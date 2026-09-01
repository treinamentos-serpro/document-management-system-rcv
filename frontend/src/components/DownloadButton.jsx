import { getDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ documentId, label = 'Baixar' }) {
  return (
    <a href={getDownloadUrl(documentId)} download>
      {label}
    </a>
  );
}
