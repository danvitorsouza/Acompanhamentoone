import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-500',
          iconBg: 'bg-red-100',
          border: 'border-red-200',
          button: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          glow: 'shadow-red-200'
        };
      case 'warning':
        return {
          icon: 'text-yellow-500',
          iconBg: 'bg-yellow-100',
          border: 'border-yellow-200',
          button: 'from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
          glow: 'shadow-yellow-200'
        };
      case 'info':
        return {
          icon: 'text-blue-500',
          iconBg: 'bg-blue-100',
          border: 'border-blue-200',
          button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
          glow: 'shadow-blue-200'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border-2 ${colors.border} ${colors.glow} animate-scaleIn`}
        style={{
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${colors.iconBg} rounded-full p-2 animate-bounce`}>
              {type === 'danger' ? (
                <Trash2 className={`w-5 h-5 ${colors.icon}`} />
              ) : (
                <AlertTriangle className={`w-5 h-5 ${colors.icon}`} />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer com botões */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all text-sm font-semibold text-gray-700 hover:scale-105 active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${colors.button} text-white rounded-lg transition-all text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
