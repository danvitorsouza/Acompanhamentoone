import React, { useEffect, useRef } from 'react';
import { Module } from '../App';

interface ModuleNumberSelectorProps {
  currentModuleId: string;
  modules: Module[];
  position: { x: number; y: number };
  onSelect: (newNumber: number) => void;
  onClose: () => void;
}

export function ModuleNumberSelector({ 
  currentModuleId, 
  modules, 
  position, 
  onSelect, 
  onClose 
}: ModuleNumberSelectorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const currentIndex = modules.findIndex(m => m.id === currentModuleId);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border-2 border-blue-300 p-3 animate-slideDown"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="text-xs font-medium text-slate-600 mb-2 text-center">
        Trocar posição com:
      </div>
      <div className="grid grid-cols-4 gap-2">
        {modules.map((module, index) => (
          <button
            key={module.id}
            onClick={() => onSelect(index)}
            disabled={index === currentIndex}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:scale-110 shadow-lg hover:shadow-xl'
            }`}
            title={module.name}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}