import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ owner, onUploaded }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError('Selecione um arquivo antes de enviar.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const document = await uploadDocument({ file, owner });
      setFile(null);
      event.target.reset();
      onUploaded?.(document);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        disabled={isUploading}
      />
      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Enviando...' : 'Enviar documento'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
