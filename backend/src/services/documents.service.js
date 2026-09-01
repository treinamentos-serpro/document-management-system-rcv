const crypto = require('crypto');
const path = require('path');
const documentsRepository = require('../repositories/documents.repository');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function normalizeOwner(owner) {
  if (!owner || !String(owner).trim()) {
    return 'anonymous';
  }

  return String(owner).trim();
}

function buildPublicDocument(document) {
  return {
    id: document.id,
    originalName: document.originalName,
    filename: document.filename,
    size: document.size,
    mimeType: document.mimeType,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  };
}

function createDocument({ file, owner }) {
  if (!file) {
    throw new AppError('Arquivo obrigatorio nao informado.', 400);
  }

  const document = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
    owner: normalizeOwner(owner),
  };

  return buildPublicDocument(documentsRepository.save(document));
}

function listDocuments({ owner } = {}) {
  return documentsRepository
    .findAll({ owner: owner ? normalizeOwner(owner) : undefined })
    .map(buildPublicDocument);
}

function getDocumentForDownload(id) {
  if (!id || !String(id).trim()) {
    throw new AppError('Identificador do documento invalido.', 400);
  }

  const document = documentsRepository.findById(id);

  if (!document) {
    throw new AppError('Documento nao encontrado.', 404);
  }

  if (!documentsRepository.fileExists(document.path)) {
    throw new AppError('Arquivo do documento nao encontrado.', 404);
  }

  return {
    filePath: document.path,
    originalName: path.basename(document.originalName),
    mimeType: document.mimeType,
  };
}

module.exports = {
  AppError,
  createDocument,
  getDocumentForDownload,
  listDocuments,
};