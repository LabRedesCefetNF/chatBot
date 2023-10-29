import { json } from "stream/consumers";

const fs = require("fs");
const cron = require("node-cron");

cron.schedule("0 0 1 * *", () => {
  resetDB();
  console.log(
    `Tarefa agendada para limpar o arquivo ${filePath} no primeiro dia de cada mês.`
  );
});

const filePath = "db.json";

export function hasValidURL(words: string[]): string | null {
  let urlEncontrada = null;

  for (const word of words) {
    if (/^.+\..+/.test(word)) {
      urlEncontrada = word;
      break;
    }
  }

  return urlEncontrada;
}

export function getUsefulWhoisData(data: any): Object | undefined {
  console.log("get whois");
  try {
    const usefulData = {
      domain: data.handle,
      created: data.events[0].eventDate.split("T")[0],
      changed: data.events[1].eventDate.split("T")[0],
      expiration: data.events[2]
        ? data.events[2].eventDate.split("T")[0]
        : null,
      cnpj: data["entities"][0].publicIds[0].identifier,
    };
    return usefulData;
  } catch (err) {
    console.error("Erro ao consultar dados whois", err);
  }
}

export function getUsefulRFData(data: any): Object {
  const usefulData = {
    date: data.data_situacao,
    active_cnpj: data.situacao == "ATIVA" ? true : false,
    tel: data.telefone,
    email: data.email,
    address: {
      place: data.logradouro,
      number: data.numero,
      cep: data.cep,
      city: data.municipio,
      uf: data.uf,
    },
  };

  return usefulData;
}

export function mergeData(whoIsData: Object, rfData: Object): Object {
  console.log("merging");
  const usefulRfData = getUsefulRFData(rfData);
  const mergedData = { ...whoIsData, ...usefulRfData };

  return mergedData;
}
export function insertData(data: Object) {
  let jsonData = [];

  try {
    const existingData = fs.readFileSync(filePath, "utf-8");
    if (existingData.trim() !== "") {
      jsonData = JSON.parse(existingData);
      if (!Array.isArray(jsonData)) {
        throw new Error("O arquivo não contém um JSON válido como array.");
      }
    }
  } catch (error) {
    console.error(
      `Ao dar insert, obteve erro ao ler ou analisar ${filePath}:`,
      error
    );
  }

  jsonData.push(data);

  const jsonString = JSON.stringify(jsonData, null, 2);

  try {
    fs.writeFileSync(filePath, jsonString);
  } catch (error) {
    console.error(
      `Ao dar insert, obteve erro ao escrever em ${filePath}:`,
      error
    );
  }
}

export function getDataFromDB(url: string) {
  console.log("searching DB");
  let jsonData = [];
  try {
    const existingData = fs.readFileSync(filePath, "utf-8");
    if (!existingData) return null;
    jsonData = JSON.parse(existingData);

    let matchingObject = null;

    jsonData.forEach((element: any) => {
      if (
        element.domain === url ||
        element.domain === "www." + url ||
        element.domain === url.replace("www.", "")
      ) {
        console.log(element.domain, "equal");
        matchingObject = element;
        return;
      }
    });

    return matchingObject;
  } catch (error) {
    console.error(
      `Ao dar get, obteve erro ao ler ou analisar ${filePath}:`,
      error
    );
    return null;
  }
}

function resetDB() {
  try {
    // Limpar o conteúdo do arquivo definindo-o como uma string vazia.
    fs.writeFileSync(filePath, "", "utf-8");
    console.log(`Limpeza realizada no arquivo ${filePath}.`);
  } catch (error) {
    console.error(`Erro ao limpar o arquivo ${filePath}:`, error);
  }
}

// const hasValidURL = words.some((word) => {
//   if (/^.+\..+/.test(word)) {
//     console.log("testando", word);
//     url = word;
//     return true;
//   }
//   return false;
// });
