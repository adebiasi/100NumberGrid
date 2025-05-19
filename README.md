# 100NumberGrid

This project is an interactive visualizer for exploring movement strategies on a grid, inspired by knight-like moves in chess. It implements various algorithms that attempt to cover the entire grid using predefined valid moves.

## 🔍 Overview

The application simulates movement on a 2D grid using L-shaped or diagonal-like moves. The goal is to fill the entire grid by numbering each cell in the order the moves are made.

## 📦 Features

- **Dynamic grid visualization**
- **Implemented algorithms:**
  - Brute Force
  - Greedy
  - Mixed Greedy-Heuristic
- **Manual selection of the starting cell**
- **Controls for grid size and animation delay**
- **UI control buttons:**
  - Run algorithm (`#run`)
  - Run greedy (`#run_greedy`)
  - Run mixed (`#run_greedy2`)
  - Reset grid (`#reset`)

## ⚙️ Algorithms

- **Brute Force:** recursively explores all valid moves to find the best solution.
- **Greedy:** always picks the move with the fewest future options (Warnsdorff's heuristic).
- **Mixed:** combines brute-force recursion and greedy heuristics to choose moves that minimize future dead-ends.

## 🧠 Move Set

The possible moves include vertical, horizontal, and diagonal-like jumps (e.g., ±3 steps straight or ±2 diagonally).

```js
possibleMoves = [
  [3, 0], [0, 3], [-3, 0], [0, -3],
  [2, 2], [-2, -2], [2, -2], [-2, 2]
];
```

## ▶️ How to Use

1. Clone or download the repository.
2. Open the `index.html` file in your browser.
3. Use the buttons to:
   - Select and run an algorithm
   - Execute a traversal
   - Reset the grid
4. You can also click on a cell to set the initial position manually.

## 🔧 Code Structure

- `setup()`: initializes the canvas, controls, and grid.
- `draw()`: renders the grid and current state.
- `reset()`: resets everything to default state.
- `bruteForce()`, `greedy()`, `mixed()`: pathfinding algorithms.
- `displayGrid()`: draws the grid and numbers.
- `mouseClicked()`: allows manual user interaction.
