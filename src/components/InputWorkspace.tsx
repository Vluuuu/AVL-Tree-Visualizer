import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { parseDigitGroups, DigitGroupItem, MAX_DIGIT_INPUT_LENGTH } from '../core/digitGrouping';
import { parseCustomSequence } from '../core/sequenceParser';
import {
  Binary,
  ListOrdered,
  RotateCcw,
  Sliders,
  Plus,
  Play,
  Download,
  Sparkles,
  Shuffle,
  AlertCircle,
  Hash,
} from 'lucide-react';

export const SAMPLE_DIGIT_STRING = '47239472342739472';

interface InputWorkspaceProps {
  inputMode: 'digit-grouping' | 'custom-sequence';
  onInputModeChange: (mode: 'digit-grouping' | 'custom-sequence') => void;
  digitString: string;
  onDigitStringChange: (value: string) => void;
  groupSize: number;
  onGroupSizeChange: (size: number) => void;
  currentInsertionIndex: number;
  onLoadParsedGroups: (groups: DigitGroupItem[], autoPlay: boolean) => void;
  onLoadCustomSequence: (sequence: number[], autoPlay: boolean) => void;
  onInsertSingle: (value: number) => void;
  onClear: () => void;
  currentSequence: number[];
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  inputMode,
  onInputModeChange,
  digitString,
  onDigitStringChange,
  groupSize,
  onGroupSizeChange,
  currentInsertionIndex,
  onLoadParsedGroups,
  onLoadCustomSequence,
  onInsertSingle,
  onClear,
  currentSequence,
}) => {
  const { t } = useLanguage();
  const [customInput, setCustomInput] = useState('');
  const [singleValueInput, setSingleValueInput] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  // Parse digit grouping on the fly for preview
  const digitParseResult = parseDigitGroups(digitString, groupSize);
  const { groups, uniqueSequence, duplicatesCount, error: digitError } = digitParseResult;

  // Handle Apply in Digit Grouping Mode
  const handleApplyDigitGrouping = (autoPlay: boolean) => {
    if (groups.length > 0 && !digitError) {
      onLoadParsedGroups(groups, autoPlay);
    }
  };

  // Handle Apply in Custom Sequence Mode
  const handleApplyCustomSequence = (autoPlay: boolean) => {
    setCustomError(null);
    const parsed = parseCustomSequence(customInput);

    if (parsed.error) {
      if (parsed.error.startsWith('INVALID_INTEGER:')) {
        setCustomError(`${t.inputErrorInvalidInteger}"${parsed.error.split(':')[1]}"`);
      } else if (parsed.error === 'EXCEEDS_MAX_ITEMS') {
        setCustomError(t.inputErrorMaxItemsExceeded);
      } else {
        setCustomError(parsed.error);
      }
      return;
    }

    if (parsed.values.length > 0) {
      onLoadCustomSequence(parsed.values, autoPlay);
    }
  };

  // Handle Single Integer Quick Insertion
  const handleInsertSingle = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);
    const trimmed = singleValueInput.trim();
    if (!trimmed) return;

    if (!/^-?\d+$/.test(trimmed)) {
      setCustomError(`${t.inputErrorInvalidInteger}"${trimmed}"`);
      return;
    }

    const val = parseInt(trimmed, 10);
    if (!Number.isSafeInteger(val)) {
      setCustomError(t.inputErrorInvalidInteger);
      return;
    }

    if (currentSequence.includes(val)) {
      setCustomError(t.inputErrorDuplicate);
      return;
    }

    onInsertSingle(val);
    setSingleValueInput('');
  };

  // Random generator
  const handleRandomSequence = () => {
    const nums = new Set<number>();
    while (nums.size < 8) {
      nums.add(Math.floor(Math.random() * 90) + 10);
    }
    onLoadCustomSequence(Array.from(nums), true);
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5 transition-colors">
      {/* 1. Header Row: Mode Switcher Tabs + Clear Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => onInputModeChange('digit-grouping')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'digit-grouping'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Binary className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
            <span>{t.modeDigitGrouping}</span>
          </button>

          <button
            type="button"
            onClick={() => onInputModeChange('custom-sequence')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'custom-sequence'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListOrdered className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
            <span>{t.modeCustomSequence}</span>
          </button>
        </div>

        {/* Clear Tree Action */}
        <button
          type="button"
          onClick={onClear}
          className="self-end sm:self-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t.clearTreeBtn}</span>
        </button>
      </div>

      {/* 2. Main Mode Body */}
      {inputMode === 'digit-grouping' ? (
        /* MODE A: Digit Grouping */
        <div className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
            {/* Input String */}
            <div className="lg:col-span-7 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
                  <span>{t.digitInputLabel}</span>
                </label>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {digitString.length}/{MAX_DIGIT_INPUT_LENGTH}
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={digitString}
                  onChange={(e) => onDigitStringChange(e.target.value.replace(/\s+/g, ''))}
                  placeholder={t.digitInputPlaceholder}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 font-mono tracking-wider transition-all outline-none"
                />
                {digitString && (
                  <button
                    type="button"
                    onClick={() => onDigitStringChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {digitError && (
                <p className="text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>
                    {digitError === 'INVALID_CHARACTERS'
                      ? t.inputErrorDigitsOnly
                      : digitError === 'EXCEEDS_MAX_LENGTH'
                      ? t.inputErrorLengthExceeded
                      : digitError}
                  </span>
                </p>
              )}
            </div>

            {/* Group Size Stepper (1-9) */}
            <div className="lg:col-span-5 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
                  <span>{t.groupSizeLabel}</span>
                </label>
                <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300">
                  {groupSize} {t.groupSizeUnit}
                </span>
              </div>

              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onGroupSizeChange(size)}
                    className={`flex-1 py-1 text-xs font-mono font-semibold rounded transition-all cursor-pointer ${
                      groupSize === size
                        ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grouped Segments Visualization Bar */}
          {groups.length > 0 && !digitError && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.parsedGroupsTitle}
                </span>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <span>
                    {t.uniqueValuesCount}: <strong className="text-slate-900 dark:text-white">{uniqueSequence.length}</strong>
                  </span>
                  {duplicatesCount > 0 && (
                    <span className="text-amber-800 dark:text-amber-400 font-semibold">
                      {t.duplicatesSkippedCount}: {duplicatesCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Partition Chips */}
              <div className="flex flex-wrap items-center gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                {groups.map((item, idx) => {
                  const isCurrent = currentInsertionIndex === idx + 1;
                  const isDone = currentInsertionIndex > idx + 1;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono transition-all border ${
                        isCurrent
                          ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border-teal-500 font-bold ring-1 ring-teal-400'
                          : item.isDuplicate
                          ? 'bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 line-through'
                          : isDone
                          ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 font-medium'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">{item.raw}</span>
                      <span className="text-[11px] text-slate-500">&rarr;</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
                      {item.isDuplicate && (
                        <span className="text-[11px] font-semibold uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          dup
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons: Load & Auto Play VS Load Only */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => onDigitStringChange(SAMPLE_DIGIT_STRING)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-teal-700 dark:text-teal-400" />
                  <span>{t.presetDigitSample}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyDigitGrouping(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                    <span>{t.loadOnlyBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyDigitGrouping(true)}
                    className="px-4 py-1.5 rounded-lg bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 dark:hover:bg-teal-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>{t.loadAndPlayBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MODE B: Custom Sequence Form */
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.customSequenceLabel}
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  if (customError) setCustomError(null);
                }}
                placeholder={t.customSequencePlaceholder}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 font-mono transition-all outline-none"
              />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyCustomSequence(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t.loadOnlyBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCustomSequence(true)}
                  className="px-4 py-1.5 rounded-lg bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 dark:hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>{t.loadAndPlayBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {customError && (
            <p className="text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{customError}</span>
            </p>
          )}
        </div>
      )}

      {/* 3. Bottom Row: Single Value Quick Adder & Presets */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Quick single value insertion form */}
        <form onSubmit={handleInsertSingle} className="flex items-center gap-1.5">
          <input
            type="text"
            value={singleValueInput}
            onChange={(e) => setSingleValueInput(e.target.value)}
            placeholder={t.insertSingleValuePlaceholder}
            className="w-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 font-mono transition-all outline-none"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="h-3 w-3 text-teal-700 dark:text-teal-400" />
            <span>{t.insertSingleBtn}</span>
          </button>
        </form>

        {/* Educational Presets List */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-0.5">
            Presets:
          </span>

          <button
            type="button"
            onClick={() => onLoadCustomSequence([30, 20, 10], true)}
            className="px-2 py-0.5 text-xs rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors cursor-pointer"
          >
            {t.presetLLDemo}
          </button>

          <button
            type="button"
            onClick={() => onLoadCustomSequence([10, 20, 30], true)}
            className="px-2 py-0.5 text-xs rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors cursor-pointer"
          >
            {t.presetRRDemo}
          </button>

          <button
            type="button"
            onClick={() => onLoadCustomSequence([30, 10, 20], true)}
            className="px-2 py-0.5 text-xs rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors cursor-pointer"
          >
            {t.presetLRDemo}
          </button>

          <button
            type="button"
            onClick={() => onLoadCustomSequence([10, 30, 20], true)}
            className="px-2 py-0.5 text-xs rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors cursor-pointer"
          >
            {t.presetRLDemo}
          </button>

          <button
            type="button"
            onClick={() => onLoadCustomSequence([40, 20, 60, 10, 30, 50, 70], true)}
            className="px-2 py-0.5 text-xs rounded bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-medium transition-colors cursor-pointer"
          >
            {t.presetBalanced7}
          </button>

          <button
            type="button"
            onClick={handleRandomSequence}
            className="px-2 py-0.5 text-xs rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <Shuffle className="h-3 w-3 text-teal-700 dark:text-teal-400" />
            <span>{t.presetRandom8}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
