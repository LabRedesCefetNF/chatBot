import {
  Client,
  Message,
  LocalAuth,
  ChatId,
  MessageContent,
} from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import {
  hasValidURL,
  getUsefulWhoisData,
  mergeData,
  insertData,
  getDataFromDB,
  getWhoisData,
  getRfData,
  saveMessageSender,
  sleep,
} from "./utils/utils";
import {
  printSuccess,
  registerMessage,
  welcomeMessage,
} from "./utils/messages";
import { checkLookup } from "./utils/dns";
const { Mutex } = require("async-mutex");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Cliente conectado!");
  startBot(client);
});

client.on("authenticated", (session) => {
  console.log("Cliente autenticado!");
});

client.initialize();

async function startBot(client: Client) {
  const mutex = new Mutex();

  client.on("message", async (message: Message) => {
    if (!isValidMessage(message)) return;

    const isFirstMessage = await saveMessageSender(message);
    if (isFirstMessage) {
      await handleFirstMessage(client, message);
      return;
    }

    const url = getValidURL(message.body);
    if (!url) {
      await sendNoURLMessage(client, message);
      return;
    }

    await sendMessageWithLinkPreview(
      message.from,
      `Obrigado por me enviar um endereço. Consultarei as informações sobre o domínio. 🔍\n→ ${url}`
    );

    await mutex.runExclusive(async () => {
      const processedURL = prepareURL(url);
      await handleURLAnalysis(client, message, processedURL);
    });
  });
}

async function sendMessageWithLinkPreview(
  chatId: string,
  message: MessageContent
) {
  await client.sendMessage(chatId, message, { linkPreview: false });
}

function isValidMessage(message: Message) {
  return message.body && !message.from.includes("@g.us");
}

async function handleFirstMessage(client: Client, message: Message) {
  const { from, body } = message;
  if (body === "1") {
    await sendMessageWithLinkPreview(from, welcomeMessage());
  } else {
    await sendMessageWithLinkPreview(from, registerMessage());
  }
}

function getValidURL(body: string): string | null {
  const words = body.split(" ");
  return hasValidURL(words);
}

async function sendNoURLMessage(client: Client, message: Message) {
  await sendMessageWithLinkPreview(
    message.from,
    `Olá! Estou pronto para ajudá-lo a analisar um site.\nPor favor, sinta-se à vontade para compartilhar o link que deseja consultar.

A consulta será realizada usando informações do domínio obtidas no Registro.br e cruzando-as com os dados do Cadastro Nacional da Pessoa Jurídica (CNPJ), administrado pela Receita Federal. Contudo, *é importante entender que apenas esses dados não são suficientes para afirmar com certeza se um site é ou não confiável*.\n
💡 Para obter mais informações sobre como funciona o RickyBot, visite: https://www.rickybot.com.br/#como-funciona
📩 Para dúvidas ou suporte, entre em contato: https://www.rickybot.com.br/#ricky-contact
`
  );
}

function prepareURL(url: string): string {
  let processedURL = url.toLowerCase();
  processedURL = processedURL.replace(/https?[:\/]*/gi, "").split("/")[0];
  return processedURL;
}

async function handleURLAnalysis(
  client: Client,
  message: Message,
  url: string
) {
  const sameDNS = await checkLookup(url);
  if (sameDNS && !url.endsWith(".br")) url += ".br";

  try {
    const whoisData = await getWhoisData(url);
    if (whoisData && whoisData["errorCode"] !== 400) {
      await handleValidURL(client, message, url, whoisData);
    } else {
      await handleInvalidURL(client, message, url);
    }
  } catch (error) {
    await handleAnalysisError(client, message, url);
  }
}

async function handleValidURL(
  client: Client,
  message: Message,
  url: string,
  data: any
) {
  const { from } = message;

  await sendMessageWithLinkPreview(from, `O endereço ${url} é válido.`);

  const cachedData = getDataFromDB(url);
  if (cachedData) {
    await sendMessageWithLinkPreview(from, `${printSuccess(cachedData)}`);
    insertData(cachedData, message);
    return;
  }

  const apiMutex = new Mutex();
  await apiMutex.runExclusive(async () => {
    try {
      await sendMessageWithLinkPreview(
        from,
        `Aguarde um pouco que estou analisando os dados do website. ⏰`
      );

      const whoisInfo = getUsefulWhoisData(data)!;
      const rfData = await getRfData(whoisInfo.cnpj);
      const resultData = await mergeData(whoisInfo, rfData);

      if (resultData) {
        await sendMessageWithLinkPreview(
          from,
          `Análise *concluída*.\n\n${printSuccess(resultData)}`
        );
        insertData(resultData, message);
      }
    } catch {
      await sendMessageWithLinkPreview(
        from,
        `Tive um erro ao tentar consultar o seu link ⤵️\n→ ${url} ⚠️`
      );
    } finally {
      await sleep(20000);
    }
  });
}

async function handleInvalidURL(client: Client, message: Message, url: string) {
  await sendMessageWithLinkPreview(
    message.from,
    `Não foi possível obter os dados administrativos do domínio: ⚠️\n→ ${url}\n
Por favor, verifique se o endereço do site está correto e considere que ele pode não possuir registro no Brasil.\n
Caso o endereço não possua registro no Brasil, tenha *cuidado*, pois fica mais difícil de garantir seus direitos como consumidor. 🧐`
  );
}

async function handleAnalysisError(
  client: Client,
  message: Message,
  url: string
) {
  await sendMessageWithLinkPreview(
    message.from,
    `Não foi possível obter os dados administrativos do domínio: ⚠️\n→ ${url}\n
Por favor, verifique se o endereço do site está correto e considere que ele pode não possuir registro no Brasil.\n
Caso o endereço não possua registro no Brasil, tenha *cuidado*, pois fica mais difícil de garantir seus direitos como consumidor. 🧐`
  );
}
