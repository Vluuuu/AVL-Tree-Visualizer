export interface CustomSequenceResult {
  values: number[];
  uniqueSequence: number[];
  duplicatesCount: number;
  error?: string;
  rawParts: string[];
}

export const MAX_SEQUENCE_ITEMS = 35;

/**
 * Parses and validates an arbitrary sequence of integers (positive, negative, zero).
 * Supports comma-separated, space-separated, and multi-line strings.
 */
export function parseCustomSequence(input: string): CustomSequenceResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      values: [],
      uniqueSequence: [],
      duplicatesCount: 0,
      rawParts: [],
    };
  }

  // Split by comma, whitespace, or newlines
  const parts = trimmed
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const values: number[] = [];
  const uniqueSequence: number[] = [];
  const seen = new Set<number>();
  let duplicatesCount = 0;

  for (const part of parts) {
    // Validate integer format (optional minus sign followed by digits)
    if (!/^-?\d+$/.test(part)) {
      return {
        values: [],
        uniqueSequence: [],
        duplicatesCount: 0,
        rawParts: parts,
        error: `INVALID_INTEGER:${part}`,
      };
    }

    const val = parseInt(part, 10);
    if (!Number.isSafeInteger(val)) {
      return {
        values: [],
        uniqueSequence: [],
        duplicatesCount: 0,
        rawParts: parts,
        error: `OUT_OF_RANGE:${part}`,
      };
    }

    values.push(val);

    if (seen.has(val)) {
      duplicatesCount++;
    } else {
      seen.add(val);
      uniqueSequence.push(val);
    }
  }

  if (uniqueSequence.length > MAX_SEQUENCE_ITEMS) {
    return {
      values,
      uniqueSequence: uniqueSequence.slice(0, MAX_SEQUENCE_ITEMS),
      duplicatesCount,
      rawParts: parts,
      error: 'EXCEEDS_MAX_ITEMS',
    };
  }

  return {
    values,
    uniqueSequence,
    duplicatesCount,
    rawParts: parts,
  };
}
