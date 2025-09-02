import React, { useEffect, useState } from "react";
import { useEyeTracking } from "../hooks/useEyeTracking";

type Props = {
  open: boolean;
  onClose?: () => void;
};

// Full-screen calibration overlay with proper step-by-step calibration
export default function CalibrationOverlay({ open, onClose }: Props) {
  const { state, startCalibration, cancelCalibration, gaze } = useEyeTracking();
  const [started, setStarted] = useState(false);

  // Close when calibration is complete
  useEffect(() => {
    if (!open) return;
    if (started && !state.isCalibrating && state.isCalibrated) {
      setTimeout(() => onClose?.(), 1000); // Small delay to show completion
    }
  }, [open, started, state.isCalibrating, state.isCalibrated, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center select-none">
      {!started ? (
        // Initial setup screen
        <div className="w-[600px] max-w-[94vw] bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="text-6xl mb-4">👁️</div>
          <h2 className="text-3xl font-bold mb-4">Eye Tracking Calibration</h2>
          <div className="text-left mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <p className="text-lg">Sit 50-70cm from your screen</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <p className="text-lg">Look at each dot with your eyes (not your head)</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <p className="text-lg">Stay focused on each dot for ~2 seconds</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-lg">Keep your head still during calibration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors"
              onClick={async () => { 
                setStarted(true); 
                await startCalibration();
              }}
            >
              🚀 Start Calibration
            </button>
            <button
              className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        // Active calibration screen
        <div className="w-full h-full relative">
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw]">
            <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${Math.round(state.progress01 * 100)}%` }}
              />
            </div>
            <div className="text-white text-center mt-2 font-semibold">
              Step {Math.min((state.currentIndex || 0) + 1, state.totalPoints)} of {state.totalPoints}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3">
              <p className="text-xl font-semibold text-gray-800">
                {state.message || "Look at the dot and hold steady"}
              </p>
              {typeof state.holdPct === 'number' && state.isCalibrating && (
                <p className="text-sm text-gray-600 mt-1">Hold {Math.round((state.holdPct || 0) * 100)}%</p>
              )}
              {state.isCalibrating && !state.target && (
                <p className="text-sm text-orange-600 mt-1">Waiting for eye tracking to initialize...</p>
              )}
            </div>
          </div>

          {/* Calibration target dot with progress ring */}
          {state.target && (
            <div
              className="absolute"
              style={{ left: state.target.x - 24, top: state.target.y - 24 }}
            >
              {/* Progress ring */}
              <div
                className="absolute w-12 h-12 rounded-full"
                style={{
                  background: `conic-gradient(rgba(255,255,255,0.9) ${(Math.round((state.holdPct || 0) * 100))}%, rgba(255,255,255,0.2) 0)`
                }}
              />
              {/* Target */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-lg animate-pulse" />
              </div>
            </div>
          )}

          {/* Live gaze reticle (red) */}
          {gaze && (
            <div
              className="absolute w-3 h-3 bg-red-500 rounded-full pointer-events-none"
              style={{ left: gaze.x - 6, top: gaze.y - 6, boxShadow: '0 0 8px rgba(239,68,68,0.7)' }}
            />
          )}

          {/* Current status */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-4">
              <div className="flex items-center gap-4">
                <button
                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  onClick={() => {
                    cancelCalibration();
                    setStarted(false);
                    onClose?.();
                  }}
                >
                  🛑 Stop Calibration
                </button>
                <div className="text-gray-700">
                  {state.isCalibrating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      Calibrating...
                    </span>
                  ) : state.isCalibrated ? (
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      ✅ Calibration Complete!
                    </span>
                  ) : (
                    <span className="text-orange-600">Preparing...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}