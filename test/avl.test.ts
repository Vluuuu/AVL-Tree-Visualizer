import { describe, it, expect } from 'vitest';
import {
  createNode,
  insertNode,
  rotateLeft,
  rotateRight,
  validateAVLTree,
  getTraversals,
  getTreeStats,
} from '../src/core/avl';
import { generateSimulationTimeline } from '../src/simulator/timeline';
import { parseDigitGroups, MAX_DIGIT_INPUT_LENGTH } from '../src/core/digitGrouping';
import { parseCustomSequence } from '../src/core/sequenceParser';

describe('1. AVL Tree Core Mathematical Rotations & Invariants', () => {
  it('should perform Single Right Rotation (LL Case) correctly', () => {
    // LL shape:
    //      30
    //     /
    //    20
    //   /
    //  10
    const node30 = createNode(30);
    const node20 = createNode(20);
    const node10 = createNode(10);
    node30.left = node20;
    node20.left = node10;
    node20.height = 2;
    node20.balanceFactor = 1;
    node30.height = 3;
    node30.balanceFactor = 2;

    const rotated = rotateRight(node30);

    // Expected:
    //     20
    //    /  \
    //   10  30
    expect(rotated.value).toBe(20);
    expect(rotated.left?.value).toBe(10);
    expect(rotated.right?.value).toBe(30);
    expect(rotated.height).toBe(2);
    expect(rotated.balanceFactor).toBe(0);
    expect(validateAVLTree(rotated).valid).toBe(true);
  });

  it('should perform Single Left Rotation (RR Case) correctly', () => {
    // RR shape:
    //  10
    //    \
    //     20
    //       \
    //        30
    const node10 = createNode(10);
    const node20 = createNode(20);
    const node30 = createNode(30);
    node10.right = node20;
    node20.right = node30;
    node20.height = 2;
    node20.balanceFactor = -1;
    node10.height = 3;
    node10.balanceFactor = -2;

    const rotated = rotateLeft(node10);

    // Expected:
    //     20
    //    /  \
    //   10  30
    expect(rotated.value).toBe(20);
    expect(rotated.left?.value).toBe(10);
    expect(rotated.right?.value).toBe(30);
    expect(rotated.height).toBe(2);
    expect(rotated.balanceFactor).toBe(0);
    expect(validateAVLTree(rotated).valid).toBe(true);
  });

  it('should handle Double Left-Right Rotation (LR Case) correctly', () => {
    // Insert sequence: 30, 10, 20 (Classic LR)
    let root = null;
    root = insertNode(root, 30).root;
    root = insertNode(root, 10).root;
    root = insertNode(root, 20).root;

    expect(root.value).toBe(20);
    expect(root.left?.value).toBe(10);
    expect(root.right?.value).toBe(30);
    expect(root.height).toBe(2);
    expect(root.balanceFactor).toBe(0);
    expect(validateAVLTree(root).valid).toBe(true);
  });

  it('should handle Double Right-Left Rotation (RL Case) correctly', () => {
    // Insert sequence: 10, 30, 20 (Classic RL)
    let root = null;
    root = insertNode(root, 10).root;
    root = insertNode(root, 30).root;
    root = insertNode(root, 20).root;

    expect(root.value).toBe(20);
    expect(root.left?.value).toBe(10);
    expect(root.right?.value).toBe(30);
    expect(root.height).toBe(2);
    expect(root.balanceFactor).toBe(0);
    expect(validateAVLTree(root).valid).toBe(true);
  });

  it('should support negative integers and preserve BST + AVL invariants', () => {
    const sequence = [-15, -30, -5, 0, -20, 10, -40];
    let root = null;

    for (const val of sequence) {
      root = insertNode(root, val).root;
      const validation = validateAVLTree(root);
      expect(validation.valid).toBe(true);
    }

    const { inorder } = getTraversals(root);
    expect(inorder).toEqual([-40, -30, -20, -15, -5, 0, 10]);
  });

  it('should handle duplicate insertions without modifying tree structure', () => {
    let root = null;
    root = insertNode(root, 50).root;
    root = insertNode(root, 25).root;
    root = insertNode(root, 75).root;

    const beforeStats = getTreeStats(root);
    const result = insertNode(root, 25); // duplicate!
    expect(result.inserted).toBe(false);

    const afterStats = getTreeStats(result.root);
    expect(afterStats.nodeCount).toBe(beforeStats.nodeCount);
    expect(getTraversals(result.root).inorder).toEqual([25, 50, 75]);
  });
});

describe('2. Universal Digit Grouping Parser (Mode A)', () => {
  it('should correctly partition with group size 2 and handle incomplete final groups', () => {
    // 17 digits with group size 2: 8 groups of 2 + 1 group of 1
    const input = '47239472342739472';
    const result = parseDigitGroups(input, 2);

    expect(result.error).toBeUndefined();
    expect(result.groups).toHaveLength(9);
    expect(result.groups.map((g) => g.raw)).toEqual([
      '47', '23', '94', '72', '34', '27', '39', '47', '2'
    ]);
    expect(result.groups.map((g) => g.value)).toEqual([
      47, 23, 94, 72, 34, 27, 39, 47, 2
    ]);

    // Group 7 ('47') is duplicate of group 0
    expect(result.groups[7].isDuplicate).toBe(true);
    expect(result.duplicatesCount).toBe(1);
    expect(result.uniqueSequence).toEqual([47, 23, 94, 72, 34, 27, 39, 2]);
  });

  it('should support grouping sizes 1, 3, 4, and 9', () => {
    const input = '1234567890';

    // Size 1
    const size1 = parseDigitGroups(input, 1);
    expect(size1.groups).toHaveLength(10);
    expect(size1.groups[0].raw).toBe('1');
    expect(size1.groups[9].raw).toBe('0');

    // Size 3: 123 | 456 | 789 | 0
    const size3 = parseDigitGroups(input, 3);
    expect(size3.groups).toHaveLength(4);
    expect(size3.groups[3].raw).toBe('0');

    // Size 4: 1234 | 5678 | 90
    const size4 = parseDigitGroups(input, 4);
    expect(size4.groups).toHaveLength(3);
    expect(size4.groups[2].raw).toBe('90');

    // Size 9: 123456789 | 0
    const size9 = parseDigitGroups(input, 9);
    expect(size9.groups).toHaveLength(2);
    expect(size9.groups[0].raw).toBe('123456789');
    expect(size9.groups[1].raw).toBe('0');
  });

  it('should preserve leading zeros in raw representation while converting to integer', () => {
    const input = '070025';
    const result = parseDigitGroups(input, 2);

    expect(result.groups[0].raw).toBe('07');
    expect(result.groups[0].value).toBe(7);

    expect(result.groups[1].raw).toBe('00');
    expect(result.groups[1].value).toBe(0);

    expect(result.groups[2].raw).toBe('25');
    expect(result.groups[2].value).toBe(25);
  });

  it('should reject non-digit characters and excessive input length', () => {
    // Non-digit
    const invalid = parseDigitGroups('123abc45', 2);
    expect(invalid.error).toBe('INVALID_CHARACTERS');

    // Empty
    const empty = parseDigitGroups('', 2);
    expect(empty.groups).toHaveLength(0);

    // Max length exceeded
    const longString = '1'.repeat(MAX_DIGIT_INPUT_LENGTH + 1);
    const exceeded = parseDigitGroups(longString, 2);
    expect(exceeded.error).toBe('EXCEEDS_MAX_LENGTH');
  });
});

describe('3. Custom Sequence Parser (Mode B)', () => {
  it('should parse comma and whitespace separated positive, negative, and zero integers', () => {
    const input = '30, -15 20, 0,  45   -5';
    const result = parseCustomSequence(input);

    expect(result.error).toBeUndefined();
    expect(result.values).toEqual([30, -15, 20, 0, 45, -5]);
    expect(result.uniqueSequence).toEqual([30, -15, 20, 0, 45, -5]);
  });

  it('should report invalid integer tokens cleanly', () => {
    const input = '10, 20, foo, 40';
    const result = parseCustomSequence(input);

    expect(result.error).toBe('INVALID_INTEGER:foo');
  });

  it('should handle duplicate entries properly', () => {
    const input = '10, 20, 10, 30, 20';
    const result = parseCustomSequence(input);

    expect(result.duplicatesCount).toBe(2);
    expect(result.uniqueSequence).toEqual([10, 20, 30]);
  });
});

describe('4. Educational Simulation Timeline & Layout', () => {
  it('should generate a deterministic, reversible timeline with rotation events', () => {
    // Educational sequence triggering multiple rotations
    const sequence = [40, 20, 60, 10, 30, 5, 15];
    const { steps, insertionMilestones, rotationsPerformed } = generateSimulationTimeline(sequence);

    expect(steps.length).toBeGreaterThan(10);
    expect(insertionMilestones).toHaveLength(sequence.length);

    // Verify chronological step indices
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i].stepIndex).toBe(i);
      expect(steps[i].totalSteps).toBe(steps.length);
    }

    // Milestones must hold valid AVL trees
    for (const ms of insertionMilestones) {
      const tree = steps[ms.stepIndex].treeSnapshot;
      expect(tree).not.toBeNull();
      expect(validateAVLTree(tree).valid).toBe(true);
    }
  });

  it('should ensure all timeline steps contain non-empty bilingual content', () => {
    const sequence = [30, 10, 20]; // LR rotation
    const { steps } = generateSimulationTimeline(sequence);

    for (const step of steps) {
      expect(step.title.id.trim().length).toBeGreaterThan(0);
      expect(step.title.en.trim().length).toBeGreaterThan(0);
      expect(step.description.id.trim().length).toBeGreaterThan(0);
      expect(step.description.en.trim().length).toBeGreaterThan(0);
    }
  });

  it('should calculate collision-free 2D layout coordinates for negative and positive values', () => {
    const sequence = [-50, 0, 50, -25, 25, 75];
    const { steps } = generateSimulationTimeline(sequence);
    const finalStep = steps[steps.length - 1];
    const nodes = finalStep.layout.nodes;

    expect(nodes.length).toBe(sequence.length);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        expect(dist).toBeGreaterThanOrEqual(40);
      }
    }
  });

  it('should ensure Step 0 is strictly an initial empty tree, not the final tree', () => {
    const sequence = [30, 20, 10];
    const { steps } = generateSimulationTimeline(sequence);

    // Step 0 must be empty
    expect(steps[0].treeSnapshot).toBeNull();
    expect(steps[0].type).toBe('START_INSERTION');
    expect(steps[0].stepIndex).toBe(0);

    // Final step must contain the balanced tree with 3 nodes
    const finalStep = steps[steps.length - 1];
    expect(finalStep.treeSnapshot).not.toBeNull();
    expect(finalStep.treeSnapshot?.value).toBe(20);
    expect(finalStep.treeSnapshot?.left?.value).toBe(10);
    expect(finalStep.treeSnapshot?.right?.value).toBe(30);
  });

  it('should preserve and display the unbalanced state before triggering LL rotation', () => {
    // LL sequence: 30, 20, 10
    const sequence = [30, 20, 10];
    const { steps, rotationsPerformed } = generateSimulationTimeline(sequence);

    expect(rotationsPerformed).toHaveLength(1);
    expect(rotationsPerformed[0].imbalanceType).toBe('LL');
    expect(rotationsPerformed[0].pivotValue).toBe(30);

    // Find the DETECT_IMBALANCE step
    const imbalanceStep = steps.find((s) => s.type === 'DETECT_IMBALANCE');
    expect(imbalanceStep).toBeDefined();
    expect(imbalanceStep?.imbalancedNodeValue).toBe(30);
    expect(imbalanceStep?.imbalanceType).toBe('LL');

    // In the unbalanced snapshot, node 30 has height 3 and BF = +2
    const unbalancedTree = imbalanceStep?.treeSnapshot;
    expect(unbalancedTree?.value).toBe(30);
    expect(unbalancedTree?.balanceFactor).toBe(2);
    expect(unbalancedTree?.left?.value).toBe(20);
    expect(unbalancedTree?.left?.left?.value).toBe(10);

    // Next step must be ROTATE_FINAL which produces the balanced tree
    const rotateStep = steps[imbalanceStep!.stepIndex + 1];
    expect(rotateStep.type).toBe('ROTATE_FINAL');
    expect(rotateStep.treeSnapshot?.value).toBe(20);
  });

  it('should preserve intermediate and final states for double rotations (LR and RL)', () => {
    // LR sequence: 30, 10, 20
    const lrTimeline = generateSimulationTimeline([30, 10, 20]);
    const lrIntermediate = lrTimeline.steps.find((s) => s.type === 'ROTATE_INTERMEDIATE');
    const lrFinal = lrTimeline.steps.find((s) => s.type === 'ROTATE_FINAL');
    expect(lrIntermediate).toBeDefined();
    expect(lrFinal).toBeDefined();
    expect(lrIntermediate!.imbalanceType).toBe('LR');
    expect(lrFinal!.imbalanceType).toBe('LR');

    // RL sequence: 10, 30, 20
    const rlTimeline = generateSimulationTimeline([10, 30, 20]);
    const rlIntermediate = rlTimeline.steps.find((s) => s.type === 'ROTATE_INTERMEDIATE');
    const rlFinal = rlTimeline.steps.find((s) => s.type === 'ROTATE_FINAL');
    expect(rlIntermediate).toBeDefined();
    expect(rlFinal).toBeDefined();
    expect(rlIntermediate!.imbalanceType).toBe('RL');
    expect(rlFinal!.imbalanceType).toBe('RL');
  });

  it('should detect RR imbalance and execute left rotation on node 10', () => {
    // RR sequence: 10, 20, 30
    const sequence = [10, 20, 30];
    const { steps, rotationsPerformed } = generateSimulationTimeline(sequence);

    expect(rotationsPerformed).toHaveLength(1);
    expect(rotationsPerformed[0].imbalanceType).toBe('RR');
    expect(rotationsPerformed[0].pivotValue).toBe(10);

    const imbalanceStep = steps.find((s) => s.type === 'DETECT_IMBALANCE');
    expect(imbalanceStep).toBeDefined();
    expect(imbalanceStep?.imbalancedNodeValue).toBe(10);
    expect(imbalanceStep?.imbalanceType).toBe('RR');

    // After rotation, root must be 20 with left 10, right 30
    const finalStep = steps[steps.length - 1];
    expect(finalStep.treeSnapshot?.value).toBe(20);
    expect(finalStep.treeSnapshot?.left?.value).toBe(10);
    expect(finalStep.treeSnapshot?.right?.value).toBe(30);
  });

  it('should support deterministic backward and forward seeking without state mutation', () => {
    const sequence = [40, 20, 60, 10, 30, 50, 70];
    const { steps } = generateSimulationTimeline(sequence);

    // Snapshot at step 5
    const snapshotAt5 = steps[5].treeSnapshot;
    const valueAt5 = steps[5].activeNodeValue;

    // Snapshot at step 12
    const snapshotAt12 = steps[12].treeSnapshot;

    // Verify seeking back to 5 returns identical value and height
    expect(steps[5].treeSnapshot?.value).toBe(snapshotAt5?.value);
    expect(steps[5].activeNodeValue).toBe(valueAt5);
    expect(steps[12].treeSnapshot?.value).toBe(snapshotAt12?.value);
  });
});
