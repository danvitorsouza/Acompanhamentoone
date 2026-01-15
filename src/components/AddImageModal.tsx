import React, { useState, useEffect, useMemo } from 'react';
import { X, Image as ImageIcon, Link } from 'lucide-react';
import { MenuItem } from '../App';

interface AddImageModalProps {
  menus: MenuItem[];
  onConfirm: (
    url: string,
    name: string,
    description: string,
    menuId: string | undefined,
    menuName: string | undefined,
    submenuId: string | undefined,
    submenuName: string | undefined,
    typeId: string | undefined,
    typeName: string | undefined
  ) => void;
  onClose: () => void;
}

export function AddImageModal({ menus, onConfirm, onClose }: AddImageModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('general');
  const [selectedSubmenuId, setSelectedSubmenuId] = useState<string>('none');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('none');

  // REGRA 6: Obter apenas MENUS principais (type === 'menu') - MEMOIZADO
  const mainMenus = useMemo(() => {
    return menus.filter(m => m.type === 'menu');
  }, [menus]);

  // Encontrar o menu selecionado - MEMOIZADO
  const selectedMenu = useMemo(() => {
    if (selectedMenuId === 'general') return null;
    return mainMenus.find(m => m.id === selectedMenuId) || null;
  }, [selectedMenuId, mainMenus]);

  // REGRA 7: Obter submenus do menu selecionado - MEMOIZADO
  const availableSubmenus = useMemo(() => {
    if (!selectedMenu || !selectedMenu.items) return [];
    return selectedMenu.items.filter(item => item.type === 'submenu');
  }, [selectedMenu]);

  // Encontrar o submenu selecionado - MEMOIZADO
  const selectedSubmenu = useMemo(() => {
    if (selectedSubmenuId === 'none') return null;
    return availableSubmenus.find(s => s.id === selectedSubmenuId) || null;
  }, [selectedSubmenuId, availableSubmenus]);

  // REGRA 8: Obter tipos do menu ou submenu selecionado - MEMOIZADO
  const availableTypes = useMemo(() => {
    if (selectedSubmenuId !== 'none' && selectedSubmenu) {
      return selectedSubmenu.items?.filter(item => item.type === 'submenuType') || [];
    } else if (selectedMenu) {
      return selectedMenu.items?.filter(item => item.type === 'menuType') || [];
    }
    return [];
  }, [selectedSubmenuId, selectedSubmenu, selectedMenu]);

  // REGRA 9: Reset submenu e tipo quando o menu mudar
  useEffect(() => {
    if (selectedMenuId === 'general') {
      setSelectedSubmenuId('none');
      setSelectedTypeId('none');
    } else {
      if (selectedSubmenuId !== 'none') {
        const submenuExists = availableSubmenus.some(s => s.id === selectedSubmenuId);
        if (!submenuExists) {
          setSelectedSubmenuId('none');
        }
      }
      setSelectedTypeId('none');
    }
  }, [selectedMenuId]);

  // REGRA 10: Reset tipo quando o submenu mudar
  useEffect(() => {
    setSelectedTypeId('none');
  }, [selectedSubmenuId]);

  // Listener de ESC
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor, informe o nome da imagem');
      return;
    }

    if (!url.trim()) {
      alert('Por favor, informe a URL da imagem');
      return;
    }

    const menuIdToSave = selectedMenuId === 'general' ? undefined : selectedMenuId;
    const submenuIdToSave = selectedSubmenuId === 'none' ? undefined : selectedSubmenuId;
    const typeIdToSave = selectedTypeId === 'none' ? undefined : selectedTypeId;
    
    let menuNameToSave: string | undefined;
    let submenuNameToSave: string | undefined;
    let typeNameToSave: string | undefined;
    
    if (menuIdToSave && selectedMenu) {
      menuNameToSave = selectedMenu.name;
      
      if (submenuIdToSave) {
        const submenu = availableSubmenus.find(s => s.id === submenuIdToSave);
        if (submenu) {
          submenuNameToSave = submenu.name;
        }
      }

      if (typeIdToSave) {
        const typeItem = availableTypes.find(t => t.id === typeIdToSave);
        if (typeItem) {
          typeNameToSave = typeItem.name;
        }
      }
    }
    
    onConfirm(
      url.trim(), 
      name.trim(), 
      description.trim(), 
      menuIdToSave, 
      menuNameToSave, 
      submenuIdToSave, 
      submenuNameToSave, 
      typeIdToSave, 
      typeNameToSave
    );
    onClose();
  };

  // REGRA 5: Preview da localização - MEMOIZADO
  const previewInfo = useMemo(() => {
    if (selectedTypeId !== 'none') {
      const typeName = availableTypes.find(t => t.id === selectedTypeId)?.name || 'Tipo';
      return {
        color: 'purple',
        text: selectedSubmenu 
          ? `${selectedMenu?.name || 'Menu'} › ${selectedSubmenu.name} › T ${typeName}`
          : `${selectedMenu?.name || 'Menu'} › T ${typeName}`,
        bgClass: 'bg-purple-50 border-purple-200',
        textClass: 'text-purple-700',
        icon: '💜'
      };
    } else if (selectedSubmenuId !== 'none') {
      const submenuName = availableSubmenus.find(s => s.id === selectedSubmenuId)?.name || 'Submenu';
      return {
        color: 'indigo',
        text: `${selectedMenu?.name || 'Menu'} › ${submenuName}`,
        bgClass: 'bg-indigo-50 border-indigo-200',
        textClass: 'text-indigo-700',
        icon: '📂'
      };
    } else if (selectedMenuId !== 'general') {
      return {
        color: 'blue',
        text: `${selectedMenu?.name || 'Menu'}`,
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-700',
        icon: '📁'
      };
    }
    return {
      color: 'gray',
      text: 'Imagens Gerais',
      bgClass: 'bg-gray-50 border-gray-200',
      textClass: 'text-gray-700',
      icon: '🖼️'
    };
  }, [selectedTypeId, selectedSubmenuId, selectedMenuId, availableTypes, availableSubmenus, selectedMenu, selectedSubmenu]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-blue-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold text-lg">
              Nova Imagem
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Campo URL */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Link className="w-4 h-4 inline mr-1" />
                URL da Imagem <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole o link direto da imagem (JPG, PNG, GIF, WebP, etc.)
              </p>
            </div>

            {/* Preview URL */}
            {url && (
              <div className="border border-gray-300 rounded-lg p-2 bg-white">
                <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                <img
                  src={url}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23fee" width="400" height="300"/%3E%3Ctext fill="%23c33" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EURL inválida%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
          </div>

          {/* Nome da Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome da Imagem <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Fluxo de Cadastro"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição para a imagem..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
            />
          </div>

          {/* REGRA 2: Campo Menu */}
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

          {/* REGRA 3: Campo Submenu */}
          {selectedMenu && availableSubmenus.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Submenu
              </label>
              <select
                value={selectedSubmenuId}
                onChange={(e) => setSelectedSubmenuId(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white"
              >
                <option value="none">Nenhum (imagem no menu principal)</option>
                {availableSubmenus.map((submenu) => (
                  <option key={submenu.id} value={submenu.id}>
                    • {submenu.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* REGRA 4: Campo Tipo */}
          {selectedMenu && availableTypes.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo
              </label>
              <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm bg-white"
              >
                <option value="none">
                  {selectedSubmenu 
                    ? `Nenhum (imagem no submenu "${selectedSubmenu.name}")`
                    : 'Nenhum (imagem no menu principal)'}
                </option>
                {availableTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    T {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* REGRA 5: Preview da localização */}
          <div className={`${previewInfo.bgClass} border rounded-lg p-3`}>
            <p className="text-xs font-medium text-gray-600 mb-1">A imagem ficará em:</p>
            <p className={`text-sm font-semibold ${previewInfo.textClass} flex items-center gap-2`}>
              <span>{previewInfo.icon}</span>
              <span>{previewInfo.text}</span>
            </p>
          </div>

          {/* Botões */}
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
              disabled={!name.trim() || !url.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md"
            >
              Adicionar Imagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
