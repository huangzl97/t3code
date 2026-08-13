import { randomUUID } from "node:crypto";

export class T3Client {
  constructor(config) {
    this.config = config;
  }

  async getShell() {
    return this.request("/api/orchestration/shell");
  }

  async request(path, init = {}) {
    const response = await fetch(`${this.config.baseUrl}${path}`, init);
    if (!response.ok) throw new Error(`T3 request failed: ${response.status}`);
    return response.json();
  }
}

export function newId() {
  return randomUUID();
}
