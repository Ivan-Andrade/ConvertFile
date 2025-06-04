const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const convertController = require('../controllers/convertController');

// Configuração do multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), convertController.convertFile);

module.exports = router;
