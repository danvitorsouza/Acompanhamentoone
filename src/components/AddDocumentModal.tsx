import React, { useState, useEffect } from 'react';
import { X, FileText, Link } from 'lucide-react';
import { MenuItem } from '../App';

interface AddDocumentModalProps {
  menus: MenuItem[];
  onConfirm: (
    url: string,
    name: string, 
    type: string, 
    size: string,
    menuId: string | undefined, 
    menuName: string | undefined, 
    submenuId: string | undefined, 
    submenuName: string | undefined, 
    typeId: string | undefined,
    typeName: string | undefined
  ) => void;
  onClose: () => void;
}

export function AddDocumentModal({ menus, onConfirm, onClose }: AddDocumentModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('PDF');
  const [size, setSize] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>('general');
  const [selectedSubmenuId, setSelectedSubmenuId] = useState<string | undefined>('none');
  const [selectedTypeId, setSelectedTypeId] = useState<string | undefined>('none');

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
    } else {
      setSelectedSubmenuId('none');
      setSelectedTypeId('none');
    }
  }, [selectedMenuId, availableSubmenus.length]);

  // Atualizar tipo quando o submenu mudar
  useEffect(() => {
    setSelectedTypeId('none');
  }, [selectedSubmenuId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      alert('Por favor, informe a URL do documento');
      return;
    }
    
    if (!name.trim()) {
      alert('Por favor, informe o nome do documento');
      return;
    }
    
    if (!size.trim()) {
      alert('Por favor, informe o tamanho do documento');
      return;
    }

    const menuIdToSave = selectedMenuId === 'general' ? undefined : selectedMenuId;
    const submenuIdToSave = selectedSubmenuId === 'none' ? undefined : selectedSubmenuId;
    const typeIdToSave = selectedTypeId === 'none' ? undefined : selectedTypeId;
    
    let menuNameToSave: string | undefined;
    let submenuNameToSave: string | undefined;
    let typeNameToSave: string | undefined;
    
    if (menuIdToSave) {
      menuNameToSave = selectedMenu?.name;
      
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
      type, 
      size.trim(), 
      menuIdToSave, 
      menuNameToSave, 
      submenuIdToSave, 
      submenuNameToSave, 
      typeIdToSave, 
      typeNameToSave
    );
    onClose();
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
        textClass: 'text-purple-700',
        icon: '💜'
      };
    } else if (selectedSubmenuId !== 'none') {
      const submenuName = availableSubmenus.find(s => s.id === selectedSubmenuId)?.name;
      return {
        color: 'indigo',
        text: `${selectedMenu?.name} › ${submenuName}`,
        bgClass: 'bg-indigo-50 border-indigo-200',
        textClass: 'text-indigo-700',
        icon: '📂'
      };
    } else if (selectedMenuId !== 'general') {
      return {
        color: 'blue',
        text: `${selectedMenu?.name}`,
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-700',
        icon: '📁'
      };
    }
    return {
      color: 'gray',
      text: 'Documentos Gerais',
      bgClass: 'bg-gray-50 border-gray-200',
      textClass: 'text-gray-700',
      icon: '📄'
    };
  };

  const previewInfo = getPreviewInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-blue-200 max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold text-lg">
              Novo Documento
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Campo URL */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Link className="w-4 h-4 inline mr-1" />
              URL do Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/documento.pdf"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
              autoFocus
            />
            <p className="text-xs text-gray-500">
              Cole o link direto do documento (PDF, DOC, XLS, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome do Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Contrato de Prestação de Serviços"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
              <option value="PDF">PDF</option>
              <option value="DOC">DOC</option>
              <option value="DOCX">DOCX</option>
              <option value="XLS">XLS</option>
              <option value="XLSX">XLSX</option>
              <option value="TXT">TXT</option>
              <option value="ZIP">ZIP</option>
              <option value="RAR">RAR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tamanho <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ex: 2.5 MB"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
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
                <option value="none">Nenhum (documento no menu principal)</option>
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
                  {selectedSubmenu ? `Nenhum (documento no submenu "${selectedSubmenu.name}")` : 'Nenhum (documento no menu principal)'}
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
            <p className="text-xs font-medium text-gray-600 mb-1">O documento ficará em:</p>
            <p className={`text-sm font-semibold ${previewInfo.textClass} flex items-center gap-2`}>
              <span>{previewInfo.icon}</span>
              <span>{previewInfo.text}</span>
            </p>
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
              disabled={!url.trim() || !name.trim() || !size.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
