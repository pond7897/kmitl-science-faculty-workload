import { test, expect } from "@playwright/test";

test.describe("Auth API", () => {
  test("GET /api/auth/login returns redirect", async ({ request }) => {
    const response = await request.get("/api/auth/login", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(302);
    const location = response.headers()["location"] ?? "";
    expect(location).toContain("oauth2/auth");
  });

  test("GET /api/auth/callback without code returns 400", async ({ request }) => {
    const response = await request.get("/api/auth/callback", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "No authorization code received" });
  });

  test("GET /api/auth/callback with code redirects to token", async ({ request }) => {
    const response = await request.get("/api/auth/callback?code=fake-code", {
      maxRedirects: 0,
    });

    expect([302, 307]).toContain(response.status());
    const location = response.headers()["location"] ?? "";
    expect(location).toContain("/api/auth/token?code=fake-code");
  });

  test("GET /api/auth/token without code returns 400", async ({ request }) => {
    const response = await request.get("/api/auth/token", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "No authorization code provided" });
  });

  test("GET /api/auth/user without access_token returns 400", async ({ request }) => {
    const response = await request.get("/api/auth/user", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "No access token provided" });
  });
});
