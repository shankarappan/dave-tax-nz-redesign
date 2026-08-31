import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, SignJWT, exportJWK, createLocalJWKSet } from "jose";
import { authorize } from "../server/auth.ts";
import worker from "../server/index.ts";
const { privateKey, publicKey } = await generateKeyPair("RS256");
const key = await exportJWK(publicKey);
key.kid = "test";
const jwks = createLocalJWKSet({ keys: [key] });
const env = {
  CF_ACCESS_TEAM_DOMAIN: "example.cloudflareaccess.com",
  CF_ACCESS_AUD: "intended-dashboard",
  ALLOWED_EMAILS: "owner@example.com",
};
async function token(overrides = {}) {
  return new SignJWT({ email: "owner@example.com", ...overrides })
    .setProtectedHeader({ alg: "RS256", kid: "test" })
    .setIssuer(overrides.iss || "https://example.cloudflareaccess.com")
    .setAudience(overrides.aud || "intended-dashboard")
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime(overrides.exp ?? "1h")
    .sign(privateKey);
}
test("valid signed owner identity is accepted", async () => {
  assert.equal(
    await authorize(
      new Request("https://insights.davetaxnz.nz", {
        headers: { "Cf-Access-Jwt-Assertion": await token() },
      }),
      env,
      jwks,
    ),
    "owner@example.com",
  );
});
test("absent configuration, unsigned headers and cookies fail closed", async () => {
  await assert.rejects(
    () =>
      authorize(new Request("https://insights.davetaxnz.nz"), {
        ...env,
        CF_ACCESS_TEAM_DOMAIN: "",
      }),
    (e) => e.status === 503,
  );
  await assert.rejects(
    () =>
      authorize(
        new Request("https://insights.davetaxnz.nz", {
          headers: {
            "Cf-Access-Authenticated-User-Email": "owner@example.com",
            Cookie: "CF_Authorization=anything",
          },
        }),
        env,
        jwks,
      ),
    (e) => e.status === 401,
  );
});
test("wrong audience, issuer, expired token, unapproved email and forged signature are rejected", async () => {
  for (const changes of [
    { aud: "another-app" },
    { iss: "https://evil.test" },
    { exp: 1 },
    { email: "other@example.com" },
  ]) {
    const signed = await token(changes);
    await assert.rejects(
      () =>
        authorize(
          new Request("https://insights.davetaxnz.nz", {
            headers: { "Cf-Access-Jwt-Assertion": signed },
          }),
          env,
          jwks,
        ),
      (e) => e.status === (changes.email ? 403 : 401),
    );
  }
  const signed = await token();
  const parts = signed.split(".");
  parts[2] = "a".repeat(parts[2].length);
  await assert.rejects(
    () =>
      authorize(
        new Request("https://insights.davetaxnz.nz", {
          headers: { "Cf-Access-Jwt-Assertion": parts.join(".") },
        }),
        env,
        jwks,
      ),
    (e) => e.status === 401,
  );
});
test("authenticated Worker still denies writes and unknown APIs", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    assert.equal(
      String(input),
      "https://example.cloudflareaccess.com/cdn-cgi/access/certs",
    );
    return Response.json({ keys: [key] });
  };
  try {
    const config = {
      ...env,
      DASHBOARD_ORIGIN: "https://insights.davetaxnz.nz",
    };
    const signed = await token();
    for (const [path, method, status] of [
      ["/api/report", "POST", 405],
      ["/api/delete", "GET", 404],
      ["/__private_cache/test", "GET", 404],
    ]) {
      const response = await worker.fetch(
        new Request(`https://insights.davetaxnz.nz${path}`, {
          method,
          headers: { "Cf-Access-Jwt-Assertion": signed },
        }),
        config,
        {},
      );
      assert.equal(response.status, status);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});
test("Worker protects both assets and API before calling bindings or cache", async () => {
  let calls = 0;
  const config = {
    ...env,
    CF_ACCESS_AUD: "",
    DASHBOARD_ORIGIN: "https://insights.davetaxnz.nz",
    ASSETS: {
      fetch: () => {
        calls++;
        return new Response("private");
      },
    },
  };
  for (const path of [
    "/",
    "/assets/app.js",
    "/catalog.json",
    "/api/report",
    "/__private_cache/v1/test",
  ]) {
    const response = await worker.fetch(
      new Request(`https://insights.davetaxnz.nz${path}`),
      config,
      {},
    );
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(
      response.headers.get("X-Robots-Tag"),
      "noindex, nofollow, noarchive",
    );
  }
  assert.equal(calls, 0);
  assert.equal(
    (
      await worker.fetch(
        new Request("https://worker.workers.dev/api/report"),
        config,
        {},
      )
    ).status,
    404,
  );
});
