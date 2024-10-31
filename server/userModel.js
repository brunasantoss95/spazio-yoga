const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      require: true,
    },
    telefone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = { User };
