import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onAddSubmenu?: () => void;
  onAddType?: () => void;
}

export function ActionMenu({ onEdit, onDelete, onAddSubmenu, onAddType }: ActionMenuProps) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onEdit}
        className="p-1 hover:bg-blue-100 rounded transition-colors"
        title="Editar"
      >
        <Edit2 className="w-3 h-3 text-blue-600" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 hover:bg-red-100 rounded transition-colors"
        title="Excluir"
      >
        <Trash2 className="w-3 h-3 text-red-600" />
      </button>
      {onAddSubmenu && (
        <button
          onClick={onAddSubmenu}
          className="p-1 hover:bg-green-100 rounded transition-colors"
          title="Adicionar Submenu"
        >
          <Plus className="w-3 h-3 text-green-600" />
        </button>
      )}
      {onAddType && (
        <button
          onClick={onAddType}
          className="p-1 hover:bg-purple-100 rounded transition-colors"
          title="Adicionar Tipo"
        >
          <Plus className="w-3 h-3 text-purple-600" />
        </button>
      )}
    </div>
  );
}
