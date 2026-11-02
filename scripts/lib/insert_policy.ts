export function insertPolicy(html: string, policy: string): string {
  if (/http-equiv\s*=\s*"content-security-policy"/i.test(html)) {
    throw new Error("the page already carries a content security policy");
  }

  const charset = /<head>\s*<meta charset="utf-8"\/?>/i.exec(html);

  if (charset === null) {
    throw new Error("the page does not open its head with <meta charset=\"utf-8\">, so nothing can precede its scripts");
  }

  const end = charset.index + charset[0].length;

  return `${html.slice(0, end)}<meta http-equiv="content-security-policy" content="${policy}">${html.slice(end)}`;
}
