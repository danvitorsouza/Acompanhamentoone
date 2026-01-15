<?php
/**
 * ONE - Sistema de Gestão Logística
 * API para carregar todos os status de desenvolvimento
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Permitir OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Arquivo de armazenamento
$storageFile = __DIR__ . '/../../data/status-data.json';

// Verificar se arquivo existe
if (!file_exists($storageFile)) {
    echo json_encode([]);
    exit;
}

// Carregar e retornar dados
$data = json_decode(file_get_contents($storageFile), true);

if ($data === null) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao ler dados'
    ]);
    exit;
}

// Retornar apenas os status (sem metadados)
$statusOnly = [];
foreach ($data as $itemId => $itemData) {
    $statusOnly[$itemId] = [
        'status' => $itemData['status']
    ];
}

echo json_encode($statusOnly);

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
    
    $stmt = $pdo->query("SELECT item_id, status FROM item_status");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $statusData = [];
    foreach ($results as $row) {
        $statusData[$row['item_id']] = [
            'status' => $row['status']
        ];
    }
    
    echo json_encode($statusData);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
*/
?>
