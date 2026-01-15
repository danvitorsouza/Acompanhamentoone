import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Note, MenuItem } from '../App';

interface AddNoteModalProps {
  note?: Note;
  menus: MenuItem[]; // Lista de menus do módulo
  preSelectedMenuId?: string; // Menu pré-selecionado
  onConfirm: (
    author: string, 
    content: string, 
    menuId: string | undefined, 
    menuName: string | undefined, 
    submenuId: string | undefined, 
    submenuName: string | undefined, 
    typeId: string | undefined,
    typeName: string | undefined,
    date?: string
  ) => void;
  onClose: () => void;
}

export function AddNoteModal({ note, menus, preSelectedMenuId, onConfirm, onClose }: AddNoteModalProps) {
  const [author, setAuthor] = useState(note?.author || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>(note?.menuId || preSelectedMenuId || 'general');
  const [selectedSubmenuId, setSelectedSubmenuId] = useState<string | undefined>(note?.submenuId || 'none');
  const [selectedTypeId, setSelectedTypeId] = useState<string | undefined>(note?.typeId || 'none');
  const [date] = useState(note?.date || new Date().toLocaleDateString('pt-BR'));

  // Obter apenas MENUS principais (type === 'menu')
  const mainMenus = menus.filter(m => m.type === 'menu');

  // Encontrar o menu selecionado
  const selectedMenu = selectedMenuId !== 'general' 
    ? mainMenus.find(m => m.id === selectedMenuId) 
    : null;

  // Obter submenus do menu selecionado (apenas submenus diretos type === 'submenu')
  const availableSubmenus = selectedMenu?.items?.filter(item => item.type === 'submenu') || [];

  // Encontrar o submenu selecionado
  const selectedSubmenu = selectedSubmenuId !== 'none'
    ? availableSubmenus.find(s => s.id === selectedSubmenuId)
    : null;

  // Obter tipos do menu ou submenu selecionado
  const getAvailableTypes = () => {
    if (selectedSubmenuId !== 'none' && selectedSubmenu) {
      // Tipos do submenu (submenuType)
      return selectedSubmenu.items?.filter(item => item.type === 'submenuType') || [];
    } else if (selectedMenu) {
      // Tipos do menu (menuType)
      return selectedMenu.items?.filter(item => item.type === 'menuType') || [];
    }
    return [];
  };

  const availableTypes = getAvailableTypes();

  // Atualizar submenu quando o menu mudar
  useEffect(() => {
    if (selectedMenuId === 'general' || availableSubmenus.length === 0) {
      setSelectedSubmenuId('none');
      setSelectedTypeId('none');
    } else if (selectedMenuId !== note?.menuId) {
      // Se trocou de menu, reseta para "none"
      setSelectedSubmenuId('none');
      setSelectedTypeId('none');
    }
  }, [selectedMenuId, availableSubmenus.length]);

  // Atualizar tipo quando o submenu mudar
  useEffect(() => {
    if (selectedSubmenuId !== note?.submenuId) {
      setSelectedTypeId('none');
    }
  }, [selectedSubmenuId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim() && content.trim()) {
      const menuIdToSave = selectedMenuId === 'general' ? undefined : selectedMenuId;
      const submenuIdToSave = selectedSubmenuId === 'none' ? undefined : selectedSubmenuId;
      const typeIdToSave = selectedTypeId === 'none' ? undefined : selectedTypeId;
      
      let menuNameToSave: string | undefined;
      let submenuNameToSave: string | undefined;
      let typeNameToSave: string | undefined;
      
      if (menuIdToSave) {
        menuNameToSave = selectedMenu?.name;
        
        // Se tem submenu selecionado
        if (submenuIdToSave) {
          const submenu = availableSubmenus.find(s => s.id === submenuIdToSave);
          if (submenu) {
            submenuNameToSave = submenu.name;
          }
        }

        // Se tem tipo selecionado
        if (typeIdToSave) {
          const type = availableTypes.find(t => t.id === typeIdToSave);
          if (type) {
            typeNameToSave = type.name;
          }
        }
      }
      
      onConfirm(author.trim(), content.trim(), menuIdToSave, menuNameToSave, submenuIdToSave, submenuNameToSave, typeIdToSave, typeNameToSave, note?.date);
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Função para determinar a cor e o texto de preview
  const getPreviewInfo = () => {
    if (selectedTypeId !== 'none') {
      const typeName = availableTypes.find(t => t.id === selectedTypeId)?.name;
      return {
        color: 'purple',
        text: selectedSubmenu 
          ? `${selectedMenu?.name} › ${selectedSubmenu.name} › T ${typeName}`
          : `${selectedMenu?.name} › T ${typeName}`,
        bgClass: 'bg-purple-50 border-purple-200',
        textClass: 'text-purple-700'
      };
    } else if (selectedSubmenuId !== 'none') {
      const submenuName = availableSubmenus.find(s => s.id === selectedSubmenuId)?.name;
      return {
        color: 'indigo',
        text: `${selectedMenu?.name} › ${submenuName}`,
        bgClass: 'bg-indigo-50 border-indigo-200',
        textClass: 'text-indigo-700'
      };
    } else if (selectedMenuId !== 'general') {
      return {
        color: 'blue',
        text: `${selectedMenu?.name} › Gerais`,
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-700'
      };
    }
    return {
      color: 'gray',
      text: 'Anotações Gerais',
      bgClass: 'bg-gray-50 border-gray-200',
      textClass: 'text-gray-700'
    };
  };

  const previewInfo = getPreviewInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-blue-200 max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h3 className="text-white font-semibold text-lg">
            {note ? 'Editar Anotação' : 'Nova Anotação'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Data
            </label>
            <input
              type="text"
              value={date}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Digite o nome do autor"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              autoFocus
            />
          </div>

          {/* Campo Menu - APENAS MENUS PRINCIPAIS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Menu <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMenuId}
              onChange={(e) => setSelectedMenuId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
              <option value="general">Geral</option>
              {mainMenus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Submenu - APENAS SUBMENUS DIRETOS DO MENU SELECIONADO */}
          {selectedMenu && availableSubmenus.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 animate-slideDown">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Submenu
              </label>
              <select
                value={selectedSubmenuId}
                onChange={(e) => setSelectedSubmenuId(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white"
              >
                <option value="none">Nenhum (nota no menu principal)</option>
                {availableSubmenus.map((submenu) => (
                  <option key={submenu.id} value={submenu.id}>
                    • {submenu.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campo Tipo - APENAS TIPOS DO MENU OU SUBMENU SELECIONADO */}
          {selectedMenu && availableTypes.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 animate-slideDown">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo
              </label>
              <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm bg-white"
              >
                <option value="none">
                  {selectedSubmenu ? `Nenhum (nota no submenu "${selectedSubmenu.name}")` : 'Nenhum (nota no menu principal)'}
                </option>
                {availableTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    T {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preview da localização */}
          <div className={`${previewInfo.bgClass} border rounded-lg p-3`}>
            <p className="text-xs font-medium text-gray-600 mb-1">A nota ficará em:</p>
            <p className={`text-sm font-semibold ${previewInfo.textClass}`}>
              {previewInfo.text}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Anotação <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite sua anotação aqui..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!author.trim() || !content.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md"
            >
              {note ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
