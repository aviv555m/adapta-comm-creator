import { useEffect, useRef, useState } from "react";

// ---------- Types ----------
export interface EyePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface CalibPoint {
  tx: number; // target x (screen px)
  ty: number; // target y
  samples: EyePoint[];
  median?: { x: number; y: number };
}

export interface CalibrationState {
  isCalibrating: boolean;
  isCalibrated: boolean;
  currentIndex: number;        // 0..points.length-1
  totalPoints: number;         // points.length
  progress01: number;          // 0..1 by points
  target?: { x: number; y: number };
  message?: string;
  holdPct?: number;            // 0..1 progress while holding on a point
}

export interface UseEyeTrackingRet {
  // realtime
  raw: EyePoint | null;
  gaze: EyePoint | null;         // mapped+smoothed coords in px
  active: boolean;

  // calibration
  state: CalibrationState;
  start(): Promise<void>;
  stop(): void;
  startCalibration(difficulty?: 'easy' | 'normal' | 'accurate'): Promise<void>;
  cancelCalibration(): void;
  quickRecenter(ms?: number): Promise<void>; // быстрый bias фикс

  // for UI helpers
  getStoredCalibration(): Affine2D | null;
  clearCalibration(): void;
  saveCalibrationProfile(name: string): void;
  loadCalibrationProfile(name: string): boolean;
  getCalibrationProfiles(): string[];
  microRecalibrate(screenPoint: { x: number; y: number }): Promise<boolean>;
}

// ---------- Math / helpers ----------
const EMA_ALPHA = 0.25; // сглаживание курсора
const LOCAL_KEY = "echoes_eye_calibration_v1";

export type Affine2D = {
  // maps [x y 1] -> [x' y']
  a: number; b: number; c: number;
  d: number; e: number; f: number;
};

function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function robustMedianXY(samples: EyePoint[]): { x: number; y: number } {
  const xs = samples.map(s => s.x);
  const ys = samples.map(s => s.y);
  return { x: median(xs), y: median(ys) };
}

function removeOutliersToPct(samples: EyePoint[], keepPct = 0.8): EyePoint[] {
  if (samples.length < 5) return samples;
  const m = robustMedianXY(samples);
  // расстояние по L2 до медианы
  const withD = samples.map(s => ({
    ...s,
    d: Math.hypot(s.x - m.x, s.y - m.y)
  }));
  const sorted = withD.sort((a, b) => a.d - b.d);
  const keep = Math.max(3, Math.floor(sorted.length * keepPct));
  return sorted.slice(0, keep).map(({ d, ...rest }) => rest);
}

// Решаем аффинное преобразование по МНК:
// [x' y'] = [ [a b c] ; [d e f] ] * [x y 1]
function solveAffineLS(src: { x: number; y: number }[], dst: { x: number; y: number }[]): Affine2D {
  // нужно >= 3 соответствия
  const n = Math.min(src.length, dst.length);
  if (n < 3) throw new Error("Need at least 3 correspondences for affine");

  // Составим матрицу нормальных уравнений вручную (2n × 6)
  // A * p = b, где p=[a b c d e f]^T
  let ATA = Array.from({ length: 6 }, () => Array(6).fill(0));
  let ATb = Array(6).fill(0);

  for (let i = 0; i < n; i++) {
    const { x, y } = src[i];
    const { x: xp, y: yp } = dst[i];

    // строка для x': [x y 1 0 0 0]
    const rx = [x, y, 1, 0, 0, 0];
    // строка для y': [0 0 0 x y 1]
    const ry = [0, 0, 0, x, y, 1];

    // accumulate
    for (let r of [rx, ry]) {
      for (let c1 = 0; c1 < 6; c1++) {
        for (let c2 = 0; c2 < 6; c2++) ATA[c1][c2] += r[c1] * r[c2];
      }
    }
    // b:
    for (let c = 0; c < 6; c++) {
      ATb[c] += rx[c] * xp + ry[c] * yp;
    }
  }

  // Решим 6×6 (Гаусс)
  const p = gaussianSolve(ATA, ATb);
  return { a: p[0], b: p[1], c: p[2], d: p[3], e: p[4], f: p[5] };
}

function gaussianSolve(A: number[][], b: number[]): number[] {
  const n = b.length;
  // Augmented
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    // pivot
    let best = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[best][col])) best = r;
    [M[col], M[best]] = [M[best], M[col]];
    const pivot = M[col][col] || 1e-12;

    // normalize
    for (let c = col; c <= n; c++) M[col][c] /= pivot;

    // eliminate
    for (let r = 0; r < n; r++) if (r !== col) {
      const factor = M[r][col];
      for (let c = col; c <= n; c++) M[r][c] -= factor * M[col][c];
    }
  }
  return M.map(r => r[n]);
}

function applyAffine(T: Affine2D, x: number, y: number) {
  return {
    x: T.a * x + T.b * y + T.c,
    y: T.d * x + T.e * y + T.f,
  };
}

// ---------- Hook ----------
declare global { interface Window { webgazer: any; } }

export function useEyeTracking(): UseEyeTrackingRet {
  const [raw, setRaw] = useState<EyePoint | null>(null);
  const [gaze, setGaze] = useState<EyePoint | null>(null);
  const [active, setActive] = useState(false);

  const [state, setState] = useState<CalibrationState>({
    isCalibrating: false,
    isCalibrated: false,
    currentIndex: 0,
    totalPoints: 0,
    progress01: 0,
  });

  const affRef = useRef<Affine2D | null>(null);
  const emaRef = useRef<{ x: number; y: number } | null>(null);
  const webgazerRef = useRef<any>(null);
  const cancelCalibRef = useRef<(() => void) | null>(null);

  // load saved affine
  useEffect(() => {
    const saved = getStoredCalibration();
    if (saved) affRef.current = saved;
  }, []);

// start: init camera + webgazer
const start = async () => {
  if (active) return;
  try {
    console.log("Starting eye tracking...");
    setActive(true);
    
    // Request camera permission first
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480 } 
    });
    console.log("Camera access granted");
    
    // Stop the stream, webgazer will handle it
    stream.getTracks().forEach(track => track.stop());
    
    const WG = await import("webgazer");
    webgazerRef.current = WG.default;
    console.log("Webgazer loaded");

    // Initialize webgazer
    await WG.default
      .setRegression("ridge")
      .setTracker("clmtrackr")
      .showVideo(false)
      .showPredictionPoints(false)
      .setGazeListener((data: any) => {
        if (!data || typeof data.x !== 'number' || typeof data.y !== 'number') return;
        console.log("Raw gaze data:", data.x, data.y);
        
        const r: EyePoint = { x: data.x, y: data.y, timestamp: Date.now() };
        setRaw(r);

        // mapping + EMA
        let mapped = r;
        if (affRef.current) {
          const m = applyAffine(affRef.current, r.x, r.y);
          mapped = { x: m.x, y: m.y, timestamp: r.timestamp };
        }
        // clamp to viewport
        const w = window.innerWidth, h = window.innerHeight;
        mapped.x = clamp(mapped.x, 0, w);
        mapped.y = clamp(mapped.y, 0, h);

        // EMA smoothing
        if (!emaRef.current) emaRef.current = { x: mapped.x, y: mapped.y };
        emaRef.current = {
          x: emaRef.current.x * (1 - EMA_ALPHA) + mapped.x * EMA_ALPHA,
          y: emaRef.current.y * (1 - EMA_ALPHA) + mapped.y * EMA_ALPHA,
        };
        setGaze({ x: emaRef.current.x, y: emaRef.current.y, timestamp: r.timestamp });
      })
      .begin();
      
    console.log("Webgazer initialized successfully");
    
    // Wait a bit for webgazer to start working
    await sleep(1000);
    
  } catch (err) {
    console.error("Eye tracking start failed", err);
    setActive(false);
    setState(s => ({
      ...s,
      isCalibrating: false,
      message: `Camera error: ${err instanceof Error ? err.message : 'Unknown error'}`
    }));
    throw err;
  }
};

const stop = () => {
  console.log("Stopping eye tracking");
  if (window.webgazer) {
    window.webgazer.end();
  }
  setActive(false);
  setRaw(null);
  setGaze(null);
  emaRef.current = null;
};

// -------- Calibration flow --------
const startCalibration = async (difficulty: 'easy' | 'normal' | 'accurate' = 'normal') => {
  try {
    await start();
    console.log(`Starting ${difficulty} calibration`);

    const gridConfig = {
      easy: { cols: 2, rows: 2, margin: 0.2 },      // 4 points
      normal: { cols: 3, rows: 3, margin: 0.15 },   // 9 points
      accurate: { cols: 4, rows: 4, margin: 0.1 }   // 16 points
    };

    const { cols, rows, margin } = gridConfig[difficulty];
    const points = buildGridPoints(cols, rows, margin);
    const cp: CalibPoint[] = points.map(p => ({ tx: p.x, ty: p.y, samples: [] }));

    setState({
      isCalibrating: true,
      isCalibrated: false,
      currentIndex: 0,
      totalPoints: cp.length,
      progress01: 0,
      target: { x: cp[0].tx, y: cp[0].ty },
      message: "Look at the dot and hold steady. Please wait for eye tracking to start...",
      holdPct: 0,
    });

    // Wait for webgazer to start producing data
    console.log("Waiting for eye data...");
    let attempts = 0;
    while (!raw && attempts < 50) {
      await sleep(100);
      attempts++;
    }
    
    if (!raw) {
      setState(s => ({
        ...s,
        isCalibrating: false,
        message: "Eye tracking is not working. Please ensure camera permission is granted and try again."
      }));
      return;
    }
    
    console.log("Eye data detected, starting calibration");
    setState(s => ({ ...s, message: "Look at the dot and hold steady" }));

  // cancel flag
  let alive = true;
  cancelCalibRef.current = () => { alive = false; };

  const perPointMs = difficulty === 'accurate' ? 2000 : difficulty === 'normal' ? 1400 : 1000;
  const minSamples = difficulty === 'accurate' ? 60 : difficulty === 'normal' ? 45 : 30;

  for (let i = 0; i < cp.length && alive; i++) {
    console.log(`Calibrating point ${i + 1}/${cp.length}`);

    // Adaptive retry logic for poor quality points
    let pointAttempts = 0;
    let pointQuality = 0;
    
    do {
      pointAttempts++;
      
      setState(s => ({
        ...s,
        message: pointAttempts > 1 ? 
          `Retrying point ${i + 1} (attempt ${pointAttempts})` : 
          "Align the red dot over the blue target and hold"
      }));

      // Dwell-based collection near target
      cp[i].samples = [];
      let dwell = 0;
      const radius = Math.max(70, Math.min(window.innerWidth, window.innerHeight) * 0.06);

      while (alive && dwell < perPointMs) {
        if (raw) {
          const dx = raw.x - cp[i].tx;
          const dy = raw.y - cp[i].ty;
          const d = Math.hypot(dx, dy);
          if (d <= radius) {
            dwell += 16; // approximate frame step
            cp[i].samples.push(raw);
          } else {
            // decay when moving away
            dwell = Math.max(0, dwell - 48);
          }
          const hp = clamp(dwell / perPointMs, 0, 1);
          setState(s => ({ ...s, holdPct: hp }));
        }
        await sleep(16);
      }

      // ensure enough samples
      const topUpUntil = performance.now() + 400;
      while (cp[i].samples.length < minSamples && performance.now() < topUpUntil && alive) {
        if (raw) cp[i].samples.push(raw);
        await sleep(8);
      }

      console.log(`Point ${i + 1}, attempt ${pointAttempts}: collected ${cp[i].samples.length} samples`);

      // Calculate quality based on sample consistency
      if (cp[i].samples.length > 10) {
        const kept = removeOutliersToPct(cp[i].samples, 0.8);
        const median = robustMedianXY(kept);
        
        // Calculate variance for quality assessment
        const variance = kept.reduce((sum, sample) => {
          const dx = sample.x - median.x;
          const dy = sample.y - median.y;
          return sum + (dx * dx + dy * dy);
        }, 0) / kept.length;
        
        pointQuality = Math.max(0, 1 - variance / 10000); // Quality score 0-1
        cp[i].median = median;
        
        console.log(`Point ${i + 1} quality: ${pointQuality.toFixed(3)}`);
      }
      
      // Retry if quality is poor and we haven't exceeded max attempts
    } while (pointQuality < 0.3 && pointAttempts < 3 && alive);

    // progress + next target
    const nextIdx = i + 1;
    setState(s => ({
      ...s,
      currentIndex: nextIdx,
      progress01: nextIdx / cp.length,
      holdPct: 0,
      target: nextIdx < cp.length ? { x: cp[nextIdx].tx, y: cp[nextIdx].ty } : undefined,
      message: nextIdx < cp.length ? "Align the red dot over the blue target and hold" : "Finishing up...",
    }));
    await sleep(250);
  }

    if (!alive) {
      setState(s => ({ ...s, isCalibrating: false, message: "Calibration canceled", holdPct: 0 }));
      return;
    }

    // build correspondences (raw->target)
    const src: { x: number; y: number }[] = [];
    const dst: { x: number; y: number }[] = [];
    for (const p of cp) {
      if (p.median) {
        src.push({ x: p.median.x, y: p.median.y });
        dst.push({ x: p.tx, y: p.ty });
      }
    }
    
    console.log(`Calibration data: ${src.length} points collected`);
    
    // Require minimum points for reliable calibration
    const minPointsRequired = Math.min(4, Math.ceil(cp.length * 0.6));
    if (src.length < minPointsRequired) {
      setState(s => ({
        ...s,
        isCalibrating: false,
        isCalibrated: false,
        message: `Calibration failed - only ${src.length}/${minPointsRequired} points collected`,
        holdPct: 0,
      }));
      return;
    }
    
    try {
      let T = solveAffineLS(src, dst);
      affRef.current = T;
      saveCalibration(T);

      // quick recenter to reduce residual bias
      await quickRecenter(600);

      setState(s => ({
        ...s,
        isCalibrating: false,
        isCalibrated: true,
        message: "Calibration complete",
        target: undefined,
        holdPct: 0,
      }));
      console.log(`${difficulty} calibration completed successfully`);
    } catch (e) {
      console.error("Calibration failed:", e);
      setState(s => ({
        ...s,
        isCalibrating: false,
        isCalibrated: false,
        message: "Calibration failed — try again in better lighting",
        holdPct: 0,
      }));
    }
  } catch (err) {
    console.error("Calibration error:", err);
    setState(s => ({
      ...s,
      isCalibrating: false,
      message: `Calibration error: ${err instanceof Error ? err.message : 'Unknown error'}`
    }));
  }
};

  const cancelCalibration = () => {
    cancelCalibRef.current?.();
    setState(s => ({ ...s, isCalibrating: false }));
  };

  // быстрый фикc смещения по центру (собираем оффсет за N мс)
  const quickRecenter = async (ms = 600) => {
    if (!active) await start();
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const buf: EyePoint[] = [];
    const t0 = performance.now();
    while (performance.now() - t0 < ms) {
      if (raw) buf.push(raw);
      await sleep(8);
    }
    if (buf.length < 10 || !affRef.current) return;

    const med = robustMedianXY(removeOutliersToPct(buf, 0.75));
    // узнаём, куда сейчас мапится медиана
    const mapped = applyAffine(affRef.current, med.x, med.y);
    const dx = center.x - mapped.x;
    const dy = center.y - mapped.y;

    // корректируем только bias (c,f)
    const T = { ...affRef.current, c: affRef.current.c + dx, f: affRef.current.f + dy };
    affRef.current = T;
    saveCalibration(T);
  };

  // ---------- storage ----------
  function saveCalibration(T: Affine2D) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(T));
  }
  function getStoredCalibration(): Affine2D | null {
    try {
      const s = localStorage.getItem(LOCAL_KEY);
      return s ? (JSON.parse(s) as Affine2D) : null;
    } catch { return null; }
  }
  function clearCalibration() {
    localStorage.removeItem(LOCAL_KEY);
    affRef.current = null;
  }

  // ---------- utils ----------
  function buildGridPoints(cols: number, rows: number, marginPct = 0.1) {
    const w = window.innerWidth, h = window.innerHeight;
    const ml = w * marginPct, mt = h * marginPct;
    const rw = w - 2 * ml, rh = h - 2 * mt;
    const pts: { x: number; y: number }[] = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        pts.push({ x: ml + (i + 0.5) * (rw / cols), y: mt + (j + 0.5) * (rh / rows) });
      }
    }
    // порядок "крестик": центр → углы → края → остальное
    const cx = Math.floor(cols / 2), cy = Math.floor(rows / 2);
    pts.sort((p1, p2) => {
      const d1 = Math.hypot(p1.x - (w / 2), p1.y - (h / 2));
      const d2 = Math.hypot(p2.x - (w / 2), p2.y - (h / 2));
      return d1 - d2;
    });
    return pts;
  }

  function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

  // Calibration profile management
  const saveCalibrationProfile = (name: string) => {
    const transform = affRef.current;
    if (transform) {
      const profiles = JSON.parse(localStorage.getItem('eyetracking-profiles') || '{}');
      profiles[name] = transform;
      localStorage.setItem('eyetracking-profiles', JSON.stringify(profiles));
    }
  };

  const loadCalibrationProfile = (name: string): boolean => {
    try {
      const profiles = JSON.parse(localStorage.getItem('eyetracking-profiles') || '{}');
      const profile = profiles[name];
      if (profile) {
        affRef.current = profile;
        return true;
      }
    } catch (error) {
      console.error('Error loading calibration profile:', error);
    }
    return false;
  };

  const getCalibrationProfiles = (): string[] => {
    try {
      const profiles = JSON.parse(localStorage.getItem('eyetracking-profiles') || '{}');
      return Object.keys(profiles);
    } catch (error) {
      console.error('Error getting calibration profiles:', error);
      return [];
    }
  };

  // Micro recalibration for drift correction
  const microRecalibrate = async (screenPoint: { x: number; y: number }): Promise<boolean> => {
    if (!active) return false;

    const samples: EyePoint[] = [];
    const sampleDuration = 1500;
    const sampleInterval = 50;
    const sampleCount = sampleDuration / sampleInterval;

    for (let i = 0; i < sampleCount; i++) {
      if (raw) {
        samples.push(raw);
      }
      await sleep(sampleInterval);
    }

    if (samples.length > 10 && affRef.current) {
      const cleanSamples = removeOutliersToPct(samples, 0.8);
      if (cleanSamples.length > 5) {
        const median = robustMedianXY(cleanSamples);
        const currentGaze = applyAffine(affRef.current, median.x, median.y);
        
        // Calculate offset and apply correction
        const offsetX = screenPoint.x - currentGaze.x;
        const offsetY = screenPoint.y - currentGaze.y;
        
        // Apply small correction to transform
        const correctionFactor = 0.15; // Gentle correction
        affRef.current.c += offsetX * correctionFactor;
        affRef.current.f += offsetY * correctionFactor;
        
        saveCalibration(affRef.current);
        console.log(`Micro-recalibrated with offset: ${offsetX.toFixed(1)}, ${offsetY.toFixed(1)}`);
        return true;
      }
    }
    
    return false;
  };

  return {
    raw, gaze, active,
    state,
    start, stop,
    startCalibration, cancelCalibration, quickRecenter,
    getStoredCalibration, clearCalibration,
    saveCalibrationProfile, loadCalibrationProfile, getCalibrationProfiles,
    microRecalibrate,
  };
}
