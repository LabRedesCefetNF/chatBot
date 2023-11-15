const mongoose = require("mongoose");

const DomainSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true },
    created: { type: String },
    changed: { type: String },
    expiration: { type: String },
    cnpj: { type: String },
    date: { type: String },
    name: { type: String },
    active_cnpj: { type: Boolean },
    type: { type: String },
    tel: { type: String },
    email: { type: String },
    address: {
      place: { type: String },
      number: { type: String },
      cep: { type: String },
      city: { type: String },
      uf: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("domains", DomainSchema);
