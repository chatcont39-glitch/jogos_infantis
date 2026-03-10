import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

const NUMBER_EMOJIS = ['🐱', '🐶', '🐥', '🐠', '🐰', '🦁', '🐸', '🐼', '🦊'];

export default function NumberGame({ onScore }: { onScore: () => void }) {
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [emoji, setEmoji] = useState('');

  const generateRound = () => {
    const newCount = Math.floor(Math.random() * 9) + 1;
    const others = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .filter(n => n !== newCount)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    
    setCount(newCount);
    setOptions([newCount, ...others].sort(() => 0.5 - Math.random()));
    setEmoji(NUMBER_EMOJIS[Math.floor(Math.random() * NUMBER_EMOJIS.length)]);
    setFeedback(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleChoice = (num: number) => {
    if (num === count) {
      setFeedback('correct');
      onScore();
      setTimeout(generateRound, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8"
    >
      <h2 className="text-3xl font-bold text-green-600">Quantos animais você vê?</h2>
      
      <div className="relative min-h-[300px] flex items-center justify-center">
        <div className="grid grid-cols-3 gap-6 p-10 bg-white rounded-[40px] kid-shadow max-w-md border-8 border-green-100">
          {Array.from({ length: count }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: i * 0.05 
              }}
              className="text-6xl drop-shadow-sm select-none"
            >
              {emoji}
            </motion.span>
          ))}
        </div>

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

      <div className="flex gap-4">
        {options.map((opt) => (
          <motion.button
            key={opt}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleChoice(opt)}
            className="w-20 h-20 bg-green-400 text-white text-4xl font-black rounded-2xl kid-shadow kid-button-press"
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
