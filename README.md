# Quero Passagem - Frontend

Frontend da aplicação de busca de passagens de ônibus, construído com Vue 3 e Vite. Consome a API do backend para buscar viagens e exibir mapa de poltronas.

## Tecnologias

- Vue 3 (Composition API)
- Vite
- Vue Router
- Axios
- Lucide Icons

## Requisitos

- Node.js >= 20
- npm

## Instalação
```bash
git clone https://github.com/Kuligowskilucas/quero-passagem-front.git
cd quero-passagem-front
npm install
```

Configure o `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

## Executando
```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

> O backend precisa estar rodando em `http://localhost:8000`.

## Funcionalidades

- Busca de cidades com autocomplete (todas as cidades, busca restrita a SP e PR)
- Inversão de origem/destino
- Listagem de viagens ordenada por horário de embarque
- Filtros por período, classe e companhia
- Mapa interativo de poltronas com seleção
- Logo das empresas carregada dinamicamente
- Indicadores de embarque direto / retirada guichê e sala VIP
- Persistência da busca via sessionStorage
- Design responsivo

## Estrutura
```
src/
├── assets/
│   └── main.css
├── components/
│   ├── LoadingSpinner.vue
│   ├── SearchForm.vue
│   ├── SeatMap.vue
│   ├── StopAutocomplete.vue
│   └── TravelCard.vue
├── composables/
│   └── useTravelFilters.js
├── router/
│   └── index.js
├── services/
│   ├── api.js
│   └── store.js
└── views/
    ├── SearchView.vue
    └── ResultsView.vue
```

## Decisões Técnicas

- **Composition API**: Padrão atual do Vue 3, mais flexível que Options API para lógica reutilizável.
- **Composables**: Lógica de filtros extraída para composable, separando lógica de negócio da apresentação.
- **Componentização**: Cada componente tem responsabilidade única — SearchForm, StopAutocomplete, TravelCard e SeatMap.
- **Store reativo**: Estado global simples com reactive + sessionStorage, adequado ao escopo sem necessidade de Pinia.
- **Variáveis de ambiente**: URL da API configurável via .env para facilitar troca entre ambientes.
- **Router Guard**: Proteção de rota para redirecionar à busca quando não há dados carregados.
- **Lucide Icons**: Biblioteca leve e tree-shakeable para ícones consistentes.