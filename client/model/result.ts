export interface Result {
  domain: string | null;
  created: string | null;
  changed: string | null;
  expiration: string | null;
  cnpj: string | null;
  name: string | null;
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
