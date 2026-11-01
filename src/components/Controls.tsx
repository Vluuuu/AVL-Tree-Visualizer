import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  FastForward,
  ChevronsRight,
  Bookmark,
} from 'lucide-react';

export interface Milestone {
  insertionNumber: number;
  value: number;
  displayLabel?: string;
  stepIndex: number;
}

interface ControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onReplay: () => void;
  onSkipToEnd: () => void;
  onSeek: (stepIndex: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  milestones: Milestone[];
}

export const Controls: React.FC<ControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onReplay,
  onSkipToEnd,
  onSeek,
  speed,
  onSpeedChange,
  milestones,
}) => {
  const { t } = useLanguage();

  const isAtEnd = totalSteps > 0 && currentStepIndex >= totalSteps - 1;
  const isAtStart = currentStepIndex <= 0;
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3 transition-colors">
      {/* Top Controls Row: Status, Playback Buttons, Speed */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {t.stepLabel}:
          </span>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md">
            {totalSteps === 0 ? 0 : currentStepIndex + 1}{' '}
            <span className="text-slate-600 dark:text-slate-400 font-normal">{t.stepOf}</span>{' '}
            {totalSteps}
          </span>
        </div>

        {/* Media Player Controls */}
        <div className="flex items-center gap-1.5">
          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            disabled={isAtStart}
            title={t.resetSim}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Previous Step */}
          <button
            type="button"
            onClick={onPrev}
            disabled={isAtStart}
            title={t.prevStep}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {/* Play / Pause / Replay main button */}
          {isAtEnd ? (
            <button
              type="button"
              onClick={onReplay}
              title={t.replayBtn}
              className="px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 bg-teal-700 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-500 text-white transition-all cursor-pointer shadow-sm"
            >
              <RotateCw className="h-4 w-4" />
              <span>{t.replayBtn}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={isPlaying ? onPause : onPlay}
              disabled={totalSteps <= 1}
              title={isPlaying ? t.pause : t.play}
              className={`px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isPlaying
                  ? 'bg-amber-600 dark:bg-amber-500 hover:bg-amber-500 text-white'
                  : 'bg-teal-700 dark:bg-teal-600 hover:bg-teal-600 text-white'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 fill-white" />
                  <span>{t.pause}</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white ml-0.5" />
                  <span>{t.play}</span>
                </>
              )}
            </button>
          )}

          {/* Next Step */}
          <button
            type="button"
            onClick={onNext}
            disabled={isAtEnd}
            title={t.nextStep}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Skip to End */}
          <button
            type="button"
            onClick={onSkipToEnd}
            disabled={isAtEnd}
            title={t.skipToEndBtn}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5">
          <FastForward className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {t.playbackSpeed}:
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 text-xs font-mono font-medium rounded transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrubber Progress Slider */}
      <div className="space-y-1 pt-1">
        <div className="relative w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
          <div
            className="h-full bg-teal-700 dark:bg-teal-500 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onSeek(parseInt(e.target.value, 10))}
          className="w-full accent-teal-700 dark:accent-teal-500 cursor-pointer h-1 opacity-90 hover:opacity-100"
        />
      </div>

      {/* Completed Insertion Milestones */}
      {milestones.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-1.5 text-slate-600 dark:text-slate-400">
            <Bookmark className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.jumpToStage}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
            {milestones.map((ms) => {
              const isCurrentMilestone =
                currentStepIndex >= ms.stepIndex &&
                (milestones.find((m) => m.insertionNumber === ms.insertionNumber + 1)?.stepIndex ?? totalSteps) > currentStepIndex;

              return (
                <button
                  key={ms.insertionNumber}
                  type="button"
                  onClick={() => onSeek(ms.stepIndex)}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-all cursor-pointer border ${
                    isCurrentMilestone
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700 font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-xs text-slate-500 font-semibold">#{ms.insertionNumber}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {ms.displayLabel && ms.displayLabel !== String(ms.value)
                      ? `${ms.displayLabel}`
                      : ms.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
