import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home as HomeIcon, BookOpen, Hash, Dog, Star, Trophy, ArrowLeft, Headphones, Settings, Palette } from 'lucide-react';

// Game Types
type GameMode = 'home' | 'alphabet' | 'numbers' | 'animals' | 'colors' | 'practice' | 'complete';
type Difficulty = 'easy' | 'medium' | 'hard';

// Components
import AlphabetGame from './components/AlphabetGame';
import NumberGame from './components/NumberGame';
import AnimalGame from './components/AnimalGame';
import ColorGame from './components/ColorGame';
import AnimalPractice from './components/AnimalPractice';
import GameComplete from './components/GameComplete';

export default function App() {
  const [mode, setMode] = useState<GameMode>('home');
  const [score, setScore] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [completedGames, setCompletedGames] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('aventura_progresso');
    const savedDiff = localStorage.getItem('aventura_difficulty');
    
    if (saved) {
      const completed = JSON.parse(saved);
      setCompletedGames(completed);
      
      // Auto-direct logic
      if (!isInitialized) {
        if (!completed.includes('alphabet')) setMode('alphabet');
        else if (!completed.includes('numbers')) setMode('numbers');
        else if (!completed.includes('animals')) setMode('animals');
        else if (!completed.includes('colors')) setMode('colors');
        else setMode('complete');
        setIsInitialized(true);
      }
    } else {
      setIsInitialized(true);
    }

    if (savedDiff) {
      setDifficulty(savedDiff as Difficulty);
    }
  }, []);

  const handleBack = () => {
    if (mode !== 'home' && mode !== 'complete') {
      setShowConfirm(true);
    } else {
      setMode('home');
    }
  };

  const confirmBack = () => {
    setMode('home');
    setShowConfirm(false);
  };

  const handleComplete = (gameId: string) => {
    const newCompleted = [...new Set([...completedGames, gameId])];
    setCompletedGames(newCompleted);
    localStorage.setItem('aventura_progresso', JSON.stringify(newCompleted));
    setMode('complete');
  };

  const changeDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    localStorage.setItem('aventura_difficulty', diff);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 1.1 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-stone-50">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute top-[20%] right-[5%] w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-40 -z-10" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex gap-2">
          {mode !== 'home' && (
            <button 
              onClick={handleBack}
              className="bg-white p-3 rounded-2xl kid-shadow kid-button-press hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-stone-600" />
            </button>
          )}
          {mode === 'home' && (
            <div className="flex bg-white p-1 rounded-2xl kid-shadow">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => changeDifficulty(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    difficulty === d 
                      ? 'bg-orange-400 text-white' 
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Médio' : 'Difícil'}
                </button>
              ))}
            </div>
          )}
        </div>
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
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MenuButton 
                  icon={<BookOpen className="w-10 h-10" />}
                  label="Alfabeto"
                  color="bg-blue-400"
                  completed={completedGames.includes('alphabet')}
                  onClick={() => setMode('alphabet')}
                />
                <MenuButton 
                  icon={<Hash className="w-10 h-10" />}
                  label="Números"
                  color="bg-green-400"
                  completed={completedGames.includes('numbers')}
                  onClick={() => setMode('numbers')}
                />
                <MenuButton 
                  icon={<Dog className="w-10 h-10" />}
                  label="Animais"
                  color="bg-purple-400"
                  completed={completedGames.includes('animals')}
                  onClick={() => setMode('animals')}
                />
                <MenuButton 
                  icon={<Palette className="w-10 h-10" />}
                  label="Cores"
                  color="bg-pink-400"
                  completed={completedGames.includes('colors')}
                  onClick={() => setMode('colors')}
                />
                <MenuButton 
                  icon={<Headphones className="w-10 h-10" />}
                  label="Prática"
                  color="bg-orange-400"
                  onClick={() => setMode('practice')}
                />
              </div>
            </motion.div>
          )}

          {mode === 'alphabet' && (
            <motion.div key="alphabet" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <AlphabetGame 
                difficulty={difficulty}
                onScore={() => setScore(s => s + 10)} 
                onComplete={() => handleComplete('alphabet')} 
              />
            </motion.div>
          )}
          {mode === 'numbers' && (
            <motion.div key="numbers" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <NumberGame 
                difficulty={difficulty}
                onScore={() => setScore(s => s + 10)} 
                onComplete={() => handleComplete('numbers')} 
              />
            </motion.div>
          )}
          {mode === 'animals' && (
            <motion.div key="animals" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <AnimalGame 
                difficulty={difficulty}
                onScore={() => setScore(s => s + 10)} 
                onComplete={() => handleComplete('animals')} 
              />
            </motion.div>
          )}
          {mode === 'colors' && (
            <motion.div key="colors" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <ColorGame 
                difficulty={difficulty}
                onScore={() => setScore(s => s + 10)} 
                onComplete={() => handleComplete('colors')} 
              />
            </motion.div>
          )}
          {mode === 'practice' && (
            <motion.div key="practice" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <AnimalPractice />
            </motion.div>
          )}
          {mode === 'complete' && (
            <motion.div key="complete" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <GameComplete onHome={() => setMode('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 max-w-sm w-full relative z-10 kid-shadow text-center space-y-6"
            >
              <h3 className="text-3xl font-black text-stone-700">Sair do jogo?</h3>
              <p className="text-lg text-stone-500 font-medium">Você quer mesmo parar de brincar agora?</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmBack}
                  className="bg-red-400 text-white py-4 rounded-2xl font-bold text-xl kid-shadow kid-button-press"
                >
                  Sim, quero sair
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="bg-stone-100 text-stone-600 py-4 rounded-2xl font-bold text-xl kid-shadow kid-button-press"
                >
                  Não, continuar!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

function MenuButton({ icon, label, color, completed, onClick }: { icon: React.ReactNode, label: string, color: string, completed?: boolean, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} p-8 rounded-[40px] text-white flex flex-col items-center gap-4 kid-shadow kid-button-press min-w-[200px] relative overflow-hidden`}
    >
      {completed && (
        <div className="absolute top-4 right-4 bg-white/30 p-1 rounded-full">
          <Star className="w-4 h-4 fill-white text-white" />
        </div>
      )}
      <div className="bg-white/20 p-6 rounded-full">
        {icon}
      </div>
      <span className="text-2xl font-bold uppercase tracking-wider">{label}</span>
      {completed && <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">COMPLETO!</span>}
    </motion.button>
  );
}
