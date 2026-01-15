import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { X, Image as ImageIcon, Link, Upload, Clipboard, Camera } from 'lucide-react';
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

type UploadMethod = 'url' | 'file' | 'print';

export function AddImageModal({ menus, onConfirm, onClose }: AddImageModalProps) {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('url');
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('general');
  const [selectedSubmenuId, setSelectedSubmenuId] = useState<string>('none');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('none');
  
  // Estados para upload de arquivo
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para print/captura
  const [printPreview, setPrintPreview] = useState<string>('');
  const [isPasting, setIsPasting] = useState(false);

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

  // Handler para upload de arquivo
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, etc.)');
        return;
      }

      // Limite de 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo é muito grande. Tamanho máximo: 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Gerar nome automaticamente se estiver vazio
      if (!name) {
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extensão
        setName(fileName);
      }

      // Gerar preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [name]);

  // Handler para colar print da área de transferência
  useEffect(() => {
    if (uploadMethod !== 'print') return;

    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      setIsPasting(true);

      const items = e.clipboardData?.items;
      if (!items) {
        setIsPasting(false);
        return;
      }

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setPrintPreview(event.target?.result as string);
              setIsPasting(false);
              
              // Gerar nome automaticamente se estiver vazio
              if (!name) {
                const timestamp = new Date().toLocaleString('pt-BR');
                setName(`Captura de tela - ${timestamp}`);
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
      
      setIsPasting(false);
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [uploadMethod, name]);

  // Handler para capturar screenshot (simular botão)
  const handleCaptureClick = useCallback(() => {
    alert('Para capturar uma tela:\n\n1. Pressione Print Screen no seu teclado\n2. Ou use Windows + Shift + S (Windows)\n3. Ou Command + Shift + 4 (Mac)\n4. Depois cole aqui com Ctrl+V (ou Cmd+V)\n\nA imagem aparecerá automaticamente na área de preview.');
  }, []);

  // Limpar preview ao trocar de método
  useEffect(() => {
    setFilePreview('');
    setPrintPreview('');
    setSelectedFile(null);
    setUrl('');
  }, [uploadMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor, informe o nome da imagem');
      return;
    }

    let finalUrl = '';

    // Validar e obter URL conforme o método
    if (uploadMethod === 'url') {
      if (!url.trim()) {
        alert('Por favor, informe a URL da imagem');
        return;
      }
      finalUrl = url.trim();
    } else if (uploadMethod === 'file') {
      if (!filePreview) {
        alert('Por favor, selecione um arquivo de imagem');
        return;
      }
      finalUrl = filePreview; // Base64
    } else if (uploadMethod === 'print') {
      if (!printPreview) {
        alert('Por favor, cole uma captura de tela (Ctrl+V ou Cmd+V)');
        return;
      }
      finalUrl = printPreview; // Base64
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
      finalUrl, 
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
          {/* Seleção do Método de Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Adicionar Imagem <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  uploadMethod === 'url'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <Link className="w-6 h-6" />
                <span className="text-xs font-medium">URL</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  uploadMethod === 'file'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium">Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMethod('print')}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  uploadMethod === 'print'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <Clipboard className="w-6 h-6" />
                <span className="text-xs font-medium">Print</span>
              </button>
            </div>
          </div>

          {/* Campo URL */}
          {uploadMethod === 'url' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
          )}

          {/* Campo Upload de Arquivo */}
          {uploadMethod === 'file' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Selecionar Arquivo <span className="text-red-500">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-green-400 rounded-lg hover:border-green-500 hover:bg-green-100 transition-all text-sm font-medium text-green-700 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  {selectedFile ? selectedFile.name : 'Clique para selecionar uma imagem'}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: JPG, PNG, GIF, WebP (máx. 5MB)
                </p>
              </div>

              {/* Preview Arquivo */}
              {filePreview && (
                <div className="border border-gray-300 rounded-lg p-2 bg-white">
                  <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded border border-gray-200"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    📁 {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Campo Print/Captura */}
          {uploadMethod === 'print' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Captura de Tela <span className="text-red-500">*</span>
                </label>
                <div className={`w-full px-4 py-8 border-2 border-dashed rounded-lg transition-all flex flex-col items-center justify-center gap-3 ${
                  isPasting 
                    ? 'border-purple-500 bg-purple-100' 
                    : 'border-purple-400 bg-white'
                }`}>
                  {printPreview ? (
                    <>
                      <Clipboard className="w-8 h-8 text-green-600" />
                      <p className="text-sm font-medium text-green-700">✓ Captura colada com sucesso!</p>
                    </>
                  ) : isPasting ? (
                    <>
                      <Clipboard className="w-8 h-8 text-purple-600 animate-pulse" />
                      <p className="text-sm font-medium text-purple-700">Colando...</p>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-8 h-8 text-purple-600" />
                      <p className="text-sm font-medium text-purple-700">Cole aqui sua captura</p>
                      <p className="text-xs text-gray-600 text-center">
                        Pressione <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+V</kbd> ou <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Cmd+V</kbd>
                      </p>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleCaptureClick}
                  className="w-full mt-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Como capturar a tela?
                </button>
              </div>

              {/* Preview Print */}
              {printPreview && (
                <div className="border border-gray-300 rounded-lg p-2 bg-white">
                  <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                  <img
                    src={printPreview}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded border border-gray-200"
                  />
                </div>
              )}
            </div>
          )}

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
              disabled={!name.trim()}
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
