const fs = require('fs');
const path = require('path');

const documents = new Map();
const storageDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'storage');

function ensureStorageDir() {
  fs.mkdirSync(storageDir, { recursive: true });
}

function save(document) {
  documents.set(document.id, document);
  return document;
}

function findAll({ owner } = {}) {
  const allDocuments = Array.from(documents.values());

  if (!owner) {
    return allDocuments;
  }

  return allDocuments.filter((document) => document.owner === owner);
}

function findById(id) {
  return documents.get(id) || null;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function getStorageDir() {
  return storageDir;
}

module.exports = {
  ensureStorageDir,
  fileExists,
  findAll,
  findById,
  getStorageDir,
  save,
};