# Especificacao - Document Management System

> Especificacao do Document Management System (DMS) para orientar o desenvolvimento guiado por especificacao. Este documento define o comportamento esperado, os contratos de API, as decisoes arquiteturais e o plano de execucao em etapas.

## 1. Objetivo

Permitir que usuarios enviem, consultem e baixem documentos por meio de uma aplicacao web simples, com arquivos armazenados localmente no filesystem da aplicacao e metadados mantidos em memoria nesta fase inicial.

## 2. Escopo

### Dentro do escopo

- Upload de documentos pelo usuario.
- Listagem de documentos enviados.
- Download de documentos pelo identificador unico.
- Associacao simples de documentos a um dono (`owner`).
- Armazenamento dos arquivos no filesystem local da aplicacao, em `backend/storage`.
- Persistencia dos metadados em memoria durante o ciclo de vida do processo Node.js.
- Backend em Node.js com Express, organizado em Clean Architecture simples.
- Frontend em React com Vite, consumindo o backend via `fetch` pelo prefixo `/api` quando a implementacao de interface for realizada.

### Fora do escopo

- Armazenamento externo, em nuvem ou servicos de terceiros para upload.
- Banco de dados relacional, NoSQL ou qualquer persistencia externa de metadados.
- Autenticacao real, autorizacao granular ou controle de permissoes avancado.
- Versionamento de documentos.
- Edicao, exclusao, compartilhamento ou pre-visualizacao de documentos.
- Antivírus, OCR, indexacao de conteudo ou busca textual dentro dos arquivos.
- Execucao ou alteracao de arquivos de backend e frontend neste passo de especificacao.

## 3. Requisitos funcionais

| ID    | Requisito |
| ----- | --------- |
| RF-01 | O usuario pode enviar um documento por meio de uma requisicao `multipart/form-data` contendo um campo de arquivo chamado `file`. |
| RF-02 | Ao concluir o upload com sucesso, o sistema deve gravar o arquivo em `backend/storage` usando `multer.diskStorage`. |
| RF-03 | Ao concluir o upload com sucesso, o sistema deve registrar em memoria os metadados do documento enviado. |
| RF-04 | Ao concluir o upload com sucesso, o sistema deve retornar os metadados publicos do documento criado com status HTTP `201`. |
| RF-05 | O usuario pode informar um dono simples do documento por meio do campo, query parameter ou header `owner`, conforme definido na implementacao. |
| RF-06 | Quando o `owner` nao for informado, o sistema deve aplicar um valor padrao simples, como `anonymous`, ou rejeitar a requisicao conforme a politica definida na implementacao. A decisao escolhida deve ser consistente entre upload e listagem. |
| RF-07 | O usuario pode listar documentos cadastrados por meio de `GET /documents`. |
| RF-08 | A listagem deve retornar os metadados dos documentos, sem retornar conteudo binario dos arquivos. |
| RF-09 | A listagem pode ser filtrada por `owner` quando esse parametro for informado. |
| RF-10 | O usuario pode baixar um documento por meio de `GET /documents/:id/download`. |
| RF-11 | No download, o sistema deve localizar os metadados pelo `id` e enviar o arquivo fisico correspondente como conteudo binario. |
| RF-12 | No download, o sistema deve preservar o nome original do arquivo no cabecalho `Content-Disposition` quando possivel. |
| RF-13 | O sistema deve retornar erro `400` quando uma requisicao de upload nao contiver arquivo. |
| RF-14 | O sistema deve retornar erro `404` quando o documento solicitado para download nao existir nos metadados em memoria. |
| RF-15 | O sistema deve retornar erro apropriado quando os metadados existirem, mas o arquivo fisico nao estiver disponivel no filesystem local. |
| RF-16 | O sistema deve expor mensagens de erro em JSON para falhas de validacao e falhas conhecidas. |

## 4. Requisitos nao funcionais

| ID     | Requisito |
| ------ | --------- |
| RNF-01 | Os arquivos enviados devem ser gravados exclusivamente no filesystem local da aplicacao, dentro de `backend/storage`. |
| RNF-02 | O upload deve usar `multer` com `diskStorage`; nao devem ser usados provedores externos de armazenamento. |
| RNF-03 | Os metadados dos documentos devem ser mantidos em memoria nesta fase inicial. |
| RNF-04 | A perda dos metadados ao reiniciar o processo backend e uma limitacao conhecida e aceita nesta fase. |
| RNF-05 | A configuracao deve seguir 12-Factor App, usando variaveis de ambiente para valores como `PORT`, `UPLOAD_DIR` e `MAX_FILE_SIZE`. |
| RNF-06 | O backend deve usar Node.js, Express e CommonJS. |
| RNF-07 | O frontend deve usar React, Vite, componentes funcionais e React Hooks. |
| RNF-08 | A comunicacao do frontend com o backend deve ocorrer via `fetch`, usando o prefixo `/api` configurado no proxy do Vite. |
| RNF-09 | O backend deve seguir Clean Architecture simples com o fluxo de dependencia `routes -> controllers -> services -> repositories`. |
| RNF-10 | As regras de negocio devem ficar em `services`; controllers devem se limitar a entrada/saida HTTP e validacao basica. |
| RNF-11 | A persistencia de arquivos e metadados deve ficar em `repositories`. |
| RNF-12 | Os testes backend devem usar o runner nativo do Node.js (`node:test`). |
| RNF-13 | O sistema deve evitar overengineering e manter a implementacao simples, legivel e evolutiva. |
| RNF-14 | Respostas de API para sucesso com metadados e para erros conhecidos devem usar JSON. |
| RNF-15 | O limite inicial recomendado para upload e 10 MB, configuravel por `MAX_FILE_SIZE`. |
| RNF-16 | A politica inicial de tipos de arquivo pode ser permissiva; restricoes por MIME type devem ser adicionadas apenas se definidas em etapa posterior. |

## 5. Modelo de dados (metadados do documento)

Os metadados representam o documento dentro da aplicacao. Eles ficam em memoria e referenciam o arquivo gravado no filesystem local.

| Campo        | Tipo    | Obrigatorio | Descricao |
| ------------ | ------- | ----------- | --------- |
| id           | string  | Sim | Identificador unico do documento, gerado no backend. |
| originalName | string  | Sim | Nome original do arquivo enviado pelo usuario. |
| filename     | string  | Sim | Nome do arquivo gravado em `backend/storage`, preferencialmente derivado do `id` para evitar colisoes. |
| path         | string  | Sim | Caminho local do arquivo gravado no filesystem da aplicacao. |
| size         | number  | Sim | Tamanho do arquivo em bytes. |
| mimeType     | string  | Sim | Tipo MIME informado no upload, por exemplo `application/pdf`. |
| uploadedAt   | string  | Sim | Data e hora do upload no formato ISO 8601. |
| owner        | string  | Sim | Identificador simples do usuario dono do documento. |

### Exemplo de metadados

```json
{
  "id": "doc_01HZY7A8Q9R2M3N4P5S6T7V8W9",
  "originalName": "contrato.pdf",
  "filename": "doc_01HZY7A8Q9R2M3N4P5S6T7V8W9.pdf",
  "path": "backend/storage/doc_01HZY7A8Q9R2M3N4P5S6T7V8W9.pdf",
  "size": 245760,
  "mimeType": "application/pdf",
  "uploadedAt": "2026-09-01T10:30:00.000Z",
  "owner": "user-123"
}
```

### Observacoes do modelo

- O `id` deve ser estavel enquanto o processo backend estiver em execucao.
- O `filename` deve evitar conflito entre arquivos com o mesmo nome original.
- O `path` e interno ao backend e nao precisa ser exposto ao frontend, salvo para diagnostico controlado.
- O `owner` nao representa autenticacao real; e apenas um identificador simples para organizar documentos nesta fase.

## 6. Contratos de API

Os contratos abaixo descrevem os endpoints do backend. Quando chamados pelo frontend, o prefixo `/api` deve ser usado conforme o proxy do Vite. Assim, o frontend chamara `/api/upload`, `/api/documents` e `/api/documents/:id/download`, enquanto o backend expora `/upload`, `/documents` e `/documents/:id/download`.

### POST /upload

Envia um documento para armazenamento local.

#### Entrada

- Metodo: `POST`
- Path backend: `/upload`
- Path frontend via proxy: `/api/upload`
- Content-Type: `multipart/form-data`
- Campo obrigatorio: `file`
- Campo, query parameter ou header opcional: `owner`

#### Requisicao multipart esperada

| Campo | Tipo | Obrigatorio | Descricao |
| ----- | ---- | ----------- | --------- |
| file  | File | Sim | Arquivo enviado pelo usuario. |
| owner | string | Nao | Identificador simples do dono do documento. |

#### Resposta de sucesso

- Status: `201 Created`
- Content-Type: `application/json`

```json
{
  "id": "doc_01HZY7A8Q9R2M3N4P5S6T7V8W9",
  "originalName": "contrato.pdf",
  "filename": "doc_01HZY7A8Q9R2M3N4P5S6T7V8W9.pdf",
  "size": 245760,
  "mimeType": "application/pdf",
  "uploadedAt": "2026-09-01T10:30:00.000Z",
  "owner": "user-123"
}
```

#### Respostas de erro

| Status | Condicao | Corpo |
| ------ | -------- | ----- |
| 400 | Campo `file` ausente | `{ "error": "Arquivo obrigatorio nao informado." }` |
| 400 | `owner` invalido, se a politica exigir owner obrigatorio | `{ "error": "Dono do documento invalido." }` |
| 413 | Arquivo acima do limite configurado | `{ "error": "Arquivo excede o tamanho maximo permitido." }` |
| 500 | Falha inesperada ao salvar arquivo ou metadados | `{ "error": "Nao foi possivel enviar o documento." }` |

#### Regras de comportamento

- O arquivo deve ser salvo em `backend/storage` por `multer.diskStorage` antes do registro dos metadados ser considerado concluido.
- A criacao dos metadados deve usar informacoes fornecidas pelo `multer`, como nome original, tamanho, MIME type, nome salvo e caminho local.
- A resposta nao deve retornar o conteudo binario do arquivo.

### GET /documents

Lista documentos cadastrados em memoria.

#### Entrada

- Metodo: `GET`
- Path backend: `/documents`
- Path frontend via proxy: `/api/documents`
- Query parameter opcional: `owner`

#### Parametros

| Parametro | Tipo | Obrigatorio | Descricao |
| --------- | ---- | ----------- | --------- |
| owner | string | Nao | Filtra a listagem por dono do documento. |

#### Resposta de sucesso

- Status: `200 OK`
- Content-Type: `application/json`

```json
[
  {
    "id": "doc_01HZY7A8Q9R2M3N4P5S6T7V8W9",
    "originalName": "contrato.pdf",
    "filename": "doc_01HZY7A8Q9R2M3N4P5S6T7V8W9.pdf",
    "size": 245760,
    "mimeType": "application/pdf",
    "uploadedAt": "2026-09-01T10:30:00.000Z",
    "owner": "user-123"
  }
]
```

#### Respostas de erro

| Status | Condicao | Corpo |
| ------ | -------- | ----- |
| 500 | Falha inesperada ao consultar metadados | `{ "error": "Nao foi possivel listar os documentos." }` |

#### Regras de comportamento

- A listagem deve retornar lista vazia (`[]`) quando nao houver documentos cadastrados.
- Quando `owner` for informado, somente documentos associados ao dono correspondente devem ser retornados.
- A resposta nao deve expor conteudo binario dos arquivos.

### GET /documents/:id/download

Baixa o conteudo binario de um documento pelo identificador.

#### Entrada

- Metodo: `GET`
- Path backend: `/documents/:id/download`
- Path frontend via proxy: `/api/documents/:id/download`
- Path parameter obrigatorio: `id`

#### Parametros

| Parametro | Tipo | Obrigatorio | Descricao |
| --------- | ---- | ----------- | --------- |
| id | string | Sim | Identificador unico do documento. |

#### Resposta de sucesso

- Status: `200 OK`
- Content-Type: MIME type original do arquivo, quando disponivel.
- Content-Disposition: `attachment; filename="<originalName>"`
- Corpo: conteudo binario do arquivo.

#### Respostas de erro

| Status | Condicao | Corpo |
| ------ | -------- | ----- |
| 400 | `id` ausente ou invalido | `{ "error": "Identificador do documento invalido." }` |
| 404 | Metadados nao encontrados para o `id` informado | `{ "error": "Documento nao encontrado." }` |
| 404 | Arquivo fisico nao encontrado no filesystem local | `{ "error": "Arquivo do documento nao encontrado." }` |
| 500 | Falha inesperada ao baixar o documento | `{ "error": "Nao foi possivel baixar o documento." }` |

#### Regras de comportamento

- O service deve buscar os metadados pelo `id` antes de tentar acessar o arquivo fisico.
- O repository responsavel por arquivos deve validar a existencia do arquivo antes de enviar o download.
- O controller deve traduzir falhas conhecidas para codigos HTTP apropriados.

## 7. Decisoes arquiteturais

### Backend

- O backend deve seguir Clean Architecture simples com as camadas `routes`, `controllers`, `services` e `repositories` dentro de `backend/src`.
- O fluxo de dependencia deve ser `routes -> controllers -> services -> repositories`.
- `routes` devem declarar endpoints e delegar para controllers.
- `controllers` devem tratar entrada HTTP, validacao basica, status codes e formato das respostas.
- `services` devem concentrar regras de negocio, como criacao de metadados, validacao de identificadores e coordenacao entre repositories.
- `repositories` devem cuidar da persistencia local: arquivos em `backend/storage` e metadados em memoria.
- O uso de `multer.diskStorage` deve ficar proximo da camada de entrada do upload, sem transferir regra de negocio para o middleware.
- O armazenamento local e uma restricao central do projeto. Nao devem ser adicionados S3, Azure Blob, Firebase Storage, MinIO ou equivalentes nesta fase.
- A aplicacao deve continuar exportando o `app` Express para permitir testes automatizados.

### Frontend

- O frontend deve ser organizado em componentes funcionais com React Hooks.
- A comunicacao com o backend deve ser feita por um servico em `frontend/src/services`, usando `fetch`.
- Chamadas HTTP no frontend devem usar o prefixo `/api`, aproveitando o proxy do Vite.
- Componentes esperados em etapa futura incluem formulario de upload, lista de documentos e botao/link de download.
- Mensagens visiveis ao usuario devem estar em portugues.

### Dados e persistencia

- Arquivos enviados devem permanecer no filesystem local enquanto nao forem removidos manualmente ou por futura funcionalidade.
- Metadados em memoria nao sobrevivem ao restart do backend.
- A ausencia de banco de dados e intencional nesta fase para manter o seed simples e evolutivo.

## 8. Plano de execucao

Este plano descreve etapas futuras de desenvolvimento. A execucao deste passo esta limitada a criacao deste documento `docs/specs/dms-spec.md`; nao inclui execucao, implementacao ou alteracao de arquivos de backend e frontend.

1. Criar a especificacao completa em `docs/specs/dms-spec.md` a partir de `docs/specs/spec-template.md`.
2. Revisar a especificacao para garantir aderencia a Clean Architecture simples e a restricao de armazenamento local com `multer.diskStorage`.
3. Planejar a implementacao backend, definindo os arquivos futuros em `routes`, `controllers`, `services` e `repositories`.
4. Planejar testes backend com `node:test` para upload, listagem, download e erros conhecidos.
5. Planejar a implementacao frontend, definindo servico de API via `fetch` e componentes de upload, listagem e download.
6. Implementar backend em etapa posterior, seguindo o fluxo `routes -> controllers -> services -> repositories`.
7. Implementar testes backend em etapa posterior, cobrindo os contratos descritos nesta especificacao.
8. Implementar frontend em etapa posterior, usando `/api` como prefixo das chamadas ao backend.
9. Realizar validacao manual em etapa posterior para confirmar upload, listagem e download de arquivos locais.
10. Refinar mensagens de erro, limites de upload e eventuais restricoes de MIME type conforme necessidade do workshop.

## 9. Criterios de aceite

- O documento de especificacao existe em `docs/specs/dms-spec.md`.
- A especificacao descreve requisitos funcionais, requisitos nao funcionais, modelo de dados, contratos de API, decisoes arquiteturais e plano de execucao.
- A especificacao respeita a restricao de armazenamento local em `backend/storage` com `multer.diskStorage`.
- A especificacao explicita que metadados ficam em memoria nesta fase inicial.
- A especificacao preserva a Clean Architecture simples definida para o backend.
- A especificacao nao introduz banco de dados, servico externo de armazenamento ou autenticacao real como obrigatoriedade desta fase.
- Nenhum arquivo de backend ou frontend e alterado neste passo.
