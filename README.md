## 🚀 Requisitos

Antes de iniciar, certifique-se de que seu ambiente possui os seguintes componentes instalados:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local ou remoto)

---

## 📥 Instalação

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/LabRedesCefetRJ/RickyBot.git
```

```bash
cd RickyBot
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione a seguinte configuração:

```ini
MONGO_URL=<URL_DO_MONGO_DB>
```

Substitua `<URL_DO_MONGO_DB>` pela URL de conexão do seu MongoDB.

---

## ▶️ Execução

### 🔹 Iniciar o bot

```bash
npm run dev
```

📌 **Nota:** Ao executar esse comando, será gerado um **QR Code** no terminal. Escaneie-o com o WhatsApp para autenticar o bot.

### 🔹 Iniciar o servidor

```bash
npm run server
```

---

## 🔄 Scripts Disponíveis

- `npm run dev` → Inicia o bot no ambiente de desenvolvimento.
- `npm run server` → Inicia o servidor para gerenciar requisições.

---

## COPYRIGHT

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />It is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>. The licensor cannot revoke these freedoms as long as you follow the license terms:

- **Attribution** — You must give **appropriate credit** like below:

WINTER, C. E. T. W. E. T.; KLEIN, D. H.; LAZARIN, N. M. **Uma proposta de ferramenta de análise de dados administrativos como estratégia defensiva ao estelionato digital.** Anais do XV Computer on the Beach - COTB’24. Anais... Em: COMPUTER ON THE BEACH. Balneário Camboriú - Santa Catarina - Brasil: Universidade do Vale do Itajaí, 28 maio 2024. DOI: 10.14210/cotb.v15.p315-317 Disponível em: <https://periodicos.univali.br/index.php/acotb/article/view/20379>. Acesso em: 24 nov. 2024

<details>
<summary> Cite using Bibtex </summary>

```
@inproceedings{winter_uma_2024,
	address = {Balneário Camboriú - Santa Catarina - Brasil},
	title = {Uma proposta de ferramenta de análise de dados administrativos como estratégia defensiva ao estelionato digital},
	copyright = {Licença Creative Commons Attribution 4.0 International},
	url = {https://periodicos.univali.br/index.php/acotb/article/view/20379},
	doi = {10.14210/cotb.v15.p315-317},
	language = {pt},
	urldate = {2024-11-24},
	booktitle = {Anais do {XV} {Computer} on the {Beach} - {COTB}'24},
	publisher = {Universidade do Vale do Itajaí},
	author = {Winter, Carlos Eduardo Taranto Winter Eduardo Taranto and Klein, Davi Heggdorne and Lazarin, Nilson Mori},
	month = may,
	year = {2024},
	pages = {315--317},
	file = {Texto completo:/home/nilson/Zotero/storage/VNXDCTZ2/Winter et al. - 2024 - Uma proposta de ferramenta de análise de dados administrativos como estratégia defensiva ao estelion.pdf:application/pdf},
}
```

</details>
