# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + Tailwind CSS

## Users

Primary: Computer Science students and self-learners studying data structures and algorithms.
Situation: Studying self-balancing binary search trees for coursework, technical interviews, or conceptual mastery.
Job: Understand AVL tree balancing mechanics, balance factor calculation (-1, 0, 1), and tree rotations (LL, RR, LR, RL) through clear step-by-step visual demonstration.

## Product Purpose

Interactive, step-by-step AVL tree visualizer that clarifies self-balancing operations.
Success means a student can insert or delete a value, see the exact moment imbalance occurs, watch the rotation execute with clear spatial transition, and understand *why* the tree rebalances.

## Positioning

Unlike static diagrams or instant black-box visualizers that jump directly to the final state, this tool breaks down the rebalancing pipeline into pedagogical stages: calculation of heights/balance factors, detection of violation, identification of rotation case, and animated node realignment.

## Operating Context

Browser-based interactive canvas/SVG with control panel for tree operations.
Used on laptops/desktops during study sessions or lectures.
Input: Numerical node insertion, deletion, search, bulk load, and random generation.
Playback: Step forward/backward, play/pause, and animation speed slider.

## Capabilities and Constraints

- Capabilities:
  - AVL tree node insertion, deletion, and lookup.
  - Calculation and visual display of node height and balance factor.
  - Step-by-step animation of rotations: Left (LL), Right (RR), Left-Right (LR), Right-Left (RL).
  - Playback controls: play/pause, step forward/backward, reset, speed adjustment.
  - Custom value input, random value generator, and pre-built demonstration scenarios (e.g., triggering each rotation type).
- Constraints:
  - Frontend-only, client-side execution (no backend required).
  - Responsive tree layout that handles typical educational tree depths (e.g., 10-30 nodes) without visual overlap.

## Evidence on Hand

- Standard AVL tree balancing specification (Adelson-Velsky and Landis, 1962).
- Greenfield repo: no existing assets, code, or testimonials.

## Product Principles

1. Pedagogical Clarity Over Instant Results: Reveal intermediate states, balance factor shifts, and rotation pivots before finalizing layout.
2. Spatial Continuity: Nodes move smoothly to their new positions during rotations so users can track subtree transfers.
3. Zero Friction Exploration: Immediate interactive feedback with single-click sample trees to test all rotation cases without manual data entry.
4. Transparent State: Always show current node heights, balance factors, and active rotation classification.

## Accessibility & Inclusion

- Keyboard-navigable controls for playback and tree inputs.
- High-contrast visual cues for balance factors (distinct styling for balanced vs imbalanced nodes).
- Reduced-motion consideration with option to toggle instant transitions or adjust speed.
