import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface MenuItem {
  name: string;
  items?: string[];
}

interface Module {
  name: string;
  menus?: MenuItem[];
}

interface ModuleMenuProps {
  module: Module;
  isLast?: boolean;
}

export function ModuleMenu({ module, isLast }: ModuleMenuProps) {
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Set<number>>(new Set());

  const toggleMenu = (index: number) => {
    const newOpenMenus = new Set(openMenus);
    if (newOpenMenus.has(index)) {
      newOpenMenus.delete(index);
    } else {
      newOpenMenus.add(index);
    }
    setOpenMenus(newOpenMenus);
  };

  return (
    <div className={!isLast ? 'border-b border-slate-200' : ''}>
      {/* Module Header */}
      <button
        onClick={() => setIsModuleOpen(!isModuleOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
      >
        <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
          {module.name}
        </span>
        {module.menus && (
          <ChevronRight 
            className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all ${
              isModuleOpen ? 'rotate-90' : ''
            }`}
          />
        )}
      </button>

      {/* Menus */}
      {isModuleOpen && module.menus && (
        <div className="bg-slate-50/50">
          {module.menus.map((menu, menuIndex) => (
            <div key={menuIndex}>
              {/* Menu Header */}
              <button
                onClick={() => menu.items && toggleMenu(menuIndex)}
                className="w-full px-10 py-3 flex items-center justify-between hover:bg-white/60 transition-colors group text-left"
              >
                <span className="text-slate-700 group-hover:text-blue-600 transition-colors">
                  {menu.name}
                </span>
                {menu.items && (
                  openMenus.has(menuIndex) ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  )
                )}
              </button>

              {/* Menu Items */}
              {menu.items && openMenus.has(menuIndex) && (
                <div className="bg-white/40">
                  {menu.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      className="w-full px-16 py-2.5 text-left text-slate-600 hover:bg-white/80 hover:text-blue-600 transition-colors text-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
