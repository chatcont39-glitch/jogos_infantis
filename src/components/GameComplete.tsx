import React from 'react';
import { motion } from 'motion/react';
import { PartyPopper, Trophy, Home, Star } from 'lucide-react';

const Confetti = () => {
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-pink-400', 'bg-purple-400'];
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const isStar = Math.random() > 0.7;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            initial={{ 
              top: -50, 
              left: `${Math.random() * 100}%`,
              rotate: 0,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 1
            }}
            animate={{ 
              top: '110%',
              rotate: 720 * (Math.random() > 0.5 ? 1 : -1),
              left: `${(Math.random() * 100) + (Math.random() * 10 - 5)}%`,
              opacity: [1, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className={`absolute ${isStar ? '' : `w-3 h-3 rounded-full ${color}`}`}
          >
            {isStar && <Star className={`w-6 h-6 fill-current ${color.replace('bg-', 'text-')}`} />}
          </motion.div>
        );
      })}
    </div>
  );
};

export default function GameComplete({ onHome }: { onHome: () => void }) {
  return (
    <>
      <Confetti />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[60px] p-12 kid-shadow text-center space-y-8 max-w-md w-full border-8 border-yellow-100 relative z-10"
      >
      <div className="flex justify-center gap-4">
        <motion.div
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <PartyPopper className="w-16 h-16 text-pink-500" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Trophy className="w-20 h-20 text-yellow-500" />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <PartyPopper className="w-16 h-16 text-blue-500" />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-5xl font-black text-orange-500">Parabéns!</h2>
        <p className="text-2xl text-stone-600 font-bold">Você completou todos os desafios!</p>
        <p className="text-lg text-stone-400">Você é incrível!</p>
      </div>

      <button 
        onClick={onHome}
        className="w-full bg-green-400 text-white py-6 rounded-[30px] text-2xl font-black kid-shadow kid-button-press flex items-center justify-center gap-4"
      >
        <Home className="w-8 h-8" />
        VOLTAR PARA O INÍCIO
      </button>
    </motion.div>
    </>
  );
}
