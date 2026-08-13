import path from "node:path";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function integer(name, fallback) {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

export function loadConfig() {
  const t3BaseUrl = (process.env.T3_BASE_URL?.trim() || "http://127.0.0.1:3773").replace(/\/$/, "");

  return {
    lark: {
      appId: required("LARK_APP_ID"),
      appSecret: required("LARK_APP_SECRET"),
      requireMention: process.env.LARK_REQUIRE_MENTION !== "false",
    },
    t3: {
      baseUrl: t3BaseUrl,
      accessToken: required("T3_ACCESS_TOKEN"),
      projectId: required("T3_PROJECT_ID"),
      runtimeMode: process.env.T3_RUNTIME_MODE?.trim() || "full-access",
      interactionMode: process.env.T3_INTERACTION_MODE?.trim() || "default",
      pollIntervalMs: integer("T3_POLL_INTERVAL_MS", 1000),
      turnTimeoutMs: integer("T3_TURN_TIMEOUT_MS", 15 * 60 * 1000),
    },
    bindingsPath: path.resolve(
      process.env.LARK_BINDINGS_PATH?.trim() || ".t3-lark-bindings.json",
    ),
  };
}
