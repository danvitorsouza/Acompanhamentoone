import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, User } from 'lucide-react';
import { Note } from '../App';
import { ConfirmDialog } from './ConfirmDialog';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determinar cores baseadas no contexto da nota
  const getColors = () => {
    // Nota de TIPO (tem typeId)
    if (note.typeId) {
      return {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200 hover:border-purple-300',
        iconColor: 'text-purple-600',
        buttonHover: 'hover:bg-purple-200/50',
        editIconColor: 'text-purple-600',
        linkColor: 'text-purple-600 hover:text-purple-700'
      };
    }
    // Nota de SUBMENU (tem submenuId mas não tem typeId)
    if (note.submenuId) {
      return {
        bg: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200 hover:border-indigo-300',
        iconColor: 'text-indigo-600',
        buttonHover: 'hover:bg-indigo-200/50',
        editIconColor: 'text-indigo-600',
        linkColor: 'text-indigo-600 hover:text-indigo-700'
      };
    }
    // Nota de MENU (tem menuId mas não tem submenuId nem typeId)
    if (note.menuId) {
      return {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200 hover:border-blue-300',
        iconColor: 'text-blue-600',
        buttonHover: 'hover:bg-blue-200/50',
        editIconColor: 'text-blue-600',
        linkColor: 'text-blue-600 hover:text-blue-700'
      };
    }
    // Nota GERAL (sem vinculação)
    return {
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-200 hover:border-gray-300',
      iconColor: 'text-gray-600',
      buttonHover: 'hover:bg-gray-200/50',
      editIconColor: 'text-gray-600',
      linkColor: 'text-gray-600 hover:text-gray-700'
    };
  };

  const colors = getColors();

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-lg p-3 border ${colors.border} transition-all group`}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`flex items-center gap-1.5 text-xs ${colors.iconColor}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">{note.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">{note.author}</span>
            </div>
          </div>
          
          <p 
            className={`text-sm text-gray-700 ${!isExpanded ? 'line-clamp-2' : ''} cursor-pointer`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {note.content}
          </p>
          
          {note.content.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-xs ${colors.linkColor} font-medium mt-1`}
            >
              {isExpanded ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className={`p-1.5 ${colors.buttonHover} rounded transition-colors`}
            title="Editar"
          >
            <Edit2 className={`w-3.5 h-3.5 ${colors.editIconColor}`} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 hover:bg-red-100 rounded transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Excluir Anotação"
        message="Deseja realmente excluir esta anotação? Esta ação não pode ser desfeita."
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={() => {
          onDelete(note.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}