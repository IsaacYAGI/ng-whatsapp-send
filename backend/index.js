const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())


const { whatsappClient } = require('./whatsapp-client.js')

app.post('/send-whatsapp', (req, res) => {
  console.log("req:",req.body)
  whatsappClient.sendMessage(`${req.body.phone}@c.us`, req.body.message)
  res.send({response:"ok"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})