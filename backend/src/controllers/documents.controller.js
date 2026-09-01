const documentsService = require('../services/documents.service');

function getOwner(req) {
  return req.body?.owner || req.query?.owner || req.get('x-owner-id');
}

function handleError(error, res, fallbackMessage) {
  if (error instanceof documentsService.AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  return res.status(500).json({ error: fallbackMessage });
}

function uploadDocument(req, res) {
  try {
    const document = documentsService.createDocument({
      file: req.file,
      owner: getOwner(req),
    });

    return res.status(201).json(document);
  } catch (error) {
    return handleError(error, res, 'Nao foi possivel enviar o documento.');
  }
}

function listDocuments(req, res) {
  try {
    const documents = documentsService.listDocuments({ owner: req.query.owner });

    return res.json(documents);
  } catch (error) {
    return handleError(error, res, 'Nao foi possivel listar os documentos.');
  }
}

function downloadDocument(req, res) {
  try {
    const document = documentsService.getDocumentForDownload(req.params.id);

    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    return res.download(document.filePath, document.originalName);
  } catch (error) {
    return handleError(error, res, 'Nao foi possivel baixar o documento.');
  }
}

module.exports = {
  downloadDocument,
  listDocuments,
  uploadDocument,
};