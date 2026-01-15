<?php
/**
 * ONE - Sistema de Gestão Logística
 * API para salvar status de desenvolvimento
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Permitir OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Receber dados JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['itemId'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Dados inválidos'
    ]);
    exit;
}

$itemId = $data['itemId'];
$status = $data['status'] ?? null;

// Arquivo de armazenamento (substitua por banco de dados em produção)
$storageFile = __DIR__ . '/../../data/status-data.json';

// Criar diretório se não existir
if (!file_exists(dirname($storageFile))) {
    mkdir(dirname($storageFile), 0755, true);
}

// Carregar dados existentes
$existingData = [];
if (file_exists($storageFile)) {
    $existingData = json_decode(file_get_contents($storageFile), true) ?? [];
}

// Atualizar ou remover status
if ($status === null) {
    // Remover status
    unset($existingData[$itemId]);
} else {
    // Adicionar/Atualizar status
    $existingData[$itemId] = [
        'status' => $status,
        'updated_at' => date('Y-m-d H:i:s'),
        'updated_by' => $_SERVER['REMOTE_ADDR'] // Trocar por ID do usuário em produção
    ];
}

// Salvar no arquivo
$saved = file_put_contents(
    $storageFile, 
    json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

if ($saved === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao salvar dados'
    ]);
    exit;
}

// Retornar sucesso
echo json_encode([
    'success' => true,
    'message' => 'Status salvo com sucesso',
    'data' => [
        'itemId' => $itemId,
        'status' => $status
    ]
]);

/**
 * INTEGRAÇÃO COM BANCO DE DADOS MySQL
 * Descomente e adapte o código abaixo:
 */

/*
// Conexão com banco de dados
$host = 'localhost';
$dbname = 'one_sistema';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if ($status === null) {
        // Remover status
        $stmt = $pdo->prepare("DELETE FROM item_status WHERE item_id = ?");
        $stmt->execute([$itemId]);
    } else {
        // Verificar se já existe
        $stmt = $pdo->prepare("SELECT id FROM item_status WHERE item_id = ?");
        $stmt->execute([$itemId]);
        $exists = $stmt->fetch();
        
        if ($exists) {
            // Atualizar
            $stmt = $pdo->prepare("
                UPDATE item_status 
                SET status = ?, updated_at = NOW() 
                WHERE item_id = ?
            ");
            $stmt->execute([$status, $itemId]);
        } else {
            // Inserir
            $stmt = $pdo->prepare("
                INSERT INTO item_status (item_id, status, created_at, updated_at) 
                VALUES (?, ?, NOW(), NOW())
            ");
            $stmt->execute([$itemId, $status]);
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Status salvo no banco de dados'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
*/
?>
