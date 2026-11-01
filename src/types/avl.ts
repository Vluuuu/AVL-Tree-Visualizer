export type ImbalanceType = 'LL' | 'RR' | 'LR' | 'RL' | 'NONE';

export interface AVLNode {
  id: string; // unique deterministic id based on value/instance
  value: number;
  height: number;
  balanceFactor: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

export interface NodeLayout {
  id: string;
  value: number;
  height: number;
  balanceFactor: number;
  x: number;
  y: number;
  leftChildId: string | null;
  rightChildId: string | null;
}

export interface EdgeLayout {
  id: string;
  fromId: string;
  toId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  isLeft: boolean;
}

export interface TreeLayout {
  nodes: NodeLayout[];
  edges: EdgeLayout[];
  width: number;
  height: number;
  minX: number;
  maxX: number;
}

export type StepType =
  | 'START_INSERTION'
  | 'TRAVERSE_COMPARE'
  | 'DUPLICATE_SKIPPED'
  | 'INSERT_LEAF'
  | 'RECALCULATE'
  | 'DETECT_IMBALANCE'
  | 'ROTATE_INTERMEDIATE'
  | 'ROTATE_FINAL'
  | 'INSERTION_COMPLETE';

export interface LocalizedText {
  id: string;
  en: string;
}

export interface SimulationStep {
  stepIndex: number;
  totalSteps: number;
  insertionNumber: number; // 1-indexed (e.g. 1st inserted number, 2nd, etc.)
  totalInsertions: number;
  currentValue: number;
  displayLabel?: string; // Optional raw representation, e.g. "07" for leading-zero groups
  type: StepType;
  title: LocalizedText;
  description: LocalizedText;
  mathExplanation?: LocalizedText;

  // Tree state at this step
  treeSnapshot: AVLNode | null;
  layout: TreeLayout;

  // Active elements highlighted
  activeNodeValue?: number;
  comparingNodeValue?: number;
  imbalancedNodeValue?: number;
  rotationPivotValue?: number;
  affectedNodeValues?: number[];
  imbalanceType?: ImbalanceType;
  rotationType?: string; // e.g. "Right Rotation at 25", "Left Rotation at 51"
}

export interface TraversalResult {
  inorder: number[];
  preorder: number[];
  postorder: number[];
  levelorder: number[];
}

export interface AVLTreeStats {
  nodeCount: number;
  height: number;
  isBalanced: boolean;
  minBF: number;
  maxBF: number;
  leafCount: number;
}
