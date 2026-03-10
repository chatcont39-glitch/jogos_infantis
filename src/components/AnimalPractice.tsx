import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ANIMALS } from '../constants';
import { speak } from '../utils/audio';

export default function AnimalPractice() {
  const [index, setIndex] = useState(0);
  const current = ANIMALS[index];

  const next = () => setIndex((i) => (i + 1) % ANIMALS.length);
  const prev = () => setIndex((i) => (i - 1 + ANIMALS.length) % ANIMALS.length);

  const handlePlaySound = () => {
    speak(current.sound);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8 w-full max-w-lg"
    >
      <h2 className="text-4xl font-black text-orange-500">Prática de Animais</h2>
      
      <div className="flex items-center gap-4 w-full">
        <button 
          onClick={prev}
          className="bg-white p-4 rounded-full kid-shadow kid-button-press"
        >
          <ChevronLeft className="w-8 h-8 text-stone-600" />
        </button>

        <motion.div
          key={current.name}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`${current.color} flex-1 aspect-square rounded-[60px] kid-shadow flex flex-col items-center justify-center gap-4 border-8 border-white p-8`}
        >
          <span className="text-[10rem] drop-shadow-md">{current.emoji}</span>
          <h3 className="text-4xl font-black text-stone-700 uppercase">{current.name}</h3>
        </motion.div>

        <button 
          onClick={next}
          className="bg-white p-4 rounded-full kid-shadow kid-button-press"
        >
          <ChevronRight className="w-8 h-8 text-stone-600" />
        </button>
      </div>

      <button 
        onClick={handlePlaySound}
        className="bg-orange-400 text-white px-8 py-6 rounded-[30px] kid-shadow kid-button-press flex items-center gap-4 hover:bg-orange-500 transition-colors"
      >
        <Volume2 className="w-10 h-10" />
        <span className="text-2xl font-bold">Ouvir o Som</span>
      </button>

      <p className="text-xl text-stone-500 font-medium text-center italic">
        "{current.sound}"
      </p>
    </motion.div>
  );
}
