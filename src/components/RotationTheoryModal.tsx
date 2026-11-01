import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { X, BookOpen, AlertCircle, RefreshCw, Calculator, Sparkles } from 'lucide-react';

interface RotationTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RotationTheoryModal: React.FC<RotationTheoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-7 my-8 text-slate-800 dark:text-slate-200 transition-colors">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-teal-700 dark:bg-teal-600 flex items-center justify-center text-white shadow-2xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.theorySubtitle}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-sm max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. What is an AVL Tree */}
          <section className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              <span>{t.whatIsAVLTitle}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.whatIsAVLDesc}
            </p>
          </section>

          {/* 2. Balance Factor Formula */}
          <section className="bg-sky-50/70 dark:bg-sky-950/40 p-4 rounded-xl border border-sky-200 dark:border-sky-800/60 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span>{t.balanceFactorTitle}</span>
            </h3>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-sky-800 font-mono text-center font-bold text-sky-900 dark:text-sky-200 text-xs shadow-2xs">
              {t.balanceFactorFormula}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.balanceFactorExplanation}
            </p>
          </section>

          {/* 3. The 4 Rotation Cases */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              <span>{t.fourCasesTitle}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* LL Case */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{t.caseLLTitle}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                    BF = +2 &amp; Left &ge; 0
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.caseLLDesc}
                </p>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 text-center">
                  RightRotate(Node)
                </div>
              </div>

              {/* RR Case */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{t.caseRRTitle}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                    BF = -2 &amp; Right &le; 0
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.caseRRDesc}
                </p>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 text-center">
                  LeftRotate(Node)
                </div>
              </div>

              {/* LR Case */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{t.caseLRTitle}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
                    BF = +2 &amp; Left = -1
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.caseLRDesc}
                </p>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 text-center">
                  LeftRotate(LeftChild) &rarr; RightRotate(Node)
                </div>
              </div>

              {/* RL Case */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{t.caseRLTitle}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
                    BF = -2 &amp; Right = +1
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.caseRLDesc}
                </p>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 text-center">
                  RightRotate(RightChild) &rarr; LeftRotate(Node)
                </div>
              </div>
            </div>
          </section>

          {/* 4. Complexity */}
          <section className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              <span>{t.complexityTitle}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {t.complexityDesc}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-700 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
