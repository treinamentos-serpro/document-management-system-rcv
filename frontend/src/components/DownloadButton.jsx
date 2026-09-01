import { getDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ documentId, label = 'Baixar' }) {
  return (
    <a
      href={getDownloadUrl(documentId)}
      download
      className="inline-block rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
    >
      {label}
    </a>
  );
}
