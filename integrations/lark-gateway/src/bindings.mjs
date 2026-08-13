import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export class BindingStore {
  #filePath;
  #bindings = new Map();

  constructor(filePath) {
    this.#filePath = filePath;
  }

  async load() {
    try {
      const raw = await readFile(this.#filePath, "utf8");
      const data = JSON.parse(raw);
      for (const [key, value] of Object.entries(data.bindings || {})) {
        if (value && typeof value.threadId === "string") this.#bindings.set(key, value);
      }
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }

  get(key) {
    return this.#bindings.get(key);
  }

  async set(key, value) {
    this.#bindings.set(key, value);
    await this.#flush();
  }

  async delete(key) {
    const deleted = this.#bindings.delete(key);
    if (deleted) await this.#flush();
    return deleted;
  }

  async #flush() {
    await mkdir(path.dirname(this.#filePath), { recursive: true });
    const tmp = `${this.#filePath}.tmp`;
    const body = JSON.stringify({ version: 1, bindings: Object.fromEntries(this.#bindings) }, null, 2);
    await writeFile(tmp, `${body}\n`, "utf8");
    await rename(tmp, this.#filePath);
  }
}

export function conversationKey(message) {
  const topic = message.threadId || message.rootId;
  return topic ? `${message.chatId}:thread:${topic}` : `${message.chatId}:default`;
}
