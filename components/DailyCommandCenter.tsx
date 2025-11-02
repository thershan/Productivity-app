
import React, { useState, useCallback } from 'react';
import { DailyEntry, Task, TaskStatus } from '../types';
import TaskItem from './TaskItem';
import Button from './ui/Button';
import Card from './ui/Card';
import { PlusIcon, SparklesIcon } from './icons';
import { getDailyReflection } from '../services/geminiService';

interface DailyCommandCenterProps {
  entry: DailyEntry;
  onUpdate: (entry: DailyEntry) => void;
}

const DailyCommandCenter: React.FC<DailyCommandCenterProps> = ({ entry, onUpdate }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim() && entry.tasks.length < 3) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        status: TaskStatus.NotStarted,
        focusLevel: 5,
      };
      onUpdate({ ...entry, tasks: [...entry.tasks, newTask] });
      setNewTaskText('');
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const newTasks = entry.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
    onUpdate({ ...entry, tasks: newTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = entry.tasks.filter(task => task.id !== taskId);
    onUpdate({ ...entry, tasks: newTasks });
  };
  
  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate({...entry, journal: e.target.value});
  }

  const handleGenerateReflection = useCallback(async () => {
    setIsGenerating(true);
    try {
        const reflection = await getDailyReflection(entry.tasks, entry.journal);
        onUpdate({ ...entry, aiReflection: reflection });
    } catch (error) {
        console.error(error);
        onUpdate({ ...entry, aiReflection: "Failed to generate reflection." });
    } finally {
        setIsGenerating(false);
    }
  }, [entry, onUpdate]);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-xl font-bold mb-4 text-cyan-300 tracking-wide">Daily Tasks</h2>
        <div className="space-y-4 mb-6">
          {entry.tasks.map(task => (
            <TaskItem key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
          ))}
        </div>
        {entry.tasks.length < 3 && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddTask()}
              placeholder="Add up to 3 key tasks..."
              className="flex-grow bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            />
            <Button onClick={handleAddTask} disabled={!newTaskText.trim()}>
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold mb-4 text-cyan-300 tracking-wide">Journal</h2>
          <textarea
            value={entry.journal}
            onChange={handleJournalChange}
            placeholder="What distracted me or helped me today?"
            className="w-full h-48 bg-gray-800/50 border border-gray-700 rounded-md p-3 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all resize-none"
          />
        </Card>
        <Card>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-cyan-300 tracking-wide">AI Reflection</h2>
             <Button onClick={handleGenerateReflection} disabled={isGenerating} size="sm">
                <SparklesIcon className="w-4 h-4 mr-2"/>
                {isGenerating ? 'Generating...' : 'Reflect'}
             </Button>
          </div>
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : (
             <p className="text-gray-400 italic leading-relaxed">{entry.aiReflection || "Generate a reflection on your day."}</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DailyCommandCenter;
