import { AVLNode, EdgeLayout, NodeLayout, TreeLayout } from '../types/avl';

interface LayoutNodeInternal {
  id: string;
  value: number;
  height: number;
  balanceFactor: number;
  x: number;
  y: number;
  depth: number;
  leftChildId: string | null;
  rightChildId: string | null;
  left: LayoutNodeInternal | null;
  right: LayoutNodeInternal | null;
}

const NODE_RADIUS = 26;
const LEVEL_HEIGHT = 88;
const MIN_HORIZONTAL_GAP = 68;

/**
 * Computes aesthetic, collision-free 2D coordinates for an AVL tree.
 * Uses an inorder-spaced tree algorithm that guarantees:
 * 1. Monotonic horizontal progression without node overlap
 * 2. Centered parents over their subtrees
 * 3. Consistent vertical rhythm per tree level
 */
export function computeTreeLayout(root: AVLNode | null): TreeLayout {
  if (!root) {
    return {
      nodes: [],
      edges: [],
      width: 600,
      height: 400,
      minX: 0,
      maxX: 0,
    };
  }

  // 1. Build layout node representation
  function buildInternal(node: AVLNode, depth: number): LayoutNodeInternal {
    return {
      id: node.id,
      value: node.value,
      height: node.height,
      balanceFactor: node.balanceFactor,
      x: 0,
      y: 60 + depth * LEVEL_HEIGHT,
      depth,
      leftChildId: node.left ? node.left.id : null,
      rightChildId: node.right ? node.right.id : null,
      left: node.left ? buildInternal(node.left, depth + 1) : null,
      right: node.right ? buildInternal(node.right, depth + 1) : null,
    };
  }

  const internalRoot = buildInternal(root, 0);

  // 2. Assign initial x positions based on inorder traversal
  let currentX = 50;
  function assignInorderX(node: LayoutNodeInternal | null) {
    if (!node) return;
    assignInorderX(node.left);
    node.x = currentX;
    currentX += MIN_HORIZONTAL_GAP;
    assignInorderX(node.right);
  }
  assignInorderX(internalRoot);

  // 3. Post-order pass to center parents over children when possible
  // and resolve overlaps smoothly
  function centerParents(node: LayoutNodeInternal | null) {
    if (!node) return;

    centerParents(node.left);
    centerParents(node.right);

    if (node.left && node.right) {
      const mid = (node.left.x + node.right.x) / 2;
      node.x = mid;
    } else if (node.left) {
      node.x = node.left.x + MIN_HORIZONTAL_GAP * 0.75;
    } else if (node.right) {
      node.x = node.right.x - MIN_HORIZONTAL_GAP * 0.75;
    }
  }
  centerParents(internalRoot);

  // 4. Ensure minimum gap between nodes on each level to prevent any collision
  const levels: Map<number, LayoutNodeInternal[]> = new Map();
  function groupLevels(node: LayoutNodeInternal | null) {
    if (!node) return;
    const list = levels.get(node.depth) || [];
    list.push(node);
    levels.set(node.depth, list);
    groupLevels(node.left);
    groupLevels(node.right);
  }
  groupLevels(internalRoot);

  // Sort each level left to right and adjust overlaps
  levels.forEach((levelNodes) => {
    levelNodes.sort((a, b) => a.x - b.x);
    for (let i = 1; i < levelNodes.length; i++) {
      const prev = levelNodes[i - 1];
      const curr = levelNodes[i];
      if (curr.x - prev.x < MIN_HORIZONTAL_GAP) {
        const shift = MIN_HORIZONTAL_GAP - (curr.x - prev.x);
        shiftSubtree(curr, shift);
      }
    }
  });

  function shiftSubtree(node: LayoutNodeInternal | null, shift: number) {
    if (!node) return;
    node.x += shift;
    shiftSubtree(node.left, shift);
    shiftSubtree(node.right, shift);
  }

  // 5. Flatten to NodeLayout and EdgeLayout lists
  const nodes: NodeLayout[] = [];
  const edges: EdgeLayout[] = [];

  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;

  function collect(node: LayoutNodeInternal | null) {
    if (!node) return;

    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y > maxY) maxY = node.y;

    nodes.push({
      id: node.id,
      value: node.value,
      height: node.height,
      balanceFactor: node.balanceFactor,
      x: node.x,
      y: node.y,
      leftChildId: node.leftChildId,
      rightChildId: node.rightChildId,
    });

    if (node.left) {
      edges.push({
        id: `edge-${node.id}-${node.left.id}`,
        fromId: node.id,
        toId: node.left.id,
        fromX: node.x,
        fromY: node.y + NODE_RADIUS * 0.7,
        toX: node.left.x,
        toY: node.left.y - NODE_RADIUS * 0.7,
        isLeft: true,
      });
      collect(node.left);
    }

    if (node.right) {
      edges.push({
        id: `edge-${node.id}-${node.right.id}`,
        fromId: node.id,
        toId: node.right.id,
        fromX: node.x,
        fromY: node.y + NODE_RADIUS * 0.7,
        toX: node.right.x,
        toY: node.right.y - NODE_RADIUS * 0.7,
        isLeft: false,
      });
      collect(node.right);
    }
  }

  collect(internalRoot);

  const paddingX = 70;
  const paddingY = 80;
  const width = Math.max(700, maxX - minX + paddingX * 2);
  const height = Math.max(450, maxY + paddingY);

  // Normalize X positions so tree is comfortably centered
  const centerShift = width / 2 - (minX + maxX) / 2;
  nodes.forEach((n) => {
    n.x += centerShift;
  });
  edges.forEach((e) => {
    e.fromX += centerShift;
    e.toX += centerShift;
  });

  return {
    nodes,
    edges,
    width,
    height,
    minX: minX + centerShift,
    maxX: maxX + centerShift,
  };
}
