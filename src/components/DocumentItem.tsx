import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Eye, Trash2, FileText, File, FileSpreadsheet, Image as ImageIcon, GripVertical } from 'lucide-react';
import { Document } from '../App';

interface DocumentItemProps {
  document: Document;
  index: number;
  onView: (doc: Document) => void;
  onDelete: (docId: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const ITEM_TYPE = 'DOCUMENT';

export function DocumentItem({ document, index, onView, onDelete, onMove }: DocumentItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  preview(drop(ref));

  const getFileIcon = () => {
    const type = document.type.toLowerCase();
    if (type.includes('pdf')) return <FileText className="size-5 text-red-400" />;
    if (type.includes('word') || type.includes('doc')) return <FileText className="size-5 text-blue-400" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheet className="size-5 text-green-400" />;
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) return <ImageIcon className="size-5 text-purple-400" />;
    return <File className="size-5 text-gray-400" />;
  };

  return (
    <div
      ref={ref}
      className={`group relative bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm
        border border-blue-400/30 rounded-lg p-3 transition-all duration-300
        hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-400/50
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
        ${isOver ? 'ring-2 ring-cyan-400/50' : ''}`}
    >
      {/* Drag Handle */}
      <div
        ref={drag}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="size-4 text-blue-300/50" />
      </div>

      <div className="flex items-start gap-3 pl-6">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getFileIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate mb-1">
            {document.name}
          </h4>
          <div className="flex items-center gap-3 text-xs text-blue-200/70">
            <span>{document.type}</span>
            <span>•</span>
            <span>{document.size}</span>
            <span>•</span>
            <span>{document.uploadDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(document)}
            className="p-1.5 rounded-md bg-blue-500/20 hover:bg-blue-500/40 
              text-blue-300 hover:text-blue-200 transition-all duration-200
              hover:scale-110"
            title="Visualizar"
          >
            <Eye className="size-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Deseja excluir o documento "${document.name}"?`)) {
                onDelete(document.id);
              }
            }}
            className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/40 
              text-red-300 hover:text-red-200 transition-all duration-200
              hover:scale-110"
            title="Excluir"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
