import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, Edit2, GripVertical, StickyNote, Image as ImageIcon, FileText } from 'lucide-react';
import { MenuItem } from '../App';
import { AddMenuModal } from './AddMenuModal';
import { useDrag, useDrop } from 'react-dnd';
import { ConfirmDialog } from './ConfirmDialog';
import { DevelopmentStatusBadge } from './DevelopmentStatusBadge';
import { DevelopmentStatusModal } from './DevelopmentStatusModal';

interface MenuItemProps {
  item: MenuItem;
  index: number;
  onUpdate: (itemId: string, updatedItem: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  level: number;
  moduleNumber: number;
  parentNumber: string;
  onAddNote?: (menuId: string, menuName: string) => void;
  onAddImage?: (menuId: string, menuName: string) => void;
  onAddDocument?: (menuId: string, menuName: string) => void;
}

export function MenuItemComponent({ 
  item, 
  index, 
  onUpdate, 
  onDelete, 
  onMove, 
  level, 
  moduleNumber,
  parentNumber,
  onAddNote,
  onAddImage,
  onAddDocument
}: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showAddSubmenu, setShowAddSubmenu] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [isHoveredOver, setIsHoveredOver] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Criar tipo de drag baseado no tipo do item (menu, submenu ou tipo)
  const getDragType = () => {
    if (item.type === 'menu') return 'MENU';
    if (item.type === 'submenu') return 'SUBMENU';
    if (item.type === 'menuType' || item.type === 'submenuType') return 'TYPE';
    return 'UNKNOWN';
  };

  const dragType = getDragType();

  const [{ isDragging }, drag] = useDrag({
    type: dragType,
    item: { index, level, itemId: item.id, itemType: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: dragType, // Só aceita o mesmo tipo
    drop: (draggedItem: { index: number; level: number; itemId: string; itemType: string }) => {
      // Só executa a troca quando soltar o mouse
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
      }
    },
    hover: (draggedItem: { index: number; level: number; itemId: string; itemType: string }) => {
      // Apenas indica visualmente que está sobre o item, sem fazer a troca
      setIsHoveredOver(true);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  // Remove o hover quando não está mais sobre o item
  React.useEffect(() => {
    if (!isOver) {
      setIsHoveredOver(false);
    }
  }, [isOver]);

  drag(drop(ref));

  // Calculate the number for this item
  const itemNumber = level === 0 
    ? `${moduleNumber}.${index}`
    : `${parentNumber}.${index + 1}`;

  const getSymbol = (type: MenuItem['type']) => {
    switch (type) {
      case 'menu':
        return null;
      case 'submenu':
        return '•';
      case 'menuType':
        return 'T'; // Mudado para letra T
      case 'submenuType':
        return 'T'; // Mudado para letra T
      default:
        return null;
    }
  };

  const addSubItem = (name: string, type: 'submenu' | 'menuType' | 'submenuType') => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name,
      type,
      items: type === 'submenu' ? [] : undefined
    };
    onUpdate(item.id, {
      ...item,
      items: [...(item.items || []), newItem]
    });
  };

  const updateSubItem = (subItemId: string, updatedSubItem: MenuItem) => {
    onUpdate(item.id, {
      ...item,
      items: item.items?.map(sub => sub.id === subItemId ? updatedSubItem : sub)
    });
  };

  const deleteSubItem = (subItemId: string) => {
    onUpdate(item.id, {
      ...item,
      items: item.items?.filter(sub => sub.id !== subItemId)
    });
  };

  const moveSubItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...(item.items || [])];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onUpdate(item.id, { ...item, items: newItems });
  };

  const handleEdit = () => {
    setEditingName(item.name);
    setShowActions(false);
  };

  const handleSaveEdit = () => {
    if (editingName && editingName.trim()) {
      onUpdate(item.id, { ...item, name: editingName.trim() });
    }
    setEditingName(null);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      onDelete(item.id);
    }
    setShowActions(false);
  };

  const canHaveSubmenus = item.type === 'menu' || item.type === 'submenu';
  const canHaveTypes = item.type === 'menu' || item.type === 'submenu';
  const symbol = getSymbol(item.type);
  const hasChildren = item.items && item.items.length > 0;

  // Destaque visual quando está sendo arrastado sobre este item
  const getDropHighlight = () => {
    if (isOver && canDrop) {
      return 'ring-2 ring-blue-400 ring-offset-1 bg-blue-50/70';
    }
    return '';
  };

  // Definir cor de hover baseado no tipo
  const getHoverBackground = () => {
    if (item.type === 'menuType' || item.type === 'submenuType') {
      return 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 hover:border-purple-200';
    }
    if (item.type === 'submenu') {
      return 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100/50 hover:border-indigo-200';
    }
    return 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200';
  };

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.4 : 1 }} className="w-full">
      <div
        className={`group relative mb-1 ${level > 0 ? 'ml-3' : ''} w-full`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Menu Item */}
        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all duration-200 ${getHoverBackground()} border border-transparent hover:shadow-sm cursor-move w-full max-w-full ${
          item.type === 'menu' ? 'font-medium' : ''
        } ${getDropHighlight()}`}>
          {/* Number with Status Background - CLICÁVEL */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowStatusModal(true);
            }}
            className={`flex-shrink-0 text-[10px] font-bold min-w-[28px] h-5 flex items-center justify-center rounded-full transition-all duration-200 ${
              item.developmentStatus === 'completed' ? 'bg-green-400 text-white hover:bg-green-500' :
              item.developmentStatus === 'in-progress' ? 'bg-yellow-400 text-white hover:bg-yellow-500' :
              item.developmentStatus === 'testing' ? 'bg-blue-400 text-white hover:bg-blue-500' :
              item.developmentStatus === 'on-hold' ? 'bg-purple-400 text-white hover:bg-purple-500' :
              item.developmentStatus === 'not-started' ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' :
              'bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
            }`}
            title="Clique para alterar status de desenvolvimento"
          >
            {itemNumber}
          </button>

          {/* Symbol */}
          {symbol && (
            <span className={`flex-shrink-0 font-bold ${ 
              item.type === 'menuType' ? 'text-purple-600 text-[11px]' : 
              item.type === 'submenuType' ? 'text-purple-500 text-[10px]' : 
              'text-indigo-500 text-xs'
            }`}>
              {symbol}
            </span>
          )}

          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex-shrink-0 transform transition-all duration-300 hover:scale-110"
            >
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
              )}
            </button>
          )}

          {/* Name */}
          {editingName !== null ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setEditingName(null);
              }}
              className="flex-1 text-xs px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <>
              <span className={`flex-1 text-xs leading-tight transition-colors duration-300 group-hover:text-blue-700 ${
                item.type === 'menu' ? 'text-slate-700 font-semibold' : 
                item.type === 'menuType' ? 'text-slate-700' :
                'text-slate-600'
              }`}>
                {item.name}
              </span>
              
              {/* Status Emoji - Visual apenas, não clicável */}
              {item.developmentStatus && (
                <span className="flex-shrink-0 text-sm" title={
                  item.developmentStatus === 'completed' ? 'Concluído' :
                  item.developmentStatus === 'in-progress' ? 'Em Progresso' :
                  item.developmentStatus === 'testing' ? 'Em Testes' :
                  item.developmentStatus === 'on-hold' ? 'Pausado' :
                  'Não Iniciado'
                }>
                  {item.developmentStatus === 'completed' ? '🟢' :
                   item.developmentStatus === 'in-progress' ? '🟡' :
                   item.developmentStatus === 'testing' ? '🔵' :
                   item.developmentStatus === 'on-hold' ? '🟣' :
                   '⚪'}
                </span>
              )}
            </>
          )}

          {/* Action Buttons */}
          {showActions && editingName === null && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Add Submenu Button */}
              {canHaveSubmenus && (
                <button
                  onClick={() => setShowAddSubmenu(true)}
                  className="p-1 bg-blue-500 hover:bg-blue-600 rounded transition-all hover:scale-110 transform duration-200 shadow-sm"
                  title="Adicionar Submenu"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              )}
              {/* Add Type Button */}
              {canHaveTypes && (
                <button
                  onClick={() => setShowAddType(true)}
                  className="p-1 bg-purple-600 hover:bg-purple-700 rounded transition-all hover:scale-110 transform duration-200 shadow-sm"
                  title="Adicionar Tipo"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              )}
              {/* Add Note Button */}
              {onAddNote && (
                <button
                  onClick={() => onAddNote(item.id, item.name)}
                  className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded transition-all hover:scale-110 transform duration-200 shadow-sm"
                  title="Adicionar Nota"
                >
                  <StickyNote className="w-3 h-3 text-white" />
                </button>
              )}
              {/* Add Image Button */}
              {onAddImage && (
                <button
                  onClick={() => onAddImage(item.id, item.name)}
                  className="p-1 bg-pink-500 hover:bg-pink-600 rounded transition-all hover:scale-110 transform duration-200 shadow-sm"
                  title="Adicionar Imagem"
                >
                  <ImageIcon className="w-3 h-3 text-white" />
                </button>
              )}
              {/* Add Document Button */}
              {onAddDocument && (
                <button
                  onClick={() => onAddDocument(item.id, item.name)}
                  className="p-1 bg-green-500 hover:bg-green-600 rounded transition-all hover:scale-110 transform duration-200 shadow-sm"
                  title="Adicionar Documento"
                >
                  <FileText className="w-3 h-3 text-white" />
                </button>
              )}
              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="p-1 hover:bg-blue-100 rounded transition-colors"
                title="Editar"
              >
                <Edit2 className="w-3 h-3 text-blue-600" />
              </button>
              {/* Delete Button */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-3 h-3 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {isOpen && hasChildren && (
        <div className="animate-slideDown">
          {item.items!.map((subItem, subIndex) => (
            <MenuItemComponent
              key={subItem.id}
              item={subItem}
              index={subIndex}
              onUpdate={updateSubItem}
              onDelete={deleteSubItem}
              onMove={moveSubItem}
              level={level + 1}
              moduleNumber={moduleNumber}
              parentNumber={itemNumber}
              onAddNote={onAddNote}
              onAddImage={onAddImage}
              onAddDocument={onAddDocument}
            />
          ))}
        </div>
      )}

      {/* Add Submenu Modal */}
      {showAddSubmenu && (
        <AddMenuModal
          title={`Adicionar Submenu em "${item.name}"`}
          onConfirm={(name) => {
            addSubItem(name, 'submenu');
            setShowAddSubmenu(false);
          }}
          onClose={() => setShowAddSubmenu(false)}
        />
      )}

      {/* Add Type Modal */}
      {showAddType && (
        <AddMenuModal
          title={`Adicionar Tipo em "${item.name}"`}
          onConfirm={(name) => {
            const typeToAdd = item.type === 'submenu' ? 'submenuType' : 'menuType';
            addSubItem(name, typeToAdd);
            setShowAddType(false);
          }}
          onClose={() => setShowAddType(false)}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Excluir Item"
        message={`Tem certeza que deseja excluir "${item.name}"?${hasChildren ? '\n\nEsta ação também excluirá todos os itens filhos!' : ''}`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={() => {
          onDelete(item.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Development Status Modal */}
      {showStatusModal && (
        <DevelopmentStatusModal
          itemName={item.name}
          currentStatus={item.developmentStatus}
          onSelect={(status) => {
            onUpdate(item.id, { ...item, developmentStatus: status });
          }}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
}