
import React, { useState, useCallback } from 'react';
import { DailyEntry } from '../types';
import { getWeeklyInsights, WeeklyInsight } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';
import { LightBulbIcon } from './icons';

interface WeeklyInsightsProps {
  entries: DailyEntry[];
}

const WeeklyInsights: React.FC<WeeklyInsightsProps> = ({ entries }) => {
  const [insights, setInsights] = useState<WeeklyInsight[] | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsights = useCallback(async () => {
    setIsLoading(true);
    const last7DaysEntries = entries.slice(0, 7);
    const result = await getWeeklyInsights(last7DaysEntries);
    setInsights(result);
    setIsLoading(false);
  }, [entries]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      );
    }

    if (!insights) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-6">Analyze the last 7 days to uncover patterns in your focus and discipline.</p>
          <Button onClick={handleGenerateInsights} disabled={entries.length < 3}>
             {entries.length < 3 ? 'Need 3+ Days of Data' : 'Generate Weekly Insights'}
          </Button>
        </div>
      );
    }
    
    if (typeof insights === 'string') {
        return <p className="text-center text-yellow-400 py-16">{insights}</p>
    }

    return (
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 transform transition-all hover:scale-[1.02] hover:border-cyan-400/50">
            <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5" />
              {insight.title}
            </h3>
            <p className="text-gray-300 mt-2">{insight.summary}</p>
            <p className="text-gray-400 mt-3 text-sm italic">Suggestion: {insight.suggestion}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-cyan-300 tracking-wide text-center">Weekly Insights Engine</h2>
      {renderContent()}
    </Card>
  );
};

export default WeeklyInsights;
