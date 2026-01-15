import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Note } from '../App';
import { NoteItem } from './NoteItem';

interface NoteGroupProps {
  menuName: string;
  notes: Note[]; // Notas diretas do menu (sem submenu) - "Gerais"
  subGroups?: { [submenuId: string]: { submenuName: string; notes: Note[] } }; // Notas agrupadas por submenu
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  isGeneral?: boolean;
}

export function NoteGroup({ menuName, notes, subGroups, onEdit, onDelete, isGeneral = false }: NoteGroupProps) {
  const [isExpanded, setIsExpanded] = useState(isGeneral); // Geral expandido por padrão
  const [activeTab, setActiveTab] = useState<string>('gerais'); // Tab ativa: 'gerais' ou submenuId

  // Agrupar notas dentro de cada submenu por tipo
  const groupNotesByType = (notesArray: Note[]) => {
    const withType: Note[] = [];
    const withoutType: Note[] = [];

    notesArray.forEach(note => {
      if (note.typeId) {
        withType.push(note);
      } else {
        withoutType.push(note);
      }
    });

    // Agrupar notas com tipo por typeId
    const typeGroups: { [typeId: string]: { typeName: string; notes: Note[] } } = {};
    withType.forEach(note => {
      if (note.typeId && note.typeName) {
        if (!typeGroups[note.typeId]) {
          typeGroups[note.typeId] = {
            typeName: note.typeName,
            notes: []
          };
        }
        typeGroups[note.typeId].notes.push(note);
      }
    });

    return { withoutType, typeGroups };
  };

  const totalNotes = notes.length + (subGroups ? Object.values(subGroups).reduce((sum, sg) => sum + sg.notes.length, 0) : 0);
  const hasSubGroups = subGroups && Object.keys(subGroups).length > 0;

  // Determinar qual conteúdo mostrar baseado na tab ativa
  const getActiveNotes = () => {
    if (activeTab === 'gerais') {
      return notes;
    } else if (subGroups && subGroups[activeTab]) {
      return subGroups[activeTab].notes;
    }
    return [];
  };

  const activeNotes = getActiveNotes();
  const { withoutType: activeNotesWithoutType, typeGroups: activeTypeGroups } = groupNotesByType(activeNotes);

  // Determinar cores baseadas no contexto
  const getColors = () => {
    if (isGeneral) {
      return {
        bg: 'from-gray-50 to-gray-100',
        hover: 'hover:from-gray-100 hover:to-gray-150',
        text: 'text-gray-700',
        badge: 'bg-gray-200 text-gray-600',
        border: 'border-gray-200'
      };
    }
    return {
      bg: 'from-blue-50 to-blue-100',
      hover: 'hover:from-blue-100 hover:to-blue-150',
      text: 'text-blue-700',
      badge: 'bg-blue-200 text-blue-700',
      border: 'border-blue-200'
    };
  };

  const colors = getColors();

  return (
    <div className={`border ${colors.border} rounded-lg overflow-hidden bg-white`}>
      {/* Header expansível */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-3 py-2.5 flex items-center justify-between transition-all duration-300
          bg-gradient-to-r ${colors.bg} ${colors.hover}`}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-blue-600 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
          )}
          <span className={`text-sm font-medium ${colors.text} text-left`}>
            {menuName}
          </span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge} font-medium`}>
          {totalNotes}
        </span>
      </button>

      {/* Conteúdo expansível */}
      {isExpanded && (
        <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30">
          {/* Abas - Aparecem apenas se houver subgrupos */}
          {hasSubGroups && (
            <div className="border-b border-blue-200 bg-white/80 px-2 py-1 flex gap-1 overflow-x-auto">
              {/* Tab "Gerais" */}
              <button
                onClick={() => setActiveTab('gerais')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === 'gerais'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Gerais
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === 'gerais'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {notes.length}
                </span>
              </button>

              {/* Tabs dos Submenus */}
              {Object.entries(subGroups).map(([submenuId, subGroup]) => (
                <button
                  key={submenuId}
                  onClick={() => setActiveTab(submenuId)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    activeTab === submenuId
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  {menuName} › {subGroup.submenuName}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === submenuId
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-200 text-indigo-700'
                  }`}>
                    {subGroup.notes.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Conteúdo da tab ativa */}
          <div className="p-2 space-y-2">
            {/* Notas sem tipo */}
            {activeNotesWithoutType.length > 0 && (
              <div className="space-y-2">
                {activeNotesWithoutType.map(note => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}

            {/* Notas agrupadas por tipo */}
            {Object.keys(activeTypeGroups).length > 0 && (
              <div className="space-y-2">
                {Object.entries(activeTypeGroups).map(([typeId, typeGroup]) => (
                  <div key={typeId} className="border border-purple-200 rounded-lg overflow-hidden bg-purple-50/50">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-150 px-3 py-2 border-b border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600 font-bold text-xs">T</span>
                        <span className="text-sm font-medium text-purple-700">
                          {typeGroup.typeName}
                        </span>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-200 text-purple-700 font-medium">
                          {typeGroup.notes.length}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 space-y-2">
                      {typeGroup.notes.map(note => (
                        <NoteItem
                          key={note.id}
                          note={note}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mensagem quando não há notas */}
            {activeNotesWithoutType.length === 0 && Object.keys(activeTypeGroups).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-3">
                {hasSubGroups 
                  ? `Nenhuma anotação em "${activeTab === 'gerais' ? 'Gerais' : subGroups![activeTab]?.submenuName}"`
                  : 'Nenhuma anotação neste grupo'
                }
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
