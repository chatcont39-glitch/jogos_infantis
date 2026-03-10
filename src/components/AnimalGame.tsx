import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Volume2 } from 'lucide-react';

const ANIMALS = [
  { name: 'Leão', emoji: '🦁', color: 'bg-orange-100' },
  { name: 'Elefante', emoji: '🐘', color: 'bg-blue-100' },
  { name: 'Macaco', emoji: '🐒', color: 'bg-amber-100' },
  { name: 'Girafa', emoji: '🦒', color: 'bg-yellow-100' },
  { name: 'Zebra', emoji: '🦓', color: 'bg-stone-100' },
  { name: 'Panda', emoji: '🐼', color: 'bg-slate-100' },
  { name: 'Tigre', emoji: '🐯', color: 'bg-orange-200' },
  { name: 'Coelho', emoji: '🐰', color: 'bg-pink-100' },
  { name: 'Porco', emoji: '🐷', color: 'bg-pink-200' },
  { name: 'Pinto', emoji: '🐥', color: 'bg-yellow-200' },
  { name: 'Vaca', emoji: '🐮', color: 'bg-red-50' },
  { name: 'Sapo', emoji: '🐸', color: 'bg-green-100' },
];

export default function AnimalGame({ onScore }: { onScore: () => void }) {
  const [target, setTarget] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateRound = () => {
    const correct = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const others = ANIMALS
      .filter(a => a.name !== correct.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setTarget(correct);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setFeedback(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleChoice = (animal: typeof ANIMALS[0]) => {
    if (animal.name === target.name) {
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
      className="flex flex-col items-center gap-8 w-full"
    >
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-purple-600">Onde está o {target.name}?</h2>
        <div className="flex justify-center">
           <Volume2 className="w-10 h-10 text-purple-400 animate-pulse cursor-pointer" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl relative">
        {options.map((animal) => (
          <motion.button
            key={animal.name}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice(animal)}
            className={`${animal.color} aspect-square rounded-[40px] kid-shadow kid-button-press flex flex-col items-center justify-center border-8 border-white`}
          >
            <span className="text-8xl drop-shadow-sm">{animal.emoji}</span>
          </motion.button>
        ))}

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
