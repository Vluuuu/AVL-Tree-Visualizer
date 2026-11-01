import React, { useState, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SimulationStep } from '../types/avl';
import { TreeNode } from './TreeNode';
import { TreeEdge } from './TreeEdge';
import { ZoomIn, ZoomOut, RefreshCw, Layers, Maximize2 } from 'lucide-react';

interface TreeCanvasProps {
  currentStep: SimulationStep | null;
  totalInsertions?: number;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({ currentStep, totalInsertions = 0 }) => {
  const { t } = useLanguage();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const fitToView = () => {
    setScale(0.9);
    setPan({ x: 0, y: 20 });
  };

  const zoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2)));

  const layout = currentStep?.layout;
  const nodes = layout?.nodes || [];
  const edges = layout?.edges || [];
  const isEmpty = nodes.length === 0;

  const activeValue = currentStep?.activeNodeValue;
  const comparingValue = currentStep?.comparingNodeValue;
  const imbalancedValue = currentStep?.imbalancedNodeValue;
  const pivotValue = currentStep?.rotationPivotValue;
  const affectedValues = currentStep?.affectedNodeValues || [];
  const isLeafStep = currentStep?.type === 'INSERT_LEAF';

  return (
    <div className="relative w-full h-[500px] lg:h-[580px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col transition-colors">
      {/* Canvas Top Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 pointer-events-auto shadow-2xs">
          <Layers className="h-4 w-4 text-teal-700 dark:text-teal-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            {t.canvasTitle}
          </span>
          {!isEmpty && (
            <span className="ml-1 text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {nodes.length} {nodes.length === 1 ? 'Node' : 'Nodes'}
            </span>
          )}
        </div>

        {/* Zoom & Navigation Actions */}
        <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-1 rounded-lg border border-slate-200 dark:border-slate-800 pointer-events-auto shadow-2xs">
          <button
            type="button"
            onClick={zoomIn}
            title={t.zoomIn}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            title={t.zoomOut}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 my-auto mx-0.5" />
          <button
            type="button"
            onClick={fitToView}
            title={t.fitToView}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={resetView}
            title={t.resetZoom}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 px-1 select-none">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing canvas-grid-pattern relative flex items-center justify-center select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isEmpty ? (
          <div className="text-center p-6 max-w-sm mx-auto z-10 space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-teal-700 dark:text-teal-400">
              <Layers className="h-5 w-5" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 text-balance">
                {totalInsertions > 0 ? t.stepLabel + ' 0: ' + t.emptyTreeTitle : t.emptyTreeTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
              {totalInsertions > 0
                ? (currentStep?.description.id ? currentStep.description.id : t.emptyTreeDesc)
                : t.emptyTreeDesc}
            </p>
          </div>
        ) : (
          <svg
            className="w-full h-full"
            style={{
              overflow: 'visible',
            }}
          >
            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
              style={{
                transformOrigin: '50% 30%',
                transition: isDragging ? 'none' : 'transform 0.08s ease-out',
              }}
            >
              {/* Edges layer */}
              <g className="edges-layer">
                {edges.map((edge) => {
                  const isHighlighted =
                    affectedValues.includes(
                      nodes.find((n) => n.id === edge.fromId)?.value || -9999
                    ) &&
                    affectedValues.includes(
                      nodes.find((n) => n.id === edge.toId)?.value || -9999
                    );

                  const isRotation =
                    currentStep?.type.includes('ROTATE') &&
                    (edge.fromId.includes(`${pivotValue}`) || edge.toId.includes(`${pivotValue}`));

                  return (
                    <TreeEdge
                      key={edge.id}
                      edge={edge}
                      isHighlighted={isHighlighted}
                      isRotationAffected={isRotation}
                    />
                  );
                })}
              </g>

              {/* Nodes layer */}
              <g className="nodes-layer">
                {nodes.map((node) => {
                  const isActive = node.value === activeValue;
                  const isComparing = node.value === comparingValue;
                  const isImbalanced = node.value === imbalancedValue;
                  const isPivot = node.value === pivotValue;
                  const isAffected = affectedValues.includes(node.value);
                  const isNewLeaf = isLeafStep && node.value === activeValue;

                  return (
                    <TreeNode
                      key={node.id}
                      node={node}
                      isActive={isActive}
                      isComparing={isComparing}
                      isImbalanced={isImbalanced}
                      isPivot={isPivot}
                      isAffected={isAffected}
                      isNewLeaf={isNewLeaf}
                    />
                  );
                })}
              </g>
            </g>
          </svg>
        )}
      </div>

      {/* Canvas Bottom Legend Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-10 text-xs transition-colors">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t.nodeLegend}:</span>
        </div>

        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Balanced Node */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-white dark:bg-slate-800 border border-slate-500 inline-block shadow-2xs" />
            <span className="text-slate-600 dark:text-slate-400">{t.legendBalanced}</span>
          </div>

          {/* Active / Comparing */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-100 dark:bg-sky-950 border border-sky-500 inline-block shadow-2xs" />
            <span className="text-sky-700 dark:text-sky-400">{t.legendActive}</span>
          </div>

          {/* Imbalanced */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-100 dark:bg-rose-950 border border-rose-500 inline-block shadow-2xs" />
            <span className="text-rose-700 dark:text-rose-400">{t.legendImbalanced}</span>
          </div>

          {/* Rotation Pivot */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-500 inline-block shadow-2xs" />
            <span className="text-amber-800 dark:text-amber-400">{t.legendPivot}</span>
          </div>

          {/* New Leaf */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 inline-block shadow-2xs" />
            <span className="text-emerald-800 dark:text-emerald-400">{t.legendNewLeaf}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
