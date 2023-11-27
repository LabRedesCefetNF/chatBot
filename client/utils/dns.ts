const dns = require("dns");

export async function checkLookup(domain: String): Promise<any> {
  try {
    let altDomain = "";
    if (domain.endsWith(".br")) altDomain = domain.slice(0, -3);
    else altDomain = domain + ".br";

    const domainIPs = await resolveLookup(domain);
    const altDomainIPs = await resolveLookup(altDomain);

    const commonIPs = domainIPs.filter((ip) => altDomainIPs.includes(ip));
    console.log("COMMON", commonIPs);
    if (commonIPs.length === 0) return false;
    return true;
  } catch (e) {
    console.error(e);
  }
}

async function resolveLookup(domain: String): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.resolve(domain, (err: any, records: any) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`DNS to ${domain}:`);
      Object.keys(records).forEach((key) => {
        console.log(`${key}: ${JSON.stringify(records[key])}`);
      });

      resolve(records);
    });
  });
}
