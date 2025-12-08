import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Puzzle, RotateCcw, Trophy, Clock, Move } from "lucide-react";
import { Button } from "../../ui/button";
import { useLanguage } from "@/contexts/useLanguage";

export interface PuzzleSolverProps {
  difficulty?: "easy" | "medium";
  imageUrl?: string;
  pointsReward?: number;
  onComplete?: (moves: number, time: number) => void;
}

const content = {
  en: {
    title: "Solve the Puzzle",
    difficulty: {
      easy: "Easy",
      medium: "Medium",
    },
    moves: "Moves",
    time: "Time",
    reset: "Reset",
    completed: "Puzzle Completed!",
    congratulations: "Congratulations!",
    pointsEarned: "Points Earned",
    solving: "Solving...",
  },
  ar: {
    title: "حل اللغز",
    difficulty: {
      easy: "سهل",
      medium: "متوسط",
    },
    moves: "الحركات",
    time: "الوقت",
    reset: "إعادة تعيين",
    completed: "تم حل اللغز!",
    congratulations: "تهانينا!",
    pointsEarned: "النقاط المكتسبة",
    solving: "جاري الحل...",
  },
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Check if puzzle is solvable (count inversions)
function isSolvable(grid: number[], size: number): boolean {
  const flatGrid = grid.filter((val) => val !== 0);
  let inversions = 0;

  for (let i = 0; i < flatGrid.length; i++) {
    for (let j = i + 1; j < flatGrid.length; j++) {
      if (flatGrid[i] > flatGrid[j]) {
        inversions++;
      }
    }
  }

  // For even-sized puzzles, also check the row of the blank from bottom
  if (size % 2 === 0) {
    const blankIndex = grid.indexOf(0);
    const blankRow = Math.floor(blankIndex / size);
    const blankRowFromBottom = size - blankRow;
    return (inversions + blankRowFromBottom) % 2 === 0;
  }

  // For odd-sized puzzles, inversions must be even
  return inversions % 2 === 0;
}

// Generate solvable puzzle
function generatePuzzle(size: number): number[] {
  const totalTiles = size * size;
  let grid: number[];

  do {
    const numbers = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    const shuffled = shuffleArray(numbers);
    grid = [...shuffled, 0]; // 0 represents empty tile
  } while (!isSolvable(grid, size));

  return grid;
}

// Get initial solved state
function getSolvedState(size: number): number[] {
  const totalTiles = size * size;
  return Array.from({ length: totalTiles - 1 }, (_, i) => i + 1).concat(0);
}

// Check if puzzle is solved
function isSolved(grid: number[], size: number): boolean {
  const solved = getSolvedState(size);
  return JSON.stringify(grid) === JSON.stringify(solved);
}

// Get valid moves (adjacent tiles to empty space)
function getValidMoves(grid: number[], size: number): number[] {
  const emptyIndex = grid.indexOf(0);
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;
  const validMoves: number[] = [];

  // Check all four directions
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  directions.forEach((dir) => {
    const newRow = emptyRow + dir.row;
    const newCol = emptyCol + dir.col;

    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      const newIndex = newRow * size + newCol;
      validMoves.push(newIndex);
    }
  });

  return validMoves;
}

export function PuzzleSolver({
  difficulty = "easy",
  imageUrl,
  pointsReward = 50,
  onComplete,
}: PuzzleSolverProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const size = difficulty === "easy" ? 3 : 4;
  const totalTiles = size * size;

  const [grid, setGrid] = useState<number[]>(() => generatePuzzle(size));
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && !isCompleted) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, isCompleted]);

  // Check for completion
  useEffect(() => {
    if (isSolved(grid, size) && !isCompleted) {
      setIsCompleted(true);
      setIsTimerRunning(false);
      if (onComplete) {
        onComplete(moves, time);
      }
    }
  }, [grid, size, isCompleted, moves, time, onComplete]);

  // Handle tile click
  const handleTileClick = useCallback(
    (index: number) => {
      if (isCompleted) return;

      const validMoves = getValidMoves(grid, size);
      if (!validMoves.includes(index)) return;

      const newGrid = [...grid];
      const emptyIndex = grid.indexOf(0);

      // Swap tile with empty space
      [newGrid[emptyIndex], newGrid[index]] = [
        newGrid[index],
        newGrid[emptyIndex],
      ];

      setGrid(newGrid);
      setMoves((prev) => prev + 1);
    },
    [grid, size, isCompleted]
  );

  // Reset puzzle
  const handleReset = useCallback(() => {
    setGrid(generatePuzzle(size));
    setMoves(0);
    setTime(0);
    setIsCompleted(false);
    setIsTimerRunning(true);
  }, [size]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get tile position for image background
  const getTileBackground = (value: number): string => {
    if (value === 0) return "transparent";
    if (imageUrl) {
      const row = Math.floor((value - 1) / size);
      const col = (value - 1) % size;
      const xPercent = (col / (size - 1)) * 100;
      const yPercent = (row / (size - 1)) * 100;
      return `url(${imageUrl}) ${xPercent}% ${yPercent}% / ${size * 100}% ${size * 100}% no-repeat`;
    }
    // Default gradient backgrounds
    const gradients = [
      "linear-gradient(135deg, #d4af37 0%, #fbbf24 100%)",
      "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      "linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)",
    ];
    return gradients[value % gradients.length];
  };

  const validMoves = getValidMoves(grid, size);

  return (
    <div className="w-full relative">
      {/* Header Stats */}
      <div
        className={`flex items-center justify-between mb-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex items-center gap-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Move className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm text-[#cbd5e1]">
              {t.moves}: <span className="text-[#fef3c7] font-semibold">{moves}</span>
            </span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Clock className="w-4 h-4 text-[#14b8a6]" />
            <span className="text-sm text-[#cbd5e1]">
              {t.time}: <span className="text-[#fef3c7] font-semibold">{formatTime(time)}</span>
            </span>
          </div>
        </div>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="border-[#334155] text-[#cbd5e1] hover:bg-[#1e293b] hover:text-[#fef3c7] hover:border-[#d4af37]/30 transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t.reset}
        </Button>
      </div>

      {/* Puzzle Grid */}
      <div
        className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-[#334155] bg-[#0f172a] mb-4"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gap: "2px",
          padding: "2px",
        }}
      >
        <AnimatePresence>
          {grid.map((value, index) => {
            const isValidMove = validMoves.includes(index);
            const isEmpty = value === 0;

            return (
              <motion.button
                key={`${value}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={!isEmpty && isValidMove ? { scale: 1.05 } : {}}
                whileTap={!isEmpty && isValidMove ? { scale: 0.95 } : {}}
                onClick={() => handleTileClick(index)}
                disabled={isEmpty || !isValidMove || isCompleted}
                className={`
                  relative rounded-lg overflow-hidden
                  ${isEmpty ? "bg-transparent" : "bg-gradient-to-br"}
                  ${isValidMove && !isEmpty ? "cursor-pointer hover:ring-2 hover:ring-[#d4af37]/50" : "cursor-not-allowed opacity-60"}
                  ${isCompleted ? "opacity-100" : ""}
                  transition-all duration-200
                  border border-[#334155]/50
                `}
                style={{
                  background: getTileBackground(value),
                  backgroundSize: imageUrl ? `${size * 100}%` : "cover",
                  backgroundPosition: imageUrl
                    ? `${((value - 1) % size) * (100 / (size - 1))}% ${Math.floor((value - 1) / size) * (100 / (size - 1))}%`
                    : "center",
                }}
              >
                {!isEmpty && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!imageUrl && (
                      <span className="text-2xl font-bold text-white drop-shadow-lg">
                        {value}
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="glass rounded-2xl p-8 text-center max-w-md mx-4 border-2 border-[#d4af37]/50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#fbbf24] rounded-full flex items-center justify-center"
              >
                <Trophy className="w-10 h-10 text-[#0f172a]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#fef3c7] mb-2">
                {t.congratulations}
              </h3>
              <p className="text-[#cbd5e1] mb-4">{t.completed}</p>
              <div className="space-y-2 mb-6">
                <div
                  className={`flex items-center justify-between p-3 bg-[#1e293b]/50 rounded-lg ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-sm text-[#cbd5e1]">{t.moves}</span>
                  <span className="text-lg font-semibold text-[#d4af37]">{moves}</span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 bg-[#1e293b]/50 rounded-lg ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-sm text-[#cbd5e1]">{t.time}</span>
                  <span className="text-lg font-semibold text-[#14b8a6]">
                    {formatTime(time)}
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 bg-gradient-to-r from-[#d4af37]/20 to-[#14b8a6]/20 rounded-lg border border-[#d4af37]/30 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-sm text-[#cbd5e1]">{t.pointsEarned}</span>
                  <span className="text-xl font-bold text-[#d4af37]">+{pointsReward}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

