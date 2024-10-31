require("dotenv/config");
const mongoose = require("mongoose");

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl);

const connection = mongoose.connection;

connection.on("error", () => {
  console.log("Erro ao conectar ao MongoDB");
});

connection.on("connected", () => {
  console.log("Conectado ao MongoDB");
});

module.exports = { mongoose };
