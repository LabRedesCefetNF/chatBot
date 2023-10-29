const app = express();
import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import session from "express-session";

app.use(
  session({
    secret: "BotWpp",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 300000,
    },
  })
);

app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/whois/:slug", async (req, res) => {
  try {
    var slug = req.params.slug;
    const response = await fetch(`https://rdap.registro.br/domain/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json(await response.json());
    if (response.status == 404)
      return res.status(404).json({ error: "URL não encontrada." });
  } catch (e) {
    console.error("URL Inválida.");
    return res.status(404).json({ error: "URL não encontrada." });
  }
});

app.get("/receita/:slug", async (req, res) => {
  var slug = req.params.slug;
  const response = await fetch(`https://receitaws.com.br/v1/cnpj/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  res.json(await response.json());
});

app.listen(80, () => {
  console.log("API UP! ");
});
