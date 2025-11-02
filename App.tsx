
import React, { useState, useMemo } from 'react';
import { DailyEntry, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import DailyCommandCenter from './components/DailyCommandCenter';
import Scoreboard from './components/Scoreboard';
import WeeklyInsights from './components/WeeklyInsights';

function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Daily);
  const [entries, setEntries] = useLocalStorage<Record<string, DailyEntry>>('darshan-os-entries', {});

  const todayDate = getTodayDateString();

  const todayEntry = useMemo((): DailyEntry => {
    return entries[todayDate] ?? {
      date: todayDate,
      tasks: [],
      journal: '',
      aiReflection: '',
    };
  }, [entries, todayDate]);

  const allEntries: DailyEntry[] = useMemo(() => Object.values(entries).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [entries]);

  const handleUpdateTodayEntry = (updatedEntry: DailyEntry) => {
    setEntries(prev => ({
      ...prev,
      [todayDate]: updatedEntry,
    }));
  };

  const renderView = () => {
    switch (view) {
      case View.Scoreboard:
        return <Scoreboard entries={allEntries} />;
      case View.Insights:
        return <WeeklyInsights entries={allEntries} />;
      case View.Daily:
      default:
        return <DailyCommandCenter entry={todayEntry} onUpdate={handleUpdateTodayEntry} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050608] to-[#111] text-gray-300">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwy1NSwwLjA1KSI+PGVsbGlwc2UgY3g9IjAiIGN5PSIzMiIgcng9IjI0IiByeT0iNDgiLz48ZWxsaXBzZSBjeD0iMzIiIGN5PSIwIiByeD0iMjQiIHJ5PSI0OCIvPjwvc3ZnPg==')] opacity-60"></div>
      <main className="container mx-auto max-w-4xl px-4 py-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
            Darshan OS
          </h1>
          <p className="text-lg text-cyan-400 mt-2 tracking-widest">The Self-Mastery Engine</p>
        </div>
        
        <Header currentView={view} setView={setView} />
        
        <div className="mt-8">
          {renderView()}
        </div>
      </main>
      <footer className="text-center py-8 text-gray-600 relative z-10">
          <p>Operate your personal neural cockpit.</p>
      </footer>
    </div>
  );
};

export default App;
