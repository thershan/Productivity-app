import React from 'react';
import { Task, TaskStatus } from '../types';
import { TrashIcon } from './icons';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const statusOptions: TaskStatus[] = [TaskStatus.NotStarted, TaskStatus.InProgress, TaskStatus.Done];

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const handleStatusChange = (status: TaskStatus) => {
    onUpdate({ ...task, status });
  };
  
  const handleFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...task, focusLevel: parseInt(e.target.value, 10) });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Done: return 'bg-green-500/20 text-green-300 border-green-500/30';
      case TaskStatus.InProgress: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case TaskStatus.NotStarted:
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-grow">
        <p className={`text-lg ${task.status === TaskStatus.Done ? 'line-through text-gray-500' : 'text-gray-200'}`}>
          {task.text}
        </p>
        <div className="flex items-center gap-2 mt-3">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-2 py-1 text-xs rounded border transition-all ${
                task.status === status
                  ? getStatusColor(status) + ' font-semibold'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border-transparent'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full sm:w-48 flex-shrink-0">
        <label htmlFor={`focus-${task.id}`} className="text-sm text-gray-400 mb-1 block">Focus: {task.focusLevel}</label>
        <input
          id={`focus-${task.id}`}
          type="range"
          min="1"
          max="10"
          value={task.focusLevel}
          onChange={handleFocusChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
          style={{
             '--thumb-color': `hsl(${task.focusLevel * 12}, 80%, 60%)`
          } as React.CSSProperties}
        />
      </div>
      <button onClick={() => onDelete(task.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
        <TrashIcon className="w-5 h-5" />
      </button>
      {/* Fix: Removed non-standard "jsx" and "global" props from the style tag. The styling for the range input thumb is now in a standard style tag, which will be applied globally. */}
      <style>{`
        .range-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: var(--thumb-color);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 5px var(--thumb-color);
        }
        .range-thumb::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background-color: var(--thumb-color);
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 5px var(--thumb-color);
        }
      `}</style>
    </div>
  );
};

export default TaskItem;
