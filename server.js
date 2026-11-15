/* Maatje: static site plus accounts and groups, stored in data/store.json. */
const http = require("http");
const https = require("https");
const net = require("net");
const tls = require("tls");
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
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
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
function cleanVideo(value) {
  const url = String(value || "").trim().slice(0, 300);
  if (/^https:\/\/([a-z0-9-]+\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\//i.test(url)) return url;
  if (/^https:\/\/.+\.(jpe?g|png|webp)(\?.*)?$/i.test(url)) return url;
  if (/^\/media\/memes\/[a-z0-9-]+\.(jpe?g|png|webp)$/i.test(url)) return url;
  return "";
}
function cleanMeme(body, id) {
  const name = String(body.name || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
  const video = cleanVideo(body.video);
  let sips = Number(body.sips);
  if (!Number.isFinite(sips)) sips = 2;
  sips = Math.max(1, Math.min(4, Math.round(sips)));
  if (name.length < 2) throw new Error("Geef de meme een naam.");
  if (!video) throw new Error("Plak een YouTube-link of upload een foto.");
  return { id, name, video, sips };
}
function removeMedia(video) {
  if (!/^\/media\/memes\/[a-z0-9-]+\.(jpe?g|png|webp|mp4|webm)$/i.test(String(video || ""))) return;
  const file = path.resolve(root, String(video).replace(/^\/+/, ""));
  const dir = path.resolve(root, "media", "memes");
  if (file !== dir && file.startsWith(dir + path.sep)) fs.unlink(file, () => {});
}
function nextMemeId(list) {
  let n = 0;
  list.forEach((m) => {
    const hit = /^m(\d+)$/.exec(String(m.id || ""));
    if (hit) n = Math.max(n, Number(hit[1]));
  });
  return "m" + (n + 1);
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
function readRaw(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) { req.destroy(); reject(new Error("Foto is te groot. Max 8 MB.")); return; }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
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
  return { id: user.id, name: user.name, email: user.email || "", verified: user.verified !== false, icon: user.icon || "glass", color: user.color || "blue", age: user.age || "20-25", google: !!user.googleSub };
}
function cleanEmail(value) {
  const email = String(value || "").trim().toLowerCase().slice(0, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}
function originOf(req) {
  const host = req.headers.host || "localhost:" + port;
  const proto = req.headers["x-forwarded-proto"] || "http";
  return proto + "://" + host;
}
function mailReady(config) {
  const mail = config.mail || {};
  return !!(mail.host && mail.user && mail.pass && mail.from);
}
function sendMail(config, message) {
  const mail = config.mail || {};
  const portNo = Number(mail.port) || 587;
  const secure = portNo === 465;
  return new Promise((resolve, reject) => {
    let buf = "";
    let step = 0;
    let upgraded = secure;
    let sock;
    const timer = setTimeout(() => fail(new Error("mail timeout")), 15000);
    function fail(err) { clearTimeout(timer); try { sock.destroy(); } catch (e) {} reject(err); }
    function write(line) { sock.write(line + "\r\n"); }
    function handle(code) {
      if (step === 0) {
        if (code >= 400) return fail(new Error("smtp greeting"));
        write("EHLO maatje"); step = 1; return;
      }
      if (step === 1) {
        if (code >= 400) return fail(new Error("smtp ehlo"));
        if (!upgraded) { write("STARTTLS"); step = 2; return; }
        write("AUTH LOGIN"); step = 3; return;
      }
      if (step === 2) {
        if (code !== 220) return fail(new Error("smtp starttls"));
        sock.removeAllListeners("data");
        sock.removeAllListeners("error");
        const plain = sock;
        sock = tls.connect({ socket: plain, servername: mail.host });
        upgraded = true;
        buf = "";
        sock.on("data", onData);
        sock.on("error", fail);
        sock.once("secureConnect", () => { step = 1; write("EHLO maatje"); });
        return;
      }
      if (step === 3) {
        if (code !== 334) return fail(new Error("smtp auth"));
        write(Buffer.from(String(mail.user)).toString("base64")); step = 4; return;
      }
      if (step === 4) {
        if (code !== 334) return fail(new Error("smtp user"));
        write(Buffer.from(String(mail.pass)).toString("base64")); step = 5; return;
      }
      if (step === 5) {
        if (code !== 235) return fail(new Error("smtp wachtwoord"));
        write("MAIL FROM:<" + mail.from + ">"); step = 6; return;
      }
      if (step === 6) {
        if (code >= 400) return fail(new Error("smtp from"));
        write("RCPT TO:<" + message.to + ">"); step = 7; return;
      }
      if (step === 7) {
        if (code >= 400) return fail(new Error("smtp to"));
        write("DATA"); step = 8; return;
      }
      if (step === 8) {
        if (code !== 354) return fail(new Error("smtp data"));
        const text = String(message.text || "").replace(/^\./gm, "..");
        sock.write([
          "From: Maatje <" + mail.from + ">",
          "To: <" + message.to + ">",
          "Subject: " + message.subject,
          "MIME-Version: 1.0",
          "Content-Type: text/plain; charset=utf-8",
          "",
          text,
          ".",
          "",
        ].join("\r\n"));
        step = 9;
        return;
      }
      if (step === 9) {
        if (code >= 400) return fail(new Error("smtp send"));
        write("QUIT");
        clearTimeout(timer);
        resolve();
      }
    }
    function onData(chunk) {
      buf += chunk.toString("utf8");
      let idx;
      while ((idx = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, idx).replace(/\r$/, "");
        buf = buf.slice(idx + 1);
        if (line.length < 4 || line[3] === "-") continue;
        const code = Number(line.slice(0, 3));
        if (code) handle(code);
      }
    }
    sock = secure ? tls.connect({ host: mail.host, port: portNo, servername: mail.host }) : net.connect(portNo, mail.host);
    sock.on("data", onData);
    sock.on("error", fail);
  });
}
async function deliverVerify(config, req, user) {
  const link = originOf(req) + "/?verify=" + user.verifyToken;
  const text = "Hoi " + user.name + ",\n\nBevestig je e-mail voor Maatje via deze link:\n" + link + "\n\nDaarna kun je met vrienden meedoen via een code. Kijken en op één telefoon spelen kon al zonder account.\n";
  if (!mailReady(config)) return { mailed: false, previewLink: link };
  await sendMail(config, { to: user.email, subject: "Bevestig je mail voor Maatje", text });
  return { mailed: true, previewLink: "" };
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
  if (req.method === "GET" && pathName === "/api/memes") {
    send(res, 200, { memes: Array.isArray(config.memes) ? config.memes : [] });
    return;
  }
  if (req.method === "POST" && pathName === "/api/admin/login") {
    const body = await readBody(req);
    const expectedUser = String(config.adminUser || "admin").trim();
    const expected = String(config.adminPassword || "");
    const username = String(body.username || "").trim();
    if (!expected || username !== expectedUser || String(body.password || "") !== expected) {
      send(res, 401, { error: "Verkeerde gegevens." });
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
  if (req.method === "POST" && pathName === "/api/admin/memes/upload") {
    if (!adminOf(req)) { send(res, 401, { error: "Niet als beheerder ingelogd." }); return; }
    const raw = await readRaw(req, 12 * 1024 * 1024);
    let body = {};
    try { body = JSON.parse(raw.toString("utf8")); } catch (e) { throw new Error("Upload mislukt."); }
    const buf = Buffer.from(String(body.data || ""), "base64");
    if (buf.length < 100 || buf.length > 8 * 1024 * 1024) throw new Error("Foto is te groot of leeg. Max 8 MB.");
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    const isPng = buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    const isWebp = buf.length > 12 && buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP";
    if (!isJpeg && !isPng && !isWebp) throw new Error("Alleen jpg, png of webp.");
    const ext = isJpeg ? "jpg" : (isPng ? "png" : "webp");
    const id = "clip-" + crypto.randomBytes(6).toString("hex");
    const dir = path.join(root, "media", "memes");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, id + "." + ext), buf);
    send(res, 200, { video: "/media/memes/" + id + "." + ext });
    return;
  }
  if (pathName === "/api/admin/memes" || pathName.startsWith("/api/admin/memes/")) {
    if (!adminOf(req)) { send(res, 401, { error: "Niet als beheerder ingelogd." }); return; }
    const list = Array.isArray(config.memes) ? config.memes.slice() : [];
    if (req.method === "POST" && pathName === "/api/admin/memes") {
      const meme = cleanMeme(await readBody(req), nextMemeId(list));
      list.push(meme);
      config.memes = list;
      saveConfig(config);
      send(res, 200, { memes: list, meme });
      return;
    }
    const memeMatch = /^\/api\/admin\/memes\/(m\d+)$/.exec(pathName);
    if (!memeMatch) { send(res, 404, { error: "Niet gevonden" }); return; }
    const memeIdx = list.findIndex((m) => m.id === memeMatch[1]);
    if (memeIdx < 0) { send(res, 404, { error: "Meme niet gevonden" }); return; }
    if (req.method === "PATCH") {
      const prev = list[memeIdx].video;
      list[memeIdx] = cleanMeme(await readBody(req), memeMatch[1]);
      if (prev !== list[memeIdx].video) removeMedia(prev);
      config.memes = list;
      saveConfig(config);
      send(res, 200, { memes: list });
      return;
    }
    if (req.method === "DELETE") {
      if (list.length < 2) throw new Error("Laat minstens één meme staan.");
      removeMedia(list[memeIdx].video);
      list.splice(memeIdx, 1);
      config.memes = list;
      saveConfig(config);
      send(res, 200, { memes: list });
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
    const email = cleanEmail(body.email);
    if (!email) throw new Error("Vul een echt e-mailadres in.");
    if (store.users.some((u) => u.email && u.email.toLowerCase() === email)) throw new Error("Dat e-mailadres is al gebruikt.");
    const user = { id: crypto.randomUUID(), name, passwordHash: pw.hash, passwordSalt: pw.salt, email, verified: false, verifyToken: crypto.randomBytes(24).toString("hex"), googleSub: "", icon: "glass", color: "blue", age: "20-25", createdAt: Date.now() };
    store.users.push(user);
    let delivery;
    try { delivery = await deliverVerify(config, req, user); }
    catch (err) { delivery = { mailed: false, previewLink: originOf(req) + "/?verify=" + user.verifyToken, mailError: err.message }; }
    saveStore(store);
    send(res, 200, { pending: true, email, mailed: !!delivery.mailed, previewLink: delivery.previewLink || "", mailError: delivery.mailError || "" });
    return;
  }
  if (req.method === "POST" && pathName === "/api/login") {
    const body = await readBody(req);
    const loginId = String(body.email || body.name || "").trim().toLowerCase();
    const name = cleanName(body.name || body.email);
    const password = String(body.password || "");
    const user = store.users.find((u) => u.passwordHash && ((u.email && u.email.toLowerCase() === loginId) || u.name.toLowerCase() === name.toLowerCase()));
    if (!user) throw new Error(loginId.includes("@") ? "Geen account met dat e-mailadres. Log in met je naam, of maak een account." : "Geen account met die naam.");
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
      user = { id: crypto.randomUUID(), name, passwordHash: "", passwordSalt: "", email: info.email || "", verified: true, googleSub: info.sub, icon: "glass", color: "blue", age: "20-25", createdAt: Date.now() };
      store.users.push(user);
    } else if (!user.googleSub) user.googleSub = info.sub;
    user.verified = true;
    const token = issueSession(store, user.id);
    saveStore(store);
    const groups = store.groups.filter((g) => (g.members || []).some((m) => m.userId === user.id)).map(publicGroup);
    send(res, 200, { token, user: publicUser(user), groups });
    return;
  }
  if (req.method === "POST" && pathName === "/api/verify") {
    const body = await readBody(req);
    const token = String(body.token || "");
    const user = store.users.find((u) => u.verifyToken && u.verifyToken === token);
    if (!user) throw new Error("Deze link is niet meer geldig. Vraag een nieuwe mail aan.");
    user.verified = true;
    user.verifyToken = "";
    const session = issueSession(store, user.id);
    saveStore(store);
    const groups = store.groups.filter((g) => (g.members || []).some((m) => m.userId === user.id)).map(publicGroup);
    send(res, 200, { token: session, user: publicUser(user), groups });
    return;
  }
  if (req.method === "POST" && pathName === "/api/resend") {
    const body = await readBody(req);
    const email = cleanEmail(body.email);
    const user = email && store.users.find((u) => u.email === email && u.verified === false);
    if (!user) { send(res, 200, { ok: true, mailed: false }); return; }
    user.verifyToken = crypto.randomBytes(24).toString("hex");
    let delivery = { mailed: false, previewLink: "" };
    try { delivery = await deliverVerify(config, req, user); }
    catch (err) { delivery = { mailed: false, previewLink: originOf(req) + "/?verify=" + user.verifyToken }; }
    saveStore(store);
    send(res, 200, { ok: true, mailed: !!delivery.mailed, previewLink: delivery.previewLink || "" });
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
