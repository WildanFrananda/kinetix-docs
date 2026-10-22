import { securityContact } from "./security_contact";

export function securityTxt(site: URL | undefined): string {
  if (site === undefined) {
    throw new Error("security.txt needs the site's URL to name its canonical address and its policy");
  }

  return [
    `Contact: ${securityContact.report}`,
    `Expires: ${securityContact.expires}`,
    `Preferred-Languages: ${securityContact.languages.join(", ")}`,
    `Canonical: ${new URL("/.well-known/security.txt", site).href}`,
    `Policy: ${new URL(securityContact.policyPath, site).href}`,
    ""
  ].join("\n");
}
