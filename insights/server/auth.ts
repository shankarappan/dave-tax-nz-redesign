import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

export type AccessConfig = {
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
  ALLOWED_EMAILS: string;
};
export class AccessError extends Error {
  status: number;
  constructor(status: number) {
    super("Private reporting access is unavailable.");
    this.status = status;
  }
}

// Never trust an email header alone. Every asset and API request passes this check.
export async function authorize(
  request: Request,
  env: AccessConfig,
  testKey?: JWTVerifyGetKey,
) {
  if (
    !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.CF_ACCESS_TEAM_DOMAIN) ||
    !env.CF_ACCESS_AUD ||
    !env.ALLOWED_EMAILS
  )
    throw new AccessError(503);
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.length > 16000) throw new AccessError(401);
  const issuer = `https://${env.CF_ACCESS_TEAM_DOMAIN}`;
  try {
    const keys =
      testKey ||
      createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`), {
        timeoutDuration: 5000,
      });
    const { payload } = await jwtVerify(token, keys, {
      issuer,
      audience: env.CF_ACCESS_AUD,
      algorithms: ["RS256"],
      maxTokenAge: "24h",
      requiredClaims: ["exp", "iat", "sub", "email"],
    });
    const email =
      typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (
      !env.ALLOWED_EMAILS.split(",")
        .map((x) => x.trim().toLowerCase())
        .includes(email)
    )
      throw new AccessError(403);
    return email;
  } catch (error) {
    if (error instanceof AccessError) throw error;
    throw new AccessError(401);
  }
}
