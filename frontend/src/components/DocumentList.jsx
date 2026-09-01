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
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
        Carregando documentos...
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
        {error}
      </p>
    );
  }

  if (!documents.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
        Nenhum documento enviado ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Tamanho</th>
            <th className="px-4 py-3">Dono</th>
            <th className="px-4 py-3">Enviado em</th>
            <th className="px-4 py-3">Acao</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((document) => (
            <tr key={document.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-700">{document.originalName}</td>
              <td className="px-4 py-3 text-slate-500">{formatSize(document.size)}</td>
              <td className="px-4 py-3 text-slate-500">{document.owner}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(document.uploadedAt)}</td>
              <td className="px-4 py-3">
                <DownloadButton documentId={document.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
