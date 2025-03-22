// const wwebVersion = '2.2410.1';

const { Client, LocalAuth } = require('whatsapp-web.js');

const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: []
    },
    // webVersionCache: {
    //     type: 'remote',
    //     remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    // },
});
const qrcode = require('qrcode-terminal');

whatsappClient.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

whatsappClient.on('ready', () => {
    console.log('Client is ready!');
});

whatsappClient.on('message_ack', async (message, ack) => {
  const text = await message.getInfo();
    console.log('Message received: ' ,text, ack, message.id);
});

// whatsappClient.on('message', message => {
// 	if(message.body === '!ping') {
//         console.log("ChatId:",message.from)
// 		message.reply('pong');
// 	}
// });


whatsappClient.initialize();

module.exports = {whatsappClient};
