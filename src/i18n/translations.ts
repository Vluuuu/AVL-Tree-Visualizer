export type Language = 'id' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  theoryGuideBtn: string;
  closeBtn: string;
  languageToggle: string;
  themeToggleLight: string;
  themeToggleDark: string;
  themeLight: string;
  themeDark: string;

  // Universal Input Modes
  modeDigitGrouping: string;
  modeCustomSequence: string;
  digitInputLabel: string;
  digitInputPlaceholder: string;
  groupSizeLabel: string;
  groupSizeUnit: string;
  parsedGroupsTitle: string;
  rawDigitTag: string;
  parsedValueTag: string;
  duplicateBadge: string;
  uniqueValuesCount: string;
  duplicatesSkippedCount: string;

  // Custom Sequence Mode
  customSequenceLabel: string;
  customSequencePlaceholder: string;
  applySequenceBtn: string;
  loadAndPlayBtn: string;
  loadOnlyBtn: string;
  resetInputBtn: string;
  insertSingleValuePlaceholder: string;
  insertSingleBtn: string;
  clearTreeBtn: string;

  // Educational Presets
  presetsTitle: string;
  presetLLDemo: string;
  presetRRDemo: string;
  presetLRDemo: string;
  presetRLDemo: string;
  presetBalanced7: string;
  presetRandom8: string;
  presetDigitSample: string;

  // Validation & Errors
  inputErrorDigitsOnly: string;
  inputErrorLengthExceeded: string;
  inputErrorInvalidInteger: string;
  inputErrorDuplicate: string;
  inputErrorMaxItemsExceeded: string;
  onboardingTip: string;

  // Controls & Timeline
  stepLabel: string;
  stepOf: string;
  playbackSpeed: string;
  prevStep: string;
  nextStep: string;
  play: string;
  pause: string;
  resetSim: string;
  replayBtn: string;
  skipToEndBtn: string;
  jumpToStage: string;
  stageTitle: string;
  completedAtStage: string;

  // Tree Canvas
  canvasTitle: string;
  emptyTreeTitle: string;
  emptyTreeDesc: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  fitToView: string;
  nodeLegend: string;
  legendBalanced: string;
  legendActive: string;
  legendImbalanced: string;
  legendPivot: string;
  legendNewLeaf: string;

  // Inspector & Stats
  inspectorTitle: string;
  stepTypeLabel: string;
  detailsLabel: string;
  mathCalculationLabel: string;
  treeStatsTitle: string;
  totalNodes: string;
  treeHeight: string;
  balanceStatus: string;
  statusBalanced: string;
  statusImbalanced: string;
  inorderTitle: string;
  rotationsLogTitle: string;
  noRotationsYet: string;
  activeRotation: string;
  imbalanceCase: string;
  bfRange: string;
  nodeValueLabel: string;
  pivotLabel: string;

  // Rotation Theory Modal
  theoryTitle: string;
  theorySubtitle: string;
  whatIsAVLTitle: string;
  whatIsAVLDesc: string;
  balanceFactorTitle: string;
  balanceFactorFormula: string;
  balanceFactorExplanation: string;
  whyRotateTitle: string;
  whyRotateDesc: string;
  fourCasesTitle: string;
  caseLLTitle: string;
  caseLLDesc: string;
  caseRRTitle: string;
  caseRRDesc: string;
  caseLRTitle: string;
  caseLRDesc: string;
  caseRLTitle: string;
  caseRLDesc: string;
  complexityTitle: string;
  complexityDesc: string;
}

export const translations: Record<Language, Translations> = {
  id: {
    appTitle: 'Visualisator Pohon AVL',
    appSubtitle: 'Workspace Interaktif Pembelajaran Struktur Data Self-Balancing',
    theoryGuideBtn: 'Panduan Teori Rotasi',
    closeBtn: 'Tutup',
    languageToggle: 'ID / EN',
    themeToggleLight: 'Ganti ke Mode Terang',
    themeToggleDark: 'Ganti ke Mode Gelap',
    themeLight: 'Terang',
    themeDark: 'Gelap',

    // Universal Input Modes
    modeDigitGrouping: 'Pengelompokan Digit',
    modeCustomSequence: 'Urutan Nilai Bebas',
    digitInputLabel: 'Deret Angka Berkelanjutan',
    digitInputPlaceholder: 'Masukkan deret angka, contoh: 47239472342739472',
    groupSizeLabel: 'Ukuran Kelompok:',
    groupSizeUnit: 'digit per kelompok',
    parsedGroupsTitle: 'Visualisasi Partisi Digit & Nilai Integer:',
    rawDigitTag: 'Teks Asli',
    parsedValueTag: 'Nilai Numerik',
    duplicateBadge: 'Duplikat',
    uniqueValuesCount: 'Nilai Unik',
    duplicatesSkippedCount: 'Duplikat Diabaikan',

    // Custom Sequence Mode
    customSequenceLabel: 'Daftar Angka Bulat (Positif, Negatif, Nol)',
    customSequencePlaceholder: 'Ketik angka dipisah koma/spasi, contoh: 30, -15, 20, 0, 45, 10',
    applySequenceBtn: 'Muat & Jalankan',
    loadAndPlayBtn: 'Muat & Putar Otomatis',
    loadOnlyBtn: 'Muat Saja',
    resetInputBtn: 'Bersihkan Input',
    insertSingleValuePlaceholder: 'Tambah 1 nilai (misal: 42)',
    insertSingleBtn: 'Sisipkan',
    clearTreeBtn: 'Kosongkan Pohon',

    // Educational Presets
    presetsTitle: 'Preset Demonstrasi Algoritma:',
    presetLLDemo: 'Kasus LL (30, 20, 10)',
    presetRRDemo: 'Kasus RR (10, 20, 30)',
    presetLRDemo: 'Kasus LR (30, 10, 20)',
    presetRLDemo: 'Kasus RL (10, 30, 20)',
    presetBalanced7: 'Pohon 7 Simpul (40,20,60...)',
    presetRandom8: 'Acak 8 Angka',
    presetDigitSample: 'Contoh Deret Digit (4723947234...)',

    // Validation & Errors
    inputErrorDigitsOnly: 'Input deret digit hanya boleh berisi angka 0-9 tanpa spasi atau karakter lain.',
    inputErrorLengthExceeded: 'Deret digit terlalu panjang (maksimal 50 digit agar visualisasi tetap responsif).',
    inputErrorInvalidInteger: 'Ditemukan format angka tidak valid: ',
    inputErrorDuplicate: 'Nilai ini sudah ada di dalam pohon AVL.',
    inputErrorMaxItemsExceeded: 'Jumlah elemen melebihi batas (maksimum 35 angka).',
    onboardingTip: 'Pilih mode input di atas atau klik salah satu preset demonstrasi untuk melihat simulasi penyeimbangan AVL.',

    // Controls & Timeline
    stepLabel: 'Langkah',
    stepOf: 'dari',
    playbackSpeed: 'Kecepatan',
    prevStep: 'Sebelumnya',
    nextStep: 'Selanjutnya',
    play: 'Putar Animasi',
    pause: 'Jeda',
    resetSim: 'Kembali ke Awal',
    replayBtn: 'Putar Ulang',
    skipToEndBtn: 'Lompat ke Akhir',
    jumpToStage: 'Lompat ke Tahap Penyisipan:',
    stageTitle: 'Tahap',
    completedAtStage: 'Selesai disisipkan',

    // Tree Canvas
    canvasTitle: 'Kanvas Visualisasi Pohon AVL',
    emptyTreeTitle: 'Pohon AVL Belum Memiliki Elemen',
    emptyTreeDesc: 'Ketikkan angka pada panel kontrol di atas atau pilih preset demonstrasi untuk memulai visualisasi langkah demi langkah.',
    zoomIn: 'Perbesar',
    zoomOut: 'Perkecil',
    resetZoom: 'Pusatkan Tampilan',
    fitToView: 'Sesuaikan Layar',
    nodeLegend: 'Status Visual Simpul',
    legendBalanced: 'Seimbang (|BF| <= 1)',
    legendActive: 'Simpul Aktif / Banding',
    legendImbalanced: 'Tidak Seimbang (|BF| > 1)',
    legendPivot: 'Poros Rotasi',
    legendNewLeaf: 'Daun Baru',

    // Inspector & Stats
    inspectorTitle: 'Analisis Langkah & Algoritma',
    stepTypeLabel: 'Aksi Algoritma',
    detailsLabel: 'Detail Langkah',
    mathCalculationLabel: 'Kalkulasi Matematis',
    treeStatsTitle: 'Metrik Invarian AVL',
    totalNodes: 'Total Simpul',
    treeHeight: 'Tinggi Pohon (h)',
    balanceStatus: 'Status Keseimbangan',
    statusBalanced: 'Seimbang Sempurna',
    statusImbalanced: 'Memerlukan Rotasi',
    inorderTitle: 'Penelusuran Inorder (BST Terurut)',
    rotationsLogTitle: 'Riwayat Rotasi Pohon',
    noRotationsYet: 'Belum ada rotasi yang terjadi pada urutan ini.',
    activeRotation: 'Rotasi Aktif:',
    imbalanceCase: 'Kasus Ketidakseimbangan',
    bfRange: 'Rentang BF',
    nodeValueLabel: 'Nilai',
    pivotLabel: 'Poros',

    // Rotation Theory Modal
    theoryTitle: 'Dasar Teori Pohon AVL & Mekanisme Rotasi',
    theorySubtitle: 'Konsep Matematis Struktur Data Self-Balancing Binary Search Tree',
    whatIsAVLTitle: 'Apa itu Pohon AVL?',
    whatIsAVLDesc:
      'Pohon AVL (dinamai dari penemunya G.M. Adelson-Velsky dan E.M. Landis pada 1962) adalah Binary Search Tree (BST) yang menyeimbangkan dirinya sendiri secara otomatis. Selisih tinggi antara sub-pohon kiri dan sub-pohon kanan (Faktor Keseimbangan) pada setiap simpul dijamin tidak pernah melebihi 1.',
    balanceFactorTitle: 'Rumus Faktor Keseimbangan (Balance Factor)',
    balanceFactorFormula: 'BF(simpul) = Tinggi(Sub-pohon Kiri) - Tinggi(Sub-pohon Kanan)',
    balanceFactorExplanation:
      'Tinggi sub-pohon kosong adalah 0. Simpul daun memiliki tinggi 1 dan BF = 0. Simpul dikatakan seimbang jika BF bernilai -1, 0, atau +1. Jika BF mencapai +2 (terlalu berat ke kiri) atau -2 (terlalu berat ke kanan), operasi rotasi segera dijalankan.',
    whyRotateTitle: 'Mengapa Rotasi Diperlukan?',
    whyRotateDesc:
      'Pada BST standar, data yang masuk secara terurut dapat mengubah pohon menjadi garis lurus (linked list) dengan kompleksitas pencarian O(N). Pohon AVL menjamin bentuk pohon tetap seimbang dan rimbun, memastikan waktu operasi selalu optimal O(log N).',
    fourCasesTitle: '4 Kasus Ketidakseimbangan dan Solusinya',
    caseLLTitle: '1. Kasus Left-Left (LL)',
    caseLLDesc:
      'Terjadi saat simpul memiliki BF = +2 dan anak kirinya memiliki BF >= 0. Solusi: 1x Rotasi Kanan (Right Rotation) pada simpul yang bersangkutan.',
    caseRRTitle: '2. Kasus Right-Right (RR)',
    caseRRDesc:
      'Terjadi saat simpul memiliki BF = -2 dan anak kanannya memiliki BF <= 0. Solusi: 1x Rotasi Kiri (Left Rotation) pada simpul yang bersangkutan.',
    caseLRTitle: '3. Kasus Left-Right (LR)',
    caseLRDesc:
      'Terjadi saat simpul memiliki BF = +2 namun anak kirinya memiliki BF = -1. Solusi: Rotasi Kiri pada anak kiri terlebih dahulu (menghasilkan bentuk LL), diikuti Rotasi Kanan pada simpul tersebut.',
    caseRLTitle: '4. Kasus Right-Left (RL)',
    caseRLDesc:
      'Terjadi saat simpul memiliki BF = -2 namun anak kanannya memiliki BF = +1. Solusi: Rotasi Kanan pada anak kanan terlebih dahulu (menghasilkan bentuk RR), diikuti Rotasi Kiri pada simpul tersebut.',
    complexityTitle: 'Kompleksitas Waktu & Ruang',
    complexityDesc:
      '• Pencarian (Search): O(log N)\n• Penyisipan (Insert): O(log N) — paling banyak membutuhkan 1 rotasi tunggal atau ganda.\n• Ruang Memori: O(N) untuk menyimpan N simpul beserta informasi tinggi.',
  },
  en: {
    appTitle: 'AVL Tree Visualizer',
    appSubtitle: 'Interactive Educational Workspace for Self-Balancing Data Structures',
    theoryGuideBtn: 'Rotation Theory Guide',
    closeBtn: 'Close',
    languageToggle: 'EN / ID',
    themeToggleLight: 'Switch to Light Mode',
    themeToggleDark: 'Switch to Dark Mode',
    themeLight: 'Light',
    themeDark: 'Dark',

    // Universal Input Modes
    modeDigitGrouping: 'Digit Grouping',
    modeCustomSequence: 'Custom Sequence',
    digitInputLabel: 'Continuous Numeric String',
    digitInputPlaceholder: 'Enter numeric string, e.g. 47239472342739472',
    groupSizeLabel: 'Group Size:',
    groupSizeUnit: 'digits per group',
    parsedGroupsTitle: 'Digit Partition & Integer Conversion:',
    rawDigitTag: 'Raw String',
    parsedValueTag: 'Integer Value',
    duplicateBadge: 'Duplicate',
    uniqueValuesCount: 'Unique Values',
    duplicatesSkippedCount: 'Duplicates Skipped',

    // Custom Sequence Mode
    customSequenceLabel: 'Integer Sequence (Positive, Negative, Zero)',
    customSequencePlaceholder: 'Enter numbers separated by comma/space, e.g. 30, -15, 20, 0, 45, 10',
    applySequenceBtn: 'Apply Sequence',
    loadAndPlayBtn: 'Load & Auto Play',
    loadOnlyBtn: 'Load Only',
    resetInputBtn: 'Reset Input',
    insertSingleValuePlaceholder: 'Add 1 value (e.g. 42)',
    insertSingleBtn: 'Insert',
    clearTreeBtn: 'Clear Tree',

    // Educational Presets
    presetsTitle: 'Educational Demonstration Presets:',
    presetLLDemo: 'LL Case (30, 20, 10)',
    presetRRDemo: 'RR Case (10, 20, 30)',
    presetLRDemo: 'LR Case (30, 10, 20)',
    presetRLDemo: 'RL Case (10, 30, 20)',
    presetBalanced7: 'Balanced 7-Node (40,20,60...)',
    presetRandom8: 'Random 8 Numbers',
    presetDigitSample: 'Sample Digit String (4723947234...)',

    // Validation & Errors
    inputErrorDigitsOnly: 'Input string must contain only digits 0-9 without spaces or other characters.',
    inputErrorLengthExceeded: 'Digit string is too long (maximum 50 digits to preserve smooth visualization).',
    inputErrorInvalidInteger: 'Found invalid integer format: ',
    inputErrorDuplicate: 'This value already exists in the AVL tree.',
    inputErrorMaxItemsExceeded: 'Number of elements exceeds limit (maximum 35 numbers).',
    onboardingTip: 'Select an input mode above or click any demonstration preset to view AVL self-balancing simulation.',

    // Controls & Timeline
    stepLabel: 'Step',
    stepOf: 'of',
    playbackSpeed: 'Speed',
    prevStep: 'Previous',
    nextStep: 'Next',
    play: 'Play Animation',
    pause: 'Pause',
    resetSim: 'Reset to Start',
    replayBtn: 'Replay',
    skipToEndBtn: 'Skip to End',
    jumpToStage: 'Jump to Insertion Stage:',
    stageTitle: 'Stage',
    completedAtStage: 'Insertion completed',

    // Tree Canvas
    canvasTitle: 'AVL Tree Structure Canvas',
    emptyTreeTitle: 'AVL Tree is Currently Empty',
    emptyTreeDesc: 'Enter numbers in the control panel above or choose an educational preset to begin step-by-step visualization.',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset View',
    fitToView: 'Fit to View',
    nodeLegend: 'Visual Node States',
    legendBalanced: 'Balanced (|BF| <= 1)',
    legendActive: 'Active / Comparing',
    legendImbalanced: 'Imbalanced (|BF| > 1)',
    legendPivot: 'Rotation Pivot',
    legendNewLeaf: 'New Leaf',

    // Inspector & Stats
    inspectorTitle: 'Step & Algorithm Analysis',
    stepTypeLabel: 'Algorithm Action',
    detailsLabel: 'Execution Details',
    mathCalculationLabel: 'Mathematical Calculation',
    treeStatsTitle: 'AVL Invariant Metrics',
    totalNodes: 'Total Nodes',
    treeHeight: 'Tree Height (h)',
    balanceStatus: 'Balance Status',
    statusBalanced: 'Perfectly Balanced',
    statusImbalanced: 'Rebalancing Required',
    inorderTitle: 'Inorder Traversal (Sorted BST)',
    rotationsLogTitle: 'Tree Rotation History',
    noRotationsYet: 'No rotations have occurred in this sequence yet.',
    activeRotation: 'Active Rotation:',
    imbalanceCase: 'Imbalance Case',
    bfRange: 'BF Range',
    nodeValueLabel: 'Value',
    pivotLabel: 'Pivot',

    // Rotation Theory Modal
    theoryTitle: 'AVL Tree Foundations & Rotation Mechanics',
    theorySubtitle: 'Mathematical Principles of Self-Balancing Binary Search Trees',
    whatIsAVLTitle: 'What is an AVL Tree?',
    whatIsAVLDesc:
      'An AVL tree (named after inventors G.M. Adelson-Velsky and E.M. Landis in 1962) is a self-balancing binary search tree. The difference between heights of left and right subtrees (Balance Factor) at any node is strictly guaranteed to never exceed 1.',
    balanceFactorTitle: 'Balance Factor Formula',
    balanceFactorFormula: 'BF(node) = Height(Left Subtree) - Height(Right Subtree)',
    balanceFactorExplanation:
      'The height of an empty subtree is defined as 0. Leaf nodes have height 1 and BF = 0. A node is balanced if BF is -1, 0, or +1. If BF becomes +2 (left-heavy) or -2 (right-heavy), rebalancing rotations are executed immediately.',
    whyRotateTitle: 'Why Are Rotations Necessary?',
    whyRotateDesc:
      'In an unbalanced BST, sequential insertions can degrade the tree into a linked list with O(N) depth. AVL trees preserve balance via local rotations, ensuring search, insertion, and deletion always run in guaranteed O(log N) time.',
    fourCasesTitle: 'The 4 Imbalance Cases and Solutions',
    caseLLTitle: '1. Left-Left (LL) Case',
    caseLLDesc:
      'Occurs when node has BF = +2 and its left child has BF >= 0. Solution: 1x Right Rotation at the imbalanced node.',
    caseRRTitle: '2. Right-Right (RR) Case',
    caseRRDesc:
      'Occurs when node has BF = -2 and its right child has BF <= 0. Solution: 1x Left Rotation at the imbalanced node.',
    caseLRTitle: '3. Left-Right (LR) Case',
    caseLRDesc:
      'Occurs when node has BF = +2 but its left child has BF = -1. Solution: Left Rotation at left child first (converts to LL), followed by Right Rotation at the imbalanced node.',
    caseRLTitle: '4. Right-Left (RL) Case',
    caseRLDesc:
      'Occurs when node has BF = -2 but its right child has BF = +1. Solution: Right Rotation at right child first (converts to RR), followed by Left Rotation at the imbalanced node.',
    complexityTitle: 'Time & Space Complexity',
    complexityDesc:
      '• Search: O(log N)\n• Insert: O(log N) — triggers at most 1 single or double rotation.\n• Space: O(N) auxiliary space to store N nodes and height attributes.',
  },
};
