
const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const xml2js = require('xml2js');

exports.convertFile = async (req, res) => {
  const file = req.file;
  const targetFormat = req.body.format;

  if (!file) return res.status(400).send('Nenhum arquivo enviado.');

  const ext = path.extname(file.originalname).toLowerCase();
  const inputPath = file.path;
  const outputPath = path.join('converted', Date.now() + '.' + targetFormat);

  try {
    if (ext === '.csv' && targetFormat === 'json') {
      const jsonArray = await csvtojson().fromFile(inputPath);
      fs.writeFileSync(outputPath, JSON.stringify(jsonArray, null, 2));
    } else if (ext === '.xml' && targetFormat === 'json') {
      const xmlData = fs.readFileSync(inputPath);
      xml2js.parseString(xmlData, (err, result) => {
        if (err) throw err;
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      });
    } else {
      return res.status(400).send('Conversão não suportada.');
    }

    return res.download(outputPath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro na conversão do arquivo.');
  }
};
