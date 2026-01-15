import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Image } from '../App';

interface ImageGalleryModalProps {
  images: Image[];
  initialIndex?: number;
  title: string;
  onClose: () => void;
}

export function ImageGalleryModal({ images, initialIndex = 0, title, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Proteção: garantir que initialIndex está no range
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < images.length) {
      setCurrentIndex(initialIndex);
    } else {
      setCurrentIndex(0);
    }
  }, [initialIndex, images.length]);

  const currentImage = images[currentIndex];

  // Funções de navegação memoizadas
  const goToNext = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, toggleFullscreen, onClose]);

  // Proteção: se não houver imagens
  if (!images || images.length === 0 || !currentImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col z-[200]">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">
            {currentIndex + 1} de {images.length} {images.length === 1 ? 'imagem' : 'imagens'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            type="button"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isFullscreen ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Área da imagem */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          {/* Botão anterior */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 z-10"
              title="Anterior (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Imagem principal */}
          <div className={`relative ${isFullscreen ? 'w-full h-full' : 'max-w-5xl max-h-full'}`}>
            <img
              src={currentImage.url}
              alt={currentImage.name}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImagem não encontrada%3C/text%3E%3C/svg%3E';
              }}
            />
            
            {/* Info da imagem */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <h4 className="text-white font-semibold text-lg">{currentImage.name}</h4>
              {currentImage.description && (
                <p className="text-gray-300 text-sm mt-1">{currentImage.description}</p>
              )}
              {(currentImage.menuName || currentImage.submenuName || currentImage.typeName) && (
                <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                  {currentImage.menuName && (
                    <span className="bg-blue-500/80 text-white px-2 py-1 rounded">
                      📁 {currentImage.menuName}
                    </span>
                  )}
                  {currentImage.submenuName && (
                    <span className="bg-indigo-500/80 text-white px-2 py-1 rounded">
                      📂 {currentImage.submenuName}
                    </span>
                  )}
                  {currentImage.typeName && (
                    <span className="bg-purple-500/80 text-white px-2 py-1 rounded">
                      💜 T {currentImage.typeName}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botão próximo */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 z-10"
              title="Próximo (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Barra lateral de miniaturas */}
        {!isFullscreen && images.length > 1 && (
          <div className="w-64 bg-gray-900 border-l border-white/10 overflow-y-auto custom-scrollbar p-4">
            <h4 className="text-white font-semibold text-sm mb-3">Todas as imagens</h4>
            <div className="space-y-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToIndex(index)}
                  type="button"
                  className={`w-full group relative overflow-hidden rounded-lg transition-all ${
                    index === currentIndex
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                      : 'hover:ring-2 hover:ring-white/30'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23555" width="200" height="150"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="12"%3EErro%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-xs font-medium truncate">
                      {image.name}
                    </p>
                  </div>
                  {index === currentIndex && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Atual
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer com atalhos */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-black border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <span>← → Navegar</span>
          <span>F Tela cheia</span>
          <span>ESC Fechar</span>
        </div>
      </div>
    </div>
  );
}
