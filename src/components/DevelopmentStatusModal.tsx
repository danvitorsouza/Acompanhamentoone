import React, { useEffect } from 'react';
import { X, Circle, Clock, CheckCircle2, Beaker, Pause } from 'lucide-react';

interface DevelopmentStatusModalProps {
  itemName: string;
  currentStatus?: 'not-started' | 'in-progress' | 'completed' | 'testing' | 'on-hold';
  onSelect: (status: 'not-started' | 'in-progress' | 'completed' | 'testing' | 'on-hold' | undefined) => void;
  onClose: () => void;
}

export function DevelopmentStatusModal({ 
  itemName, 
  currentStatus, 
  onSelect, 
  onClose 
}: DevelopmentStatusModalProps) {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const statusOptions = [
    {
      value: 'not-started' as const,
      icon: Circle,
      label: 'Não Iniciado',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-200',
      borderColor: 'border-gray-400',
      emoji: '⚪'
    },
    {
      value: 'in-progress' as const,
      icon: Clock,
      label: 'Em Progresso',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      hoverColor: 'hover:bg-yellow-200',
      borderColor: 'border-yellow-400',
      emoji: '🟡'
    },
    {
      value: 'testing' as const,
      icon: Beaker,
      label: 'Em Testes',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-200',
      borderColor: 'border-blue-400',
      emoji: '🔵'
    },
    {
      value: 'completed' as const,
      icon: CheckCircle2,
      label: 'Concluído',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-200',
      borderColor: 'border-green-400',
      emoji: '🟢'
    },
    {
      value: 'on-hold' as const,
      icon: Pause,
      label: 'Pausado',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-200',
      borderColor: 'border-purple-400',
      emoji: '🟣'
    }
  ];

  const handleSelect = (value: typeof statusOptions[number]['value']) => {
    onSelect(value);
    onClose();
  };

  const handleRemove = () => {
    onSelect(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border-2 border-blue-300">
        {/* Header - Compacto */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-white" />
            <h3 className="text-white font-semibold text-sm">
              Status
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Compacto */}
        <div className="p-3 space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded px-2.5 py-1.5">
            <p className="text-xs text-gray-700 truncate">
              <span className="font-semibold">{itemName}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isActive = currentStatus === option.value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full p-2 rounded-md border-2 transition-all text-left flex items-center gap-2.5 ${
                    isActive
                      ? `${option.borderColor} ${option.bgColor} shadow-sm`
                      : `border-gray-200 hover:border-gray-300 ${option.hoverColor}`
                  }`}
                >
                  <span className="text-base">{option.emoji}</span>
                  <span className={`font-medium text-xs ${option.color} flex-1`}>
                    {option.label}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                      Atual
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Botão de remover status - Compacto */}
          {currentStatus && (
            <button
              type="button"
              onClick={handleRemove}
              className="w-full p-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium border border-transparent hover:border-red-200"
            >
              Remover Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
