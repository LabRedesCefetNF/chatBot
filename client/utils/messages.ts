import { Result } from "../model/result";

export const trusted = `Confiável`;
export const inconclusive = `Não é possível definir com precisão`;
export const untrusted = `Não é confiável`;

export function printSuccess(data: Result) {
  let message = `O domínio ${data.domain} possui os seguintes dados ⤵️\n
- *Criado:* ${printData(formatData(data.created))}
- *Última vez alterado:* ${printData(formatData(data.changed))}
- *Expira em:* ${printData(formatData(data.expiration))}\n`;
  if (data.created) {
    const created = new Date(data.created);
    const date = new Date();
    const differenceMs = date.getTime() - created.getTime();

    const years = Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 365.25));

    if (years == 0)
      message += `- 🚨 *Cuidado*, o domínio enviado foi criado há menos de um ano.`;
    else if (years <= 1)
      message += `- 🚨 *Cuidado*, o domínio enviado foi criado recentemente e possui somente ${
        years == 1 ? "1 ano" : years + " anos"
      }.`;
    else if (years <= 3)
      message += `- ⚠️ O domínio enviado possui ${years} anos.`;
    else message += `- ✅ O domínio enviado possui ${years} anos.`;
  }

  if (data.type == "cpf")
    message += `\n
- *CPF:* ${data.cnpj} 🤔\n
Não foi possível realizar uma análise mais profunda dos dados, pois o domínio não está registrado com um CNPJ. 😥
⚠️ Tenha cuidado, pois domínios registrados com um CPF, possuem maior risco de anonimato, devido à dificuldade de rastrear o responsável por atividades maliciosas.`;
  else if (data.type == "cnpj") {
    message += `
- *Nome:* ${printData(data.name)}
- *CNPJ:* ${printData(data.cnpj)}
- *CNPJ Ativo:* ${data.active_cnpj == true ? "Sim ✅" : "Não 🚨"}
- *Telefone:* ${printData(data.tel)}
- *E-mail:* ${printData(data.email)}
- *Endereço:* Rua ${printData(data.address.place)} N° ${printData(
      data.address.number
    )}
- *CEP:* ${printData(data.address.cep)}
- *Cidade:* ${printData(data.address.city)} - (${printData(data.address.uf)})`;
    if (
      data.address.cep &&
      data.address.city &&
      data.address.uf &&
      data.address.place &&
      data.address.number
    ) {
      let link = `https://www.google.com/maps/search/${data.address.place}+${data.address.number}+${data.address.city}+${data.address.uf}`;

      message += `\n\n📍 Para verificar a localização desse endereço no mapa, sinta-se à vontade para utilizar o link abaixo:
${link.replace(/ /g, "+")}`;
    }
  }
  return message;
}

function formatData(date: string | null) {
  if (date != null) {
    const newDate = date.split("-");
    return newDate[2] + "/" + newDate[1] + "/" + newDate[0];
  }
  return `Não há data definida`;
}

function printData(data: string | null) {
  if (data == null || data == "") return "Não informado ⚠️";
  return data;
}

export function registerMessage(name: String) {
  return `Olá, ${name}. 👋
Bem-vindo(a) ao nosso serviço de verificação de links! Estamos aqui para ajudar você a tomar decisões mais assertivas sobre a confiabilidade de links que você suspeita.
Por favor, tenha em mente as seguintes informações: ⤵️
*1.* Este bot realiza uma consulta na receita federal com os dados do responsável pelo domínio, mas não pode garantir 100% de precisão quanto a confiabilidade de um site.
*2.* A decisão final sobre confiar ou não em um link é sempre sua. Recomendamos cautela, especialmente ao abrir links de remetentes desconhecidos.
*3.* Não nos responsabilizamos por quaisquer danos resultantes do uso deste serviço. Use-o como uma ferramenta auxiliar, mas sempre confirme com suas próprias verificações. 

→ Digite 1 se deseja prosseguir e aproveitar todas as funcionalidades de análise de website. `;
}
export function welcomeMessage() {
  return `Parabéns! 🥳
Agora você tem acesso a todos os recursos de análise de websites.
Sinta-se à vontade para compartilhar um domínio que deseja que seja consultado.
Tenha uma ótima experiência!`;
}
