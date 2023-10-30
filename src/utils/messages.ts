export const trusted = `Confiável`;
export const inconclusive = `Não é possível definir com precisão`;
export const untrusted = `Não é confiável`;

export function printSuccess(data: resultData) {
  return `O domínio ${data.domain} possui os seguintes dados:
Criado: ${formatData(data.created)}
Última vez alterado: ${formatData(data.changed)}
Expira em: ${formatData(data.expiration)}
CNPJ: ${data.cnpj}
CNPJ Ativo: ${data.active_cnpj == true ? "Sim" : "Não"}
Telefone: ${data.tel}
E-mail: ${data.email}
Endereço: Rua ${data.address.place} N° ${data.address.number} CEP ${
    data.address.cep
  }\nCidade: ${data.address.city} - (${data.address.uf})`;
}

function formatData(date: string | null) {
  if (date != null) {
    const newDate = date.split("-");
    return newDate[2] + "/" + newDate[1] + "/" + newDate[0];
  }
  return `Não há data definida`;
}
interface resultData {
  domain: string | null;
  created: string | null;
  changed: string | null;
  expiration: string | null;
  cnpj: string | null;
  date: string | null;
  active_cnpj: boolean | null;
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
