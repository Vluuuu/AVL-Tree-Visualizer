import React from 'react';
import { EdgeLayout } from '../types/avl';
import { useTheme } from '../theme/ThemeContext';

interface TreeEdgeProps {
  edge: EdgeLayout;
  isHighlighted?: boolean;
  isRotationAffected?: boolean;
}

export const TreeEdge: React.FC<TreeEdgeProps> = ({
  edge,
  isHighlighted,
  isRotationAffected,
}) => {
  const { isDark } = useTheme();
  const midY = (edge.fromY + edge.toY) / 2;
  const pathData = `M ${edge.fromX} ${edge.fromY} C ${edge.fromX} ${midY}, ${edge.toX} ${midY}, ${edge.toX} ${edge.toY}`;

  let strokeColor = isDark ? '#475569' : '#94a3b8'; // slate-600 in dark, slate-400 in light
  let strokeWidth = 2;
  let strokeDasharray = 'none';

  if (isRotationAffected) {
    strokeColor = isDark ? '#fbbf24' : '#d97706'; // amber-400 in dark, amber-600 in light
    strokeWidth = 2.5;
    strokeDasharray = '4 3';
  } else if (isHighlighted) {
    strokeColor = isDark ? '#38bdf8' : '#0284c7'; // sky-400 in dark, sky-600 in light
    strokeWidth = 2.5;
  }

  return (
    <path
      d={pathData}
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeLinecap="round"
      className="transition-all duration-300 ease-out"
    />
  );
};
