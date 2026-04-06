# 🐿️ Finance Squirrel — Frontend

Interface mobile do sistema **Finance Squirrel**, focada em **visualização de dados financeiros, usabilidade e experiência do usuário**.

## 📌 Sobre

Este repositório contém o **frontend da aplicação**, desenvolvido com **React Native + Expo**, responsável por toda a camada de interação com o usuário, incluindo:

- Visualização de dados financeiros
- Navegação entre telas
- Consumo da API backend
- Renderização de gráficos e relatórios

## 🎯 Responsabilidades do Frontend

- Gerenciar estado da interface
- Consumir dados da API
- Exibir informações financeiras de forma clara
- Garantir boa experiência do usuário (UX)
- Aplicar responsividade e acessibilidade

## 🧩 Principais Funcionalidades

### 📊 Dashboard

- Exibição de saldo atual
- Resumo de receitas e despesas
- Gráficos de distribuição por categoria
- Evolução financeira ao longo do tempo
- Últimas transações

### 💰 Transações

- Cadastro de receitas e despesas
- Edição e exclusão
- Formulários controlados
- Validação de dados

### 📜 Histórico

- Listagem completa de transações
- Filtros por data, categoria e tipo
- Ordenação dinâmica

### 🗂️ Categorias

- Criação e edição de categorias
- Personalização com cores e ícones
- Associação com transações

### 📊 Relatórios

- Análises visuais
- Comparações mensais
- Indicadores financeiros

### 📚 Educação Financeira

- Exibição de conteúdos educativos
- Alertas baseados em comportamento financeiro

### ⚙️ Configurações

- Tema (claro/escuro)
- Preferências de moeda
- Formato de data
- Personalização da interface

## 🖥️ Estrutura de Telas

```
/screens
  ├── Auth
  │     ├── Login
  │     └── Register
  ├── Dashboard
  ├── Transaction
  ├── History
  ├── Categories
  ├── Reports
  ├── Education
  └── Settings
```

## 🏗️ Arquitetura (Frontend)

Estrutura baseada em separação por responsabilidade:

```
/src
  ├── components     → Componentes reutilizáveis
  ├── screens        → Telas da aplicação
  ├── hooks          → Hooks customizados
  ├── services       → Comunicação com API
  ├── context        → Gerenciamento de estado global
  ├── utils          → Funções auxiliares
  └── styles         → Temas e estilos globais
```

## 🛠️ Tecnologias

- **React Native**
- **Expo**
- **TypeScript**
- **TailwindCSS (NativeWind)**
- **Axios (requisições HTTP)**
- **React Navigation**

## ▶️ Como executar

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o projeto
npm start
```

## 🔌 Integração com Backend

Certifique-se de configurar a URL da API no arquivo de serviços:

```ts
// exemplo
const api = axios.create({
  baseURL: "http://<seu-ip>:<porta>",
})
```

> Para testes em dispositivo físico, utilize o IP da sua máquina na rede local.

## 🎨 Padrões de UI

- Componentização reutilizável
- Layout responsivo
- Uso consistente de cores e tipografia
- Feedback visual para ações do usuário
- Foco em clareza de dados

## 💡 Boas práticas adotadas

- Separação entre lógica e UI
- Uso de hooks customizados
- Tipagem com TypeScript
- Organização escalável de pastas
- Código limpo e reutilizável

## 👨‍💻 Equipe

Projeto desenvolvido como parte do curso de Ciência da Computação.

## 📄 Licença

MIT
