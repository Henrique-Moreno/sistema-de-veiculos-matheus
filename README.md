# Documentação do Sistema de Gestão de Concessionária

Esta é a documentação completa, com um guia passo a passo para configurar e executar a aplicação de gerenciamento de uma concessionária. O guia abrange desde a instalação das dependências necessárias até a execução da aplicação em modo de desenvolvimento, tanto para o backend quanto para o frontend.

## Sumário
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Requisitos](#requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Como Rodar a Aplicação Localmente](#como-rodar-a-aplicação-localmente)
- [Testando a Aplicação](#testando-a-aplicação)
- [Backup de Dados](#backup-de-dados)

## Tecnologias Utilizadas
- **Backend**:
  - Python
  - Flask
  - SQLAlchemy
  - Flask-Login
  - MySQL
- **Frontend**:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Axios
- **Ferramentas**:
  - Node.js
  - npm
  - Git (opcional, para clonar o repositório)

## Requisitos
Antes de rodar a aplicação, você vai precisar ter instalado:
- **Python 3.8 ou superior** (recomendado)
- **MySQL** (servidor MySQL instalado e em execução)
- **Node.js 16 ou superior** (para o frontend)
- **npm** (gerenciador de pacotes do Node.js)
- **Git** (opcional, para clonar o repositório)

## Configuração do Ambiente
Para configurar o ambiente de desenvolvimento, siga os passos abaixo:

1. **Configuração do MySQL**:
   - Certifique-se de que o servidor MySQL está instalado e em execução.
   - Crie um usuário com permissões para criar bancos de dados e tabelas (ou use o usuário `root`).
   - Não é necessário criar o banco de dados manualmente; ele será criado automaticamente pelo SQLAlchemy.

2. **Configuração do Backend**:
   - No diretório `backend`, há um arquivo `.env.example`. Renomeie-o para `.env` e edite as variáveis de ambiente conforme necessário:
     ```env
     DATABASE_URL=mysql+pymysql://root:suaSenha@localhost/concessionaria_db
     SECRET_KEY=sua_chave_secreta_aqui
     ```
     - Substitua `suaSenha` pela senha do seu usuário MySQL e `sua_chave_secreta_aqui` por uma chave secreta segura (ex.: uma string aleatória de 32 caracteres).

3. **Configuração do Frontend**:
   - No diretório `frontend`, verifique se o arquivo `.env.local` (se necessário) contém a URL do backend:
     ```env
     NEXT_PUBLIC_API_URL=http://127.0.0.1:8080
     ```
     - Ajuste a porta (ex.: `8080`) conforme a configuração do seu servidor Flask.

## Como Rodar a Aplicação Localmente
Siga os passos abaixo para executar o backend e o frontend localmente.

### Backend
1. **Clone este repositório ou faça download**:
   ```bash
   git clone https://github.com/seu_usuario/concessionaria_system.git
   cd concessionaria_system/backend
   ```

2. **Crie um ambiente virtual e instale as dependências**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

3. **Configure o banco de dados**:
   - Inicialize o Flask-Migrate:
     ```bash
     flask db init
     ```
   - Crie a migration inicial:
     ```bash
     flask db migrate -m "Initial migration."
     ```
   - Aplique as migrations para criar as tabelas no banco de dados:
     ```bash
     flask db upgrade
     ```

4. **Popule o banco de dados com dados iniciais** (opcional, se disponível):
   - Se houver um script para popular o banco, execute:
     ```bash
     python -m app.scripts.populate_db
     ```
   - Isso pode criar um usuário padrão com credenciais como:
     - **Usuário**: `joao.silva@email.com`
     - **Senha**: `senha123`

5. **Execute o backend**:
   ```bash
   flask run --port=8080
   ```
   - O backend estará disponível em `http://127.0.0.1:8080`.

### Frontend
1. **Navegue até o diretório do frontend**:
   ```bash
   cd ../frontend
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute o frontend**:
   ```bash
   npm run dev
   ```
   - O frontend estará disponível em `http://localhost:3000`.

4. **Acesse a aplicação no navegador**:
   - Abra `http://localhost:3000/auth` no navegador.
   - Faça login com as credenciais padrão (ex.: `joao.silva@email.com` / `senha123`).
   - Após o login, você será redirecionado para o **dashboard** (`/dashboard`), onde poderá:
     - Visualizar veículos disponíveis.
     - Agendar vistorias (`/inspections/schedule/[vehicleId]`).
     - Completar vistorias (`/inspections/complete/[inspectionId]`).
     - Gerenciar reservas (`/reservations`, com opções para confirmar ou cancelar).

## Testando a Aplicação
Para testar a aplicação, você pode usar ferramentas como o **Postman** para verificar as rotas da API e o navegador para testar o frontend.

### Testes de API (Backend)
1. **Configurar o Postman**:
   - Importe a coleção de rotas fornecida (se disponível) ou configure manualmente as requisições.
   - Exemplo de rotas:
     - **POST /api/users/login**:
       ```json
       {
         "email": "joao.silva@email.com",
         "password": "senha123"
       }
       ```
       - Retorna um token JWT (`authToken`) que deve ser incluído no header `Authorization: Bearer <token>` para rotas protegidas.
     - **GET /api/reservations**: Lista as reservas do usuário autenticado.
     - **POST /api/reservations**:
       ```json
       {
         "vehicle_id": 2,
         "amount": 500.00,
         "inspection_id": 1
       }
       ```
     - **PATCH /api/reservations/[id]/confirm**: Confirma uma reserva.
     - **PATCH /api/reservations/[id]/cancel**: Cancela uma reserva.

2. **Executar testes unitários** (se disponíveis):
   ```bash
   cd backend
   pytest --tb=short --disable-warnings tests/
   ```

### Testes de Frontend
1. **Acesse as páginas**:
   - Navegue para `/dashboard` e confirme que os veículos são listados.
   - Acesse `/reservations` e verifique se as reservas aparecem com botões para confirmar/cancelar.
   - Teste o fluxo de login/logout no `Header`.

2. **Verificar responsividade**:
   - Use o DevTools do navegador (F12) para testar em diferentes tamanhos de tela (ex.: 375px para mobile).
   - Confirme que o `Header` e os grids (em `/dashboard` e `/reservations`) se ajustam corretamente.

## Backup de Dados
Se você deseja exportar os dados do banco de dados para um arquivo CSV, execute o seguinte comando no diretório `backend` (se o script de backup estiver configurado):
```bash
python -m app.scripts.backup
```
Isso criará um arquivo CSV com os dados atuais do banco de dados (ex.: usuários, veículos, reservas, vistorias).