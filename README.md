# Cotações Financeiras em Tempo Real

Este projeto é uma aplicação web que exibe cotações financeiras de moedas, ações e Bitcoin em tempo real. Os dados são obtidos de uma API pública e o histórico de variações é armazenado para visualização em gráficos interativos.

## Funcionalidades Principais

- **Visualização de Cotações:** Exibe os preços de compra e venda (quando disponíveis) e a variação diária de diversas moedas, ações e Bitcoin em cards intuitivos.
- **Busca de Cotações:** Permite aos usuários buscar cotações específicas por código ou nome.
- **Gráfico de Variação em Tempo Real:** Ao clicar em um card de cotação, um modal exibe um gráfico de linha mostrando a variação da cotação desde o login do usuário, com atualizações automáticas.
- **Gerenciamento de Sessão:** Implementa um sistema de login e logout para controlar o acesso às funcionalidades.
- **Persistência de Sessão:** A sessão do usuário é mantida utilizando `localStorage` até o logout ou expiração.
- **Gerenciamento de Estado:** Utiliza Zustand para gerenciar o estado global da aplicação, incluindo o histórico de cotações.
- **Interface Moderna:** Interface de usuário responsiva e estilizada com Tailwind CSS e ícones Lucide React.

## Tecnologias Utilizadas

- **Next.js:** Framework React para construção da aplicação full-stack.
- **React:** Biblioteca JavaScript para construção da interface de usuário.
- **TypeScript:** Superset de JavaScript que adiciona tipagem estática.
- **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
- **Zustand:** Biblioteca para gerenciamento de estado simples e escalável.
- **Recharts:** Biblioteca de gráficos React para renderizar os gráficos de variação.
- **Lucide React:** Biblioteca de ícones vetoriais.
- **`localStorage`:** API do navegador para persistência de dados do lado do cliente (sessão e histórico).
- **API HG Brasil Finance:** API pública utilizada para obter os dados das cotações financeiras.

## Pré-requisitos

- **Node.js** (versão LTS recomendada) instalado em sua máquina.
- **npm** ou **yarn** como gerenciador de pacotes.
- Uma chave de API da HG Brasil Finance (você pode obter uma gratuitamente em [https://hgbrasil.com/status/finance](https://hgbrasil.com/status/finance)).

## Configuração

1.  **Clone o repositório:**

    ```bash
    # Usando SSH
    git clone git@github.com:guimamura/finance-app.git
    # Ou usando HTTPS
    git clone [https://github.com/guimamura/finance-app.git](https://github.com/guimamura/finance-app.git)
    cd finance-app
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    - Crie um arquivo `.env.local` na raiz do projeto.
    - Adicione a sua chave de API da HG Brasil Finance:
      ```
      NEXT_PUBLIC_API_KEY=SUA_CHAVE_DE_API
      ```

## Execução

1.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    # ou
    yarn dev
    ```

2.  Abra seu navegador e acesse `http://localhost:3000`.

## Estrutura de Pastas

.
├── app
│ └── api
│ └── quotes
│ └── route.ts # Rota da API para buscar as cotações
│ └── dashboard
│ └── page.tsx # Componente da página do dashboard
│ └── login
│ └── page.tsx # Componente da página de login
│ └── page.tsx # Componente da página inicial (redireciona para /login)
├── components
│ ├── QuoteCard.tsx # Componente para exibir um card de cotação
│ ├── QuoteChart.tsx # Componente para exibir o gráfico de variação
│ └── QuoteSearch.tsx # Componente para a barra de busca de cotações
├── lib
│ └── quotes.ts # Lógica para buscar e filtrar cotações (não mais usado diretamente)
│ └── storage.ts # Utilitários para interagir com localStorage
├── store
│ └── quoteHistoryStore.ts # Store do Zustand para gerenciar o histórico de cotações
├── types
│ ├── Quote.ts # Definição do tipo Quote
│ ├── QuoteTypes.ts # Definições de tipos para dados da API
│ └── User.ts # Definição do tipo User
├── .env.local # Arquivo de variáveis de ambiente
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json

## Créditos

- Este projeto utiliza dados da [HG Brasil Finance API](https://hgbrasil.com/status/finance).
- As bibliotecas de código aberto mencionadas em "Tecnologias Utilizadas" tornaram este projeto possível.
