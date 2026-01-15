import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { Image } from '../App';
import { ImageItem } from './ImageItem';

interface ImageGroupProps {
  menuName: string;
  images: Image[];
  subGroups?: { 
    [submenuId: string]: { 
      submenuName: string; 
      images: Image[]; 
      typeGroups?: { 
        [typeId: string]: { 
          typeName: string; 
          images: Image[] 
        } 
      } 
    } 
  };
  onView: (image: Image) => void;
  onDelete: (imageId: string) => void;
  onPlaySlideshow: (images: Image[], title: string) => void;
  isGeneral?: boolean;
}

export function ImageGroup({ 
  menuName, 
  images, 
  subGroups, 
  onView, 
  onDelete, 
  onPlaySlideshow, 
  isGeneral = false 
}: ImageGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSubmenus, setExpandedSubmenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = useCallback((submenuId: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [submenuId]: !prev[submenuId]
    }));
  }, []);

  // Verificar se há conteúdo
  const hasContent = useMemo(() => {
    return images.length > 0 || (subGroups && Object.keys(subGroups).length > 0);
  }, [images, subGroups]);

  // Coletar TODAS as imagens do menu (incluindo submenus e tipos) - MEMOIZADO
  const allMenuImages = useMemo(() => {
    const allImages: Image[] = [...images];
    
    if (subGroups) {
      Object.values(subGroups).forEach(subGroup => {
        allImages.push(...subGroup.images);
        
        if (subGroup.typeGroups) {
          Object.values(subGroup.typeGroups).forEach(typeGroup => {
            allImages.push(...typeGroup.images);
          });
        }
      });
    }
    
    return allImages;
  }, [images, subGroups]);

  const handlePlayAll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaySlideshow(allMenuImages, `${menuName} (Completo)`);
  }, [allMenuImages, menuName, onPlaySlideshow]);

  if (!hasContent) return null;

  return (
    <div className={`border rounded-lg overflow-hidden ${
      isGeneral 
        ? 'border-gray-200 bg-gray-50' 
        : 'border-blue-200 bg-blue-50'
    }`}>
      {/* Header do Grupo */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
        className={`w-full px-3 py-2 flex items-center justify-between ${
          isGeneral
            ? 'bg-gray-100 hover:bg-gray-200'
            : 'bg-blue-100 hover:bg-blue-200'
        } transition-colors`}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
          <span className={`text-sm font-semibold ${
            isGeneral ? 'text-gray-700' : 'text-blue-700'
          }`}>
            {isGeneral ? '🖼️' : '📁'} {menuName}
          </span>
          <span className="text-xs text-gray-500">
            ({allMenuImages.length})
          </span>
        </div>
        
        {/* Botão Play para todo o menu */}
        {allMenuImages.length > 0 && (
          <button
            onClick={handlePlayAll}
            type="button"
            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-all hover:scale-110"
            title={`Apresentar todas as ${allMenuImages.length} imagens de ${menuName}`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </button>

      {/* Conteúdo */}
      {isExpanded && (
        <div className="p-2 space-y-2">
          {/* Imagens diretas do menu */}
          {images.length > 0 && (
            <div className="space-y-1">
              {images.map((image) => (
                <ImageItem
                  key={image.id}
                  image={image}
                  onView={onView}
                  onDelete={onDelete}
                  level={isGeneral ? 'general' : 'menu'}
                />
              ))}
            </div>
          )}

          {/* Submenus */}
          {subGroups && Object.entries(subGroups).map(([submenuId, subGroup]) => {
            const isSubmenuExpanded = expandedSubmenus[submenuId] ?? true;
            
            // Coletar imagens do submenu + tipos - INLINE
            const allSubmenuImages = useMemo(() => {
              const submenuImages: Image[] = [...subGroup.images];
              
              if (subGroup.typeGroups) {
                Object.values(subGroup.typeGroups).forEach(typeGroup => {
                  submenuImages.push(...typeGroup.images);
                });
              }
              
              return submenuImages;
            }, [subGroup]);
            
            return (
              <div key={submenuId} className="border-l-2 border-indigo-300 pl-2 ml-2">
                {/* Header do Submenu */}
                <button
                  onClick={() => toggleSubmenu(submenuId)}
                  type="button"
                  className="w-full px-2 py-1.5 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isSubmenuExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                    )}
                    <span className="text-xs font-semibold text-indigo-700">
                      📂 {subGroup.submenuName}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({allSubmenuImages.length})
                    </span>
                  </div>
                  
                  {/* Botão Play para submenu completo */}
                  {allSubmenuImages.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaySlideshow(allSubmenuImages, `${menuName} › ${subGroup.submenuName} (Completo)`);
                      }}
                      type="button"
                      className="p-1 bg-green-500 hover:bg-green-600 text-white rounded transition-all hover:scale-110"
                      title={`Apresentar todas as ${allSubmenuImages.length} imagens de ${subGroup.submenuName}`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  )}
                </button>

                {/* Imagens do submenu */}
                {isSubmenuExpanded && (
                  <div className="mt-1 space-y-1">
                    {subGroup.images.map((image) => (
                      <ImageItem
                        key={image.id}
                        image={image}
                        onView={onView}
                        onDelete={onDelete}
                        level="submenu"
                      />
                    ))}

                    {/* Tipos do submenu */}
                    {subGroup.typeGroups && Object.entries(subGroup.typeGroups).map(([typeId, typeGroup]) => (
                      <div key={typeId} className="border-l-2 border-purple-300 pl-2 ml-2 mt-1">
                        <div className="px-2 py-1.5 bg-purple-50 rounded flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-purple-700">
                              💜 T {typeGroup.typeName}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({typeGroup.images.length})
                            </span>
                          </div>
                          
                          {/* Botão Play para tipo */}
                          {typeGroup.images.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPlaySlideshow(typeGroup.images, `${menuName} › ${subGroup.submenuName} › T ${typeGroup.typeName}`);
                              }}
                              type="button"
                              className="p-1 bg-green-500 hover:bg-green-600 text-white rounded transition-all hover:scale-110"
                              title={`Apresentar ${typeGroup.images.length} imagens do tipo ${typeGroup.typeName}`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          )}
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          {typeGroup.images.map((image) => (
                            <ImageItem
                              key={image.id}
                              image={image}
                              onView={onView}
                              onDelete={onDelete}
                              level="type"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
