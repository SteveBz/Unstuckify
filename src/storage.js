const PREFIX = "unstuckify:";

export const storage = {
  async set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return { key, value };
    } catch(e) { return null; }
  },
  async get(key) {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val ? { key, value: JSON.parse(val) } : null;
    } catch(e) { return null; }
  },
  async delete(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return { key, deleted: true };
    } catch(e) { return null; }
  },
  async list(prefix = "") {
    try {
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX + prefix))
        .map(k => k.slice(PREFIX.length));
      return { keys };
    } catch(e) { return { keys: [] }; }
  }
};