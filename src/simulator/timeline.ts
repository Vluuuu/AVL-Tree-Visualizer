import { AVLNode, ImbalanceType, SimulationStep } from '../types/avl';
import { cloneTree, createNode, getBalanceFactor, getHeight, updateNodeStats, rotateLeft, rotateRight } from '../core/avl';
import { computeTreeLayout } from '../core/layout';

export type SequenceInputItem = number | { value: number; raw?: string };

export interface InsertionMilestone {
  insertionNumber: number;
  value: number;
  displayLabel?: string;
  stepIndex: number;
}

export interface TimelineGenerationResult {
  steps: SimulationStep[];
  insertionMilestones: InsertionMilestone[];
  rotationsPerformed: {
    insertionNumber: number;
    value: number;
    imbalanceType: ImbalanceType;
    pivotValue: number;
  }[];
}

/**
 * Builds a comprehensive, step-by-step visual timeline for an AVL tree insertion sequence.
 * Every step contains an immutable tree snapshot and computed layout for deterministic navigation.
 */
export function generateSimulationTimeline(sequence: SequenceInputItem[]): TimelineGenerationResult {
  const steps: SimulationStep[] = [];
  const milestones: InsertionMilestone[] = [];
  const rotationsPerformed: {
    insertionNumber: number;
    value: number;
    imbalanceType: ImbalanceType;
    pivotValue: number;
  }[] = [];

  let currentTree: AVLNode | null = null;
  const totalInsertions = sequence.length;

  function pushStep(partial: Omit<SimulationStep, 'stepIndex' | 'totalSteps' | 'layout'>) {
    const layout = computeTreeLayout(partial.treeSnapshot);
    const step: SimulationStep = {
      ...partial,
      stepIndex: steps.length,
      totalSteps: 0, // will be updated at the end
      layout,
    };
    steps.push(step);
    return step;
  }

  // Initial step before any insertions
  pushStep({
    insertionNumber: 0,
    totalInsertions,
    currentValue: 0,
    type: 'START_INSERTION',
    title: {
      id: 'Pohon AVL Awal',
      en: 'Initial AVL Tree',
    },
    description: {
      id: 'Pohon masih kosong. Siap memulai simulasi penyisipan elemen.',
      en: 'The tree is currently empty. Ready to begin the element insertion simulation.',
    },
    treeSnapshot: null,
  });

  // Process each item in the sequence
  for (let insIdx = 0; insIdx < sequence.length; insIdx++) {
    const item = sequence[insIdx];
    const val = typeof item === 'number' ? item : item.value;
    const rawLabel = typeof item === 'number' ? String(val) : (item.raw || String(val));
    const hasRawDiff = rawLabel !== String(val);
    const insertionNum = insIdx + 1;

    // Step: Start of this insertion
    pushStep({
      insertionNumber: insertionNum,
      totalInsertions,
      currentValue: val,
      displayLabel: rawLabel,
      type: 'START_INSERTION',
      activeNodeValue: val,
      title: {
        id: hasRawDiff
          ? `Penyisipan #${insertionNum}: Nilai ${val} (dari "${rawLabel}")`
          : `Penyisipan #${insertionNum}: Nilai ${val}`,
        en: hasRawDiff
          ? `Insertion #${insertionNum}: Value ${val} (from "${rawLabel}")`
          : `Insertion #${insertionNum}: Value ${val}`,
      },
      description: {
        id: `Mempersiapkan penyisipan nilai ${val} ke dalam pohon AVL.`,
        en: `Preparing to insert value ${val} into the AVL tree.`,
      },
      treeSnapshot: cloneTree(currentTree),
    });

    if (!currentTree) {
      // First node in empty tree
      currentTree = createNode(val);

      pushStep({
        insertionNumber: insertionNum,
        totalInsertions,
        currentValue: val,
        displayLabel: rawLabel,
        type: 'INSERT_LEAF',
        activeNodeValue: val,
        title: {
          id: `Simpul Akar Dibuat: ${val}`,
          en: `Root Node Created: ${val}`,
        },
        description: {
          id: `Karena pohon masih kosong, nilai ${val} disematkan sebagai simpul akar (root) dengan tinggi 1 dan faktor keseimbangan 0.`,
          en: `Since the tree is empty, value ${val} is placed as the root node with height 1 and balance factor 0.`,
        },
        mathExplanation: {
          id: 'Tinggi = 1, BF = h(kiri) - h(kanan) = 0 - 0 = 0 (Seimbang)',
          en: 'Height = 1, BF = h(left) - h(right) = 0 - 0 = 0 (Balanced)',
        },
        treeSnapshot: cloneTree(currentTree),
      });

      milestones.push({
        insertionNumber: insertionNum,
        value: val,
        displayLabel: rawLabel,
        stepIndex: steps.length - 1,
      });
      continue;
    }

    // Tree is not empty: traverse to find insertion spot
    let workingTree: AVLNode = cloneTree(currentTree)!;
    const path: AVLNode[] = [];
    let curr: AVLNode | null = workingTree;
    let isDuplicate = false;

    while (curr) {
      path.push(curr);

      pushStep({
        insertionNumber: insertionNum,
        totalInsertions,
        currentValue: val,
        displayLabel: rawLabel,
        type: 'TRAVERSE_COMPARE',
        activeNodeValue: val,
        comparingNodeValue: curr.value,
        affectedNodeValues: path.map((n) => n.value),
        title: {
          id: `Membandingkan ${val} dengan Simpul ${curr.value}`,
          en: `Comparing ${val} with Node ${curr.value}`,
        },
        description: {
          id:
            val < curr.value
              ? `Karena ${val} < ${curr.value}, algoritma menelusuri ke sub-pohon kiri.`
              : val > curr.value
              ? `Karena ${val} > ${curr.value}, algoritma menelusuri ke sub-pohon kanan.`
              : `Nilai ${val} sudah ada di dalam pohon. Penyisipan diabaikan untuk menjaga keunikan simpul BST.`,
          en:
            val < curr.value
              ? `Since ${val} < ${curr.value}, traversal proceeds to the left subtree.`
              : val > curr.value
              ? `Since ${val} > ${curr.value}, traversal proceeds to the right subtree.`
              : `Value ${val} already exists in the tree. Insertion skipped to maintain unique BST nodes.`,
        },
        treeSnapshot: cloneTree(workingTree),
      });

      if (val < curr.value) {
        if (!curr.left) break;
        curr = curr.left;
      } else if (val > curr.value) {
        if (!curr.right) break;
        curr = curr.right;
      } else {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      pushStep({
        insertionNumber: insertionNum,
        totalInsertions,
        currentValue: val,
        displayLabel: rawLabel,
        type: 'DUPLICATE_SKIPPED',
        activeNodeValue: val,
        title: {
          id: `Duplikat Diabaikan: ${val}`,
          en: `Duplicate Skipped: ${val}`,
        },
        description: {
          id: hasRawDiff
            ? `Nilai ${val} (dari "${rawLabel}") telah ada sebelumnya. Struktur pohon AVL tidak mengalami perubahan.`
            : `Nilai ${val} telah ada sebelumnya. Struktur pohon AVL tidak mengalami perubahan.`,
          en: hasRawDiff
            ? `Value ${val} (from "${rawLabel}") was already present. The AVL tree structure remains unchanged.`
            : `Value ${val} was already present. The AVL tree structure remains unchanged.`,
        },
        treeSnapshot: cloneTree(workingTree),
      });

      currentTree = workingTree;
      milestones.push({
        insertionNumber: insertionNum,
        value: val,
        displayLabel: rawLabel,
        stepIndex: steps.length - 1,
      });
      continue;
    }

    // Attach new node as leaf to the last node on path
    const parentNode = path[path.length - 1];
    const newNode = createNode(val);
    if (val < parentNode.value) {
      parentNode.left = newNode;
    } else {
      parentNode.right = newNode;
    }

    pushStep({
      insertionNumber: insertionNum,
      totalInsertions,
      currentValue: val,
      displayLabel: rawLabel,
      type: 'INSERT_LEAF',
      activeNodeValue: val,
      comparingNodeValue: parentNode.value,
      affectedNodeValues: [parentNode.value, val],
      title: {
        id: `Menyisipkan Daun Baru: ${val}`,
        en: `Inserting New Leaf: ${val}`,
      },
      description: {
        id: `Simpul ${val} disematkan sebagai anak ${val < parentNode.value ? 'kiri' : 'kanan'} dari simpul ${parentNode.value}.`,
        en: `Node ${val} attached as ${val < parentNode.value ? 'left' : 'right'} child of node ${parentNode.value}.`,
      },
      mathExplanation: {
        id: `Simpul baru memiliki tinggi 1 dan BF = 0. Selanjutnya leluhur akan diperbarui.`,
        en: `New leaf has height 1 and BF = 0. Ancestors will now be updated.`,
      },
      treeSnapshot: cloneTree(workingTree),
    });

    // Backtrack up the path to recalculate heights, balance factors, and detect imbalances
    let rotationPerformed = false;

    for (let pIdx = path.length - 1; pIdx >= 0; pIdx--) {
      const ancestor = path[pIdx];
      const oldH = ancestor.height;
      const oldBF = ancestor.balanceFactor;
      updateNodeStats(ancestor);
      const newH = ancestor.height;
      const newBF = ancestor.balanceFactor;

      const hL = getHeight(ancestor.left);
      const hR = getHeight(ancestor.right);

      pushStep({
        insertionNumber: insertionNum,
        totalInsertions,
        currentValue: val,
        displayLabel: rawLabel,
        type: 'RECALCULATE',
        activeNodeValue: ancestor.value,
        affectedNodeValues: path.map((n) => n.value),
        title: {
          id: `Perbarui Simpul ${ancestor.value}: Tinggi & Faktor Keseimbangan`,
          en: `Update Node ${ancestor.value}: Height & Balance Factor`,
        },
        description: {
          id: `Menghitung ulang: h(kiri) = ${hL}, h(kanan) = ${hR}. Tinggi = 1 + max(${hL}, ${hR}) = ${newH}. Faktor Keseimbangan (BF) = ${hL} - ${hR} = ${newBF}.`,
          en: `Recalculating: h(left) = ${hL}, h(right) = ${hR}. Height = 1 + max(${hL}, ${hR}) = ${newH}. Balance Factor (BF) = ${hL} - ${hR} = ${newBF}.`,
        },
        mathExplanation: {
          id: `Tinggi: ${oldH} -> ${newH} | BF: ${oldBF} -> ${newBF} (|BF| ${Math.abs(newBF) <= 1 ? '<= 1: Seimbang' : '> 1: TIDAK SEIMBANG!'})`,
          en: `Height: ${oldH} -> ${newH} | BF: ${oldBF} -> ${newBF} (|BF| ${Math.abs(newBF) <= 1 ? '<= 1: Balanced' : '> 1: IMBALANCED!'})`,
        },
        treeSnapshot: cloneTree(workingTree),
      });

      // Check if this ancestor violated AVL balance condition
      if (Math.abs(newBF) > 1) {
        rotationPerformed = true;
        let caseType: ImbalanceType = 'NONE';
        const pivotVal = ancestor.value;

        if (newBF > 1 && ancestor.left) {
          // Left Heavy
          const leftBF = getBalanceFactor(ancestor.left);
          if (leftBF >= 0) {
            caseType = 'LL';
          } else {
            caseType = 'LR';
          }
        } else if (newBF < -1 && ancestor.right) {
          // Right Heavy
          const rightBF = getBalanceFactor(ancestor.right);
          if (rightBF <= 0) {
            caseType = 'RR';
          } else {
            caseType = 'RL';
          }
        }

        rotationsPerformed.push({
          insertionNumber: insertionNum,
          value: val,
          imbalanceType: caseType,
          pivotValue: pivotVal,
        });

        // Step: Highlight Imbalance Detection
        pushStep({
          insertionNumber: insertionNum,
          totalInsertions,
          currentValue: val,
          displayLabel: rawLabel,
          type: 'DETECT_IMBALANCE',
          imbalancedNodeValue: pivotVal,
          rotationPivotValue: pivotVal,
          imbalanceType: caseType,
          affectedNodeValues: [pivotVal, ancestor.left?.value ?? 0, ancestor.right?.value ?? 0].filter(Boolean),
          title: {
            id: `Ketidakseimbangan Terdeteksi pada Simpul ${pivotVal} (Kasus ${caseType})`,
            en: `Imbalance Detected at Node ${pivotVal} (${caseType} Case)`,
          },
          description: {
            id: getImbalanceDescription(caseType, ancestor, 'id'),
            en: getImbalanceDescription(caseType, ancestor, 'en'),
          },
          mathExplanation: {
            id: `Kondisi AVL dilanggar: BF(${pivotVal}) = ${newBF}. Diperlukan rotasi ${getRotationName(caseType, 'id')}.`,
            en: `AVL condition violated: BF(${pivotVal}) = ${newBF}. ${getRotationName(caseType, 'en')} rotation required.`,
          },
          treeSnapshot: cloneTree(workingTree),
        });

        // Helper to replace subtree in workingTree
        const replaceSubtree = (oldNode: AVLNode, newRoot: AVLNode) => {
          if (workingTree === oldNode) {
            workingTree = newRoot;
            return;
          }
          const parentOfOld = findParent(workingTree, oldNode.value);
          if (parentOfOld) {
            if (parentOfOld.left === oldNode) {
              parentOfOld.left = newRoot;
            } else if (parentOfOld.right === oldNode) {
              parentOfOld.right = newRoot;
            }
            updateNodeStats(parentOfOld);
          }
        };

        // Perform Rotations
        if (caseType === 'LL') {
          // Single Right Rotation at ancestor
          const newSubRoot = rotateRight(ancestor);
          replaceSubtree(ancestor, newSubRoot);

          pushStep({
            insertionNumber: insertionNum,
            totalInsertions,
            currentValue: val,
            displayLabel: rawLabel,
            type: 'ROTATE_FINAL',
            activeNodeValue: newSubRoot.value,
            rotationPivotValue: pivotVal,
            imbalanceType: 'LL',
            rotationType: `Right Rotation at ${pivotVal}`,
            affectedNodeValues: [newSubRoot.value, ancestor.value],
            title: {
              id: `Rotasi Kanan (Right Rotation) pada Simpul ${pivotVal}`,
              en: `Right Rotation at Node ${pivotVal}`,
            },
            description: {
              id: `Simpul ${newSubRoot.value} naik menjadi akar sub-pohon baru. Simpul ${pivotVal} turun menjadi anak kanannya. Keseimbangan kembali normal.`,
              en: `Node ${newSubRoot.value} ascends as the new subtree root. Node ${pivotVal} descends as its right child. Balance is restored.`,
            },
            treeSnapshot: cloneTree(workingTree),
          });
        } else if (caseType === 'RR') {
          // Single Left Rotation at ancestor
          const newSubRoot = rotateLeft(ancestor);
          replaceSubtree(ancestor, newSubRoot);

          pushStep({
            insertionNumber: insertionNum,
            totalInsertions,
            currentValue: val,
            displayLabel: rawLabel,
            type: 'ROTATE_FINAL',
            activeNodeValue: newSubRoot.value,
            rotationPivotValue: pivotVal,
            imbalanceType: 'RR',
            rotationType: `Left Rotation at ${pivotVal}`,
            affectedNodeValues: [newSubRoot.value, ancestor.value],
            title: {
              id: `Rotasi Kiri (Left Rotation) pada Simpul ${pivotVal}`,
              en: `Left Rotation at Node ${pivotVal}`,
            },
            description: {
              id: `Simpul ${newSubRoot.value} naik menjadi akar sub-pohon baru. Simpul ${pivotVal} turun menjadi anak kirinya. Keseimbangan kembali normal.`,
              en: `Node ${newSubRoot.value} ascends as the new subtree root. Node ${pivotVal} descends as its left child. Balance is restored.`,
            },
            treeSnapshot: cloneTree(workingTree),
          });
        } else if (caseType === 'LR') {
          // Double rotation: Left on left child, then Right on ancestor
          const leftChild = ancestor.left!;
          const childVal = leftChild.value;

          // Step 1: Left rotation at left child
          ancestor.left = rotateLeft(leftChild);
          updateNodeStats(ancestor);

          pushStep({
            insertionNumber: insertionNum,
            totalInsertions,
            currentValue: val,
            displayLabel: rawLabel,
            type: 'ROTATE_INTERMEDIATE',
            activeNodeValue: ancestor.left.value,
            rotationPivotValue: childVal,
            imbalanceType: 'LR',
            rotationType: `Step 1/2: Left Rotation at ${childVal}`,
            affectedNodeValues: [ancestor.value, ancestor.left.value, childVal],
            title: {
              id: `Langkah 1/2 Rotasi LR: Rotasi Kiri pada Simpul ${childVal}`,
              en: `Step 1/2 of LR Rotation: Left Rotation at Node ${childVal}`,
            },
            description: {
              id: `Rotasi kiri dilakukan pada anak kiri (${childVal}). Konfigurasi Left-Right (LR) kini telah ditransformasi menjadi Left-Left (LL).`,
              en: `Left rotation performed on left child (${childVal}). The Left-Right (LR) shape is transformed into a Left-Left (LL) shape.`,
            },
            treeSnapshot: cloneTree(workingTree),
          });

          // Step 2: Right rotation at ancestor
          const newSubRoot = rotateRight(ancestor);
          replaceSubtree(ancestor, newSubRoot);

          pushStep({
            insertionNumber: insertionNum,
            totalInsertions,
            currentValue: val,
            displayLabel: rawLabel,
            type: 'ROTATE_FINAL',
            activeNodeValue: newSubRoot.value,
            rotationPivotValue: pivotVal,
            imbalanceType: 'LR',
            rotationType: `Step 2/2: Right Rotation at ${pivotVal}`,
            affectedNodeValues: [newSubRoot.value, pivotVal, childVal],
            title: {
              id: `Langkah 2/2 Rotasi LR: Rotasi Kanan pada Simpul ${pivotVal}`,
              en: `Step 2/2 of LR Rotation: Right Rotation at Node ${pivotVal}`,
            },
            description: {
              id: `Rotasi kanan dilakukan pada simpul ${pivotVal}. Simpul ${newSubRoot.value} menjadi akar sub-pohon. Sub-pohon kini seimbang secara sempurna.`,
              en: `Right rotation performed on node ${pivotVal}. Node ${newSubRoot.value} is now subtree root. Subtree is now perfectly balanced.`,
            },
            treeSnapshot: cloneTree(workingTree),
          });
        } else if (caseType === 'RL') {
          // Double rotation: Right on right child, then Left on ancestor
          const rightChild = ancestor.right!;
          const childVal = rightChild.value;

          // Step 1: Right rotation at right child
          ancestor.right = rotateRight(rightChild);
          updateNodeStats(ancestor);

          pushStep({
            insertionNumber: insertionNum,
            totalInsertions,
            currentValue: val,
            displayLabel: rawLabel,
            type: 'ROTATE_INTERMEDIATE',
            activeNodeValue: ancestor.right.value,
            rotationPivotValue: childVal,
            imbalanceType: 'RL',
            rotationType: `Step 1/2: Right Rotation at ${childVal}`,
            affectedNodeValues: [ancestor.value, ancestor.right.value, childVal],
            title: {
              id: `Langkah 1/2 Rotasi RL: Rotasi Kanan pada Simpul ${childVal}`,
              en: `Step 1/2 of RL Rotation: Right Rotation at Node ${childVal}`,
            },
            description: {
              id: `Rotasi kanan dilakukan pada anak kanan (${childVal}). Konfigurasi Right-Left (RL) kini telah ditransformasi menjadi Right-Right (RR).`,
              en: `Right rotation performed on right child (${childVal}). The Right-Left (RL) shape is transformed into a Right-Right (RR) shape.`,
            },
            treeSnapshot: cloneTree(workingTree),
          });

          // Step 2: Left rotation at ancestor
          const newSubRoot = rotateLeft(ancestor);
          replaceSubtree(ancestor, newSubRoot);

          pushStep({
            insertionNumber: insertionNum,
            totalInsertions,
            currentValue: val,
            displayLabel: rawLabel,
            type: 'ROTATE_FINAL',
            activeNodeValue: newSubRoot.value,
            rotationPivotValue: pivotVal,
            imbalanceType: 'RL',
            rotationType: `Step 2/2: Left Rotation at ${pivotVal}`,
            affectedNodeValues: [newSubRoot.value, pivotVal, childVal],
            title: {
              id: `Langkah 2/2 Rotasi RL: Rotasi Kiri pada Simpul ${pivotVal}`,
              en: `Step 2/2 of RL Rotation: Left Rotation at Node ${pivotVal}`,
            },
            description: {
              id: `Rotasi kiri dilakukan pada simpul ${pivotVal}. Simpul ${newSubRoot.value} menjadi akar sub-pohon. Sub-pohon kini seimbang secara sempurna.`,
              en: `Left rotation performed on node ${pivotVal}. Node ${newSubRoot.value} is now subtree root. Subtree is now perfectly balanced.`,
            },
            treeSnapshot: cloneTree(workingTree),
          });
        }

        // Recompute all ancestors above the rotated subtree
        for (let aIdx = pIdx - 1; aIdx >= 0; aIdx--) {
          updateNodeStats(path[aIdx]);
        }

        // In AVL insertion, one single or double rotation restores height, so break!
        break;
      }
    }

    currentTree = workingTree;

    // Step: Insertion Complete for this value
    pushStep({
      insertionNumber: insertionNum,
      totalInsertions,
      currentValue: val,
      displayLabel: rawLabel,
      type: 'INSERTION_COMPLETE',
      activeNodeValue: val,
      title: {
        id: `Penyisipan #${insertionNum} (${val}) Berhasil Diselesaikan`,
        en: `Insertion #${insertionNum} (${val}) Successfully Completed`,
      },
      description: {
        id: rotationPerformed
          ? `Nilai ${val} telah tersimpan dan pohon diseimbangkan kembali. Invarian AVL terpenuhi.`
          : `Nilai ${val} telah tersimpan. Pohon tetap seimbang tanpa memerlukan rotasi.`,
        en: rotationPerformed
          ? `Value ${val} stored and tree rebalanced. All AVL invariants are satisfied.`
          : `Value ${val} stored. The tree remains balanced without requiring any rotation.`,
      },
      treeSnapshot: cloneTree(currentTree),
    });

    milestones.push({
      insertionNumber: insertionNum,
      value: val,
      displayLabel: rawLabel,
      stepIndex: steps.length - 1,
    });
  }

  // Update totalSteps on all steps
  const total = steps.length;
  steps.forEach((s) => {
    s.totalSteps = total;
  });

  return {
    steps,
    insertionMilestones: milestones,
    rotationsPerformed,
  };
}

function findParent(root: AVLNode | null, childValue: number): AVLNode | null {
  if (!root) return null;
  if ((root.left && root.left.value === childValue) || (root.right && root.right.value === childValue)) {
    return root;
  }
  if (childValue < root.value) {
    return findParent(root.left, childValue);
  } else {
    return findParent(root.right, childValue);
  }
}

function getImbalanceDescription(type: ImbalanceType, node: AVLNode, lang: 'id' | 'en'): string {
  if (lang === 'id') {
    switch (type) {
      case 'LL':
        return `Simpul ${node.value} berat ke kiri (BF = +2) dan anak kirinya (${node.left?.value}) juga berat ke kiri/seimbang (BF >= 0). Ini adalah kasus Left-Left (LL), diselesaikan dengan 1 Rotasi Kanan pada simpul ${node.value}.`;
      case 'RR':
        return `Simpul ${node.value} berat ke kanan (BF = -2) dan anak kanannya (${node.right?.value}) juga berat ke kanan/seimbang (BF <= 0). Ini adalah kasus Right-Right (RR), diselesaikan dengan 1 Rotasi Kiri pada simpul ${node.value}.`;
      case 'LR':
        return `Simpul ${node.value} berat ke kiri (BF = +2), namun anak kirinya (${node.left?.value}) berat ke kanan (BF = -1). Ini adalah kasus Left-Right (LR), diselesaikan dengan Rotasi Kiri pada ${node.left?.value} lalu Rotasi Kanan pada ${node.value}.`;
      case 'RL':
        return `Simpul ${node.value} berat ke kanan (BF = -2), namun anak kanannya (${node.right?.value}) berat ke kiri (BF = +1). Ini adalah kasus Right-Left (RL), diselesaikan dengan Rotasi Kanan pada ${node.right?.value} lalu Rotasi Kiri pada ${node.value}.`;
      default:
        return 'Pohon dalam batas toleransi keseimbangan.';
    }
  } else {
    switch (type) {
      case 'LL':
        return `Node ${node.value} is left-heavy (BF = +2) and its left child (${node.left?.value}) is also left-heavy/balanced (BF >= 0). This is a Left-Left (LL) case, resolved by 1 Right Rotation at node ${node.value}.`;
      case 'RR':
        return `Node ${node.value} is right-heavy (BF = -2) and its right child (${node.right?.value}) is also right-heavy/balanced (BF <= 0). This is a Right-Right (RR) case, resolved by 1 Left Rotation at node ${node.value}.`;
      case 'LR':
        return `Node ${node.value} is left-heavy (BF = +2), but its left child (${node.left?.value}) is right-heavy (BF = -1). This is a Left-Right (LR) case, resolved by Left Rotation at ${node.left?.value} then Right Rotation at ${node.value}.`;
      case 'RL':
        return `Node ${node.value} is right-heavy (BF = -2), but its right child (${node.right?.value}) is left-heavy (BF = +1). This is a Right-Left (RL) case, resolved by Right Rotation at ${node.right?.value} then Left Rotation at ${node.value}.`;
      default:
        return 'Tree is within balance tolerance.';
    }
  }
}

function getRotationName(type: ImbalanceType, lang: 'id' | 'en'): string {
  if (lang === 'id') {
    switch (type) {
      case 'LL':
        return 'Tunggal Kanan (Right Rotation)';
      case 'RR':
        return 'Tunggal Kiri (Left Rotation)';
      case 'LR':
        return 'Ganda Kiri-Kanan (LR Rotation)';
      case 'RL':
        return 'Ganda Kanan-Kiri (RL Rotation)';
      default:
        return 'Tidak ada';
    }
  } else {
    switch (type) {
      case 'LL':
        return 'Single Right';
      case 'RR':
        return 'Single Left';
      case 'LR':
        return 'Double Left-Right';
      case 'RL':
        return 'Double Right-Left';
      default:
        return 'None';
    }
  }
}
