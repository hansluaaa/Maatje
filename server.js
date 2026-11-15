/* Maatje: static site plus accounts and groups, stored in data/store.json. */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname);
const storePath = path.join(root, "data", "store.json");
const configPath = path.join(root, "config.json");
const port = Number(process.env.PORT) || 8080;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

function loadConfig() {
  try { return JSON.parse(fs.readFileSync(configPath, "utf8")); }
  catch (e) { return { googleClientId: "" }; }
}
function saveConfig(cfg) {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}
const AGE_IDS = ["16-18", "18-20", "20-25", "25-35", "35+"];
const adminTokens = new Set();
function adminOf(req) {
  const token = String(req.headers["x-admin-token"] || "");
  return token && adminTokens.has(token);
}
function cleanQuestion(body, id) {
  const text = String(body.text || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 180);
  if (text.length < 8) throw new Error("Vraag is te kort.");
  const cat = ["licht", "groep", "pittig"].includes(body.cat) ? body.cat : "licht";
  const kind = body.kind === "point" ? "point" : "say";
  let ages = Array.isArray(body.ages) ? body.ages.filter((a) => AGE_IDS.includes(a)) : AGE_IDS.slice();
  if (cat === "pittig") ages = ages.filter((a) => a !== "16-18");
  if (!ages.length) ages = cat === "pittig" ? AGE_IDS.filter((a) => a !== "16-18") : AGE_IDS.slice();
  return { id, cat, kind, text, ages };
}
function nextQuestionId(list) {
  let n = 0;
  list.forEach((q) => {
    const m = /^q(\d+)$/.exec(String(q.id || ""));
    if (m) n = Math.max(n, Number(m[1]));
  });
  return "q" + (n + 1);
}
function emptyStore() { return { users: [], sessions: [], groups: [] }; }
function loadStore() {
  try {
    const data = JSON.parse(fs.readFileSync(storePath, "utf8"));
    return { users: data.users || [], sessions: data.sessions || [], groups: data.groups || [] };
  } catch (e) { return emptyStore(); }
}
function saveStore(store) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  const tmp = storePath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
  fs.renameSync(tmp, storePath);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 120000) { req.destroy(); reject(new Error("te groot")); }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(new Error("ongeldige json")); }
    });
    req.on("error", reject);
  });
}
function send(res, code, body) {
  const json = JSON.stringify(body);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(json);
}
function cleanName(s) {
  return String(s || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 16);
}
function hashPassword(password, salt) {
  const use = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), use, 32).toString("hex");
  return { salt: use, hash };
}
function tokenOf(req) {
  const h = req.headers.authorization || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : "";
}
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email || "", icon: user.icon || "glass", color: user.color || "blue", age: user.age || "20-25", google: !!user.googleSub };
}
function publicGroup(group) {
  return {
    id: group.id,
    name: group.name,
    code: group.code,
    ownerId: group.ownerId,
    icon: group.icon || "crown",
    color: group.color || "blue",
    age: group.age || "20-25",
    activeRoom: group.activeRoom || "",
    activeRoomAt: group.activeRoomAt || 0,
    members: (group.members || []).map((m) => ({ userId: m.userId, name: m.name, icon: m.icon, color: m.color })),
    questions: (group.questions || []).map((q) => ({ id: q.id, text: q.text, by: q.by || "" })),
    segments: (group.segments || []).map((s) => ({ id: s.id, label: s.label, text: s.text || "", sips: s.sips | 0, who: s.who || "self" })),
    evenings: (group.evenings || []).slice(-12).map((e) => ({
      at: e.at || 0,
      games: e.games || [],
      players: (e.players || []).map((p) => ({ name: p.name, sips: p.sips | 0 })),
      questions: e.questions || [],
    })),
  };
}
function userByToken(store, token) {
  if (!token) return null;
  const session = store.sessions.find((s) => s.token === token);
  if (!session) return null;
  return store.users.find((u) => u.id === session.userId) || null;
}
function code4() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
function uniqueGroupCode(store) {
  for (let i = 0; i < 20; i++) {
    const code = code4();
    if (!store.groups.some((g) => g.code === code)) return code;
  }
  return code4();
}
function verifyGoogle(idToken, clientId) {
  const url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken);
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => {
        try {
          const info = JSON.parse(data);
          if (info.error) return reject(new Error("Google herkende dit account niet."));
          if (clientId && info.aud !== clientId) return reject(new Error("Deze Google-login hoort niet bij deze site."));
          if (!info.sub) return reject(new Error("Geen Google-account."));
          resolve(info);
        } catch (e) { reject(new Error("Google gaf geen geldig antwoord.")); }
      });
    }).on("error", () => reject(new Error("Geen verbinding met Google.")));
  });
}
function issueSession(store, userId) {
  const token = crypto.randomBytes(24).toString("hex");
  store.sessions.push({ token, userId, createdAt: Date.now() });
  if (store.sessions.length > 400) store.sessions = store.sessions.slice(-400);
  return token;
}
function memberFrom(user) {
  return { userId: user.id, name: user.name, icon: user.icon || "glass", color: user.color || "blue" };
}
function syncMember(store, user) {
  for (const group of store.groups) {
    const m = (group.members || []).find((x) => x.userId === user.id);
    if (m) { m.name = user.name; m.icon = user.icon; m.color = user.color; }
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  if (url.pathname.startsWith("/api/")) {
    try { await handleApi(req, res, url); }
    catch (err) { send(res, 400, { error: err.message || "Mislukt" }); }
    return;
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  rel = rel.replace(/^\/+/, "");
  if (rel === "config.json" || rel === "data" || rel.startsWith("data/") || rel.startsWith("data\\")) {
    res.writeHead(404); res.end("niet gevonden"); return;
  }
  const file = path.resolve(root, rel);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end("nee"); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("niet gevonden"); return; }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
});

async function handleApi(req, res, url) {
  const config = loadConfig();
  const store = loadStore();
  const me = userByToken(store, tokenOf(req));
  const pathName = url.pathname;

  if (req.method === "GET" && pathName === "/api/config") {
    send(res, 200, { googleClientId: config.googleClientId || "" });
    return;
  }
  if (req.method === "GET" && pathName === "/api/questions") {
    send(res, 200, { questions: Array.isArray(config.questions) ? config.questions : [] });
    return;
  }
  if (req.method === "POST" && pathName === "/api/admin/login") {
    const body = await readBody(req);
    const expected = String(config.adminPassword || "");
    if (!expected || String(body.password || "") !== expected) {
      send(res, 401, { error: "Verkeerd wachtwoord." });
      return;
    }
    const token = crypto.randomBytes(24).toString("hex");
    adminTokens.add(token);
    send(res, 200, { token });
    return;
  }
  if (pathName === "/api/admin/questions" || pathName.startsWith("/api/admin/questions/")) {
    if (!adminOf(req)) { send(res, 401, { error: "Niet als beheerder ingelogd." }); return; }
    const list = Array.isArray(config.questions) ? config.questions.slice() : [];
    if (req.method === "POST" && pathName === "/api/admin/questions") {
      const q = cleanQuestion(await readBody(req), nextQuestionId(list));
      list.push(q);
      config.questions = list;
      saveConfig(config);
      send(res, 200, { questions: list, question: q });
      return;
    }
    const match = /^\/api\/admin\/questions\/(q\d+)$/.exec(pathName);
    if (!match) { send(res, 404, { error: "Niet gevonden" }); return; }
    const idx = list.findIndex((q) => q.id === match[1]);
    if (idx < 0) { send(res, 404, { error: "Vraag niet gevonden" }); return; }
    if (req.method === "PATCH") {
      list[idx] = cleanQuestion(await readBody(req), match[1]);
      config.questions = list;
      saveConfig(config);
      send(res, 200, { questions: list });
      return;
    }
    if (req.method === "DELETE") {
      if (list.length < 4) throw new Error("Laat minstens een paar vragen staan.");
      list.splice(idx, 1);
      config.questions = list;
      saveConfig(config);
      send(res, 200, { questions: list });
      return;
    }
    send(res, 405, { error: "Niet toegestaan" });
    return;
  }
  if (req.method === "GET" && pathName === "/api/me") {
    if (!me) { send(res, 401, { error: "Niet ingelogd" }); return; }
    const groups = store.groups.filter((g) => (g.members || []).some((m) => m.userId === me.id)).map(publicGroup);
    send(res, 200, { user: publicUser(me), groups });
    return;
  }
  if (req.method === "POST" && pathName === "/api/register") {
    const body = await readBody(req);
    const name = cleanName(body.name);
    const password = String(body.password || "");
    if (name.length < 2) throw new Error("Kies een naam van minstens 2 letters.");
    if (password.length < 4) throw new Error("Kies een wachtwoord van minstens 4 tekens.");
    if (store.users.some((u) => u.name.toLowerCase() === name.toLowerCase())) throw new Error("Die naam is al bezet.");
    const pw = hashPassword(password);
    const user = { id: crypto.randomUUID(), name, passwordHash: pw.hash, passwordSalt: pw.salt, email: "", googleSub: "", icon: "glass", color: "blue", age: "20-25", createdAt: Date.now() };
    store.users.push(user);
    const token = issueSession(store, user.id);
    saveStore(store);
    send(res, 200, { token, user: publicUser(user), groups: [] });
    return;
  }
  if (req.method === "POST" && pathName === "/api/login") {
    const body = await readBody(req);
    const name = cleanName(body.name);
    const password = String(body.password || "");
    const user = store.users.find((u) => u.name.toLowerCase() === name.toLowerCase() && u.passwordHash);
    if (!user) throw new Error("Geen account met die naam.");
    const check = hashPassword(password, user.passwordSalt);
    const a = Buffer.from(check.hash, "hex");
    const b = Buffer.from(user.passwordHash, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error("Wachtwoord klopt niet.");
    const token = issueSession(store, user.id);
    saveStore(store);
    const groups = store.groups.filter((g) => (g.members || []).some((m) => m.userId === user.id)).map(publicGroup);
    send(res, 200, { token, user: publicUser(user), groups });
    return;
  }
  if (req.method === "POST" && pathName === "/api/google") {
    const body = await readBody(req);
    if (!config.googleClientId) throw new Error("Google staat nog niet aan. Zet googleClientId in config.json.");
    const info = await verifyGoogle(String(body.credential || ""), config.googleClientId);
    let user = store.users.find((u) => u.googleSub === info.sub);
    if (!user && info.email) user = store.users.find((u) => u.email && u.email.toLowerCase() === String(info.email).toLowerCase());
    if (!user) {
      let name = cleanName(info.given_name || info.name || "Speler");
      if (name.length < 2) name = "Speler";
      const base = name;
      let n = 2;
      while (store.users.some((u) => u.name.toLowerCase() === name.toLowerCase())) name = (base + n).slice(0, 16), n += 1;
      user = { id: crypto.randomUUID(), name, passwordHash: "", passwordSalt: "", email: info.email || "", googleSub: info.sub, icon: "glass", color: "blue", age: "20-25", createdAt: Date.now() };
      store.users.push(user);
    } else if (!user.googleSub) user.googleSub = info.sub;
    const token = issueSession(store, user.id);
    saveStore(store);
    const groups = store.groups.filter((g) => (g.members || []).some((m) => m.userId === user.id)).map(publicGroup);
    send(res, 200, { token, user: publicUser(user), groups });
    return;
  }
  if (req.method === "POST" && pathName === "/api/logout") {
    const token = tokenOf(req);
    store.sessions = store.sessions.filter((s) => s.token !== token);
    saveStore(store);
    send(res, 200, { ok: true });
    return;
  }
  if (!me) { send(res, 401, { error: "Log eerst in." }); return; }

  if (req.method === "PATCH" && pathName === "/api/me") {
    const body = await readBody(req);
    if (body.name) {
      const name = cleanName(body.name);
      if (name.length < 2) throw new Error("Naam is te kort.");
      if (store.users.some((u) => u.id !== me.id && u.name.toLowerCase() === name.toLowerCase())) throw new Error("Die naam is al bezet.");
      me.name = name;
    }
    if (body.icon) me.icon = String(body.icon).slice(0, 24);
    if (body.color) me.color = String(body.color).slice(0, 24);
    if (body.age) me.age = String(body.age).slice(0, 12);
    syncMember(store, me);
    saveStore(store);
    const groups = store.groups.filter((g) => (g.members || []).some((m) => m.userId === me.id)).map(publicGroup);
    send(res, 200, { user: publicUser(me), groups });
    return;
  }
  if (req.method === "POST" && pathName === "/api/groups") {
    const body = await readBody(req);
    const name = cleanName(body.name);
    if (name.length < 2) throw new Error("Geef de groep een naam.");
    const group = {
      id: crypto.randomUUID(),
      name,
      code: uniqueGroupCode(store),
      ownerId: me.id,
      icon: "crown",
      color: me.color || "blue",
      age: me.age || "20-25",
      activeRoom: "",
      activeRoomAt: 0,
      members: [memberFrom(me)],
      questions: [],
      segments: [],
      evenings: [],
      createdAt: Date.now(),
    };
    store.groups.push(group);
    saveStore(store);
    send(res, 200, { group: publicGroup(group) });
    return;
  }
  if (req.method === "POST" && pathName === "/api/groups/join") {
    const body = await readBody(req);
    const code = String(body.code || "").toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 4);
    const group = store.groups.find((g) => g.code === code);
    if (!group) throw new Error("Geen groep met die code.");
    if (!(group.members || []).some((m) => m.userId === me.id)) group.members.push(memberFrom(me));
    if ((group.members || []).length > 24) throw new Error("Deze groep zit vol.");
    saveStore(store);
    send(res, 200, { group: publicGroup(group) });
    return;
  }

  const roomMatch = /^\/api\/groups\/([^/]+)\/room$/.exec(pathName);
  const questionMatch = /^\/api\/groups\/([^/]+)\/questions$/.exec(pathName);
  const segmentMatch = /^\/api\/groups\/([^/]+)\/segments$/.exec(pathName);
  const eveningMatch = /^\/api\/groups\/([^/]+)\/evenings$/.exec(pathName);
  const oneMatch = /^\/api\/groups\/([^/]+)$/.exec(pathName);
  if (roomMatch && req.method === "POST") {
    const group = store.groups.find((g) => g.id === roomMatch[1]);
    if (!group || !(group.members || []).some((m) => m.userId === me.id)) throw new Error("Je zit niet in deze groep.");
    const body = await readBody(req);
    group.activeRoom = String(body.code || "").toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 4);
    group.activeRoomAt = Date.now();
    saveStore(store);
    send(res, 200, { group: publicGroup(group) });
    return;
  }
  if (segmentMatch && req.method === "POST") {
    const group = store.groups.find((g) => g.id === segmentMatch[1]);
    if (!group || !(group.members || []).some((m) => m.userId === me.id)) throw new Error("Je zit niet in deze groep.");
    const body = await readBody(req);
    group.segments = group.segments || [];
    if (body.remove) {
      group.segments = group.segments.filter((s) => s.id !== String(body.remove));
    } else {
      const label = String(body.label || "").replace(/\s+/g, " ").trim().slice(0, 10);
      const text = String(body.text || "").replace(/\s+/g, " ").trim().slice(0, 80);
      const who = ["self", "all", "left", "right", "give", "none"].includes(body.who) ? body.who : "self";
      if (label.length < 2) throw new Error("Geef het vakje een korte naam.");
      if (group.segments.length >= 8) throw new Error("Een rad heeft maximaal 8 eigen vakjes.");
      group.segments.push({ id: "s" + crypto.randomBytes(3).toString("hex"), label, text, who, sips: Math.max(0, Math.min(4, body.sips | 0)) });
    }
    saveStore(store);
    send(res, 200, { group: publicGroup(group) });
    return;
  }
  if (eveningMatch && req.method === "POST") {
    const group = store.groups.find((g) => g.id === eveningMatch[1]);
    if (!group || !(group.members || []).some((m) => m.userId === me.id)) throw new Error("Je zit niet in deze groep.");
    const body = await readBody(req);
    const players = Array.isArray(body.players) ? body.players.slice(0, 12).map((p) => ({
      name: cleanName(p.name) || "Speler",
      sips: Math.max(0, Math.min(999, p.sips | 0)),
    })) : [];
    if (!players.length) throw new Error("Geen spelers om te bewaren.");
    group.evenings = group.evenings || [];
    group.evenings.push({
      at: Date.now(),
      games: Array.isArray(body.games) ? body.games.map((g) => String(g).slice(0, 12)).slice(0, 6) : [],
      players,
      questions: Array.isArray(body.questions) ? body.questions.map((q) => String(q).slice(0, 180)).slice(0, 12) : [],
    });
    group.evenings = group.evenings.slice(-20);
    saveStore(store);
    send(res, 200, { group: publicGroup(group) });
    return;
  }
  if (questionMatch && req.method === "POST") {
    const group = store.groups.find((g) => g.id === questionMatch[1]);
    if (!group || !(group.members || []).some((m) => m.userId === me.id)) throw new Error("Je zit niet in deze groep.");
    const body = await readBody(req);
    const text = String(body.text || "").replace(/\s+/g, " ").trim().slice(0, 180);
    if (text.length < 8) throw new Error("Maak de vraag iets langer.");
    group.questions = group.questions || [];
    if (group.questions.length >= 40) throw new Error("Deze groep heeft al 40 eigen vragen.");
    group.questions.push({ id: "g" + crypto.randomBytes(4).toString("hex"), text, by: me.name });
    saveStore(store);
    send(res, 200, { group: publicGroup(group) });
    return;
  }
  if (oneMatch && req.method === "PATCH") {
    const group = store.groups.find((g) => g.id === oneMatch[1]);
    if (!group || group.ownerId !== me.id) throw new Error("Alleen de maker past de groep aan.");
    const body = await readBody(req);
    if (body.age) group.age = String(body.age).slice(0, 12);
    if (body.name) {
      const name = cleanName(body.name);
      if (name.length < 2) throw new Error("Naam is te kort.");
      group.name = name;
    }
    saveStore(store);
    send(res, 200, { group: publicGroup(group) });
    return;
  }
  if (oneMatch && req.method === "POST") {
    const group = store.groups.find((g) => g.id === oneMatch[1]);
    if (!group) throw new Error("Groep niet gevonden.");
    group.members = (group.members || []).filter((m) => m.userId !== me.id);
    if (!group.members.length) store.groups = store.groups.filter((g) => g.id !== group.id);
    else if (group.ownerId === me.id) group.ownerId = group.members[0].userId;
    saveStore(store);
    send(res, 200, { ok: true });
    return;
  }
  send(res, 404, { error: "Niet gevonden" });
}

server.listen(port, "0.0.0.0");
