
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.Daily, label: 'Command Center' },
    { id: View.Scoreboard, label: 'Scoreboard' },
    { id: View.Insights, label: 'Insights' },
  ];

  return (
    <nav className="flex justify-center bg-gray-900/50 backdrop-blur-sm p-2 rounded-full border border-gray-700/50 shadow-lg">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
            currentView === item.id 
            ? 'text-white' 
            : 'text-gray-400 hover:text-white'
          }`}
        >
          {currentView === item.id && (
            <span
              className="absolute inset-0 bg-cyan-500/20 rounded-full border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
            ></span>
          )}
          <span className="relative z-10">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Header;
