import { AVLNode, AVLTreeStats, ImbalanceType, TraversalResult } from '../types/avl';

/**
 * Creates a new AVL tree node.
 * Height is 1 for a new leaf, Balance Factor is 0.
 */
export function createNode(value: number): AVLNode {
  return {
    id: `node-${value < 0 ? 'neg' + Math.abs(value) : value}`,
    value,
    height: 1,
    balanceFactor: 0,
    left: null,
    right: null,
  };
}

/**
 * Deep clones an AVL tree or subtree to ensure immutable snapshots.
 */
export function cloneTree(node: AVLNode | null): AVLNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    height: node.height,
    balanceFactor: node.balanceFactor,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

/**
 * Returns height of node or 0 if null.
 */
export function getHeight(node: AVLNode | null): number {
  return node ? node.height : 0;
}

/**
 * Balance Factor = height(left subtree) - height(right subtree).
 */
export function getBalanceFactor(node: AVLNode | null): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

/**
 * Updates height and balance factor of a node based on its children.
 */
export function updateNodeStats(node: AVLNode): void {
  const leftHeight = getHeight(node.left);
  const rightHeight = getHeight(node.right);
  node.height = 1 + Math.max(leftHeight, rightHeight);
  node.balanceFactor = leftHeight - rightHeight;
}

/**
 * Standard AVL Right Rotation (Single rotation for LL case)
 *
 *        y                  x
 *       / \                / \
 *      x   T3     -->     T1  y
 *     / \                    / \
 *    T1  T2                 T2  T3
 */
export function rotateRight(y: AVLNode): AVLNode {
  const x = y.left;
  if (!x) return y;

  const t2 = x.right;

  // Perform rotation
  x.right = y;
  y.left = t2;

  // Update heights and balance factors
  updateNodeStats(y);
  updateNodeStats(x);

  return x;
}

/**
 * Standard AVL Left Rotation (Single rotation for RR case)
 *
 *      x                      y
 *     / \                    / \
 *    T1  y        -->       x   T3
 *       / \                / \
 *      T2  T3             T1  T2
 */
export function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right;
  if (!y) return x;

  const t2 = y.left;

  // Perform rotation
  y.left = x;
  x.right = t2;

  // Update heights and balance factors
  updateNodeStats(x);
  updateNodeStats(y);

  return y;
}

/**
 * Rebalances a node if its balance factor is out of bounds (|BF| > 1).
 * Returns the new root of this subtree and the imbalance type.
 */
export function rebalanceNode(node: AVLNode): { newRoot: AVLNode; imbalanceType: ImbalanceType } {
  updateNodeStats(node);
  const bf = node.balanceFactor;

  // Left Heavy (LL or LR)
  if (bf > 1 && node.left) {
    const leftBF = getBalanceFactor(node.left);
    if (leftBF >= 0) {
      // LL Case -> Single Right Rotation
      return { newRoot: rotateRight(node), imbalanceType: 'LL' };
    } else {
      // LR Case -> Left rotate left child, then right rotate node
      node.left = rotateLeft(node.left);
      return { newRoot: rotateRight(node), imbalanceType: 'LR' };
    }
  }

  // Right Heavy (RR or RL)
  if (bf < -1 && node.right) {
    const rightBF = getBalanceFactor(node.right);
    if (rightBF <= 0) {
      // RR Case -> Single Left Rotation
      return { newRoot: rotateLeft(node), imbalanceType: 'RR' };
    } else {
      // RL Case -> Right rotate right child, then left rotate node
      node.right = rotateRight(node.right);
      return { newRoot: rotateLeft(node), imbalanceType: 'RL' };
    }
  }

  return { newRoot: node, imbalanceType: 'NONE' };
}

/**
 * Standard pure AVL insert function.
 */
export function insertNode(root: AVLNode | null, value: number): { root: AVLNode; inserted: boolean } {
  if (!root) {
    return { root: createNode(value), inserted: true };
  }

  const newTree = cloneTree(root)!;

  let inserted = false;
  function insertInternal(node: AVLNode): AVLNode {
    if (value < node.value) {
      if (!node.left) {
        node.left = createNode(value);
        inserted = true;
      } else {
        node.left = insertInternal(node.left);
      }
    } else if (value > node.value) {
      if (!node.right) {
        node.right = createNode(value);
        inserted = true;
      } else {
        node.right = insertInternal(node.right);
      }
    } else {
      // Duplicate, no insertion
      inserted = false;
      return node;
    }

    const { newRoot } = rebalanceNode(node);
    return newRoot;
  }

  const finalRoot = insertInternal(newTree);
  return { root: finalRoot, inserted };
}

/**
 * Traversal functions for tree analysis.
 */
export function getTraversals(root: AVLNode | null): TraversalResult {
  const inorder: number[] = [];
  const preorder: number[] = [];
  const postorder: number[] = [];
  const levelorder: number[] = [];

  function traverseIn(node: AVLNode | null) {
    if (!node) return;
    traverseIn(node.left);
    inorder.push(node.value);
    traverseIn(node.right);
  }

  function traversePre(node: AVLNode | null) {
    if (!node) return;
    preorder.push(node.value);
    traversePre(node.left);
    traversePre(node.right);
  }

  function traversePost(node: AVLNode | null) {
    if (!node) return;
    traversePost(node.left);
    traversePost(node.right);
    postorder.push(node.value);
  }

  function traverseLevel(node: AVLNode | null) {
    if (!node) return;
    const queue: AVLNode[] = [node];
    while (queue.length > 0) {
      const current = queue.shift()!;
      levelorder.push(current.value);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  traverseIn(root);
  traversePre(root);
  traversePost(root);
  traverseLevel(root);

  return { inorder, preorder, postorder, levelorder };
}

/**
 * Gathers subtree values starting from a node.
 */
export function collectSubtreeValues(node: AVLNode | null): number[] {
  if (!node) return [];
  const result: number[] = [];
  function dfs(curr: AVLNode | null) {
    if (!curr) return;
    result.push(curr.value);
    dfs(curr.left);
    dfs(curr.right);
  }
  dfs(node);
  return result;
}

/**
 * Validates AVL invariants:
 * 1. Binary Search Tree ordering (inorder strictly increasing)
 * 2. Balance factor invariant: for every node, |BF| <= 1
 * 3. Height correctness: height = 1 + max(leftHeight, rightHeight)
 */
export function validateAVLTree(root: AVLNode | null): { valid: boolean; reason?: string } {
  if (!root) return { valid: true };

  // 1. BST ordering check
  const { inorder } = getTraversals(root);
  for (let i = 1; i < inorder.length; i++) {
    if (inorder[i] <= inorder[i - 1]) {
      return { valid: false, reason: `BST order violation: ${inorder[i - 1]} >= ${inorder[i]}` };
    }
  }

  // 2. Height and Balance Factor check
  let isBalanced = true;
  let reason = '';

  function check(node: AVLNode | null): number {
    if (!node) return 0;
    const leftH = check(node.left);
    const rightH = check(node.right);

    const expectedHeight = 1 + Math.max(leftH, rightH);
    if (node.height !== expectedHeight) {
      isBalanced = false;
      reason = `Height mismatch at node ${node.value}: node.height=${node.height}, computed=${expectedHeight}`;
    }

    const expectedBF = leftH - rightH;
    if (node.balanceFactor !== expectedBF) {
      isBalanced = false;
      reason = `Balance factor mismatch at node ${node.value}: node.BF=${node.balanceFactor}, computed=${expectedBF}`;
    }

    if (Math.abs(expectedBF) > 1) {
      isBalanced = false;
      reason = `AVL balance invariant violated at node ${node.value}: BF=${expectedBF}`;
    }

    return expectedHeight;
  }

  check(root);

  return isBalanced ? { valid: true } : { valid: false, reason };
}

/**
 * Computes tree statistics.
 */
export function getTreeStats(root: AVLNode | null): AVLTreeStats {
  if (!root) {
    return {
      nodeCount: 0,
      height: 0,
      isBalanced: true,
      minBF: 0,
      maxBF: 0,
      leafCount: 0,
    };
  }

  let nodeCount = 0;
  let leafCount = 0;
  let minBF = 0;
  let maxBF = 0;
  let isBalanced = true;

  function dfs(node: AVLNode | null) {
    if (!node) return;
    nodeCount++;
    if (!node.left && !node.right) leafCount++;
    if (node.balanceFactor < minBF) minBF = node.balanceFactor;
    if (node.balanceFactor > maxBF) maxBF = node.balanceFactor;
    if (Math.abs(node.balanceFactor) > 1) isBalanced = false;

    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);

  return {
    nodeCount,
    height: root.height,
    isBalanced,
    minBF,
    maxBF,
    leafCount,
  };
}
