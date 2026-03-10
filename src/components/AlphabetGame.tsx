import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

const ALPHABET_DATA = [
  { letter: 'A', animal: 'Abelha', emoji: '🐝', color: 'bg-yellow-100' },
  { letter: 'B', animal: 'Baleia', emoji: '🐋', color: 'bg-blue-100' },
  { letter: 'C', animal: 'Cachorro', emoji: '🐶', color: 'bg-orange-100' },
  { letter: 'D', animal: 'Dinossauro', emoji: '🦖', color: 'bg-green-100' },
  { letter: 'E', animal: 'Elefante', emoji: '🐘', color: 'bg-indigo-100' },
  { letter: 'F', animal: 'Foca', emoji: '🦭', color: 'bg-cyan-100' },
  { letter: 'G', animal: 'Gato', emoji: '🐱', color: 'bg-amber-100' },
  { letter: 'H', animal: 'Hipopótamo', emoji: '🦛', color: 'bg-slate-100' },
  { letter: 'I', animal: 'Iguana', emoji: '🦎', color: 'bg-emerald-100' },
  { letter: 'J', animal: 'Jacaré', emoji: '🐊', color: 'bg-green-200' },
  { letter: 'L', animal: 'Leão', emoji: '🦁', color: 'bg-orange-200' },
  { letter: 'M', animal: 'Macaco', emoji: '🐒', color: 'bg-amber-200' },
  { letter: 'N', animal: 'Naja', emoji: '🐍', color: 'bg-lime-100' },
  { letter: 'O', animal: 'Ovelha', emoji: '🐑', color: 'bg-stone-100' },
  { letter: 'P', animal: 'Pato', emoji: '🦆', color: 'bg-yellow-200' },
  { letter: 'Q', animal: 'Quati', emoji: '🦝', color: 'bg-gray-200' },
  { letter: 'R', animal: 'Rato', emoji: '🐭', color: 'bg-zinc-100' },
  { letter: 'S', animal: 'Sapo', emoji: '🐸', color: 'bg-green-300' },
  { letter: 'T', animal: 'Tigre', emoji: '🐯', color: 'bg-orange-300' },
  { letter: 'U', animal: 'Urso', emoji: '🐻', color: 'bg-stone-200' },
  { letter: 'V', animal: 'Vaca', emoji: '🐮', color: 'bg-red-50' },
  { letter: 'Z', animal: 'Zebra', emoji: '🦓', color: 'bg-slate-200' },
];

export default function AlphabetGame({ onScore }: { onScore: () => void }) {
  const [current, setCurrent] = useState(ALPHABET_DATA[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateRound = () => {
    const correct = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    const others = ALPHABET_DATA
      .filter(a => a.letter !== correct.letter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(a => a.letter);
    
    setCurrent(correct);
    setOptions([correct.letter, ...others].sort(() => 0.5 - Math.random()));
    setFeedback(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleChoice = (letter: string) => {
    if (letter === current.letter) {
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
      <h2 className="text-3xl font-bold text-blue-600">Qual é a letra inicial?</h2>
      
      <div className="relative">
        <motion.div
          key={current.animal}
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          className={`w-64 h-64 ${current.color} rounded-[40px] p-4 kid-shadow flex flex-col items-center justify-center gap-2 border-8 border-white`}
        >
          <span className="text-9xl drop-shadow-md">{current.emoji}</span>
          <span className="text-3xl font-black text-stone-700 uppercase tracking-tighter">{current.animal}</span>
        </motion.div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`absolute inset-0 flex items-center justify-center rounded-[40px] ${
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
            className="w-20 h-20 bg-blue-400 text-white text-4xl font-black rounded-2xl kid-shadow kid-button-press"
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
