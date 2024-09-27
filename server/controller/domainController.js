const Domain = require("../model/domainModel.js");

const saveDomain = async (req, res) => {
  try {
    // console.log("Request domain details:", req.method, req.url, req.body);

    const { id_user, ...domainData } = req.body;
    const userNumber = id_user.split("@")[0];

    const newDomain = new Domain({
      ...domainData,
      id_user: userNumber,
    });

    await newDomain.save();

    res
      .status(201)
      .json({ message: "Domínio salvo com sucesso", data: newDomain });
  } catch (error) {
    console.error("Erro ao salvar domínio:", error);
    res.status(500).json({ error: "Erro ao salvar domínio." });
  }
};

module.exports = { saveDomain };
