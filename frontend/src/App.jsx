import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { fetchDocuments } from './services/documentsApi';

const OWNER = 'anonymous';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchDocuments({ owner: OWNER });
      setDocuments(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
            Document Management System
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Envie, liste e baixe seus documentos.
          </p>
        </header>
        <UploadComponent owner={OWNER} onUploaded={loadDocuments} />
        <DocumentList documents={documents} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}
