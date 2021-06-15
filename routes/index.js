var express = require('express');
var router = express.Router();

/* Lista pagina inicial. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ENVIO DO ARQUIVO' });
});

//router.post('/', (req, res, next) => {
//  const formidable = require('formidable');
//  const form = new formidable.IncomingForm();
//  form.parse(req, async (err, fields, files) => {
//    const s3Client = require('../s3Client');
//    const url = await s3Client.uploadFile(files.filetoupload.name, files.filetoupload.path);
//    res.send(`File uploaded at ${url}`);
//  });
//});

router.post('/', (req, res, next) => {
  const formidable = require('formidable');
  const fs = require('fs');
  const form = new formidable.IncomingForm();
 
  form.parse(req, (err, fields, files) => {
 
    const path = require('path');
    const oldpath = files.filetoupload.path;
    const newpath = path.join(__dirname, '../Arq_recebido', files.filetoupload.name);
    
    fs.renameSync(oldpath, newpath);
    res.send('Arquivo enviado com sucesso!');
  });
});

module.exports = router;


