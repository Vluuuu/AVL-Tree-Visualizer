export interface DigitGroupItem {
  raw: string;
  value: number;
  index: number;
  isDuplicate: boolean;
}

export interface DigitGroupingResult {
  groups: DigitGroupItem[];
  uniqueSequence: number[];
  duplicatesCount: number;
  error?: string;
}

export const MAX_DIGIT_INPUT_LENGTH = 50;
export const MIN_GROUP_SIZE = 1;
export const MAX_GROUP_SIZE = 9;

/**
 * Validates and partitions a continuous numeric string into groups of size `groupSize`.
 * Rules:
 * - Left to right partitioning
 * - Preserves the final group even if it contains fewer digits
 * - Preserves leading zeros in raw representation (e.g., "07" -> 7, "00" -> 0)
 * - Identifies duplicates and tracks unique sequence for AVL tree insertion
 */
export function parseDigitGroups(
  input: string,
  groupSize: number
): DigitGroupingResult {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return {
      groups: [],
      uniqueSequence: [],
      duplicatesCount: 0,
    };
  }

  // Validate that input contains only numeric digits
  if (!/^\d+$/.test(cleanInput)) {
    return {
      groups: [],
      uniqueSequence: [],
      duplicatesCount: 0,
      error: 'INVALID_CHARACTERS',
    };
  }

  if (cleanInput.length > MAX_DIGIT_INPUT_LENGTH) {
    return {
      groups: [],
      uniqueSequence: [],
      duplicatesCount: 0,
      error: 'EXCEEDS_MAX_LENGTH',
    };
  }

  const validGroupSize = Math.max(
    MIN_GROUP_SIZE,
    Math.min(MAX_GROUP_SIZE, Math.floor(groupSize))
  );

  const groups: DigitGroupItem[] = [];
  const seenValues = new Set<number>();
  const uniqueSequence: number[] = [];
  let duplicatesCount = 0;

  for (let i = 0; i < cleanInput.length; i += validGroupSize) {
    const raw = cleanInput.slice(i, i + validGroupSize);
    const value = parseInt(raw, 10);
    const isDuplicate = seenValues.has(value);

    if (isDuplicate) {
      duplicatesCount++;
    } else {
      seenValues.add(value);
      uniqueSequence.push(value);
    }

    groups.push({
      raw,
      value,
      index: groups.length,
      isDuplicate,
    });
  }

  return {
    groups,
    uniqueSequence,
    duplicatesCount,
  };
}
