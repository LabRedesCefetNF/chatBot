// @ts-nocheck
import { Message, Whatsapp, create } from "venom-bot";
import {
  hasValidURL,
  getUsefulWhoisData,
  mergeData,
  insertData,
  getDataFromDB,
} from "./utils/utils";

const { Mutex } = require("async-mutex");

create({
  session: "bot-fraude",
})
  .then(async (client: Whatsapp) => await start(client))
  .catch((err) => {
    console.log(err);
  });

async function start(client: Whatsapp) {
  const mutex = new Mutex();

  client.onMessage(async (message: Message) => {
    if (!message.body || message.isGroupMsg) return;
    const words = message.body.split(" ");
    let url = hasValidURL(words);

    if (!url) {
      await client.sendText(
        message.from,
        `Por favor, me envie um endereço de website para que eu possa consultá-lo.`
      );
      return;
    }

    await client.sendText(
      message.from,
      `Obrigado por me enviar um endereço. Consultarei as informações sobre o domínio.\n→ ${url}`
    );
    await mutex.runExclusive(async () => {
      url = url.replace(/https?[:\/]*/gi, "");
      url = url.split("/")[0];
      if (url.endsWith(".com")) url += ".br";
      try {
        console.log(url);
        const data = await getWhoisData(url);
        if (data["errorCode"] !== 400 && data !== null) {
          await client.sendText(
            message.from,
            `O endereço ${url} endereço é válido.`
          );
          if (getDataFromDB(url)) {
            await client.sendText(message.from, `Já existe no banco de dados.`);
            return;
          }
          const mutexApi = new Mutex();

          await mutexApi.runExclusive(async () => {
            try {
              await client.sendText(
                message.from,
                `Aguarde um pouco que estou analisando os dados do website.`
              );
              // await sleep(20000); // Limitado a 3 req./min
              // console.log(data);

              const whoIsData = getUsefulWhoisData(data);
              const rfData = await getRfData(whoIsData.cnpj);
              const resultData = await mergeData(whoIsData, rfData);
              if (resultData) {
                await client.sendText(
                  message.from,
                  `Analisei os dados do domínio.`
                );
                insertData(resultData);
              }
            } catch {
              await client.sendText(
                message.from,
                `Tive um erro ao tentar consultar os dados do seu link:\n→ ${url}`
              );
            } finally {
              await sleep(20000);
            }
          });
        } else {
          await client.sendText(
            message.from,
            `Não é um endereço existente.\nCertifique-se que foi digitado corretamente e com os devidos espaçamentos.`
          );
          return;
        }
      } catch {
        //Erro no fetch
        await client.sendText(
          message.from,
          `Tive um erro ao tentar consultar o seu link:\n→ ${url}`
        );
      } //finally {
      //   mutex.release();
      // }
    });
  });
}

async function getWhoisData(url) {
  console.log("searching whois data");
  try {
    const response = await fetch(`http://localhost:80/whois/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 404) {
      return null;
    }
    console.log(response.status);
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter dados Whois.", error);
    return null;
  }
}

async function getRfData(cnpj) {
  console.log("searching receita data");
  const cnpjSanitized = cnpj.replace(/[^\d]+/g, "");
  try {
    let response = await fetch(`http://localhost:80/receita/${cnpjSanitized}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.status);
    if (response.status === 404) {
      return null;
    }
    console.log(response.status, "Busca Receita");
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter dados Receita.");
    return null;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
