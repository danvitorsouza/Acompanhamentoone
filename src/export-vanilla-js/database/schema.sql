-- =============================================
-- ONE - Sistema de Gestão Logística
-- Schema do Banco de Dados para Status
-- =============================================

-- Criar database (se não existir)
CREATE DATABASE IF NOT EXISTS one_sistema 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE one_sistema;

-- =============================================
-- Tabela: item_status
-- Armazena os status de desenvolvimento de cada item
-- =============================================
CREATE TABLE IF NOT EXISTS item_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('not-started', 'in-progress', 'testing', 'completed', 'on-hold') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100) DEFAULT NULL,
    
    INDEX idx_item_id (item_id),
    INDEX idx_status (status),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: modules
-- Armazena os módulos do sistema
-- =============================================
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_number INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_module_number (module_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: menu_items
-- Armazena todos os menus, submenus e tipos
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(100) PRIMARY KEY,
    module_id INT NOT NULL,
    parent_id VARCHAR(100) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('menu', 'submenu', 'menuType', 'submenuType') NOT NULL,
    order_index INT DEFAULT 0,
    development_status ENUM('not-started', 'in-progress', 'testing', 'completed', 'on-hold') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    
    INDEX idx_module_id (module_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_type (type),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: notes
-- Armazena as notas vinculadas aos itens
-- =============================================
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    color VARCHAR(50) DEFAULT 'yellow',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_menu_item (menu_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: images
-- Armazena as imagens vinculadas aos itens
-- =============================================
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    upload_method ENUM('url', 'upload', 'screenshot') DEFAULT 'url',
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_menu_item (menu_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: documents
-- Armazena os documentos vinculados aos itens
-- =============================================
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_menu_item (menu_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Inserir dados iniciais dos módulos
-- =============================================
INSERT INTO modules (module_number, name, description, icon, color) VALUES
(1, 'Cadastros', 'Gestão de cadastros básicos do sistema', 'Database', 'blue'),
(2, 'Governanças', 'Políticas e regras de governança', 'Shield', 'purple'),
(3, 'Gestão de Frota', 'Controle e gestão de veículos', 'Truck', 'green'),
(4, 'Agregados e Terceiros', 'Gestão de parceiros externos', 'Users', 'orange'),
(5, 'Gestão de Motoristas', 'Controle de motoristas', 'UserCircle', 'cyan'),
(6, 'Gestão de Cargas', 'Operações de carga e descarga', 'Package', 'red'),
(7, 'Control Tower', 'Central de monitoramento', 'Monitor', 'indigo'),
(8, 'BI', 'Business Intelligence e Relatórios', 'BarChart', 'pink')
ON DUPLICATE KEY UPDATE name=name;

-- =============================================
-- Views úteis
-- =============================================

-- View: Contagem de status por módulo
CREATE OR REPLACE VIEW v_module_status_count AS
SELECT 
    m.id as module_id,
    m.name as module_name,
    mi.development_status,
    COUNT(*) as count
FROM modules m
LEFT JOIN menu_items mi ON m.id = mi.module_id
GROUP BY m.id, m.name, mi.development_status;

-- View: Progresso geral do sistema
CREATE OR REPLACE VIEW v_system_progress AS
SELECT 
    development_status,
    COUNT(*) as total,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM menu_items WHERE development_status IS NOT NULL), 2) as percentage
FROM menu_items
WHERE development_status IS NOT NULL
GROUP BY development_status;

-- =============================================
-- Stored Procedures
-- =============================================

DELIMITER //

-- Procedure: Atualizar status de um item
CREATE PROCEDURE sp_update_item_status(
    IN p_item_id VARCHAR(100),
    IN p_status VARCHAR(50),
    IN p_user VARCHAR(100)
)
BEGIN
    UPDATE menu_items 
    SET development_status = p_status,
        updated_at = NOW()
    WHERE id = p_item_id;
    
    -- Log da alteração (criar tabela de log se necessário)
    -- INSERT INTO status_history (item_id, status, changed_by, changed_at) 
    -- VALUES (p_item_id, p_status, p_user, NOW());
END //

-- Procedure: Obter estatísticas de um módulo
CREATE PROCEDURE sp_get_module_stats(
    IN p_module_id INT
)
BEGIN
    SELECT 
        development_status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (
            SELECT COUNT(*) 
            FROM menu_items 
            WHERE module_id = p_module_id 
            AND development_status IS NOT NULL
        ), 2) as percentage
    FROM menu_items
    WHERE module_id = p_module_id
    AND development_status IS NOT NULL
    GROUP BY development_status;
END //

DELIMITER ;

-- =============================================
-- Fim do Schema
-- =============================================
