import React, { useState, useMemo, useCallback } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Image } from '../App';
import { ConfirmDialog } from './ConfirmDialog';

interface ImageItemProps {
  image: Image;
  onView: (image: Image) => void;
  onDelete: (imageId: string) => void;
  level: 'menu' | 'submenu' | 'type' | 'general';
}

export function ImageItem({ image, onView, onDelete, level }: ImageItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  // REGRA 13: Cores diferenciadas por nível - MEMOIZADO
  const colors = useMemo(() => {
    if (level === 'type' || image.typeId) {
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100',
        tag: 'bg-purple-100 text-purple-700',
        icon: '💜'
      };
    } else if (level === 'submenu' || image.submenuId) {
      return {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-100',
        tag: 'bg-indigo-100 text-indigo-700',
        icon: '📂'
      };
    } else if (level === 'menu' || image.menuId) {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
        tag: 'bg-blue-100 text-blue-700',
        icon: '📁'
      };
    }
    return {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100',
      tag: 'bg-gray-100 text-gray-700',
      icon: '🖼️'
    };
  }, [level, image.typeId, image.submenuId, image.menuId]);

  const handleView = useCallback(() => {
    onView(image);
  }, [image, onView]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(image.id);
    setShowDeleteConfirm(false);
  }, [image.id, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <>
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-2 ${colors.hover} transition-colors group`}>
        <div className="flex gap-2">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {!imageError ? (
              <img
                src={image.url}
                alt={image.name}
                className="w-16 h-16 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleView}
                onError={handleImageError}
              />
            ) : (
              <div 
                className="w-16 h-16 rounded border border-gray-300 bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleView}
              >
                <span className="text-xs text-gray-500">Erro</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-gray-800 truncate">
                  {colors.icon} {image.name}
                </h4>
                {image.description && (
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    {image.description}
                  </p>
                )}
                
                {/* Tags de localização */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {image.menuName && !image.submenuId && !image.typeId && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                      📁 {image.menuName}
                    </span>
                  )}
                  {image.submenuName && !image.typeId && (
                    <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                      📂 {image.submenuName}
                    </span>
                  )}
                  {image.typeName && (
                    <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                      💜 T {image.typeName}
                    </span>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={handleView}
                  type="button"
                  className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                  title="Visualizar"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  type="button"
                  className="p-1.5 hover:bg-red-100 rounded transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Excluir Imagem"
          message={`Deseja realmente excluir a imagem "${image.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          type="danger"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}
