import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ModuleCard } from './components/ModuleCard';
import { ModuleNumberSelector } from './components/ModuleNumberSelector';
import bgImage1 from 'figma:asset/5c373baf6be010d4f463bf10a74dcb4684ffb8c7.png';
import bgImage2 from 'figma:asset/eb0f108d06168001275b8ea3d04d983c7eca866f.png';

export interface MenuItem {
  id: string;
  name: string;
  type: 'menu' | 'submenu' | 'menuType' | 'submenuType';
  items?: MenuItem[];
  developmentStatus?: 'not-started' | 'in-progress' | 'completed' | 'testing' | 'on-hold';
}

export interface Note {
  id: string;
  date: string;
  author: string;
  content: string;
  menuId?: string; // ID do menu vinculado (undefined = Geral)
  menuName?: string; // Nome do menu para exibição
  submenuId?: string; // ID do submenu vinculado (undefined = apenas menu)
  submenuName?: string; // Nome do submenu para exibição
  typeId?: string; // ID do tipo vinculado (undefined = não é tipo)
  typeName?: string; // Nome do tipo para exibição
}

export interface Image {
  id: string;
  url: string;
  name: string;
  folder: string; // Mantido para compatibilidade
  menuId?: string; // ID do menu vinculado (undefined = Geral)
  menuName?: string; // Nome do menu para exibição
  submenuId?: string; // ID do submenu vinculado (undefined = apenas menu)
  submenuName?: string; // Nome do submenu para exibição
  typeId?: string; // ID do tipo vinculado (undefined = não é tipo)
  typeName?: string; // Nome do tipo para exibição
  description?: string; // Descrição opcional da imagem
}

export interface ImageFolder {
  id: string;
  name: string;
  images: Image[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  menuId?: string; // ID do menu vinculado (undefined = Geral)
  menuName?: string; // Nome do menu para exibição
  submenuId?: string; // ID do submenu vinculado (undefined = apenas menu)
  submenuName?: string; // Nome do submenu para exibição
  typeId?: string; // ID do tipo vinculado (undefined = não é tipo)
  typeName?: string; // Nome do tipo para exibição
}

export interface Module {
  id: string;
  name: string;
  color: string;
  menus: MenuItem[];
  notes?: Note[];
  images?: Image[]; // Lista simples de imagens
  documents?: Document[];
}

const initialModules: Module[] = [
  {
    id: 'm1',
    name: 'Cadastros',
    color: 'from-blue-600 to-blue-700',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu1',
        name: 'Acessos',
        type: 'menu',
        items: [
          { id: 'sub1', name: 'Usuário', type: 'submenu' },
          { id: 'sub2', name: 'Perfil', type: 'submenu' },
          { id: 'sub3', name: 'Permissão', type: 'submenu' },
          { id: 'sub4', name: 'Programa', type: 'submenu' }
        ]
      },
      {
        id: 'menu2',
        name: 'Pessoas (PF/PJ)',
        type: 'menu',
        items: [
          { id: 'type1', name: 'Motorista', type: 'menuType' },
          { id: 'type2', name: 'Funcionário', type: 'menuType' },
          { id: 'type3', name: 'Cliente', type: 'menuType' },
          { id: 'type4', name: 'Fornecedor', type: 'menuType' }
        ]
      },
      {
        id: 'menu3',
        name: 'Clientes & Contratos',
        type: 'menu',
        items: [
          { id: 'sub5', name: 'Produtos', type: 'submenu' },
          { id: 'sub6', name: 'Tipos de Operação', type: 'submenu' },
          { id: 'sub7', name: 'Regras por Operação e Cliente', type: 'submenu' },
          { id: 'sub8', name: 'Grupo de pessoas', type: 'submenu' }
        ]
      },
      {
        id: 'menu4',
        name: 'Rotas & Corredores',
        type: 'menu',
        items: [
          { id: 'sub9', name: 'Rotas', type: 'submenu', items: [
            { id: 'type5', name: 'Rotas Tronco', type: 'submenuType' },
            { id: 'type6', name: 'Rotas complementares', type: 'submenuType' }
          ]},
          { id: 'sub10', name: 'Checkpoints', type: 'submenu' }
        ]
      },
      {
        id: 'menu5',
        name: 'Referências',
        type: 'menu',
        items: [
          { id: 'sub11', name: 'Aduanas', type: 'submenu' },
          { id: 'sub12', name: 'Geometrias', type: 'submenu' },
          { id: 'sub13', name: 'Postos de Abastecimento', type: 'submenu' }
        ]
      },
      {
        id: 'menu6',
        name: 'Endereço',
        type: 'menu',
        items: [
          { id: 'sub14', name: 'País', type: 'submenu' },
          { id: 'sub15', name: 'Estado', type: 'submenu' },
          { id: 'sub16', name: 'Cidade', type: 'submenu' }
        ]
      },
      {
        id: 'menu7',
        name: 'Comercial',
        type: 'menu',
        items: [
          { id: 'sub17', name: 'Tabela de Frete', type: 'submenu', items: [
            { id: 'type7', name: 'Nacional', type: 'submenuType' },
            { id: 'type8', name: 'Internacional', type: 'submenuType' },
            { id: 'type9', name: 'Dedicados', type: 'submenuType' },
            { id: 'type10', name: 'Fracionado', type: 'submenuType' },
            { id: 'type11', name: 'Armazém', type: 'submenuType' },
            { id: 'type12', name: 'Container', type: 'submenuType' },
            { id: 'type13', name: 'Estadias', type: 'submenuType' }
          ]},
          { id: 'sub18', name: 'Simulador de Custos', type: 'submenu' },
          { id: 'sub19', name: 'SLA Cliente (meta de cargas)', type: 'submenu' },
          { id: 'sub20', name: 'Comparativo de Tabelas x Custo', type: 'submenu' }
        ]
      },
      {
        id: 'menu8',
        name: 'Centros de Resultado',
        type: 'menu'
      },
      {
        id: 'menu9',
        name: 'Torre',
        type: 'menu',
        items: [
          { id: 'sub21', name: 'Vínculo Torre', type: 'submenu' },
          { id: 'sub22', name: 'Meta Torre', type: 'submenu' },
          { id: 'sub23', name: 'Montagem de Conjunto', type: 'submenu' }
        ]
      },
      {
        id: 'menu10',
        name: 'Veículos (cavalos, carretas, veículos de passeio)',
        type: 'menu',
        items: [
          { id: 'sub24', name: 'Equipamentos', type: 'submenu', items: [
            { id: 'type14', name: 'Rastreadores', type: 'submenuType' },
            { id: 'type15', name: 'Câmeras', type: 'submenuType' },
            { id: 'type16', name: 'Refrigeradores', type: 'submenuType' }
          ]}
        ]
      }
    ]
  },
  {
    id: 'm2',
    name: 'Governança',
    color: 'from-blue-500 to-blue-600',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu11',
        name: 'Regras',
        type: 'menu',
        items: [
          { id: 'sub25', name: 'Regras de produtos', type: 'submenu' },
          { id: 'sub26', name: 'Regras para planejamento', type: 'submenu' },
          { id: 'sub27', name: 'Regras de agregamento', type: 'submenu' },
          { id: 'sub28', name: 'Regras de tabelas de agregado', type: 'submenu' },
          { id: 'sub29', name: 'Regras de tabelas de terceiro', type: 'submenu' },
          { id: 'sub30', name: 'Regras lógicas', type: 'submenu' },
          { id: 'sub31', name: 'Regras de senhas', type: 'submenu' },
          { id: 'sub32', name: 'Regras de compras', type: 'submenu' },
          { id: 'sub33', name: 'Regras de hierarquização', type: 'submenu' }
        ]
      },
      {
        id: 'menu12',
        name: 'Qualidade & OEA',
        type: 'menu',
        items: [
          { id: 'sub34', name: 'Requisitos', type: 'submenu' },
          { id: 'sub35', name: 'Checklists', type: 'submenu' },
          { id: 'sub36', name: 'Não Conformidades', type: 'submenu' }
        ]
      }
    ]
  },
  {
    id: 'm3',
    name: 'Gestão de Frota',
    color: 'from-blue-700 to-blue-800',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu13',
        name: 'Manutenção',
        type: 'menu',
        items: [
          { id: 'sub37', name: 'Ordem de serviço (gera ordem de compra)', type: 'submenu' }
        ]
      },
      {
        id: 'menu14',
        name: 'Indicadores de Frota (custo/km, TCO)',
        type: 'menu'
      },
      {
        id: 'menu15',
        name: 'Pneus',
        type: 'menu'
      },
      {
        id: 'menu16',
        name: 'Relatório',
        type: 'menu'
      }
    ]
  },
  {
    id: 'm4',
    name: 'Agregados e Terceiros',
    color: 'from-sky-600 to-sky-700',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu17',
        name: 'Contrato de agregamento',
        type: 'menu'
      },
      {
        id: 'menu18',
        name: 'Viagens Realizadas',
        type: 'menu'
      },
      {
        id: 'menu19',
        name: 'Performance',
        type: 'menu'
      },
      {
        id: 'menu20',
        name: 'Ofertas terceiros',
        type: 'menu'
      },
      {
        id: 'menu21',
        name: 'Ofertas pedidos internos',
        type: 'menu'
      },
      {
        id: 'menu22',
        name: 'Pagamentos',
        type: 'menu'
      },
      {
        id: 'menu23',
        name: 'Relatório',
        type: 'menu'
      }
    ]
  },
  {
    id: 'm5',
    name: 'Gestão de Motoristas',
    color: 'from-blue-600 to-cyan-600',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu24',
        name: 'Integração HCM',
        type: 'menu'
      },
      {
        id: 'menu25',
        name: 'Documentação',
        type: 'menu'
      },
      {
        id: 'menu26',
        name: 'Eventos & Ocorrências',
        type: 'menu',
        items: [
          { id: 'sub38', name: 'Multas', type: 'submenu' },
          { id: 'sub39', name: 'Sinistros', type: 'submenu' },
          { id: 'sub40', name: 'Violações', type: 'submenu' },
          { id: 'sub41', name: 'Mensagens Autotrac', type: 'submenu' },
          { id: 'sub42', name: 'Histórico de programações enviadas', type: 'submenu' }
        ]
      },
      {
        id: 'menu27',
        name: 'Acerto de Viagem',
        type: 'menu'
      },
      {
        id: 'menu28',
        name: 'Jornada',
        type: 'menu',
        items: [
          { id: 'sub43', name: 'Programação do condutor', type: 'submenu' }
        ]
      },
      {
        id: 'menu29',
        name: 'Relatório',
        type: 'menu'
      }
    ]
  },
  {
    id: 'm6',
    name: 'Gestão de Cargas',
    color: 'from-sky-700 to-blue-800',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu30',
        name: 'Pedidos',
        type: 'menu',
        items: [
          { id: 'sub44', name: 'Alocação de cargas', type: 'submenu' }
        ]
      },
      {
        id: 'menu31',
        name: 'Cargas',
        type: 'menu'
      },
      {
        id: 'menu32',
        name: 'Planejamento de Viagem',
        type: 'menu'
      },
      {
        id: 'menu33',
        name: 'Plano de Viagem (envio ao motorista)',
        type: 'menu'
      },
      {
        id: 'menu34',
        name: 'Viagens em Andamento',
        type: 'menu'
      },
      {
        id: 'menu35',
        name: 'Finalização de Viagem',
        type: 'menu'
      },
      {
        id: 'menu36',
        name: 'Deslocamento Vazio (autorizações)',
        type: 'menu'
      },
      {
        id: 'menu37',
        name: 'Relatório',
        type: 'menu'
      },
      {
        id: 'menu38',
        name: 'CSC',
        type: 'menu',
        items: [
          { id: 'sub45', name: 'Devoluções', type: 'submenu' },
          { id: 'sub46', name: 'Pallets', type: 'submenu' },
          { id: 'sub47', name: 'Comprovantes (POD)', type: 'submenu' },
          { id: 'sub48', name: 'Estadias', type: 'submenu' }
        ]
      }
    ]
  },
  {
    id: 'm7',
    name: 'Control Tower',
    color: 'from-blue-800 to-blue-900',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu39',
        name: 'Tracking',
        type: 'menu',
        items: [
          { id: 'sub49', name: 'Linha do Tempo', type: 'submenu' }
        ]
      },
      {
        id: 'menu40',
        name: 'Advertências',
        type: 'menu'
      },
      {
        id: 'menu41',
        name: 'Relatório',
        type: 'menu'
      },
      {
        id: 'menu42',
        name: 'Central de Alertas',
        type: 'menu'
      },
      {
        id: 'menu43',
        name: 'Indicadores e performance',
        type: 'menu'
      }
    ]
  },
  {
    id: 'm8',
    name: 'BI',
    color: 'from-cyan-700 to-blue-700',
    notes: [],
    images: [],
    documents: [],
    menus: [
      {
        id: 'menu44',
        name: 'Dashboard Operacional',
        type: 'menu'
      },
      {
        id: 'menu45',
        name: 'Custo por Viagem',
        type: 'menu'
      },
      {
        id: 'menu46',
        name: 'DRE por',
        type: 'menu',
        items: [
          { id: 'sub50', name: 'Cliente', type: 'submenu' },
          { id: 'sub51', name: 'Rota', type: 'submenu' },
          { id: 'sub52', name: 'Veículo', type: 'submenu' },
          { id: 'sub53', name: 'Motorista', type: 'submenu' },
          { id: 'sub54', name: 'Parceiro', type: 'submenu' }
        ]
      },
      {
        id: 'menu47',
        name: 'Planejado × Realizado',
        type: 'menu'
      }
    ]
  }
];

export default function App() {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [showNumberSelector, setShowNumberSelector] = useState(false);
  const [selectedModuleForNumber, setSelectedModuleForNumber] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });

  const updateModule = (moduleId: string, updatedModule: Module) => {
    setModules(modules.map(m => m.id === moduleId ? updatedModule : m));
  };

  const moveModule = (fromIndex: number, toIndex: number) => {
    // Validações para evitar erros
    if (fromIndex < 0 || fromIndex >= modules.length || toIndex < 0 || toIndex >= modules.length) {
      console.warn('Invalid indices:', { fromIndex, toIndex, modulesLength: modules.length });
      return;
    }
    if (fromIndex === toIndex) {
      return;
    }
    
    setModules(prevModules => {
      const newModules = [...prevModules];
      // Troca direta (swap) - módulo A vai para posição de B, B vai para posição de A
      const temp = newModules[fromIndex];
      newModules[fromIndex] = newModules[toIndex];
      newModules[toIndex] = temp;
      return newModules;
    });
  };

  const handleNumberClick = (moduleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectorPosition({ x: rect.left, y: rect.bottom + 5 });
    setSelectedModuleForNumber(moduleId);
    setShowNumberSelector(true);
  };

  const handleNumberSelect = (targetIndex: number) => {
    if (selectedModuleForNumber) {
      const currentIndex = modules.findIndex(m => m.id === selectedModuleForNumber);
      if (currentIndex !== -1 && targetIndex !== currentIndex) {
        // Faz a troca (swap) entre o módulo atual e o módulo na posição selecionada
        moveModule(currentIndex, targetIndex);
      }
    }
    setShowNumberSelector(false);
    setSelectedModuleForNumber(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full relative overflow-hidden font-sans">
        {/* Background Images */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${bgImage2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div 
            className="absolute top-0 right-0 w-1/2 h-full opacity-20"
            style={{
              backgroundImage: `url(${bgImage1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-cyan-900/40" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4">
          <div className="max-w-[1850px] mx-auto">
            <div className="text-center mb-4 animate-fade-in">
              {/* ONE Logo */}
              <div className="inline-block mb-3 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 rounded-2xl"></div>
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 px-12 py-2.5 rounded-xl shadow-2xl relative overflow-hidden border-2 border-white/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                  <h2 className="text-4xl text-white relative z-10 tracking-[0.3em] font-black drop-shadow-2xl">
                    ONE
                  </h2>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-fast" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white mb-1.5 drop-shadow-2xl tracking-wide leading-tight">
                Sistema de Gestão Logística
              </h1>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                <p className="text-base text-cyan-100 drop-shadow-lg font-light tracking-wider">
                  Hub de Soluções Integradas
                </p>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {modules.filter(m => m && m.id).map((module) => {
                const originalIndex = modules.findIndex(m => m && m.id === module.id);
                return (
                  <ModuleCard 
                    key={module.id}
                    module={module}
                    index={originalIndex}
                    onUpdateModule={updateModule}
                    onNumberClick={handleNumberClick}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Number Selector Modal */}
        {showNumberSelector && (
          <ModuleNumberSelector
            currentModuleId={selectedModuleForNumber!}
            modules={modules}
            position={selectorPosition}
            onSelect={handleNumberSelect}
            onClose={() => setShowNumberSelector(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}