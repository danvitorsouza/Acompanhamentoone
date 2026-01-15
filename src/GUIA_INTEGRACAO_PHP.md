# 🚀 GUIA DE INTEGRAÇÃO - ONE Sistema de Gestão Logística
## Transferindo do Figma Make para Cursor (PHP/Javascript)

---

## 📋 ÍNDICE
1. [Opções de Integração](#opções-de-integração)
2. [Opção 1: React Standalone](#opção-1-react-standalone-recomendado)
3. [Opção 2: Javascript Vanilla](#opção-2-javascript-vanilla)
4. [Opção 3: Híbrido React + PHP](#opção-3-híbrido-react--php)
5. [Estrutura de Arquivos](#estrutura-de-arquivos)
6. [Banco de Dados](#banco-de-dados)
7. [APIs Backend](#apis-backend)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 OPÇÕES DE INTEGRAÇÃO

### Comparação Rápida

| Característica | React Standalone | Javascript Vanilla | Híbrido |
|----------------|------------------|-------------------|---------|
| Complexidade | Média | Baixa | Alta |
| Performance | Excelente | Boa | Excelente |
| Manutenção | Fácil | Média | Complexa |
| Curva Aprendizado | Média | Baixa | Alta |
| **Recomendado** | ✅ **SIM** | ⚠️ Projetos Simples | ❌ Não |

---

## 🎯 OPÇÃO 1: React Standalone (RECOMENDADO)

### 📦 Passo 1: Exportar Projeto React

#### No Figma Make (Terminal):
```bash
# Baixar todos os arquivos
# Use o botão de download do Figma Make
```

#### Estrutura a baixar:
```
figma-make-project/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── MenuItemComponent.tsx
│   │   ├── DevelopmentStatusModal.tsx
│   │   ├── DevelopmentStatusBadge.tsx
│   │   ├── AddMenuModal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ModuleCard.tsx
│   │   └── ... (outros)
│   └── styles/
│       └── globals.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

### 📦 Passo 2: Configurar no Cursor

#### 2.1. Criar novo projeto ou pasta:
```bash
# No seu projeto PHP existente
mkdir frontend-react
cd frontend-react
```

#### 2.2. Copiar arquivos do Figma Make:
```bash
# Copie toda a pasta baixada para frontend-react/
cp -r ~/Downloads/figma-make-project/* .
```

#### 2.3. Instalar dependências:
```bash
npm install

# Ou se usar yarn
yarn install
```

#### 2.4. Configurar build para produção:

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/frontend/', // Ajuste conforme sua estrutura
  build: {
    outDir: '../public/frontend', // Pasta pública do PHP
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
```

#### 2.5. Build para produção:
```bash
npm run build
```

#### 2.6. Integrar com PHP:

**index.php:**
```php
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ONE - Sistema de Gestão Logística</title>
    
    <!-- CSS do React compilado -->
    <link rel="stylesheet" href="/frontend/assets/index.css">
</head>
<body>
    <!-- Container React -->
    <div id="root"></div>
    
    <!-- Script React compilado -->
    <script type="module" src="/frontend/assets/index.js"></script>
    
    <?php
    // Seu código PHP aqui pode passar dados para o React via window
    ?>
    <script>
        // Passar dados do PHP para React
        window.phpData = {
            userId: <?php echo json_encode($_SESSION['user_id'] ?? null); ?>,
            modules: <?php echo json_encode($modules ?? []); ?>,
            apiUrl: '<?php echo $apiUrl; ?>'
        };
    </script>
</body>
</html>
```

### 📦 Passo 3: Conectar com Backend PHP

**App.tsx (modificar):**
```typescript
// Acessar dados do PHP
const phpData = (window as any).phpData;

// Usar API PHP
const saveStatus = async (itemId: string, status: string) => {
  const response = await fetch('/api/save-status.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, status })
  });
  return response.json();
};
```

---

## 🎯 OPÇÃO 2: Javascript Vanilla

### 📦 Arquivos Fornecidos

Já criei para você na pasta `/export-vanilla-js/`:

1. **status-system.js** - Sistema completo de status
2. **example.html** - Exemplo de uso
3. **api/save-status.php** - API para salvar
4. **api/get-statuses.php** - API para carregar
5. **database/schema.sql** - Schema do banco

### 📦 Passo 1: Copiar Arquivos

```bash
# No Cursor, copie os arquivos:
/export-vanilla-js/status-system.js → seu-projeto/js/
/export-vanilla-js/api/*.php → seu-projeto/api/
/export-vanilla-js/database/schema.sql → seu-projeto/database/
```

### 📦 Passo 2: Importar no HTML/PHP

```php
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <title>ONE - Sistema</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    
    <!-- Seu conteúdo -->
    <div id="number-item-1"></div>
    <div id="emoji-item-1"></div>
    
    <!-- Importar sistema -->
    <script src="/js/status-system.js"></script>
    
    <!-- Inicializar -->
    <script>
        document.getElementById('number-item-1').innerHTML = 
            statusSystem.createStatusButton('1.0', 'item-1');
        
        document.getElementById('emoji-item-1').innerHTML = 
            statusSystem.createStatusEmoji('item-1');
    </script>
</body>
</html>
```

### 📦 Passo 3: Configurar Banco de Dados

```bash
# Importar schema
mysql -u root -p one_sistema < database/schema.sql
```

### 📦 Passo 4: Configurar APIs PHP

Edite os arquivos PHP:
- `api/save-status.php` - Linha 85+: Descomentar código MySQL
- `api/get-statuses.php` - Linha 48+: Descomentar código MySQL
- Configurar credenciais do banco

---

## 🎯 OPÇÃO 3: Híbrido React + PHP

### Não Recomendado
Esta opção é muito complexa e não traz benefícios significativos.

Se precisar de integração profunda, use **Opção 1** com API REST.

---

## 📁 ESTRUTURA DE ARQUIVOS RECOMENDADA

### Para React Standalone:

```
seu-projeto-php/
├── public/
│   ├── index.php
│   ├── frontend/          # Build do React
│   │   ├── assets/
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   └── index.html
│   └── api/
│       ├── save-status.php
│       └── get-statuses.php
├── frontend-react/         # Código-fonte React
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── database/
│   └── schema.sql
└── config/
    └── database.php
```

### Para Javascript Vanilla:

```
seu-projeto-php/
├── public/
│   ├── index.php
│   ├── js/
│   │   └── status-system.js
│   ├── css/
│   │   └── styles.css
│   └── api/
│       ├── save-status.php
│       └── get-statuses.php
├── database/
│   └── schema.sql
└── data/
    └── status-data.json    # Alternativa ao banco
```

---

## 💾 BANCO DE DADOS

### Opção 1: Arquivo JSON (Desenvolvimento)

**Vantagens:**
- ✅ Sem configuração
- ✅ Fácil debug
- ✅ Portável

**Desvantagens:**
- ❌ Não escala
- ❌ Sem concorrência
- ❌ Performance limitada

**Uso:**
```php
// Já implementado em save-status.php
$storageFile = __DIR__ . '/../../data/status-data.json';
```

### Opção 2: MySQL (Produção)

**Vantagens:**
- ✅ Escala bem
- ✅ ACID compliant
- ✅ Relacional

**Configuração:**
```bash
# Importar schema
mysql -u root -p < database/schema.sql

# Verificar
mysql -u root -p one_sistema -e "SHOW TABLES;"
```

**Configurar PHP:**
```php
// config/database.php
<?php
$host = 'localhost';
$dbname = 'one_sistema';
$username = 'root';
$password = 'sua-senha';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Erro: ' . $e->getMessage());
}
```

---

## 🔌 APIs BACKEND

### Endpoints Criados

#### 1. **POST /api/save-status.php**

**Request:**
```json
{
  "itemId": "item-1",
  "status": "in-progress"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Status salvo com sucesso",
  "data": {
    "itemId": "item-1",
    "status": "in-progress"
  }
}
```

#### 2. **GET /api/get-statuses.php**

**Response:**
```json
{
  "item-1": { "status": "in-progress" },
  "item-2": { "status": "completed" },
  "item-3": { "status": "testing" }
}
```

### Criar Novos Endpoints

**api/get-module-stats.php:**
```php
<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$moduleId = $_GET['module_id'] ?? null;

if (!$moduleId) {
    http_response_code(400);
    echo json_encode(['error' => 'module_id required']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT development_status, COUNT(*) as count
    FROM menu_items
    WHERE module_id = ?
    GROUP BY development_status
");
$stmt->execute([$moduleId]);
$stats = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($stats);
```

---

## 🐛 TROUBLESHOOTING

### Problema: Build do React não funciona

**Solução:**
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problema: CORS ao chamar API

**Solução em save-status.php:**
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### Problema: Tailwind não funciona

**Solução:**
```html
<!-- Usar CDN temporariamente -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Ou compilar Tailwind -->
npm install -D tailwindcss
npx tailwindcss init
```

### Problema: Arquivo JSON não salva

**Solução:**
```bash
# Dar permissões
chmod 755 data/
chmod 666 data/status-data.json

# Ou criar diretório
mkdir -p data
touch data/status-data.json
```

### Problema: Conexão MySQL falha

**Solução:**
```php
// Testar conexão
<?php
try {
    $pdo = new PDO("mysql:host=localhost", "root", "senha");
    echo "Conectado!";
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
```

---

## 📚 RECURSOS ADICIONAIS

### Documentação
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- PHP PDO: https://www.php.net/pdo

### Tutoriais
- React + PHP: https://www.digitalocean.com/community/tutorials/react-php-api
- Tailwind com PHP: https://tailwindcss.com/docs/installation

### Comunidade
- Stack Overflow: tag `react`, `php`
- Reddit: r/reactjs, r/PHP

---

## ✅ CHECKLIST DE INTEGRAÇÃO

### React Standalone:
- [ ] Baixar projeto do Figma Make
- [ ] Copiar para pasta `frontend-react/`
- [ ] Instalar dependências: `npm install`
- [ ] Configurar `vite.config.ts`
- [ ] Build: `npm run build`
- [ ] Copiar build para pasta pública PHP
- [ ] Criar `index.php` com integração
- [ ] Testar no navegador

### Javascript Vanilla:
- [ ] Copiar `status-system.js` para projeto
- [ ] Copiar arquivos PHP da API
- [ ] Importar schema MySQL
- [ ] Configurar credenciais banco
- [ ] Descomentar código MySQL nas APIs
- [ ] Adicionar Tailwind CSS (CDN ou build)
- [ ] Testar funcionalidades

### Backend:
- [ ] Criar banco de dados
- [ ] Importar schema SQL
- [ ] Configurar conexão PDO
- [ ] Testar endpoints da API
- [ ] Implementar autenticação (se necessário)
- [ ] Adicionar logs de erro

---

## 🎯 PRÓXIMOS PASSOS

1. **Escolha a opção** que melhor se adapta ao seu projeto
2. **Siga o guia passo a passo**
3. **Teste cada funcionalidade**
4. **Customize conforme necessário**
5. **Deploy em produção**

---

## 💡 DICAS FINAIS

### Performance:
- Use CDN para bibliotecas quando possível
- Minifique CSS e JS em produção
- Implemente cache de API
- Use compressão gzip

### Segurança:
- Valide TODOS os inputs
- Use prepared statements (PDO)
- Implemente CSRF protection
- Sanitize outputs

### Manutenção:
- Documente mudanças
- Use versionamento (Git)
- Faça backups regulares
- Monitore erros

---

**BOA SORTE COM A INTEGRAÇÃO! 🚀**

Se precisar de ajuda adicional, consulte a documentação oficial ou a comunidade!
