import React from 'react';
import { motion } from 'framer-motion';
import { NodeLayout } from '../types/avl';
import { useTheme } from '../theme/ThemeContext';

interface TreeNodeProps {
  node: NodeLayout;
  isActive?: boolean;
  isComparing?: boolean;
  isImbalanced?: boolean;
  isPivot?: boolean;
  isAffected?: boolean;
  isNewLeaf?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  isActive,
  isComparing,
  isImbalanced,
  isPivot,
  isAffected,
  isNewLeaf,
}) => {
  const { isDark } = useTheme();
  const radius = 24;
  const isViolation = Math.abs(node.balanceFactor) > 1;

  // Visual state styling adapted for both Light and Dark themes
  let strokeColor = isDark ? '#64748b' : '#64748b'; // slate-500
  let strokeWidth = 2;
  let fillColor = isDark ? '#1e293b' : '#ffffff';
  let textColor = isDark ? '#f8fafc' : '#0f172a';
  let outerRingColor: string | null = null;

  if (isImbalanced || isViolation) {
    strokeColor = isDark ? '#fb7185' : '#e11d48'; // rose-400 / rose-600
    strokeWidth = 3;
    fillColor = isDark ? '#881337' : '#ffe4e6'; // rose-900 / rose-100
    textColor = isDark ? '#fff1f2' : '#9f1239';
    outerRingColor = isDark ? '#f43f5e' : '#fecdd3';
  } else if (isPivot) {
    strokeColor = isDark ? '#fbbf24' : '#d97706'; // amber-400 / amber-600
    strokeWidth = 3;
    fillColor = isDark ? '#78350f' : '#fef3c7'; // amber-900 / amber-100
    textColor = isDark ? '#fef3c7' : '#92400e';
    outerRingColor = isDark ? '#f59e0b' : '#fde68a';
  } else if (isNewLeaf) {
    strokeColor = isDark ? '#34d399' : '#059669'; // emerald-400 / emerald-600
    strokeWidth = 2.5;
    fillColor = isDark ? '#064e3b' : '#ecfdf5'; // emerald-900 / emerald-50
    textColor = isDark ? '#ecfdf5' : '#065f46';
    outerRingColor = isDark ? '#10b981' : '#a7f3d0';
  } else if (isActive || isComparing) {
    strokeColor = isDark ? '#38bdf8' : '#0284c7'; // sky-400 / sky-600
    strokeWidth = 2.5;
    fillColor = isDark ? '#0c4a6e' : '#e0f2fe'; // sky-900 / sky-100
    textColor = isDark ? '#e0f2fe' : '#0369a1';
    outerRingColor = isDark ? '#0284c7' : '#bae6fd';
  } else if (isAffected) {
    strokeColor = isDark ? '#38bdf8' : '#0284c7';
    strokeWidth = 2;
    fillColor = isDark ? '#0f172a' : '#f0f9ff';
  }

  // Balance factor badge styling
  let bfBadgeBg = isDark ? '#334155' : '#f1f5f9';
  let bfBadgeText = isDark ? '#cbd5e1' : '#475569';
  let bfBorder = isDark ? '#475569' : '#cbd5e1';

  if (isViolation) {
    bfBadgeBg = '#e11d48';
    bfBadgeText = '#ffffff';
    bfBorder = isDark ? '#fda4af' : '#be123c';
  } else if (node.balanceFactor === 0) {
    bfBadgeBg = isDark ? '#064e3b' : '#ecfdf5';
    bfBadgeText = isDark ? '#6ee7b7' : '#047857';
    bfBorder = isDark ? '#059669' : '#10b981';
  } else {
    bfBadgeBg = isDark ? '#1e3a8a' : '#eff6ff';
    bfBadgeText = isDark ? '#93c5fd' : '#1d4ed8';
    bfBorder = isDark ? '#3b82f6' : '#3b82f6';
  }

  const formattedBF = node.balanceFactor > 0 ? `+${node.balanceFactor}` : `${node.balanceFactor}`;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        x: node.x,
        y: node.y,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 26,
      }}
      className="cursor-pointer"
    >
      {/* Outer focus halo ring for active/imbalanced/pivot states */}
      {outerRingColor && (
        <circle
          r={radius + 6}
          fill="none"
          stroke={outerRingColor}
          strokeWidth={3}
          opacity={0.85}
        />
      )}

      {/* Main Node Circle */}
      <circle
        r={radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        filter={isDark ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' : 'drop-shadow(0 2px 4px rgba(15,23,42,0.08))'}
      />

      {/* Node Value */}
      <text
        dy="0.34em"
        textAnchor="middle"
        fill={textColor}
        fontSize="13"
        fontWeight="700"
        fontFamily="var(--font-mono)"
        className="select-none pointer-events-none"
      >
        {node.value}
      </text>

      {/* Balance Factor Pill Badge (Top Right) */}
      <g transform={`translate(${radius * 0.72}, ${-radius * 0.72})`}>
        <rect
          x="-14"
          y="-8"
          width="28"
          height="16"
          rx="8"
          fill={bfBadgeBg}
          stroke={bfBorder}
          strokeWidth="1"
          filter={isDark ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' : 'drop-shadow(0 1px 2px rgba(15,23,42,0.08))'}
        />
        <text
          dy="0.32em"
          textAnchor="middle"
          fill={bfBadgeText}
          fontSize="9"
          fontWeight="800"
          fontFamily="var(--font-mono)"
          className="select-none pointer-events-none"
        >
          {formattedBF}
        </text>
      </g>

      {/* Height Indicator Badge (Bottom Right) */}
      <g transform={`translate(${radius * 0.72}, ${radius * 0.72})`}>
        <circle
          r="8"
          fill={isDark ? '#0f172a' : '#f8fafc'}
          stroke={isDark ? '#475569' : '#94a3b8'}
          strokeWidth="1"
          filter={isDark ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' : 'drop-shadow(0 1px 2px rgba(15,23,42,0.06))'}
        />
        <text
          dy="0.34em"
          textAnchor="middle"
          fill={isDark ? '#94a3b8' : '#475569'}
          fontSize="8.5"
          fontWeight="700"
          fontFamily="var(--font-mono)"
          className="select-none pointer-events-none"
        >
          {node.height}
        </text>
      </g>
    </motion.g>
  );
};
