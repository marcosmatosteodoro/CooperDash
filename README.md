# Teste Técnico Unicred - Cadastro de Cooperados
Este projeto é uma solução para o teste técnico da Unicred, desenvolvido com Laravel no backend e React no frontend, utilizando Docker para conteinerização.
## Visão Geral
A aplicação consiste em um CRUD completo para cadastro de cooperados, com validações específicas para pessoa física (CPF) e jurídica (CNPJ). O sistema oferece:
*   Cadastro de cooperados com todos os campos obrigatórios
*   Validações robustas para documentos (CPF/CNPJ), telefone e outros campos
*   Interface web responsiva com temas claro/escuro
*   Busca integrada por múltiplos campos
*   Testes unitários no backend para garantir a qualidade do código
## Stack Tecnológica
**Backend:**
*   PHP 8.2
*   Laravel 10
*   PostgreSQL
**Frontend:**
*   React.js
*   Redux (gerenciamento de estado)
*   Bootstrap 5 (UI responsiva)
*   Create React App (scaffolding)
**Infraestrutura:**
*   Docker
*   Docker Compose
## Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
*   Docker (versão 20.10+)
*   Docker Compose (versão 1.29+)
*   Git (para clonar o repositório)
## Configuração do Ambiente
### 1\. Clonar o repositório
bash

```plain
git clone https://github.com/marcosmatosteodoro/teste-unicred.git
cd teste-unicred
```

### 2\. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
bash

```plain
cp .env.example .env
```

Edite o arquivo `.env` com as configurações do banco de dados:
ini

```plain
DB_CONNECTION=pgsqlDB_HOST=dbDB_PORT=5432DB_DATABASE=unicredDB_USERNAME=unicredDB_PASSWORD=secret
```

### 3\. Iniciar os containers
Execute o seguinte comando para construir e iniciar os containers:
bash

```haskell
docker-compose up -d --build
```

Este comando irá:
*   Construir as imagens do backend (Laravel) e frontend (React)
*   Iniciar os containers do app, banco de dados e frontend
*   Configurar a rede entre os containers
### 4\. Executar migrações e seeders (opcional)
Para criar as tabelas no banco de dados, execute:
bash

```bash
docker exec -it laravel-backend php artisan migrate
```

Se desejar popular o banco com dados de teste:
bash

```plain
docker exec -it laravel-backend php artisan db:seed
```

## Acessando a Aplicação
*   **Backend (API Laravel):** [http://localhost:8000](http://localhost:8000/)
*   **Frontend (React):** [http://localhost:3000](http://localhost:3000/)
*   **Banco de dados (PostgreSQL):** localhost:5432 (usuário: unicred, senha: secret)
## Executando Testes
Os testes unitários foram desenvolvidos com PHPUnit. Para executá-los:
bash

```bash
docker exec -it laravel-backend php artisan test
```

## Estrutura do Projeto
text

```plain
.
├── app/                  # Código fonte Laravel
│   ├── Http/Controllers/ # Controladores da API
│   ├── Models/           # Modelos Eloquent
│   └── ...
├── frontend/             # Aplicação React
│   ├── public/           # Assets públicos
│   ├── src/              # Código fonte React
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── store/        # Configuração Redux
│   │   └── ...
│   └── ...
├── tests/                # Testes PHPUnit
├── docker-compose.yml    # Configuração Docker Compose
├── Dockerfile            # Dockerfile backend
└── Dockerfile.frontend   # Dockerfile frontend
```

## Rotas da API
A API oferece os seguintes endpoints:
*   `GET /cooperados` - Lista todos os cooperados
*   `POST /cooperados` - Cria um novo cooperado
*   `GET /cooperados/{id}` - Mostra um cooperado específico
*   `PUT /cooperados/{id}` - Atualiza um cooperado
*   `DELETE /cooperados/{id}` - Remove um cooperado
*   `GET /cooperados/search?q={termo}` - Busca cooperados por termo
## Validações Implementadas
O sistema realiza as seguintes validações:
*   **Nome:** obrigatório (string)
*   **Tipo de pessoa:** obrigatório (FISICA ou JURIDICA)
*   **Documento:**
    *   CPF válido para pessoa física
    *   CNPJ válido para pessoa jurídica
    *   Único no sistema
*   **Data:**
    *   Obrigatória
    *   Não pode ser futura
*   **Valor (renda/faturamento):**
    *   Obrigatório
    *   Numérico
    *   Não negativo
*   **Telefone:**
    *   Obrigatório
    *   Formato válido (apenas números)
    *   Tamanho entre 10 e 15 caracteres
*   **Email:** opcional, mas deve ser válido se informado
*   **Código do país:**
    *   Obrigatório
    *   Deve começar com "+"
    *   Seguido apenas de números
## Funcionalidades do Frontend
*   **Listagem de cooperados:**
    *   Filtro por tipo de pessoa (Física/Jurídica)
    *   Busca integrada
    *   Paginação
*   **Cadastro de cooperados:**
    *   Formulário dinâmico (muda campos conforme tipo de pessoa)
    *   Validações em tempo real
    *   Feedback visual
*   **Edição de cooperados:**
    *   Mantém todas as validações do cadastro
    *   Carrega dados existentes
*   **Visualização de cooperados:**
    *   Exibe todos os detalhes
    *   Formatação adequada para cada tipo de pessoa
*   **Temas:**
    *   Alternância entre tema claro e escuro
    *   Persistência da preferência
## Comandos Úteis
**Backend:**
*   Executar migrações: `docker exec -it laravel-backend php artisan migrate`
*   Executar seeders: `docker exec -it laravel-backend php artisan db:seed`
*   Executar testes: `docker exec -it laravel-backend php artisan test`
*   Acessar shell no container: `docker exec -it laravel-backend bash`
**Frontend:**
*   Instalar dependências: `docker exec -it next-frontend npm install`
*   Executar testes: `docker exec -it next-frontend npm test`
## Considerações Finais
Este projeto foi desenvolvido seguindo boas práticas de desenvolvimento, incluindo:
*   Separação clara de camadas
*   Validações robustas tanto no frontend quanto no backend
*   Testes unitários para garantir a qualidade do código
*   Documentação completa
*   Interface responsiva e acessível
Qualquer dúvida ou problema, por favor abra uma issue no repositório.


docker exec -it laravel-backend php artisan migrate
