
import React, { useMemo } from 'react';
import { DailyEntry, TaskStatus } from '../types';
import Card from './ui/Card';
import CircularProgress from './ui/CircularProgress';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ScoreboardProps {
  entries: DailyEntry[];
}

const Scoreboard: React.FC<ScoreboardProps> = ({ entries }) => {
  const stats = useMemo(() => {
    const totalDays = entries.length;
    if (totalDays === 0) {
      return {
        consistency: 0,
        avgFocus: 0,
        streak: 0,
        chartData: []
      };
    }

    let completedTasks = 0;
    let totalTasks = 0;
    let totalFocus = 0;
    let focusEntries = 0;
    
    const chartData = entries.slice(0, 30).reverse().map(entry => {
        let dayFocus = 0;
        let dayTasksWithFocus = 0;
        entry.tasks.forEach(task => {
            if (task.status === TaskStatus.Done) completedTasks++;
            totalTasks++;
            if(task.focusLevel > 0) {
                dayFocus += task.focusLevel;
                dayTasksWithFocus++;
            }
        });
        const avgDayFocus = dayTasksWithFocus > 0 ? dayFocus / dayTasksWithFocus : 0;
        if(avgDayFocus > 0) {
            totalFocus += avgDayFocus;
            focusEntries++;
        }
        return {
            date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
            focus: parseFloat(avgDayFocus.toFixed(1)),
        }
    });

    const consistency = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const avgFocus = focusEntries > 0 ? totalFocus / focusEntries : 0;
    
    // Calculate streak
    let streak = 0;
    let today = new Date();
    today.setHours(0,0,0,0);
    const sortedDates = entries.map(e => new Date(e.date)).sort((a,b) => b.getTime() - a.getTime());
    
    for (let i = 0; i < sortedDates.length; i++) {
        const entryDate = new Date(sortedDates[i]);
        entryDate.setHours(0,0,0,0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (entryDate.getTime() === expectedDate.getTime()) {
            const hasCompletedTask = entries.find(e => new Date(e.date).getTime() === entryDate.getTime())?.tasks.some(t => t.status === TaskStatus.Done);
            if(hasCompletedTask) {
              streak++;
            } else {
              break;
            }
        } else {
            break;
        }
    }


    return {
      consistency,
      avgFocus,
      streak,
      chartData
    };
  }, [entries]);

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-cyan-300 tracking-wide text-center">Your Scoreboard</h2>
      {entries.length > 0 ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
                <div className="flex flex-col items-center">
                    <CircularProgress value={stats.consistency} />
                    <h3 className="text-lg font-semibold mt-4">Consistency</h3>
                    <p className="text-gray-400">Task completion rate</p>
                </div>
                <div className="flex flex-col items-center">
                    <CircularProgress value={stats.avgFocus * 10} />
                    <h3 className="text-lg font-semibold mt-4">Average Focus</h3>
                    <p className="text-gray-400">Rating out of 10</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{stats.streak}</p>
                    <h3 className="text-lg font-semibold mt-2">Day Streak</h3>
                    <p className="text-gray-400">Consecutive days with completed tasks</p>
                </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4 text-cyan-300 tracking-wide">Focus Over Time (Last 30 Days)</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="date" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} domain={[0, 10]} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        <Line type="monotone" dataKey="focus" stroke="#00E5FF" strokeWidth={2} dot={{ r: 4, fill: '#00E5FF' }} activeDot={{ r: 8, stroke: 'rgba(0, 229, 255, 0.5)', strokeWidth: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
      ) : (
        <p className="text-center text-gray-500 py-16">Log some daily entries to see your stats.</p>
      )}
    </Card>
  );
};

export default Scoreboard;
