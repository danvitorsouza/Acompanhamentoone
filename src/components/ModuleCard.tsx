import React, { useState } from 'react';
import { Plus, RotateCw, StickyNote, Image as ImageIcon, Settings, HelpCircle, FileText } from 'lucide-react';
import { Module, MenuItem, Note, Document, Image } from '../App';
import { MenuItemComponent } from './MenuItemComponent';
import { AddMenuModal } from './AddMenuModal';
import { AddNoteModal } from './AddNoteModal';
import { NoteGroup } from './NoteGroup';
import { AddDocumentModal } from './AddDocumentModal';
import { DocumentItem } from './DocumentItem';
import { AddImageModal } from './AddImageModal';
import { ImageGroup } from './ImageGroup';
import { ImageGalleryModal } from './ImageGalleryModal';

interface ModuleCardProps {
  module: Module;
  index: number;
  onUpdateModule: (moduleId: string, updatedModule: Module) => void;
  onNumberClick: (moduleId: string, event: React.MouseEvent) => void;
}

type BackTab = 'notes' | 'images' | 'docs' | 'config' | 'help';

export function ModuleCard({ module, index, onUpdateModule, onNumberClick }: ModuleCardProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeBackTab, setActiveBackTab] = useState<BackTab>('notes');
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | undefined>(undefined);
  const [preSelectedMenuId, setPreSelectedMenuId] = useState<string | undefined>(undefined);
  const [showAddImage, setShowAddImage] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const addMenu = (name: string) => {
    const newMenu: MenuItem = {
      id: `menu-${Date.now()}`,
      name,
      type: 'menu',
      items: []
    };
    onUpdateModule(module.id, {
      ...module,
      menus: [...module.menus, newMenu]
    });
  };

  const updateMenu = (menuId: string, updatedMenu: MenuItem) => {
    onUpdateModule(module.id, {
      ...module,
      menus: module.menus.map(m => m.id === menuId ? updatedMenu : m)
    });
  };

  const deleteMenu = (menuId: string) => {
    onUpdateModule(module.id, {
      ...module,
      menus: module.menus.filter(m => m.id !== menuId)
    });
  };

  const moveMenu = (fromIndex: number, toIndex: number) => {
    const newMenus = [...module.menus];
    const [movedMenu] = newMenus.splice(fromIndex, 1);
    newMenus.splice(toIndex, 0, movedMenu);
    onUpdateModule(module.id, { ...module, menus: newMenus });
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  // Funções de notas atualizadas com menuId, menuName, submenuId, submenuName, typeId e typeName
  const addNote = (author: string, content: string, menuId?: string, menuName?: string, submenuId?: string, submenuName?: string, typeId?: string, typeName?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      author,
      content,
      menuId,
      menuName,
      submenuId,
      submenuName,
      typeId,
      typeName
    };
    onUpdateModule(module.id, {
      ...module,
      notes: [...(module.notes || []), newNote]
    });
  };

  const updateNote = (author: string, content: string, menuId?: string, menuName?: string, submenuId?: string, submenuName?: string, typeId?: string, typeName?: string, date?: string) => {
    if (!editingNote) return;
    
    const updatedNote: Note = {
      ...editingNote,
      author,
      content,
      menuId,
      menuName,
      submenuId,
      submenuName,
      typeId,
      typeName,
      date: date || editingNote.date
    };
    
    onUpdateModule(module.id, {
      ...module,
      notes: (module.notes || []).map(n => n.id === editingNote.id ? updatedNote : n)
    });
  };

  const deleteNote = (noteId: string) => {
    onUpdateModule(module.id, {
      ...module,
      notes: (module.notes || []).filter(n => n.id !== noteId)
    });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setPreSelectedMenuId(note.menuId);
    setShowAddNote(true);
  };

  const handleCloseNoteModal = () => {
    setShowAddNote(false);
    setEditingNote(undefined);
    setPreSelectedMenuId(undefined);
  };

  // Callbacks para adicionar nota/imagem de um menu específico
  const handleAddNoteFromMenu = (menuId: string, menuName: string) => {
    setPreSelectedMenuId(menuId);
    setIsFlipped(true); // Vira o card
    setTimeout(() => {
      setActiveBackTab('notes'); // Muda para aba de notas
      setTimeout(() => {
        setShowAddNote(true); // Abre o modal
      }, 100);
    }, 600); // Aguarda a animação de flip
  };

  const handleAddImageFromMenu = (menuId: string, menuName: string) => {
    setPreSelectedMenuId(menuId);
    setIsFlipped(true);
    setTimeout(() => {
      setActiveBackTab('images');
      setTimeout(() => {
        setShowAddImage(true); // Abre o modal
      }, 100);
    }, 600); // Aguarda a animação de flip
  };

  // Funções de documentos
  const addDocument = (name: string, type: string, size: string, menuId?: string, menuName?: string, submenuId?: string, submenuName?: string, typeId?: string, typeName?: string) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name,
      type,
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      size,
      menuId,
      menuName,
      submenuId,
      submenuName,
      typeId,
      typeName
    };
    onUpdateModule(module.id, {
      ...module,
      documents: [...(module.documents || []), newDocument]
    });
  };

  const deleteDocument = (docId: string) => {
    onUpdateModule(module.id, {
      ...module,
      documents: (module.documents || []).filter(d => d.id !== docId)
    });
  };

  const moveDocument = (fromIndex: number, toIndex: number) => {
    const newDocuments = [...(module.documents || [])];
    const [movedDoc] = newDocuments.splice(fromIndex, 1);
    newDocuments.splice(toIndex, 0, movedDoc);
    onUpdateModule(module.id, { ...module, documents: newDocuments });
  };

  const viewDocument = (doc: Document) => {
    alert(`Visualizando documento: ${doc.name}\nTipo: ${doc.type}\nTamanho: ${doc.size}\n\nEm produção, abriria o documento em um visualizador.`);
  };

  // Funções de imagens
  const addImage = (url: string, name: string, description: string, menuId?: string, menuName?: string, submenuId?: string, submenuName?: string, typeId?: string, typeName?: string) => {
    const newImage: Image = {
      id: `img-${Date.now()}`,
      url,
      name,
      folder: menuName || 'Geral', // Compatibilidade
      description,
      menuId,
      menuName,
      submenuId,
      submenuName,
      typeId,
      typeName
    };
    onUpdateModule(module.id, {
      ...module,
      images: [...(module.images || []), newImage]
    });
  };

  const deleteImage = (imgId: string) => {
    onUpdateModule(module.id, {
      ...module,
      images: (module.images || []).filter(i => i.id !== imgId)
    });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...(module.images || [])];
    const [movedImg] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImg);
    onUpdateModule(module.id, { ...module, images: newImages });
  };

  const viewImage = (img: Image) => {
    // Visualizar imagem individual
    const imageIndex = (module.images || []).findIndex(i => i.id === img.id);
    setGalleryImages(module.images || []);
    setGalleryTitle(img.name);
    setGalleryInitialIndex(imageIndex >= 0 ? imageIndex : 0);
    setShowImageGallery(true);
  };

  const handleCloseImageModal = () => {
    setShowAddImage(false);
    setPreSelectedMenuId(undefined);
  };

  const handlePlaySlideshow = (images: Image[], title: string) => {
    setGalleryImages(images);
    setGalleryTitle(title);
    setGalleryInitialIndex(0);
    setShowImageGallery(true);
  };

  // Agrupar notas por menu e submenu
  const groupNotesByMenu = () => {
    type MenuGroup = {
      menuName: string;
      notes: Note[]; // Notas diretas do menu (sem submenu)
      subGroups?: { [submenuId: string]: { submenuName: string; notes: Note[] } };
    };
    
    const groups: { [menuId: string]: MenuGroup } = {};
    
    (module.notes || []).forEach(note => {
      const menuKey = note.menuId || 'general';
      const menuName = note.menuName || 'Geral';
      
      // Inicializar grupo do menu se não existir
      if (!groups[menuKey]) {
        groups[menuKey] = {
          menuName,
          notes: [],
          subGroups: {}
        };
      }
      
      // Se a nota tem submenu, adiciona ao subgrupo
      if (note.submenuId && note.submenuName) {
        if (!groups[menuKey].subGroups![note.submenuId]) {
          groups[menuKey].subGroups![note.submenuId] = {
            submenuName: note.submenuName,
            notes: []
          };
        }
        groups[menuKey].subGroups![note.submenuId].notes.push(note);
      } else {
        // Se não tem submenu, adiciona direto ao menu
        groups[menuKey].notes.push(note);
      }
    });
    
    return groups;
  };

  const noteGroups = groupNotesByMenu();

  // Agrupar imagens por menu e submenu
  const groupImagesByMenu = () => {
    type TypeGroup = { typeName: string; images: Image[] };
    type SubGroup = { submenuName: string; images: Image[]; typeGroups?: { [typeId: string]: TypeGroup } };
    type MenuGroup = {
      menuName: string;
      images: Image[]; // Imagens diretas do menu (sem submenu)
      subGroups?: { [submenuId: string]: SubGroup };
    };
    
    const groups: { [menuId: string]: MenuGroup } = {};
    
    (module.images || []).forEach(image => {
      const menuKey = image.menuId || 'general';
      const menuName = image.menuName || 'Geral';
      
      // Inicializar grupo do menu se não existir
      if (!groups[menuKey]) {
        groups[menuKey] = {
          menuName,
          images: [],
          subGroups: {}
        };
      }
      
      // Se a imagem tem tipo
      if (image.typeId && image.typeName) {
        if (image.submenuId && image.submenuName) {
          // Tipo dentro de submenu
          if (!groups[menuKey].subGroups![image.submenuId]) {
            groups[menuKey].subGroups![image.submenuId] = {
              submenuName: image.submenuName,
              images: [],
              typeGroups: {}
            };
          }
          if (!groups[menuKey].subGroups![image.submenuId].typeGroups![image.typeId]) {
            groups[menuKey].subGroups![image.submenuId].typeGroups![image.typeId] = {
              typeName: image.typeName,
              images: []
            };
          }
          groups[menuKey].subGroups![image.submenuId].typeGroups![image.typeId].images.push(image);
        } else {
          // Tipo direto no menu (menuType)
          // Por enquanto adiciona como imagem do menu
          groups[menuKey].images.push(image);
        }
      } else if (image.submenuId && image.submenuName) {
        // Imagem de submenu (sem tipo)
        if (!groups[menuKey].subGroups![image.submenuId]) {
          groups[menuKey].subGroups![image.submenuId] = {
            submenuName: image.submenuName,
            images: [],
            typeGroups: {}
          };
        }
        groups[menuKey].subGroups![image.submenuId].images.push(image);
      } else {
        // Imagem direto no menu
        groups[menuKey].images.push(image);
      }
    });
    
    return groups;
  };

  const imageGroups = groupImagesByMenu();

  const tabs = [
    { id: 'notes' as BackTab, icon: StickyNote, label: 'Notas' },
    { id: 'images' as BackTab, icon: ImageIcon, label: 'Imagens' },
    { id: 'docs' as BackTab, icon: FileText, label: 'Docs' },
    { id: 'config' as BackTab, icon: Settings, label: 'Config' },
    { id: 'help' as BackTab, icon: HelpCircle, label: 'Ajuda' }
  ];

  return (
    <div 
      className="h-full"
      style={{
        animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`
      }}
    >
      {/* Card com flip */}
      <div className="flip-card-container h-[370px]">
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* FRENTE */}
          <div className="flip-card-front">
            <div className="bg-white/95 rounded-lg shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
              {/* Header da Frente */}
              <div className={`bg-gradient-to-r ${module.color} px-4 py-1.5 relative overflow-hidden flex-shrink-0`}>
                <div className="flex items-center gap-2.5 relative z-10">
                  <div 
                    onClick={(e) => onNumberClick(module.id, e)}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-all hover:scale-110"
                  >
                    <span className="text-white font-black text-xs">{index + 1}</span>
                  </div>
                  
                  <h3 className="text-white text-center flex-1 text-sm font-semibold tracking-wide">
                    {module.name}
                  </h3>
                  
                  <button
                    onClick={handleFlip}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all hover:scale-110 hover:rotate-180 duration-500"
                    title="Virar módulo"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>

              {/* Menus */}
              <div className="p-2 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {(module.menus || []).filter(menu => menu).map((menu, menuIndex) => (
                  <MenuItemComponent
                    key={menu.id}
                    item={menu}
                    index={menuIndex}
                    onUpdate={updateMenu}
                    onDelete={deleteMenu}
                    onMove={moveMenu}
                    level={0}
                    moduleNumber={index + 1}
                    parentNumber={`${index + 1}`}
                    onAddNote={handleAddNoteFromMenu}
                    onAddImage={handleAddImageFromMenu}
                  />
                ))}
                
                <button
                  onClick={() => setShowAddMenu(true)}
                  className="w-full mt-2 px-3 py-2 flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg transition-all duration-300 group hover:bg-blue-50/50"
                >
                  <Plus className="w-4 h-4 text-blue-500 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                    Adicionar Menu
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* VERSO */}
          <div className="flip-card-back">
            <div className="bg-white/95 rounded-lg shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
              {/* Header do Verso */}
              <div className={`bg-gradient-to-r ${module.color} px-4 py-2 relative overflow-hidden flex-shrink-0`}>
                <div className="flex items-center gap-2.5 relative z-10">
                  <button
                    onClick={handleFlip}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all hover:scale-110 hover:rotate-180 duration-500"
                    title="Voltar"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-white" />
                  </button>
                  
                  <h3 className="text-white text-center flex-1 text-sm font-semibold tracking-wide">
                    {module.name} - Configurações
                  </h3>
                  
                  <div 
                    onClick={(e) => onNumberClick(module.id, e)}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-all hover:scale-110"
                  >
                    <span className="text-white font-black text-xs">{index + 1}</span>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Verso */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Abas */}
                <div className="flex border-b border-gray-200 bg-gray-50 px-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveBackTab(tab.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium transition-all relative ${
                          activeBackTab === tab.id
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {activeBackTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                      </button>
                    );
                  })}\n                </div>

                {/* Conteúdo das Abas */}
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                  {activeBackTab === 'notes' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAddNote(true)}
                        className="w-full px-3 py-2 flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg transition-all duration-300 group hover:bg-blue-50/50"
                      >
                        <Plus className="w-4 h-4 text-blue-500 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                          Adicionar Anotação
                        </span>
                      </button>

                      {Object.keys(noteGroups).length > 0 ? (
                        <div className="space-y-2">
                          {/* Notas Gerais primeiro */}
                          {noteGroups['general'] && (
                            <NoteGroup
                              key="general"
                              menuName="Geral"
                              notes={noteGroups['general'].notes}
                              onEdit={handleEditNote}
                              onDelete={deleteNote}
                              isGeneral={true}
                            />
                          )}
                          {/* Notas por Menu */}
                          {Object.entries(noteGroups)
                            .filter(([key]) => key !== 'general')
                            .map(([key, group]) => (
                              <NoteGroup
                                key={key}
                                menuName={group.menuName}
                                notes={group.notes}
                                subGroups={group.subGroups}
                                onEdit={handleEditNote}
                                onDelete={deleteNote}
                              />
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Nenhuma anotação ainda</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeBackTab === 'images' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAddImage(true)}
                        className="w-full px-3 py-2 flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg transition-all duration-300 group hover:bg-blue-50/50"
                      >
                        <Plus className="w-4 h-4 text-blue-500 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                          Adicionar Imagem
                        </span>
                      </button>

                      {Object.keys(imageGroups).length > 0 ? (
                        <div className="space-y-2">
                          {/* Imagens Gerais primeiro */}
                          {imageGroups['general'] && (
                            <ImageGroup
                              key="general"
                              menuName="Geral"
                              images={imageGroups['general'].images}
                              onView={viewImage}
                              onDelete={deleteImage}
                              onPlaySlideshow={handlePlaySlideshow}
                              isGeneral={true}
                            />
                          )}
                          {/* Imagens por Menu */}
                          {Object.entries(imageGroups)
                            .filter(([key]) => key !== 'general')
                            .map(([key, group]) => (
                              <ImageGroup
                                key={key}
                                menuName={group.menuName}
                                images={group.images}
                                subGroups={group.subGroups}
                                onView={viewImage}
                                onDelete={deleteImage}
                                onPlaySlideshow={handlePlaySlideshow}
                              />
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Nenhuma imagem ainda</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeBackTab === 'docs' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAddDocument(true)}
                        className="w-full px-3 py-2 flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg transition-all duration-300 group hover:bg-blue-50/50"
                      >
                        <Plus className="w-4 h-4 text-blue-500 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                          Adicionar Documento
                        </span>
                      </button>

                      {(module.documents || []).length > 0 ? (
                        <div className="space-y-2">
                          {module.documents!.map((document, docIndex) => (
                            <DocumentItem
                              key={document.id}
                              document={document}
                              index={docIndex}
                              onView={viewDocument}
                              onDelete={deleteDocument}
                              onMove={moveDocument}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Nenhum documento ainda</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeBackTab === 'config' && (
                    <div className="text-center py-8 text-gray-400">
                      <Settings className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Em desenvolvimento</p>
                    </div>
                  )}

                  {activeBackTab === 'help' && (
                    <div className="text-center py-8 text-gray-400">
                      <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Em desenvolvimento</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddMenu && (
        <AddMenuModal
          title="Adicionar Novo Menu"
          onConfirm={addMenu}
          onClose={() => setShowAddMenu(false)}
        />
      )}

      {showAddNote && (
        <AddNoteModal
          note={editingNote}
          menus={module.menus || []}
          preSelectedMenuId={preSelectedMenuId}
          onConfirm={editingNote ? updateNote : addNote}
          onClose={handleCloseNoteModal}
        />
      )}

      {showAddDocument && (
        <AddDocumentModal
          menus={module.menus || []}
          onConfirm={addDocument}
          onClose={() => setShowAddDocument(false)}
        />
      )}

      {showAddImage && (
        <AddImageModal
          menus={module.menus || []}
          onConfirm={addImage}
          onClose={handleCloseImageModal}
        />
      )}

      {showImageGallery && (
        <ImageGalleryModal
          images={galleryImages}
          title={galleryTitle}
          initialIndex={galleryInitialIndex}
          onClose={() => setShowImageGallery(false)}
        />
      )}
    </div>
  );
}