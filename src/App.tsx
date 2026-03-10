import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home as HomeIcon, BookOpen, Hash, Dog, Star, Trophy, ArrowLeft } from 'lucide-react';

// Game Types
type GameMode = 'home' | 'alphabet' | 'numbers' | 'animals';

// Components
import AlphabetGame from './components/AlphabetGame';
import NumberGame from './components/NumberGame';
import AnimalGame from './components/AnimalGame';

export default function App() {
  const [mode, setMode] = useState<GameMode>('home');
  const [score, setScore] = useState(0);

  const handleBack = () => setMode('home');

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute top-[20%] right-[5%] w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-40 -z-10" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        {mode !== 'home' && (
          <button 
            onClick={handleBack}
            className="bg-white p-3 rounded-2xl kid-shadow kid-button-press hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-stone-600" />
          </button>
        )}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl kid-shadow">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-bold text-stone-700">{score}</span>
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {mode === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-6xl md:text-8xl font-black text-orange-500 drop-shadow-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Aventura dos Pequenos
                </motion.h1>
                <p className="text-xl text-stone-500 font-medium">Escolha um desafio para começar!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MenuButton 
                  icon={<BookOpen className="w-12 h-12" />}
                  label="Alfabeto"
                  color="bg-blue-400"
                  onClick={() => setMode('alphabet')}
                />
                <MenuButton 
                  icon={<Hash className="w-12 h-12" />}
                  label="Números"
                  color="bg-green-400"
                  onClick={() => setMode('numbers')}
                />
                <MenuButton 
                  icon={<Dog className="w-12 h-12" />}
                  label="Animais"
                  color="bg-purple-400"
                  onClick={() => setMode('animals')}
                />
              </div>
            </motion.div>
          )}

          {mode === 'alphabet' && (
            <AlphabetGame onScore={() => setScore(s => s + 10)} />
          )}
          {mode === 'numbers' && (
            <NumberGame onScore={() => setScore(s => s + 10)} />
          )}
          {mode === 'animals' && (
            <AnimalGame onScore={() => setScore(s => s + 10)} />
          )}
        </AnimatePresence>
      </main>

      {/* Floating Stars */}
      <div className="fixed bottom-10 left-10 animate-bounce">
        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 opacity-50" />
      </div>
      <div className="fixed top-20 right-20 animate-pulse">
        <Star className="w-6 h-6 text-blue-400 fill-blue-400 opacity-50" />
      </div>
    </div>
  );
}

function MenuButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} p-8 rounded-[40px] text-white flex flex-col items-center gap-4 kid-shadow kid-button-press min-w-[200px]`}
    >
      <div className="bg-white/20 p-6 rounded-full">
        {icon}
      </div>
      <span className="text-2xl font-bold uppercase tracking-wider">{label}</span>
    </motion.button>
  );
}
