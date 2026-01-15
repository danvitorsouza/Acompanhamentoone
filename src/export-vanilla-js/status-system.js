/**
 * ONE - Sistema de Gestão Logística
 * Sistema de Status de Desenvolvimento
 * Versão Javascript Vanilla (sem React)
 */

class DevelopmentStatusSystem {
  constructor() {
    this.statusConfig = {
      'not-started': {
        label: 'Não Iniciado',
        color: 'bg-gray-300 text-gray-700',
        hoverColor: 'hover:bg-gray-400',
        emoji: '⚪'
      },
      'in-progress': {
        label: 'Em Progresso',
        color: 'bg-yellow-400 text-white',
        hoverColor: 'hover:bg-yellow-500',
        emoji: '🟡'
      },
      'testing': {
        label: 'Em Testes',
        color: 'bg-blue-400 text-white',
        hoverColor: 'hover:bg-blue-500',
        emoji: '🔵'
      },
      'completed': {
        label: 'Concluído',
        color: 'bg-green-400 text-white',
        hoverColor: 'hover:bg-green-500',
        emoji: '🟢'
      },
      'on-hold': {
        label: 'Pausado',
        color: 'bg-purple-400 text-white',
        hoverColor: 'hover:bg-purple-500',
        emoji: '🟣'
      }
    };
    
    this.items = {}; // { itemId: { status: 'in-progress', ... } }
    this.init();
  }

  init() {
    // Adicionar listeners a todos os números de ordenação
    document.addEventListener('click', (e) => {
      const statusButton = e.target.closest('.status-number-btn');
      if (statusButton) {
        const itemId = statusButton.dataset.itemId;
        this.openModal(itemId);
      }
    });
  }

  // Criar botão de número com status
  createStatusButton(itemNumber, itemId, currentStatus = null) {
    const status = this.items[itemId]?.status || currentStatus;
    const config = status ? this.statusConfig[status] : null;
    
    const colorClass = config 
      ? `${config.color} ${config.hoverColor}`
      : 'bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400';
    
    return `
      <button 
        type="button"
        class="status-number-btn flex-shrink-0 text-[10px] font-bold min-w-[28px] h-5 flex items-center justify-center rounded-full transition-all duration-200 ${colorClass}"
        data-item-id="${itemId}"
        title="Clique para alterar status de desenvolvimento"
      >
        ${itemNumber}
      </button>
    `;
  }

  // Criar emoji visual
  createStatusEmoji(itemId, currentStatus = null) {
    const status = this.items[itemId]?.status || currentStatus;
    if (!status) return '';
    
    const config = this.statusConfig[status];
    return `
      <span class="flex-shrink-0 text-sm" title="${config.label}">
        ${config.emoji}
      </span>
    `;
  }

  // Abrir modal de seleção
  openModal(itemId) {
    const currentStatus = this.items[itemId]?.status;
    
    const modalHtml = `
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4" id="status-modal">
        <div class="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border-2 border-blue-300">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="text-white font-semibold text-sm">Status de Desenvolvimento</h3>
            </div>
            <button type="button" class="close-modal text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-3 space-y-2">
            <div class="space-y-1.5">
              ${Object.entries(this.statusConfig).map(([value, config]) => {
                const isActive = currentStatus === value;
                return `
                  <button
                    type="button"
                    class="status-option w-full p-2 rounded-md border-2 transition-all text-left flex items-center gap-2.5 ${
                      isActive
                        ? 'border-blue-400 bg-blue-100 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }"
                    data-status="${value}"
                  >
                    <span class="text-base">${config.emoji}</span>
                    <span class="font-medium text-xs text-gray-700 flex-1">
                      ${config.label}
                    </span>
                    ${isActive ? '<span class="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Atual</span>' : ''}
                  </button>
                `;
              }).join('')}
            </div>

            ${currentStatus ? `
              <button
                type="button"
                class="remove-status w-full p-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium border border-transparent hover:border-red-200"
              >
                Remover Status
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Event listeners
    const modal = document.getElementById('status-modal');
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
      this.closeModal();
    });

    modal.querySelectorAll('.status-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.status;
        this.setStatus(itemId, status);
        this.closeModal();
      });
    });

    const removeBtn = modal.querySelector('.remove-status');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.removeStatus(itemId);
        this.closeModal();
      });
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Close on ESC
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  closeModal() {
    const modal = document.getElementById('status-modal');
    if (modal) {
      modal.remove();
    }
  }

  setStatus(itemId, status) {
    this.items[itemId] = { status };
    this.updateUI(itemId);
    this.saveToServer(itemId, status);
  }

  removeStatus(itemId) {
    delete this.items[itemId];
    this.updateUI(itemId);
    this.saveToServer(itemId, null);
  }

  updateUI(itemId) {
    // Atualizar botão de número
    const button = document.querySelector(`[data-item-id="${itemId}"]`);
    if (button) {
      const itemNumber = button.textContent;
      button.outerHTML = this.createStatusButton(itemNumber, itemId);
    }

    // Atualizar emoji
    const emojiContainer = document.getElementById(`emoji-${itemId}`);
    if (emojiContainer) {
      emojiContainer.innerHTML = this.createStatusEmoji(itemId);
    }
  }

  // Salvar no servidor (adaptar para seu backend PHP)
  saveToServer(itemId, status) {
    fetch('/api/save-status.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId: itemId,
        status: status
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Status salvo:', data);
    })
    .catch(error => {
      console.error('Erro ao salvar status:', error);
    });
  }

  // Carregar do servidor
  loadFromServer() {
    fetch('/api/get-statuses.php')
      .then(response => response.json())
      .then(data => {
        this.items = data;
        Object.keys(data).forEach(itemId => {
          this.updateUI(itemId);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar status:', error);
      });
  }
}

// Inicializar sistema
const statusSystem = new DevelopmentStatusSystem();
statusSystem.loadFromServer();

// Exportar para uso global
window.DevelopmentStatusSystem = DevelopmentStatusSystem;
window.statusSystem = statusSystem;
