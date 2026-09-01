import DownloadButton from './DownloadButton';

function formatSize(bytes) {
  if (!bytes && bytes !== 0) {
    return '-';
  }

  const kilobytes = bytes / 1024;
  return kilobytes < 1024 ? `${kilobytes.toFixed(1)} KB` : `${(kilobytes / 1024).toFixed(1)} MB`;
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString('pt-BR');
}

export default function DocumentList({ documents, isLoading, error }) {
  if (isLoading) {
    return <p>Carregando documentos...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!documents.length) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tamanho</th>
          <th>Dono</th>
          <th>Enviado em</th>
          <th>Acao</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((document) => (
          <tr key={document.id}>
            <td>{document.originalName}</td>
            <td>{formatSize(document.size)}</td>
            <td>{document.owner}</td>
            <td>{formatDate(document.uploadedAt)}</td>
            <td>
              <DownloadButton documentId={document.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
