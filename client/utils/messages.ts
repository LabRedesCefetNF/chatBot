import { Result } from "../model/result";

export const trusted = `Confiável`;
export const inconclusive = `Não é possível definir com precisão`;
export const untrusted = `Não é confiável`;

export function printSuccess(data: Result) {
  let message = `O domínio ${data.domain} possui os seguintes dados ⤵️\n
- *Criado:* ${printData(formatData(data.created))}
- *Última vez alterado:* ${printData(formatData(data.changed))}
- *Expira em:* ${printData(formatData(data.expiration))}`;
  console.log(data.type);
  if (data.type == "cpf")
    message += `
- *CPF:* ${data.cnpj} 🤔\n
Não foi possível realizar uma análise mais profunda dos dados, pois o domínio não está registrado com um CNPJ. 😥
⚠️ Tenha cuidado, pois domínios registrados com um CPF, possuem maior risco de anonimato, devido à dificuldade de rastrear o responsável por atividades maliciosas.`;
  else if (data.type == "cnpj") {
    message += `
- *Nome:* ${printData(data.name)}
- *CNPJ:* ${printData(data.cnpj)}
- *CNPJ Ativo:* ${data.active_cnpj == true ? "Sim ✅" : "Não ⚠️"}
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
      let link = `https://www.google.com/maps/search/${data.address.place}+${data.address.number}+${data.address.cep}+${data.address.city}+${data.address.uf}`;

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

export function welcomeMessage(name: String) {
  return `Olá, ${name}. 👋
Bem-vindo(a) ao nosso serviço de verificação de links! Estamos aqui para ajudar você a tomar decisões informadas sobre a confiabilidade de links que você recebe.
Por favor, tenha em mente as seguintes informações: ⤵️
*1.* Este bot realiza uma consulta na receita federal com os dados do responsável pelo domínio, mas não pode garantir 100% de precisão quanto a confiabilidade de um site.
*2.* A decisão final sobre confiar ou não em um link é sempre sua. Recomendamos cautela, especialmente ao abrir links de remetentes desconhecidos.
*3.* Não nos responsabilizamos por quaisquer danos resultantes do uso deste serviço. Use-o como uma ferramenta auxiliar, mas sempre confirme com suas próprias verificações. 
Se deseja prosseguir, sinta-se à vontade para compartilhar um link que deseja que seja consultado.
Tenha uma ótima experiência!`;
}
// {
//     "domain": "cefet-rj.br",
//     "created": "1996-01-01",
//     "changed": "2013-08-08",
//     "expiration": null,
//     "cnpj": "42.441.758/0001-05",
//     "date": "04/07/1998",
//     "active_cnpj": true,
//     "tel": "",
//     "email": "",
//     "address": {
//       "place": "AVENIDA MARACANA",
//       "number": "229",
//       "cep": "20.271-110",
//       "city": "RIO DE JANEIRO",
//       "uf": "RJ"
//     }
//   }
