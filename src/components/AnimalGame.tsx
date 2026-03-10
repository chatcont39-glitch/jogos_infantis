import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Volume2 } from 'lucide-react';
import { playSound, speak } from '../utils/audio';
import { ANIMALS, ROUNDS_PER_GAME } from '../constants';

export default function AnimalGame({ difficulty, onScore, onComplete }: { difficulty: 'easy' | 'medium' | 'hard', onScore: () => void, onComplete: () => void }) {
  const [target, setTarget] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rounds, setRounds] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const generateRound = () => {
    if (rounds >= ROUNDS_PER_GAME) {
      onComplete();
      return;
    }
    const correct = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const optionsCount = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const others = ANIMALS
      .filter(a => a.name !== correct.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, optionsCount);
    
    setTarget(correct);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setFeedback(null);
    setSelectedId(null);
    setWrongId(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleChoice = (animal: typeof ANIMALS[0]) => {
    if (selectedId || feedback === 'correct') return; // Prevent multiple clicks

    const delay = difficulty === 'hard' ? 2500 : 2000;

    if (animal.name === target.name) {
      setSelectedId(animal.name);
      playSound('correct');
      setFeedback('correct');
      onScore();
      setRounds(r => r + 1);
      setTimeout(generateRound, delay);
    } else {
      playSound('wrong');
      setFeedback('wrong');
      setWrongId(animal.name);
      setTimeout(() => {
        setFeedback(null);
        setWrongId(null);
      }, 1500);
    }
  };

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(target.sound);
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
      className="flex flex-col items-center gap-8 w-full"
    >
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-purple-600">Onde está o {target.name}?</h2>
        <motion.div 
          key={target.name}
          variants={bounceVariants}
          initial="initial"
          animate="animate"
          className="flex justify-center"
        >
           <button 
             onClick={handlePlaySound}
             className="bg-purple-100 p-3 rounded-full hover:bg-purple-200 transition-colors kid-shadow kid-button-press"
           >
             <Volume2 className="w-10 h-10 text-purple-600 animate-pulse" />
           </button>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-2xl relative">
        {options.map((animal) => {
          const isCorrect = animal.name === target.name;
          const isSelected = animal.name === selectedId;
          const isWrong = animal.name === wrongId;
          const showHighlight = selectedId !== null || isWrong;

          return (
            <motion.button
              key={animal.name}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              variants={shakeVariants}
              animate={isWrong ? "shake" : (showHighlight && isCorrect ? {
                scale: [1, 1.1, 1],
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)"
              } : {})}
              transition={showHighlight && isCorrect ? { repeat: Infinity, duration: 1 } : {}}
              onClick={() => handleChoice(animal)}
              className={`${animal.color} aspect-square rounded-[40px] kid-shadow kid-button-press flex flex-col items-center justify-center border-8 ${
                showHighlight && isCorrect ? 'border-green-400' : 
                isWrong ? 'border-red-400' : 'border-white'
              }`}
            >
              <span className="text-8xl drop-shadow-sm">{animal.emoji}</span>
            </motion.button>
          );
        })}


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
                <Check className="w-48 h-48 text-white" />
              ) : (
                <X className="w-48 h-48 text-white" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
