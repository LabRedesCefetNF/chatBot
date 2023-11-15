const User = require("../model/userModel.js");

const saveUser = async (req, res) => {
  try {
    console.log("Request details:", req.method, req.url, req.body);

    let { number, name } = req.body;
    number = number.split("@")[0];
    const newUser = new User({ number: number, name: name });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    res.status(500).json({ error: "Erro ao salvar usuário." });
  }
};

module.exports = { saveUser };
