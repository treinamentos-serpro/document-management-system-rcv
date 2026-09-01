// Cliente HTTP para a API de documentos, consumida via prefixo /api (proxy do Vite).

const API_BASE_URL = '/api';

async function parseErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function uploadDocument({ file, owner }) {
  const formData = new FormData();
  formData.append('file', file);
  if (owner) {
    formData.append('owner', owner);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Nao foi possivel enviar o documento.'));
  }

  return response.json();
}

export async function fetchDocuments({ owner } = {}) {
  const query = owner ? `?owner=${encodeURIComponent(owner)}` : '';
  const response = await fetch(`${API_BASE_URL}/documents${query}`);

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Nao foi possivel listar os documentos.'));
  }

  return response.json();
}

export function getDownloadUrl(documentId) {
  return `${API_BASE_URL}/documents/${documentId}/download`;
}
