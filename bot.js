const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('--- QR Code generated! Scan it ---');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Bot is now connected and ready!');
});

client.on('disconnected', (reason) => {
    console.log('Bot disconnected! Reason:', reason);
    process.exit(); 
});

client.on('message', async msg => {
    console.log(`Message received from ${msg.from}: ${msg.body}`);
    
    try {
        const response = await axios.post('https://rafftar01.app.n8n.cloud/webhook-test/c5a23e56-3b10-4f1c-a169-d9a3382752c1', {
            sender: msg.from,
            text: msg.body
        });
        
        if (response.data && response.data.reply) {
            client.sendMessage(msg.from, response.data.reply);
            console.log('Reply sent successfully!');
        }
    } catch (err) {
        console.error('Webhook error (Is n8n test mode active?):', err.message);
    }
});

client.initialize();