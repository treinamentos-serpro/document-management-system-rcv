const path = require('path');
const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');
const documentsRepository = require('../repositories/documents.repository');

documentsRepository.ensureStorageDir();

const router = express.Router();
const maxFileSize = Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024);

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, documentsRepository.getStorageDir());
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
});

function handleUploadError(error, req, res, next) {
  if (!error) {
    return next();
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Arquivo excede o tamanho maximo permitido.' });
  }

  return res.status(400).json({ error: 'Nao foi possivel processar o upload.' });
}

router.post('/upload', upload.single('file'), handleUploadError, documentsController.uploadDocument);
router.get('/documents', documentsController.listDocuments);
router.get('/documents/:id/download', documentsController.downloadDocument);

module.exports = router;