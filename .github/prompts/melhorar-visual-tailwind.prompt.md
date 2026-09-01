---
description: Melhora o visual do frontend do DMS aplicando Tailwind CSS 3, usando o agente ui-tailwind.
name: melhorar-visual-tailwind
argument-hint: (opcional) componente ou pagina especifica a estilizar
agent: ui-tailwind
---

# Melhorar visual com Tailwind CSS 3

Utilize o agente `ui-tailwind` para modernizar o visual do frontend do Document Management System com **Tailwind CSS 3**.

Alvo: `${input:alvo:todo o frontend, ou informe um componente/pagina especifica}`.

## Contexto atual

O frontend (`frontend/src`) é um app React com Vite, sem biblioteca de estilos, usando principalmente estilos inline (ex. `App.jsx`) e HTML puro (`DocumentList.jsx`, `UploadComponent.jsx`, `DownloadButton.jsx`).

## O que deve ser feito

1. Configurar o Tailwind CSS 3 no projeto `frontend` (PostCSS, `tailwind.config.js`, diretivas `@tailwind` no CSS global importado em `main.jsx`).
2. Estilizar com utility classes do Tailwind:
   - `App.jsx`: layout principal, cabeçalho e espaçamento geral da página.
   - `UploadComponent.jsx`: formulário de upload com input de arquivo, botão de envio e mensagem de erro.
   - `DocumentList.jsx`: tabela de documentos, estados de carregamento/erro/lista vazia.
   - `DownloadButton.jsx`: botão/link de download com estado de hover.
3. Garantir responsividade básica (mobile-first) e boa hierarquia visual (tipografia, cores, espaçamento).
4. Não alterar lógica de negócio, chamadas à API ou estrutura de componentes.

## Restrições

- Apenas Tailwind CSS 3 (sem outras bibliotecas de UI).
- Mensagens ao usuário permanecem em português.
- Não quebrar funcionalidades existentes (upload, listagem, download).

## Validação final

Rode `npm run build` em `frontend/` e confirme que não há erros antes de concluir.
