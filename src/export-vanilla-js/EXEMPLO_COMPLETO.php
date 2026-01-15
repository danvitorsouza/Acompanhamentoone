<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ONE - Sistema de Gestão Logística</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-slideDown {
            animation: slideDown 0.2s ease-out;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white py-6 shadow-2xl">
        <div class="container mx-auto px-8">
            <h1 class="text-4xl font-bold mb-2">
                ONE - Sistema de Gestão Logística
            </h1>
            <p class="text-blue-100 text-sm">
                Apresentação Executiva para Diretoria
            </p>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-8 py-8">
        
        <!-- Grid de Módulos -->
        <div class="grid grid-cols-4 gap-6">
            
            <!-- MÓDULO 1 - CADASTROS -->
            <div class="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-blue-200 hover:shadow-3xl transition-all duration-300">
                <!-- Header do Módulo -->
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                        </svg>
                        <h2 class="font-bold text-sm">MÓDULO 1 - CADASTROS</h2>
                    </div>
                </div>

                <!-- Conteúdo do Módulo -->
                <div class="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                    
                    <!-- Menu 1.0 - Acessos -->
                    <div class="group">
                        <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 border border-transparent transition-all">
                            <!-- Número com Status - CLICÁVEL -->
                            <div id="number-menu-1-0"></div>
                            
                            <!-- Nome -->
                            <span class="flex-1 text-xs font-semibold text-slate-700">
                                Acessos
                            </span>
                            
                            <!-- Emoji Visual -->
                            <div id="emoji-menu-1-0"></div>
                        </div>

                        <!-- Submenus de Acessos -->
                        <div class="ml-3 space-y-1 mt-1">
                            <!-- 1.0.1 - Usuário -->
                            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100/50 hover:border-indigo-200 border border-transparent transition-all">
                                <div id="number-submenu-1-0-1"></div>
                                <span class="text-indigo-500 text-xs font-bold">•</span>
                                <span class="flex-1 text-xs text-slate-600">Usuário</span>
                                <div id="emoji-submenu-1-0-1"></div>
                            </div>

                            <!-- 1.0.2 - Perfil -->
                            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100/50 hover:border-indigo-200 border border-transparent transition-all">
                                <div id="number-submenu-1-0-2"></div>
                                <span class="text-indigo-500 text-xs font-bold">•</span>
                                <span class="flex-1 text-xs text-slate-600">Perfil</span>
                                <div id="emoji-submenu-1-0-2"></div>
                            </div>

                            <!-- 1.0.3 - Permissão -->
                            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100/50 hover:border-indigo-200 border border-transparent transition-all">
                                <div id="number-submenu-1-0-3"></div>
                                <span class="text-indigo-500 text-xs font-bold">•</span>
                                <span class="flex-1 text-xs text-slate-600">Permissão</span>
                                <div id="emoji-submenu-1-0-3"></div>
                            </div>

                            <!-- 1.0.4 - Programa -->
                            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100/50 hover:border-indigo-200 border border-transparent transition-all">
                                <div id="number-submenu-1-0-4"></div>
                                <span class="text-indigo-500 text-xs font-bold">•</span>
                                <span class="flex-1 text-xs text-slate-600">Programa</span>
                                <div id="emoji-submenu-1-0-4"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Menu 1.1 - Pessoas -->
                    <div class="group mt-4">
                        <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 border border-transparent transition-all">
                            <div id="number-menu-1-1"></div>
                            <span class="flex-1 text-xs font-semibold text-slate-700">Pessoas (PF/PJ)</span>
                            <div id="emoji-menu-1-1"></div>
                        </div>

                        <!-- Tipos de Pessoas -->
                        <div class="ml-3 space-y-1 mt-1">
                            <!-- T Motorista -->
                            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 hover:border-purple-200 border border-transparent transition-all">
                                <div id="number-type-1-1-1"></div>
                                <span class="text-purple-600 text-[11px] font-bold">T</span>
                                <span class="flex-1 text-xs text-slate-700">Motorista</span>
                                <div id="emoji-type-1-1-1"></div>
                            </div>

                            <!-- T Funcionário -->
                            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 hover:border-purple-200 border border-transparent transition-all">
                                <div id="number-type-1-1-2"></div>
                                <span class="text-purple-600 text-[11px] font-bold">T</span>
                                <span class="flex-1 text-xs text-slate-700">Funcionário</span>
                                <div id="emoji-type-1-1-2"></div>
                            </div>

                            <!-- T Cliente -->
                            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 hover:border-purple-200 border border-transparent transition-all">
                                <div id="number-type-1-1-3"></div>
                                <span class="text-purple-600 text-[11px] font-bold">T</span>
                                <span class="flex-1 text-xs text-slate-700">Cliente</span>
                                <div id="emoji-type-1-1-3"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- MÓDULO 2 - GOVERNANÇAS (Placeholder) -->
            <div class="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-purple-200 opacity-50">
                <div class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        <h2 class="font-bold text-sm">MÓDULO 2 - GOVERNANÇAS</h2>
                    </div>
                </div>
                <div class="p-4 text-center text-gray-400 text-xs">
                    Em desenvolvimento...
                </div>
            </div>

            <!-- MÓDULO 3 - GESTÃO DE FROTA (Placeholder) -->
            <div class="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-green-200 opacity-50">
                <div class="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                        </svg>
                        <h2 class="font-bold text-sm">MÓDULO 3 - GESTÃO DE FROTA</h2>
                    </div>
                </div>
                <div class="p-4 text-center text-gray-400 text-xs">
                    Em desenvolvimento...
                </div>
            </div>

            <!-- MÓDULO 4 - AGREGADOS (Placeholder) -->
            <div class="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-orange-200 opacity-50">
                <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-3">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <h2 class="font-bold text-sm">MÓDULO 4 - AGREGADOS</h2>
                    </div>
                </div>
                <div class="p-4 text-center text-gray-400 text-xs">
                    Em desenvolvimento...
                </div>
            </div>

        </div>

        <!-- Legenda -->
        <div class="mt-8 bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <h3 class="font-bold text-lg text-blue-900 mb-4">📊 Legenda de Status</h3>
            <div class="grid grid-cols-5 gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-base">⚪</span>
                    <span class="text-xs text-gray-700">Não Iniciado</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-base">🟡</span>
                    <span class="text-xs text-gray-700">Em Progresso</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-base">🔵</span>
                    <span class="text-xs text-gray-700">Em Testes</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-base">🟢</span>
                    <span class="text-xs text-gray-700">Concluído</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-base">🟣</span>
                    <span class="text-xs text-gray-700">Pausado</span>
                </div>
            </div>
            <p class="mt-4 text-xs text-gray-600">
                💡 <strong>Dica:</strong> Clique nos números de ordenação para alterar o status de desenvolvimento de cada item.
            </p>
        </div>
    </div>

    <!-- Importar Sistema de Status -->
    <script src="status-system.js"></script>

    <!-- Inicializar Botões -->
    <script>
        // Função helper para renderizar item
        function renderItem(numberId, emojiId, itemNumber, itemId, currentStatus = null) {
            document.getElementById(numberId).innerHTML = 
                statusSystem.createStatusButton(itemNumber, itemId, currentStatus);
            document.getElementById(emojiId).innerHTML = 
                statusSystem.createStatusEmoji(itemId, currentStatus);
        }

        // MÓDULO 1 - CADASTROS
        
        // Menu 1.0 - Acessos
        renderItem('number-menu-1-0', 'emoji-menu-1-0', '1.0', 'menu-1-0');
        
        // Submenus de Acessos
        renderItem('number-submenu-1-0-1', 'emoji-submenu-1-0-1', '1.0.1', 'submenu-1-0-1');
        renderItem('number-submenu-1-0-2', 'emoji-submenu-1-0-2', '1.0.2', 'submenu-1-0-2');
        renderItem('number-submenu-1-0-3', 'emoji-submenu-1-0-3', '1.0.3', 'submenu-1-0-3');
        renderItem('number-submenu-1-0-4', 'emoji-submenu-1-0-4', '1.0.4', 'submenu-1-0-4');
        
        // Menu 1.1 - Pessoas
        renderItem('number-menu-1-1', 'emoji-menu-1-1', '1.1', 'menu-1-1');
        
        // Tipos de Pessoas
        renderItem('number-type-1-1-1', 'emoji-type-1-1-1', '1.1.1', 'type-1-1-1');
        renderItem('number-type-1-1-2', 'emoji-type-1-1-2', '1.1.2', 'type-1-1-2');
        renderItem('number-type-1-1-3', 'emoji-type-1-1-3', '1.1.3', 'type-1-1-3');

        // Carregar status salvos
        statusSystem.loadFromServer();
    </script>

    <?php
    /**
     * INTEGRAÇÃO COM PHP
     * 
     * Você pode passar dados do PHP para o Javascript assim:
     */
    
    // Exemplo de dados vindos do banco
    $modulesData = [
        1 => ['name' => 'Cadastros', 'color' => 'blue'],
        2 => ['name' => 'Governanças', 'color' => 'purple'],
        // ...
    ];
    
    $savedStatuses = [
        'menu-1-0' => 'in-progress',
        'submenu-1-0-1' => 'completed',
        // ...
    ];
    ?>

    <script>
        // Dados do PHP disponíveis no Javascript
        window.phpData = {
            modules: <?php echo json_encode($modulesData); ?>,
            savedStatuses: <?php echo json_encode($savedStatuses); ?>
        };

        // Usar dados do PHP para inicializar
        // statusSystem.items = window.phpData.savedStatuses;
    </script>

</body>
</html>
