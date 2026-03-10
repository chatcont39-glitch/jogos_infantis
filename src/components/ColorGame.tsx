import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { COLORS_DATA, ROUNDS_PER_GAME } from '../constants';
import { playSound } from '../utils/audio';

export default function ColorGame({ difficulty, onScore, onComplete }: { difficulty: 'easy' | 'medium' | 'hard', onScore: () => void, onComplete: () => void }) {
  const [current, setCurrent] = useState(COLORS_DATA[0]);
  const [options, setOptions] = useState<typeof COLORS_DATA>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [rounds, setRounds] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const generateRound = () => {
    if (rounds >= ROUNDS_PER_GAME) {
      onComplete();
      return;
    }
    const correct = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    const optionsCount = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const others = COLORS_DATA
      .filter(c => c.name !== correct.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, optionsCount);
    
    setCurrent(correct);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setFeedback(null);
    setWrongId(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleChoice = (colorName: string) => {
    if (feedback === 'correct') return;

    const delay = difficulty === 'hard' ? 2000 : 1500;

    if (colorName === current.name) {
      playSound('correct');
      setFeedback('correct');
      onScore();
      setRounds(r => r + 1);
      setTimeout(generateRound, delay);
    } else {
      playSound('wrong');
      setFeedback('wrong');
      setWrongId(colorName);
      setTimeout(() => {
        setFeedback(null);
        setWrongId(null);
      }, 1000);
    }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  const bounceVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8"
    >
      <h2 className="text-3xl font-bold text-pink-600">Qual é a cor da {current.object}?</h2>
      
      <div className="relative">
        <motion.div
          key={current.name}
          variants={bounceVariants}
          initial="initial"
          animate="animate"
          className="w-64 h-64 bg-white rounded-[40px] p-4 kid-shadow flex flex-col items-center justify-center gap-2 border-8 border-pink-100"
        >
          <span className="text-9xl drop-shadow-md">{current.emoji}</span>
          <span className="text-3xl font-black text-stone-700 uppercase tracking-tighter">{current.object}</span>
        </motion.div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`absolute inset-0 flex items-center justify-center rounded-[40px] z-10 ${
                feedback === 'correct' ? 'bg-green-500/80' : 'bg-red-500/80'
              }`}
            >
              {feedback === 'correct' ? (
                <Check className="w-32 h-32 text-white" />
              ) : (
                <X className="w-32 h-32 text-white" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {options.map((opt) => (
          <motion.button
            key={opt.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            variants={shakeVariants}
            animate={wrongId === opt.name ? "shake" : ""}
            onClick={() => handleChoice(opt.name)}
            className={`w-24 h-24 rounded-3xl kid-shadow kid-button-press border-4 border-white flex flex-col items-center justify-center gap-1 ${opt.color}`}
          >
            <span className="text-white font-black text-sm uppercase">{opt.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
