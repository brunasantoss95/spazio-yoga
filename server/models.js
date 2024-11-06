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

const adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = { User, Admin };
