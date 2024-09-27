const mongoose = require("mongoose");

const DomainSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: false },
    created: { type: String },
    changed: { type: String },
    expiration: { type: String },
    cnpj: { type: String },
    date: { type: String },
    name: { type: String },
    active_cnpj: { type: Boolean },
    tel: { type: String },
    email: { type: String },
    id_user: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("domains", DomainSchema);
