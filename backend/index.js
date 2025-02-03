const express = require('express')
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const date = require('date-and-time');
const app = express()
const port = 3000
const { whatsappClient } = require('./whatsapp-client.js')
const { MessageMedia } = require('whatsapp-web.js');

let logFileName = "";
let logFilePath = "";
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

function getTimestamp() {
  const now = new Date();
  const formattedDate = date.format(now, 'YYYYMMDD-HHmmss');

 return formattedDate;
}

function createLogFile() {
  const timestamp = getTimestamp();
  logFileName = `log-${timestamp}.log`;
  logFilePath = path.join(__dirname, 'logs', logFileName);

  if (!fs.existsSync(path.join(__dirname, 'logs'))) {
      fs.mkdirSync(path.join(__dirname, 'logs'));
  }

  fs.writeFile(logFilePath, `Log creado el: ${timestamp}\n`, (err) => {
      if (err) {
          console.error('Error al crear el archivo de log:', err);
      } else {
          console.log(`Archivo de log creado: ${logFilePath}`);
      }
  });
}

function writeToLog(message) {
  const now = new Date();
  const timestamp = date.format(now, 'YYYY/MM/DD-HH:mm:ss');
  const logMessage = `${timestamp},${message}\n`;

  fs.appendFileSync(logFilePath, logMessage);
}

createLogFile();

app.post('/start-send-session', (req, res) => {

  writeToLog(`-----------------------------Iniciando envío-----------------------------`)
  res.send({response:"ok"})
})

app.post('/send-whatsapp', async (req, res) => {
  console.log("req:",req.body)
  try {
    writeToLog(`Sent,${req.body.phone},`)
    await whatsappClient.sendMessage(`${req.body.phone}@c.us`, req.body.message)
  } catch (error) {
    writeToLog(`Error,${req.body.phone},${error}`)
  }
  res.send({response:"ok"})
})

app.post('/send-whatsapp-file', async (req, res) => {
  console.log("req:",req.body)
  try {
    writeToLog(`Sent_File,${req.body.phone},`)
    const media = MessageMedia.fromFilePath(req.body.filePath);
    const {caption} = req.body
    await whatsappClient.sendMessage(`${req.body.phone}@c.us`, media, {caption})
  } catch (error) {
    writeToLog(`Error,${req.body.phone},${error}`)
  }
  res.send({response:"ok"})
})

app.post('/send-whatsapp-file-b64', async (req, res) => {
  console.log("req:",req.body)
  try {
    writeToLog(`Sent_File,${req.body.phone},`)
    const media = new MessageMedia(req.body.mime, req.body.file, req.body.filename);
    const {caption} = req.body
    await whatsappClient.sendMessage(`${req.body.phone}@c.us`, media, {caption})
  } catch (error) {
    writeToLog(`Error,${req.body.phone},${error}`)
  }
  res.send({response:"ok"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
