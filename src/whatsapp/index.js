const qrcode = require("qrcode-terminal");
const fs = require("fs");

const { Client, LocalAuth } = require("whatsapp-web.js");

// Path where the session data will be stored
const SESSION_FILE_PATH = "./session.json";

// Load the session data if it has been previously saved

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const chat = await client.getChats();

  client.sendMessage("916352201170@c.us", "Hello  Your Whatsapp is Hacked");

});

client.on("message", (m) => {
  if (m.body === "wellbenix") {
    m.reply("Hello");
  }

  if (m.body === "Wellbenix") {
    m.reply("Hello");
  }
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
});

client.initialize();
