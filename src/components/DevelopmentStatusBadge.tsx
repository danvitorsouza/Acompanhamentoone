import React from 'react';
import { Circle, CheckCircle2, Clock, Pause, Beaker } from 'lucide-react';

interface DevelopmentStatusBadgeProps {
  status?: 'not-started' | 'in-progress' | 'completed' | 'testing' | 'on-hold';
  onClick?: (e: React.MouseEvent) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DevelopmentStatusBadge({ 
  status, 
  onClick, 
  showLabel = false,
  size = 'sm'
}: DevelopmentStatusBadgeProps) {
  
  const statusConfig = {
    'not-started': {
      icon: Circle,
      label: 'Não Iniciado',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      hoverColor: 'hover:bg-gray-200',
      emoji: '⚪'
    },
    'in-progress': {
      icon: Clock,
      label: 'Em Progresso',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      hoverColor: 'hover:bg-yellow-100',
      emoji: '🟡'
    },
    'completed': {
      icon: CheckCircle2,
      label: 'Concluído',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      hoverColor: 'hover:bg-green-100',
      emoji: '🟢'
    },
    'testing': {
      icon: Beaker,
      label: 'Em Testes',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      hoverColor: 'hover:bg-blue-100',
      emoji: '🔵'
    },
    'on-hold': {
      icon: Pause,
      label: 'Pausado',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      hoverColor: 'hover:bg-purple-100',
      emoji: '🟣'
    }
  };

  // Se não tiver status, mostra um botão vazio/cinza para adicionar
  const config = status ? statusConfig[status] : {
    icon: Circle,
    label: 'Definir Status',
    color: 'text-gray-400',
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
    hoverColor: 'hover:bg-blue-50 hover:border-blue-400',
    emoji: '○'
  };
  
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      padding: 'px-1.5 py-0.5',
      text: 'text-xs',
      emoji: 'text-xs'
    },
    md: {
      icon: 'w-4 h-4',
      padding: 'px-2 py-1',
      text: 'text-sm',
      emoji: 'text-sm'
    },
    lg: {
      icon: 'w-5 h-5',
      padding: 'px-3 py-1.5',
      text: 'text-base',
      emoji: 'text-base'
    }
  };

  const sizeClass = sizeClasses[size];

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 ${sizeClass.padding} ${config.bgColor} ${config.borderColor} ${config.color} border rounded-md ${onClick ? `${config.hoverColor} transition-colors cursor-pointer` : 'cursor-default'} ${sizeClass.text} font-medium`}
        title={onClick ? `Clique para alterar - Status atual: ${config.label}` : config.label}
      >
        <span className={sizeClass.emoji}>{config.emoji}</span>
        <span>{config.label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center ${config.bgColor} ${config.borderColor} ${config.color} border rounded-full ${onClick ? `${config.hoverColor} transition-all cursor-pointer hover:scale-110` : 'cursor-default'} p-1`}
      title={onClick ? `Clique para alterar - Status: ${config.label}` : config.label}
    >
      <Icon className={sizeClass.icon} />
    </button>
  );
}