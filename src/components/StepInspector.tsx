import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SimulationStep, StepType } from '../types/avl';
import { getTreeStats, getTraversals } from '../core/avl';
import {
  Info,
  Calculator,
  Activity,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Binary,
} from 'lucide-react';

interface StepInspectorProps {
  step: SimulationStep | null;
  rotationsLog: {
    insertionNumber: number;
    value: number;
    imbalanceType: string;
    pivotValue: number;
  }[];
}

export const StepInspector: React.FC<StepInspectorProps> = ({ step, rotationsLog }) => {
  const { language, t } = useLanguage();

  if (!step) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs text-slate-600 dark:text-slate-400 text-xs text-center transition-colors">
        {t.emptyTreeDesc}
      </div>
    );
  }

  const title = language === 'id' ? step.title.id : step.title.en;
  const description = language === 'id' ? step.description.id : step.description.en;
  const math = step.mathExplanation ? (language === 'id' ? step.mathExplanation.id : step.mathExplanation.en) : null;

  const stats = getTreeStats(step.treeSnapshot);
  const traversals = getTraversals(step.treeSnapshot);

  return (
    <div className="space-y-3">
      {/* 1. Main Step Details Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2.5 transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Info className="h-4 w-4 text-teal-700 dark:text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {t.inspectorTitle}
            </h2>
          </div>
          {getStepTypeBadge(step.type)}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-950 dark:text-white leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg text-pretty">
          {description}
        </p>

        {/* Math Calculation Section if present */}
        {math && (
          <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-950 dark:text-sky-200 border border-sky-100 dark:border-sky-800/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-800 dark:text-sky-300 mb-0.5">
              <Calculator className="h-3.5 w-3.5" />
              <span>{t.mathCalculationLabel}:</span>
            </div>
            <p className="text-xs font-mono font-medium">{math}</p>
          </div>
        )}

        {/* Active Imbalance Callout Banner */}
        {step.imbalanceType && step.imbalanceType !== 'NONE' && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 flex items-start gap-2 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                {t.imbalanceCase}: {step.imbalanceType}
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">
                {step.rotationType || `Rotasi untuk kasus ${step.imbalanceType}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Current Tree Invariants & Metrics Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2.5 transition-colors">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Activity className="h-4 w-4 text-teal-700 dark:text-teal-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {t.treeStatsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Total Nodes */}
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg">
            <span className="text-xs text-slate-600 dark:text-slate-400 block">{t.totalNodes}</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {stats.nodeCount}
            </span>
          </div>

          {/* Tree Height */}
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg">
            <span className="text-xs text-slate-600 dark:text-slate-400 block">{t.treeHeight}</span>
            <span className="text-base font-bold font-mono text-teal-700 dark:text-teal-400">
              {stats.height}
            </span>
          </div>

          {/* Balance Status */}
          <div className="col-span-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-600 dark:text-slate-400 block">{t.balanceStatus}</span>
              <span
                className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${
                  stats.isBalanced ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                {stats.isBalanced ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{t.statusBalanced}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{t.statusImbalanced}</span>
                  </>
                )}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-600 dark:text-slate-400 block">{t.bfRange}</span>
              <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                [{stats.minBF}, {stats.maxBF}]
              </span>
            </div>
          </div>
        </div>

        {/* Inorder Traversal */}
        {traversals.inorder.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Binary className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
              <span>{t.inorderTitle}:</span>
            </div>
            <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg font-mono text-xs">
              {traversals.inorder.map((val, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded ${
                    val === step.activeNodeValue
                      ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 font-bold'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {val}
                  {idx < traversals.inorder.length - 1 && (
                    <span className="text-slate-400 dark:text-slate-600 ml-1">,</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Rotations Log Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <RotateCw className="h-4 w-4 text-teal-700 dark:text-teal-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {t.rotationsLogTitle}
          </h2>
        </div>

        {rotationsLog.length === 0 ? (
          <p className="text-xs text-slate-600 dark:text-slate-400 italic py-1">{t.noRotationsYet}</p>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {rotationsLog.map((rot, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">#{rot.insertionNumber}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {t.nodeValueLabel} {rot.value}
                  </span>
                  <ArrowRightLeft className="h-3 w-3 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{t.pivotLabel}: {rot.pivotValue}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {rot.imbalanceType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function getStepTypeBadge(type: StepType) {
  switch (type) {
    case 'START_INSERTION':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          START
        </span>
      );
    case 'TRAVERSE_COMPARE':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          COMPARE
        </span>
      );
    case 'INSERT_LEAF':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          ATTACH LEAF
        </span>
      );
    case 'RECALCULATE':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          UPDATE HEIGHT & BF
        </span>
      );
    case 'DETECT_IMBALANCE':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          IMBALANCE DETECTED
        </span>
      );
    case 'ROTATE_INTERMEDIATE':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          ROTATION 1/2
        </span>
      );
    case 'ROTATE_FINAL':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          ROTATION COMPLETE
        </span>
      );
    case 'INSERTION_COMPLETE':
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          BALANCED
        </span>
      );
    default:
      return null;
  }
}
