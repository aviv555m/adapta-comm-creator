import React, { useEffect, useState } from "react";
import { useEyeTracking } from "../hooks/useEyeTracking";

type Props = {
  open: boolean;
  onClose?: () => void;
};

// Большой оверлей с точками, прогрессом и подсказками.
export default function CalibrationOverlay({ open, onClose }: Props) {
  const { isCalibrated, isCalibrating, startCalibration, stopEyeTracking } = useEyeTracking();
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Закрытие, когда калибровка закончилась
  useEffect(() => {
    if (!open) return;
    if (started && !isCalibrating && isCalibrated) {
      onClose?.();
    }
  }, [open, started, isCalibrating, isCalibrated, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-sm flex items-center justify-center select-none">
      <div className="w-[720px] max-w-[94vw] bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold mb-2">Eye-Tracking Calibration</h2>
        <p className="text-sm text-neutral-600 mb-4">
          Sit ~50–70cm from the screen. Keep your head steady. Follow the dot with your eyes
          (не головой). Каждая точка длится ~1.2s.
        </p>

        {/* Progress */}
        <div className="w-full h-2 bg-neutral-200 rounded mb-3 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stage / target */}
        <div className="relative h-[360px] rounded-lg border border-neutral-200 bg-neutral-50">
          <div className="absolute inset-x-0 bottom-3 text-center text-xs text-neutral-600">
            {isCalibrating ? "Calibrating…" : "Ready"}
          </div>
        </div>

        {/* Controls */}
        {!started ? (
          <div className="mt-5 flex items-center gap-3">
            <button
              className="px-5 h-11 rounded-xl bg-neutral-900 text-white font-semibold"
              onClick={async () => { 
                setStarted(true); 
                setProgress(0);
                await startCalibration();
                // Simulate progress
                const interval = setInterval(() => {
                  setProgress(prev => {
                    if (prev >= 100) {
                      clearInterval(interval);
                      return 100;
                    }
                    return prev + 10;
                  });
                }, 300);
              }}
            >
              Start calibration
            </button>
            <button
              className="px-5 h-11 rounded-xl border border-neutral-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <div className="text-xs text-neutral-500 ml-auto">
              Tip: press <kbd>Space</kbd> to re-center later
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-3">
            <button
              className="px-5 h-11 rounded-xl border border-neutral-300"
              onClick={() => {
                stopEyeTracking();
                setStarted(false);
                setProgress(0);
              }}
            >
              Stop
            </button>
            <div className="ml-auto text-sm">
              {Math.floor(progress / 10)}/10
            </div>
          </div>
        )}
      </div>
    </div>
  );
}