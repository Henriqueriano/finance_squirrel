---

# 🐿️ Finance Squirrel

## ⚙️ Configuração do Backend

*(dentro do sub-repositório `fs_backend`)*

---

### 🐍 1. Configuração do Python

```bash
# Criar ambiente virtual
py -m venv venv

# Ativar o ambiente (Windows)
.\venv\Scripts\activate

# Instalar dependências
pip install -r requirements
```

---

### 🐳 2. Configuração do Docker

1. Baixe e instale o Docker Desktop:
   👉 [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. Suba os containers:

```bash
docker compose up
```

---

### 🗄️ Configuração do Banco de Dados (Alembic)

```bash
# Gerar uma nova migration automaticamente
alembic revision --autogenerate

# Aplicar as migrations
alembic upgrade head
```

---

### 🚀 Executar o Projeto (Modo Desenvolvimento)

```bash
fastapi dev ./main.py
```

---