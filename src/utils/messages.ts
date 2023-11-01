export const trusted = `Confiável`;
export const inconclusive = `Não é possível definir com precisão`;
export const untrusted = `Não é confiável`;

export function printSuccess(data: resultData) {
  let message = `O domínio ${data.domain} possui os seguintes dados ⤵️\n
- *Criado:* ${printData(formatData(data.created))}
- *Última vez alterado:* ${printData(formatData(data.changed))}
- *Expira em:* ${printData(formatData(data.expiration))}`;
  console.log(data.type);
  if (data.type == "cpf")
    message += `
- *CPF:* ${data.cnpj}\n
Não foi possível realizar uma análise mais profunda dos dados, pois o domínio não está registrado em um CNPJ.`;
  else if (data.type == "cnpj")
    message += `
- *CNPJ:* ${printData(data.cnpj)}
- *CNPJ Ativo:* ${data.active_cnpj == true ? "Sim ✅" : "Não ⚠️"}
- *Telefone:* ${printData(data.tel)}
- *E-mail:* ${printData(data.email)}
- *Endereço:* Rua ${printData(data.address.place)} N° ${printData(
      data.address.number
    )}
- *CEP:* ${printData(data.address.cep)}
- *Cidade:* ${printData(data.address.city)} - (${printData(data.address.uf)})`;
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
interface resultData {
  domain: string | null;
  created: string | null;
  changed: string | null;
  expiration: string | null;
  cnpj: string | null;
  date: string | null;
  active_cnpj: boolean | null;
  type: string | null;
  tel: string | null;
  email: string | null;
  address: {
    place: string | null;
    number: string | null;
    cep: string | null;
    city: string | null;
    uf: string | null;
  };
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
