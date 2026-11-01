import React, { useState, useMemo, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { Header } from './components/Header';
import { InputWorkspace, SAMPLE_DIGIT_STRING } from './components/InputWorkspace';
import { TreeCanvas } from './components/TreeCanvas';
import { Controls } from './components/Controls';
import { StepInspector } from './components/StepInspector';
import { RotationTheoryModal } from './components/RotationTheoryModal';
import { generateSimulationTimeline, SequenceInputItem } from './simulator/timeline';
import { parseDigitGroups, DigitGroupItem } from './core/digitGrouping';
import { usePlayback } from './hooks/usePlayback';
import { Sparkles } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [inputMode, setInputMode] = useState<'digit-grouping' | 'custom-sequence'>('digit-grouping');
  const [digitString, setDigitString] = useState<string>(SAMPLE_DIGIT_STRING);
  const [groupSize, setGroupSize] = useState<number>(2);

  // The authoritative loaded sequence currently powering the simulation
  const [loadedSequence, setLoadedSequence] = useState<SequenceInputItem[]>(() => {
    const parsed = parseDigitGroups(SAMPLE_DIGIT_STRING, 2);
    return parsed.groups.map((g) => ({ value: g.value, raw: g.raw }));
  });

  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  // Generate deterministic simulation timeline from the loaded sequence
  const timelineResult = useMemo(() => {
    return generateSimulationTimeline(loadedSequence);
  }, [loadedSequence]);

  const { steps, insertionMilestones, rotationsPerformed } = timelineResult;

  // Authoritative simulation playback hook
  const playback = usePlayback({
    totalSteps: steps.length,
    initialSpeed: 1,
  });

  const {
    currentStepIndex,
    isPlaying,
    speed,
    play,
    pause,
    next,
    prev,
    reset,
    replay,
    skipToEnd,
    seek,
    setSpeed,
    startNewSimulation,
  } = playback;

  const currentStep = steps[currentStepIndex] || null;

  // Handler: Load from parsed digit grouping
  const handleLoadParsedGroups = useCallback(
    (groups: DigitGroupItem[], autoPlay: boolean = true) => {
      const newItems: SequenceInputItem[] = groups.map((g) => ({
        value: g.value,
        raw: g.raw,
      }));
      setLoadedSequence(newItems);
      // Start simulation from Step 0 (Initial Empty Tree)
      startNewSimulation(autoPlay);
    },
    [startNewSimulation]
  );

  // Handler: Load from custom sequence / preset
  const handleLoadCustomSequence = useCallback(
    (newSeq: number[], autoPlay: boolean = true) => {
      setInputMode('custom-sequence');
      const newItems: SequenceInputItem[] = newSeq.map((val) => ({ value: val }));
      setLoadedSequence(newItems);
      // Start simulation from Step 0 (Initial Empty Tree)
      startNewSimulation(autoPlay);
    },
    [startNewSimulation]
  );

  // Handler: Incremental single value insertion
  const handleInsertSingle = useCallback(
    (val: number) => {
      const newItems: SequenceInputItem[] = [...loadedSequence, { value: val }];
      setLoadedSequence(newItems);
      // Animate the new insertion
      startNewSimulation(true);
    },
    [loadedSequence, startNewSimulation]
  );

  // Handler: Clear tree
  const handleClear = useCallback(() => {
    setLoadedSequence([]);
    startNewSimulation(false);
  }, [startNewSimulation]);

  const currentNumericList = useMemo(() => {
    return loadedSequence.map((item) => (typeof item === 'number' ? item : item.value));
  }, [loadedSequence]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-teal-500/20 dark:selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-200 transition-colors">
      {/* Header Navigation with Theme & Language Toggles */}
      <Header onOpenTheory={() => setIsTheoryOpen(true)} />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-3.5">
        {/* Onboarding Helper Tip */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300 shadow-2xs transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-700 dark:text-teal-400 shrink-0" />
            <span>{t.onboardingTip}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsTheoryOpen(true)}
            className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold cursor-pointer hidden md:inline shrink-0"
          >
            {t.theoryGuideBtn} &rarr;
          </button>
        </div>

        {/* Input Configuration Panel (Digit Grouping / Custom Sequence / Presets) */}
        <InputWorkspace
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          digitString={digitString}
          onDigitStringChange={setDigitString}
          groupSize={groupSize}
          onGroupSizeChange={setGroupSize}
          currentInsertionIndex={currentStep?.insertionNumber || 0}
          onLoadParsedGroups={handleLoadParsedGroups}
          onLoadCustomSequence={handleLoadCustomSequence}
          onInsertSingle={handleInsertSingle}
          onClear={handleClear}
          currentSequence={currentNumericList}
        />

        {/* Visualization & Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* Dominant Canvas & Playback Controls (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-3">
            <TreeCanvas
              currentStep={currentStep}
              totalInsertions={loadedSequence.length}
            />
            <Controls
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onNext={next}
              onPrev={prev}
              onReset={reset}
              onReplay={replay}
              onSkipToEnd={skipToEnd}
              onSeek={seek}
              speed={speed}
              onSpeedChange={setSpeed}
              milestones={insertionMilestones}
            />
          </div>

          {/* Educational Step & Stats Inspector (4 cols on lg) */}
          <div className="lg:col-span-4">
            <StepInspector
              step={currentStep}
              rotationsLog={rotationsPerformed}
            />
          </div>
        </div>
      </main>

      {/* Rotation Theory Guide Modal */}
      <RotationTheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
