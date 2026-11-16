(() => {
  "use strict";

  const COLORS = [
    { id: "red", hex: "#ff4b4b", label: "rood" },
    { id: "orange", hex: "#ff8a1f", label: "oranje" },
    { id: "green", hex: "#22c55e", label: "groen" },
    { id: "teal", hex: "#2dd4bf", label: "turquoise" },
    { id: "blue", hex: "#3b82f6", label: "blauw" },
    { id: "purple", hex: "#a855f7", label: "paars" },
    { id: "pink", hex: "#f43f8a", label: "roze" },
    { id: "mint", hex: "#14b8a6", label: "mint" },
    { id: "yellow", hex: "#f5c518", label: "geel" },
    { id: "sand", hex: "#f4f0e6", label: "zand" },
  ];

  const ICONS = [
    ["glass", "Glas", '<path d="M8 3h8l-.8 7.2a3.6 3.6 0 0 1-6.4 0L8 3z"/><path d="M12 14.5V19"/><path d="M9 21h6"/><path d="M8.6 7h6.8"/>'],
    ["bolt", "Bliksem", '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>'],
    ["flame", "Vlam", '<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1.2-3.2 2-4.5C10.5 8 12 8 12 6c0 0 .2-1.2 0-3z"/>'],
    ["star", "Ster", '<path d="m12 3 2.2 4.7 5.1.6-3.8 3.4 1.1 5-4.6-2.6L7.4 16.7l1.1-5L4.7 8.3l5.1-.6L12 3z"/>'],
    ["crown", "Kroon", '<path d="M3 17 5.2 8l3.3 3.2L12 6l3.5 5.2L18.8 8 21 17H3z"/><path d="M5 20h14"/>'],
    ["moon", "Maan", '<path d="M16 3.4A7.2 7.2 0 1 0 20.6 14 5.6 5.6 0 0 1 16 3.4z"/>'],
    ["dice", "Dobbelsteen", '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>'],
    ["heart", "Hart", '<path d="M12 19s-6.2-3.8-6.2-8A3.4 3.4 0 0 1 12 8.2 3.4 3.4 0 0 1 18.2 11c0 4.2-6.2 8-6.2 8z"/>'],
    ["music", "Muziek", '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.2"/><circle cx="17" cy="16" r="2.2"/>'],
    ["smile", "Lach", '<circle cx="12" cy="12" r="8"/><path d="M8 14.2c1.1 1.4 2.4 2 4 2s2.9-.6 4-2"/><path d="M9 10h.01M15 10h.01"/>'],
    ["coffee", "Koffie", '<path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z"/><path d="M16 9h1.6a2.2 2.2 0 0 1 0 4.4H16"/><path d="M8 4c.2 1 .8 1 .8 2M12 4c.2 1 .8 1 .8 2"/>'],
    ["diamond", "Ruit", '<path d="M12 3 20 9.5 12 21 4 9.5 12 3z"/><path d="M4 9.5h16"/>'],
    ["sun", "Zon", '<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"/>'],
    ["comet", "Komeet", '<path d="M14.5 14.5a4.2 4.2 0 1 1-1.2-4.8"/><path d="M13 10 4 4M12.2 12.2 5.5 8M11.2 14 7 12"/>'],
    ["chat", "Praat", '<path d="M6 17.2 3.8 20.5l4.2-1.2A7.6 7.6 0 1 0 6 17.2z"/>'],
    ["shield", "Schild", '<path d="M12 3 19 6v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6l7-3z"/>'],
  ].map(([id, label, body]) => ({
    id,
    label,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`,
  }));

  const SEGMENTS = [
    { id: "all", label: "Allemaal", emoji: "🍻", fg: "#fff", bg: "#2563eb", needs: "" },
    { id: "self2", label: "2 slok", emoji: "✌️", fg: "#fff", bg: "#6d28d9", needs: "" },
    { id: "give", label: "Weggeven", emoji: "👉", fg: "#fff", bg: "#be185d", needs: "target" },
    { id: "left", label: "Links", emoji: "◀️", fg: "#fff", bg: "#0f766e", needs: "" },
    { id: "right", label: "Rechts", emoji: "▶️", fg: "#fff", bg: "#c2410c", needs: "" },
    { id: "water", label: "Waterval", emoji: "🌊", fg: "#fff", bg: "#4338ca", needs: "" },
    { id: "cat", label: "Thema", emoji: "🎲", fg: "#fff", bg: "#0e7490", needs: "" },
    { id: "free", label: "Vrij", emoji: "⭐", fg: "#fff", bg: "#1d4ed8", needs: "" },
    { id: "mate", label: "Maatje", emoji: "🤝", fg: "#fff", bg: "#a21caf", needs: "target" },
    { id: "story", label: "Verhaal", emoji: "💬", fg: "#fff", bg: "#047857", needs: "choice" },
    { id: "except", label: "Behalve", emoji: "🙃", fg: "#fff", bg: "#b45309", needs: "" },
    { id: "again", label: "Opnieuw", emoji: "🔁", fg: "#fff", bg: "#4f46e5", needs: "" },
  ];

  const CATEGORIES = ["biermerken", "frisdrank", "films", "series", "hoofdsteden", "snacks", "automerken", "sporten", "apps", "dieren", "landen", "liedjes", "beroepen", "schoolvakken", "ijsjes"];

  let QUESTIONS = [
    ["q01", "licht", "say", "Wat was het laatste wat je op je telefoon hebt opgezocht?"],
    ["q02", "licht", "say", "Welk nummer zing je mee, terwijl je het eigenlijk niet goed vindt?"],
    ["q03", "licht", "say", "Wat eet je het liefst als je om twee uur nog wakker bent?"],
    ["q04", "licht", "say", "Welke serie heb je stiekem helemaal uitgekeken?"],
    ["q05", "licht", "say", "Waar zou je morgen heen gaan als de trein gratis was?"],
    ["q06", "licht", "say", "Wat is het enige gerecht dat je echt kunt koken?"],
    ["q07", "licht", "say", "Hoe laat had je vanavond thuis willen zijn?"],
    ["q08", "licht", "say", "Welke app mag van jou wel een week weg?"],
    ["q09", "licht", "say", "Wat is het beste advies dat je ooit genegeerd hebt?"],
    ["q10", "licht", "say", "Welk drankje op tafel kies je als je er nog een mag?"],
    ["q11", "licht", "say", "Liever een weekend zonder muziek, of een weekend zonder je telefoon?"],
    ["q12", "licht", "say", "Welke kleine ergernis wordt bij jou veel te groot?"],
    ["q13", "groep", "point", "Wijs aan: wie is het vaakst te laat?"],
    ["q14", "groep", "point", "Wijs aan: wie stuurt de langste spraakberichten?"],
    ["q15", "groep", "point", "Wijs aan: wie redt zich op een festival zonder powerbank?"],
    ["q16", "groep", "point", "Wijs aan: wie danst het eerst als er muziek opstaat?"],
    ["q17", "groep", "point", "Wijs aan: wie kookt het chaotischst?"],
    ["q18", "groep", "point", "Wijs aan: wie wint een potje kaarten zonder moeite?"],
    ["q19", "groep", "point", "Wijs aan: wie bewaart een geheim het slechtst?"],
    ["q20", "groep", "point", "Wijs aan: wie ken je het minst? Stel diegene één vraag."],
    ["q21", "groep", "point", "Wijs aan: wie zegt het eerst ja tegen een slecht plan?"],
    ["q22", "groep", "point", "Wijs aan: wie gaat vanavond als laatste naar huis?"],
    ["q23", "groep", "point", "Wijs aan: wie is het rustigst aan deze tafel?"],
    ["q24", "groep", "point", "Wijs aan: met wie zou je een escape room willen doen?"],
    ["q25", "pittig", "say", "Wat is een rode vlag van jou, in één zin?"],
    ["q26", "pittig", "say", "Wat is het domste dat je deed om indruk te maken?"],
    ["q27", "pittig", "say", "Welk gerucht over jou klopt een klein beetje?"],
    ["q28", "pittig", "say", "Welk excuus gebruik je te vaak?"],
    ["q29", "pittig", "say", "Wat zeg je niet hardop als je helemaal nuchter bent?"],
    ["q30", "pittig", "say", "Wat is je slechtste openingszin tot nu toe?"],
    ["q31", "pittig", "say", "Welke huisregel zou jij vanavond invoeren?"],
    ["q32", "pittig", "say", "Wat is een mening waar je vrienden het niet mee eens zijn?"],
    ["q33", "pittig", "say", "Wat deed je een keer en dacht je meteen: waarom?"],
    ["q34", "pittig", "say", "Welk kinderachtig ding maakt je echt boos?"],
    ["q35", "pittig", "say", "Wat is je meest nutteloze talent?"],
    ["q36", "pittig", "say", "Wie aan tafel krijgt van jou het voordeel van de twijfel? Zeg de naam, of drink."],
    ["q40", "licht", "say", "Welk vak zou je het liefst skippen?", ["16-18"]],
    ["q41", "groep", "point", "Wijs aan: wie appt het meest op een schooldag?", ["16-18"]],
    ["q42", "licht", "say", "Wat is je slechtste excuus om te laat te komen?", ["16-18"]],
    ["q43", "licht", "say", "Welke docent heeft stiekem een goede playlist?", ["16-18"]],
    ["q44", "licht", "say", "Wat zet je op je story en haal je daarna weer weg?", ["16-18", "18-20"]],
    ["q45", "groep", "point", "Wijs aan: wie maakt als eerste de groepsapp voor een feestje?", ["16-18", "18-20"]],
    ["q46", "licht", "say", "Liever een proefwerk of een spreekbeurt?", ["16-18"]],
    ["q47", "licht", "say", "Welk nummer mag van jou nooit op een schoolfeest?", ["16-18"]],
    ["q50", "licht", "say", "Wat is je standaard bestelling als je uitgaat?", ["18-20", "20-25"]],
    ["q51", "licht", "say", "Hoe laat was je echt thuis de laatste keer?", ["18-20", "20-25"]],
    ["q52", "groep", "point", "Wijs aan: wie stuurt ‘ik kom eraan’ terwijl die nog thuis is?", ["18-20", "20-25"]],
    ["q53", "licht", "say", "Welke studie zou je nu kiezen als je opnieuw mocht?", ["18-20"]],
    ["q54", "groep", "point", "Wijs aan: wie blijft het langst hangen na sluitingstijd?", ["18-20", "20-25"]],
    ["q60", "licht", "say", "Wat is de eerste app die je opent op een werkdag?", ["20-25", "25-35"]],
    ["q61", "groep", "point", "Wijs aan: wie heeft het drukst en doet het minst?", ["20-25", "25-35"]],
    ["q62", "licht", "say", "Beschrijf je laatste date in één zin, of sla over.", ["20-25"]],
    ["q63", "licht", "say", "Wat koop je te vaak ‘voor de gezelligheid’?", ["20-25", "25-35"]],
    ["q64", "licht", "say", "Hoeveel keer snooze je echt?", ["20-25", "25-35", "35+"]],
    ["q70", "licht", "say", "Hoe ziet jouw ideale zondag eruit, zonder verplichtingen?", ["25-35", "35+"]],
    ["q71", "groep", "point", "Wijs aan: wie regelt altijd de planning?", ["25-35", "35+"]],
    ["q72", "licht", "say", "Welk klusje in huis stel je al maanden uit?", ["25-35", "35+"]],
    ["q73", "licht", "say", "Welke mening had je op je twintigste en nu niet meer?", ["25-35", "35+"]],
    ["q80", "licht", "say", "Wat deed je vroeger op een avond dat je nu niet meer trekt?", ["35+"]],
    ["q81", "groep", "point", "Wijs aan: wie gaat als eerste naar huis, en terecht?", ["25-35", "35+"]],
    ["q82", "licht", "say", "Welk advies geef je de jongste aan tafel?", ["35+", "25-35"]],
    ["q83", "licht", "say", "Wat is je favoriete excuus om een feestje eerder te verlaten?", ["35+", "25-35"]],
  ].map(([id, cat, kind, text, ages]) => ({
    id,
    cat,
    kind,
    text,
    ages: ages || (cat === "pittig" ? ["18-20", "20-25", "25-35", "35+"] : ["16-18", "18-20", "20-25", "25-35", "35+"]),
  }));

  const AGES = [
    { id: "16-18", label: "16–18", hint: "School en vrienden. Geen pittige vragen." },
    { id: "18-20", label: "18–20", hint: "Uitgaan, studie, lichte chaos." },
    { id: "20-25", label: "20–25", hint: "Werk, dates en de borrel." },
    { id: "25-35", label: "25–35", hint: "Huis, planning, nog steeds een avond." },
    { id: "35+", label: "35+", hint: "Droog, herkenbaar, eerder naar huis mag." },
  ];

  let MEMES = [
    { id: "m01", name: "Jurk!", video: "https://www.youtube.com/watch?v=lsTMQ3SGF_g", sips: 2 },
    { id: "m02", name: "Links, rechts en kaas", video: "https://www.youtube.com/shorts/R6PMfdyWxdQ", sips: 2 },
    { id: "m03", name: "Okay, let's go", video: "https://www.youtube.com/watch?v=AWM5ZNdWlqw", sips: 2 },
    { id: "m04", name: "Op je muil, gauw", video: "https://www.youtube.com/watch?v=rbV5WlxusAc", sips: 2 },
    { id: "m05", name: "Turbo Polyp", video: "https://www.youtube.com/watch?v=xb0-7XOYDxg", sips: 2 },
  ];

  const GAMES = [
    { id: "rad", name: "Het Rad", tag: "Makkelijk", time: "± 10 min", blurb: "Draai aan het rad en doe wat het vakje zegt. Soms drink je, soms wijs je iemand aan." },
    { id: "vragen", name: "Vragenvuur", tag: "Vragen", time: "± 15 min", blurb: "Een vraag voor één iemand. Antwoorden mag. Twee slokken nemen ook." },
    { id: "kaarten", name: "Hoger of Lager", tag: "Kaarten", time: "± 10 min", blurb: "Raad of de volgende kaart hoger of lager is. Fout is twee slokken." },
    { id: "memes", name: "Memes", tag: "Foto", time: "± 10 min", blurb: "Je ziet een foto. Ken je het filmpje, dan deel je slokken uit. Weet je het niet, dan drink je zelf." },
  ];

  const RULES = {
    rad: { title: "Het Rad", lines: ["Je draait om de beurt.", "Doe wat het vakje zegt. De tekst eronder legt het uit.", "Links en rechts volgen de namen, met de klok mee.", "De teller telt alleen slokken die het spel aanwijst. Bij waterval en thema tel je zelf.", "Eén slok is genoeg. Niemand hoeft leeg te drinken."] },
    vragen: { title: "Vragenvuur", lines: ["Lees de vraag hardop.", "Geef antwoord, of neem 2 slokken en sla de vraag over.", "Bij ‘wijs aan’ wijs je iemand aan tafel aan.", "Pittig is plagerig. Sla over als je niet wilt."] },
    kaarten: { title: "Hoger of Lager", lines: ["Je ziet een kaart. Raad of de volgende hoger of lager is.", "Aas is het hoogst, daarna heer, vrouw en boer.", "Goed: niemand drinkt. Fout: jij neemt 2 slokken. Dezelfde waarde: iedereen 1.", "Daarna is de nieuwe kaart de startkaart."] },
    memes: { title: "Memes", lines: ["Je ziet een foto, niet het filmpje.", "Weet je het, zeg het hardop en tik Verteld. Dan zie je het antwoord.", "Weet je het niet, dan drink je zelf en zie je het antwoord ook."] },
  };

  const SUITS = [
    { sym: "♠", name: "schoppen", red: false },
    { sym: "♥", name: "harten", red: true },
    { sym: "♦", name: "ruiten", red: true },
    { sym: "♣", name: "klaveren", red: false },
  ];

  const BROKERS = ["wss://broker.hivemq.com:8884/mqtt", "wss://broker.emqx.io:8084/mqtt"];

  const app = {
    root: null,
    meId: "",
    profile: null,
    draft: null,
    draftPlayers: [],
    screen: "home",
    overlay: null,
    afterStyle: null,
    mode: null,
    isHost: false,
    tv: false,
    roomCode: "",
    state: null,
    conn: "off",
    error: "",
    sound: true,
    authReady: false,
    admin: false,
    adminToken: "",
    questionsRev: 0,
    memesRev: 0,
    audio: null,
    token: "",
    account: null,
    groups: [],
    config: { googleClientId: "" },
    groupId: "",
    seen: new Set(),
    op: 0,
    joinTimer: null,
    ui: {
      filter: "mix",
      age: "20-25",
      authName: "",
      authEmail: "",
      authPass: "",
      authHint: "",
      pendingEmail: "",
      previewLink: "",
      groupName: "",
      groupCode: "",
      customQ: "",
      codeValue: "",
      how: "",
      addName: "",
      rules: "",
      confirmLeave: false,
      noRoom: false,
      stale: false,
      joinWait: "",
      fp: "",
      lastView: "",
      lockSpinId: "",
      revealAt: 0,
      spinPainted: "",
      justStartedSpin: false,
      wheelRot: 0,
      soundFor: "",
      scrolled: "",
      turnKey: "",
      spinLock: false,
      editId: "",
      adminTab: "vragen",
      timerInt: null,
      timerLeft: 0,
      revealTimer: null,
    },
  };

  const net = { client: null, stateTopic: "", inTopic: "", attempt: 0, connecting: null, cancelConn: null, repairT: null, closing: false };

  function uid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Math.random().toString(16).slice(2) + Date.now().toString(16);
  }
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function cleanName(s, fallback) {
    const out = Array.from(String(s ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim()).slice(0, 16).join("");
    return out || fallback;
  }
  function validIcon(id) { return ICONS.some((i) => i.id === id) ? id : "glass"; }
  function validColor(id) { return COLORS.some((c) => c.id === id) ? id : "blue"; }
  function colorHex(id) { return (COLORS.find((c) => c.id === id) || COLORS[1]).hex; }
  function iconSvg(id) { return (ICONS.find((i) => i.id === id) || ICONS[0]).svg; }
  function cleanPhoto(value) {
    const url = String(value || "");
    if (/^\/media\/avatars\/ava-[a-z0-9-]+\.jpg$/i.test(url)) return url;
    if (/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(url) && url.length < 140000) return url;
    return "";
  }
  function faceHtml(person) {
    const photo = cleanPhoto(person && person.photo);
    if (photo) return `<img class="face-photo" src="${esc(photo)}" alt="">`;
    return iconSvg(person && person.icon);
  }
  function openCrop(file, source) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (app.ui.crop && app.ui.crop.url) URL.revokeObjectURL(app.ui.crop.url);
      app.ui.crop = { url, source, nw: img.naturalWidth || img.width, nh: img.naturalHeight || img.height, zoom: 1, x: 0, y: 0, placed: false };
      render();
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast("Deze foto lukt niet."); };
    img.src = url;
  }
  function closeCrop() {
    if (app.ui.crop && app.ui.crop.url) URL.revokeObjectURL(app.ui.crop.url);
    app.ui.crop = null;
  }
  function cropCover(c, box) {
    const scale = Math.max(box / c.nw, box / c.nh) * c.zoom;
    return { w: c.nw * scale, h: c.nh * scale };
  }
  function clampCrop(c, box) {
    const size = cropCover(c, box);
    c.x = Math.min(0, Math.max(box - size.w, c.x));
    c.y = Math.min(0, Math.max(box - size.h, c.y));
    return size;
  }
  function bindCrop() {
    const box = document.getElementById("cropBox");
    const img = document.getElementById("cropImg");
    const zoom = document.getElementById("cropZoom");
    const c = app.ui.crop;
    if (!box || !img || !c) return;
    const place = () => {
      const size = clampCrop(c, box.clientWidth || 280);
      img.style.width = size.w + "px";
      img.style.height = size.h + "px";
      img.style.left = c.x + "px";
      img.style.top = c.y + "px";
    };
    if (!c.placed) {
      const size = cropCover(c, box.clientWidth || 280);
      c.x = ((box.clientWidth || 280) - size.w) / 2;
      c.y = ((box.clientWidth || 280) - size.h) / 2;
      c.placed = true;
    }
    place();
    let drag = null;
    box.onpointerdown = (e) => {
      if (e.button != null && e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, ox: c.x, oy: c.y };
      box.setPointerCapture(e.pointerId);
    };
    box.onpointermove = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      c.x = drag.ox + (e.clientX - drag.x);
      c.y = drag.oy + (e.clientY - drag.y);
      place();
    };
    box.onpointerup = box.onpointercancel = () => { drag = null; };
    if (zoom) {
      zoom.value = String(c.zoom);
      zoom.oninput = () => {
        const boxSize = box.clientWidth || 280;
        const before = cropCover(c, boxSize);
        const cx = boxSize / 2 - c.x;
        const cy = boxSize / 2 - c.y;
        c.zoom = Math.min(3, Math.max(1, Number(zoom.value) || 1));
        const after = cropCover(c, boxSize);
        c.x = boxSize / 2 - cx * (after.w / before.w);
        c.y = boxSize / 2 - cy * (after.h / before.h);
        place();
      };
    }
  }
  function applyCrop() {
    const c = app.ui.crop;
    const box = document.getElementById("cropBox");
    const img = document.getElementById("cropImg");
    if (!c || !box || !img) return;
    const boxSize = box.clientWidth || 280;
    const size = clampCrop(c, boxSize);
    const sx = Math.max(0, (-c.x / size.w) * c.nw);
    const sy = Math.max(0, (-c.y / size.h) * c.nh);
    const sw = Math.min(c.nw - sx, (boxSize / size.w) * c.nw);
    const sh = Math.min(c.nh - sy, (boxSize / size.h) * c.nh);
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    canvas.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, 256, 256);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    const source = c.source;
    closeCrop();
    if (!app.draft) app.draft = { ...(app.profile || { name: "", icon: "glass", color: "blue" }) };
    app.draft.photo = dataUrl;
    if (source === "settings") {
      const typed = (document.getElementById("settingsName") || {}).value;
      persistProfile({ ...app.draft, name: typed || app.draft.name });
    }
    render();
  }
  function stopCamera() {
    const cam = app.ui.camera;
    if (cam && cam.stream) cam.stream.getTracks().forEach((track) => track.stop());
    app.ui.camera = null;
  }
  function startCamera(source) {
    const devices = navigator.mediaDevices;
    if (!devices || !devices.getUserMedia) { openCameraFile(source); return; }
    const open = (stream) => { stopCamera(); app.ui.camera = { source, stream }; render(); };
    devices.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .catch((err) => {
        if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) throw err;
        return devices.getUserMedia({ video: true, audio: false });
      })
      .then(open)
      .catch((err) => {
        const blocked = err && (err.name === "NotAllowedError" || err.name === "SecurityError");
        if (blocked) { toast("Sta de camera toe in je browser."); return; }
        openCameraFile(source);
      });
  }
  function openCameraFile(source) {
    const el = document.getElementById(source === "settings" ? "settingsCamera" : "styleCamera");
    if (el) el.click();
    else toast("Geen camera gevonden. Kies een foto uit je bestanden.");
  }
  function bindCamera() {
    const video = document.getElementById("cameraVideo");
    const cam = app.ui.camera;
    if (!video || !cam || !cam.stream) return;
    video.srcObject = cam.stream;
    video.play().catch(() => {});
  }
  function snapCamera() {
    const video = document.getElementById("cameraVideo");
    const cam = app.ui.camera;
    if (!video || !cam) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    const source = cam.source;
    canvas.toBlob((blob) => {
      stopCamera();
      if (!blob) { toast("Foto maken lukte niet."); render(); return; }
      openCrop(new File([blob], "camera.jpg", { type: "image/jpeg" }), source);
    }, "image/jpeg", 0.92);
  }
  function cameraHtml() {
    if (!app.ui.camera) return "";
    return `<div class="modal" data-act="camera-cancel"><div class="panel crop-panel" data-act="stop" role="dialog" aria-modal="true"><h3>Maak een foto</h3><p class="fine">Kijk in de camera en tik op de knop.</p><div class="camera-box"><video id="cameraVideo" autoplay playsinline muted></video></div><div class="stack"><button type="button" class="btn btn-primary" data-act="camera-snap">Neem foto</button><button type="button" class="btn btn-text" data-act="camera-cancel">Annuleren</button></div></div></div>`;
  }
  function cropHtml() {
    const c = app.ui.crop;
    if (!c) return "";
    return `<div class="modal" data-act="crop-cancel"><div class="panel crop-panel" data-act="stop" role="dialog" aria-modal="true"><h3>Snijd je foto</h3><p class="fine">Sleep de foto en zoom. Het ronde stuk blijft zichtbaar.</p><div class="crop-box" id="cropBox"><img id="cropImg" src="${esc(c.url)}" alt="" draggable="false"></div><label class="crop-zoom">Zoom<input id="cropZoom" type="range" min="1" max="3" step="0.01" value="${c.zoom}"></label><div class="stack"><button type="button" class="btn btn-primary" data-act="crop-save">Dit stuk</button><button type="button" class="btn btn-text" data-act="crop-cancel">Annuleren</button></div></div></div>`;
  }
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function sipWord(n) { return n === 1 ? "1 slok" : n + " slokken"; }
  function makeCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
    return s;
  }
  function normalizeCode(raw) {
    const up = String(raw || "").toUpperCase().replace(/\s+/g, "");
    let code = "";
    let bad = false;
    for (const ch of up) {
      if ("ABCDEFGHJKLMNPQRSTUVWXYZ23456789".includes(ch)) code += ch;
      else if (ch) bad = true;
    }
    return { code: code.slice(0, 4), bad };
  }
  function spaced(code) { return String(code || "").split("").join(" "); }
  function rankFace(r) { return { 11: "J", 12: "Q", 13: "K", 14: "A" }[r] || String(r); }
  function rankLabel(r) { return { 11: "boer", 12: "vrouw", 13: "heer", 14: "aas" }[r] || ""; }

  function spinRotation(current, segmentIndex, n) {
    const a = 360 / n;
    const mid = (segmentIndex + 0.5) * a;
    const target = (360 - (mid % 360) + 360) % 360;
    const cur = ((current % 360) + 360) % 360;
    let delta = (target - cur + 360) % 360;
    if (delta < 12) delta += 360;
    return current + (5 + Math.floor(Math.random() * 2)) * 360 + delta;
  }
  function segmentAt(rotation, n) {
    const a = 360 / n;
    const r = ((rotation % 360) + 360) % 360;
    const from = (360 - r) % 360;
    return Math.floor((from + 0.0001) / a) % n;
  }
  function makeDeck() {
    const deck = [];
    for (let s = 0; s < 4; s++) for (let r = 2; r <= 14; r++) deck.push({ r, s });
    return shuffle(deck);
  }
  function better(prev, next) {
    if ((next.gen | 0) !== (prev.gen | 0)) return (next.gen | 0) > (prev.gen | 0);
    if ((next.rev | 0) !== (prev.rev | 0)) return (next.rev | 0) > (prev.rev | 0);
    if (next.hostId !== prev.hostId) return String(next.hostId) > String(prev.hostId);
    return (next.hostBeat | 0) > (prev.hostBeat | 0);
  }
  function actorOk(state, action) {
    if (!state.game) return false;
    if (action.by === state.hostId) return true;
    const p = state.players[state.game.turn];
    return !!(p && p.id === action.by);
  }
  function sanitizePlayer(p) {
    if (!p || typeof p !== "object") return null;
    const id = String(p.id || "").slice(0, 40);
    if (!/^[\w-]{4,40}$/.test(id)) return null;
    const photo = /^\/media\/avatars\/ava-[a-z0-9-]+\.jpg$/i.test(String(p.photo || "")) ? String(p.photo) : "";
    return { id, name: cleanName(p.name, "Speler"), icon: validIcon(p.icon), color: validColor(p.color), photo, sips: Math.max(0, Math.min(999, p.sips | 0)) };
  }
  function normalizeGame(g) {
    if (!g || !["rad", "vragen", "kaarten", "memes"].includes(g.id)) return null;
    if (g.id === "rad") {
      const extraWheel = normalizeExtraWheel(g.extraWheel);
      const known = g.spin && g.spin.id;
      const segment = known ? Math.max(0, Math.min(SEGMENTS.length + extraWheel.length - 1, g.spin.segment | 0)) : 0;
      let rotation = Number(g.rotation);
      if (!Number.isFinite(rotation) || rotation < 0) rotation = 0;
      if (rotation > 1e7) rotation = rotation % 360;
      const spin = known ? { id: String(g.spin.id).slice(0, 48), segment, at: Number(g.spin.at) || 0 } : null;
      return {
        id: "rad",
        turn: g.turn | 0,
        rotation,
        stage: spin && g.stage === "result" ? "result" : "ready",
        targetId: g.targetId ? String(g.targetId).slice(0, 40) : null,
        choice: g.choice === "tell" || g.choice === "drink" ? g.choice : null,
        category: String(g.category || "").slice(0, 40),
        spin,
        extraWheel,
      };
    }
    if (g.id === "vragen") {
      const custom = Array.isArray(g.custom) ? g.custom.filter((q) => q && q.id && q.text).slice(0, 40).map((q) => ({
        id: String(q.id).slice(0, 40),
        text: String(q.text).slice(0, 180),
        kind: q.kind === "point" ? "point" : "say",
        cat: "groep",
      })) : [];
      const known = new Set(QUESTIONS.map((q) => q.id).concat(custom.map((q) => q.id)));
      let order = Array.isArray(g.order) ? g.order.map((id) => String(id)).filter((id) => known.has(id)).slice(0, 120) : [];
      if (!order.length) order = QUESTIONS.map((q) => q.id);
      const filter = ["licht", "groep", "pittig", "mix"].includes(g.filter) ? g.filter : "mix";
      const age = AGES.some((a) => a.id === g.age) ? g.age : "20-25";
      return {
        id: "vragen",
        turn: g.turn | 0,
        order,
        cursor: Math.max(0, Math.min(order.length - 1, g.cursor | 0)),
        round: Math.max(1, g.round | 0 || 1),
        stage: g.stage === "note" ? "note" : "ask",
        note: g.note === "say" || g.note === "drink" ? g.note : null,
        filter,
        age,
        custom,
      };
    }
    if (g.id === "memes") {
      const memes = Array.isArray(g.memes) ? g.memes.filter((m) => m && m.id && m.name && m.video).slice(0, 40).map((m) => ({
        id: String(m.id).slice(0, 20),
        name: String(m.name).slice(0, 40),
        video: String(m.video).slice(0, 300),
        sips: Math.max(1, Math.min(4, m.sips | 0 || 2)),
      })) : [];
      const known = new Set(memes.map((m) => m.id));
      let order = Array.isArray(g.order) ? g.order.map((id) => String(id)).filter((id) => known.has(id)).slice(0, 40) : [];
      if (!order.length) order = memes.map((m) => m.id);
      const stages = ["watch", "tell", "give", "result"];
      return {
        id: "memes",
        turn: g.turn | 0,
        order,
        cursor: order.length ? Math.max(0, Math.min(order.length - 1, g.cursor | 0)) : 0,
        round: Math.max(1, g.round | 0 || 1),
        stage: g.stage === "give" ? "tell" : (stages.includes(g.stage) ? g.stage : "watch"),
        note: g.note === "know" || g.note === "miss" ? g.note : null,
        targetId: g.targetId ? String(g.targetId).slice(0, 40) : null,
        memes,
        missed: Array.isArray(g.missed) ? g.missed.map((n) => String(n).slice(0, 40)).slice(-30) : [],
        answers: Array.isArray(g.answers) ? g.answers.map((n) => String(n).slice(0, 40)).filter(Boolean).slice(-40) : [],
      };
    }
    let deck = Array.isArray(g.deck) ? g.deck.filter((c) => c && c.r >= 2 && c.r <= 14 && c.s >= 0 && c.s <= 3).slice(0, 52) : [];
    if (deck.length < 2) deck = makeDeck();
    let index = g.index | 0;
    if (index < 0 || index >= deck.length - 1) index = 0;
    return {
      id: "kaarten",
      turn: g.turn | 0,
      deck,
      index,
      stage: g.stage === "reveal" ? "reveal" : "guess",
      guess: g.guess === "higher" || g.guess === "lower" ? g.guess : null,
      outcome: g.outcome === "good" || g.outcome === "bad" || g.outcome === "tie" ? g.outcome : null,
      banner: String(g.banner || "").slice(0, 40),
    };
  }
  function normalizeState(s) {
    if (!s || s.v !== 1 || !Array.isArray(s.players)) return null;
    const phase = ["lobby", "play", "closed"].includes(s.phase) ? s.phase : "lobby";
    const players = s.players.slice(0, 12).map(sanitizePlayer).filter(Boolean);
    const game = phase === "play" ? normalizeGame(s.game) : null;
    if (game && players.length) game.turn = ((game.turn % players.length) + players.length) % players.length;
    return { v: 1, gen: s.gen | 0, rev: s.rev | 0, hostId: String(s.hostId || "").slice(0, 40), hostBeat: Number(s.hostBeat) || 0, phase, players, game, history: normalizeHistory(s.history) };
  }
  const WHO_IDS = ["self", "all", "left", "right", "give", "none"];
  const WHO_EMOJI = { self: "✌️", all: "🍻", left: "◀️", right: "▶️", give: "👉", none: "⭐" };
  function normalizeExtraWheel(list) {
    if (!Array.isArray(list)) return [];
    return list.slice(0, 8).map((s, i) => {
      if (!s || !s.label) return null;
      const who = WHO_IDS.includes(s.who) ? s.who : "self";
      const label = String(s.label).replace(/\s+/g, " ").trim().slice(0, 10);
      if (label.length < 2) return null;
      return {
        id: String(s.id || ("c" + i)).replace(/[^\w-]/g, "").slice(0, 20) || ("c" + i),
        label,
        text: String(s.text || "").replace(/\s+/g, " ").trim().slice(0, 80),
        emoji: WHO_EMOJI[who],
        fg: "#fff",
        bg: ["#0ea5e9", "#8b5cf6", "#14b8a6", "#6366f1", "#0284c7", "#a855f7", "#2563eb", "#0891b2"][i % 8],
        needs: who === "give" ? "target" : "",
        who,
        sips: Math.max(0, Math.min(4, s.sips | 0)),
      };
    }).filter(Boolean);
  }
  function normalizeHistory(list) {
    if (!Array.isArray(list)) return [];
    return list.slice(-5).map((snap) => {
      if (!snap || !Array.isArray(snap.players)) return null;
      return {
        players: snap.players.slice(0, 12).map((p) => ({ id: String(p.id || "").slice(0, 40), sips: Math.max(0, Math.min(999, p.sips | 0)) })).filter((p) => /^[\w-]{4,40}$/.test(p.id)),
        game: snap.game ? normalizeGame(snap.game) : null,
      };
    }).filter(Boolean);
  }
  function wheelOf(g) {
    const extra = g && Array.isArray(g.extraWheel) ? g.extraWheel : [];
    return extra.length ? SEGMENTS.concat(extra) : SEGMENTS;
  }
  function segmentOf(state) {
    const g = state && state.game;
    if (!g || !g.spin) return null;
    return wheelOf(g)[g.spin.segment] || null;
  }
  function remember(state, next) {
    if (!next) return null;
    const game = state.game ? JSON.parse(JSON.stringify(state.game)) : null;
    const snap = { players: state.players.map((p) => ({ id: p.id, sips: p.sips })), game };
    return { ...next, history: (state.history || []).concat([snap]).slice(-5) };
  }
  function initGame(id, opts, n) {
    const turn = Math.floor(Math.random() * Math.max(1, n));
    if (id === "rad") return { id, turn, rotation: 0, stage: "ready", spin: null, targetId: null, choice: null, category: "", extraWheel: normalizeExtraWheel(opts.segments) };
    if (id === "vragen") {
      const filter = ["licht", "groep", "pittig", "mix"].includes(opts.filter) ? opts.filter : "mix";
      const age = AGES.some((a) => a.id === opts.age) ? opts.age : "20-25";
      const custom = Array.isArray(opts.custom) ? opts.custom.filter((q) => q && q.id && q.text).slice(0, 40).map((q) => ({
        id: String(q.id).slice(0, 40),
        text: String(q.text).slice(0, 180),
        kind: "say",
        cat: "groep",
      })) : [];
      const pool = QUESTIONS.filter((q) => {
        if (!(q.ages || []).includes(age)) return false;
        if (age === "16-18" && q.cat === "pittig") return false;
        if (filter !== "mix" && q.cat !== filter) return false;
        return true;
      }).map((q) => q.id);
      let ids = pool.concat(custom.map((q) => q.id));
      if (!ids.length) ids = QUESTIONS.filter((q) => age !== "16-18" || q.cat !== "pittig").map((q) => q.id);
      return { id, turn, order: shuffle(ids), cursor: 0, round: 1, stage: "ask", note: null, filter, age, custom };
    }
    if (id === "memes") {
      const memes = (MEMES.length ? MEMES : [{ id: "m01", name: "Jurk!", video: "https://www.youtube.com/watch?v=lsTMQ3SGF_g", sips: 2 }]).slice(0, 40).map((m) => ({
        id: String(m.id),
        name: String(m.name).slice(0, 40),
        video: String(m.video).slice(0, 300),
        sips: Math.max(1, Math.min(4, m.sips | 0 || 2)),
      }));
      return { id: "memes", turn, order: shuffle(memes.map((m) => m.id)), cursor: 0, round: 1, stage: "watch", note: null, targetId: null, memes };
    }
    return { id: "kaarten", turn, deck: makeDeck(), index: 0, stage: "guess", guess: null, outcome: null, banner: "" };
  }
  function sipPlan(state) {
    const g = state.game;
    const seg = segmentOf(state);
    const players = state.players;
    const n = players.length;
    const t = g ? g.turn : 0;
    if (!seg || !n) return [];
    if (seg.who) {
      const sips = seg.sips | 0;
      const idOf = (id) => players.findIndex((p) => p.id === id);
      if (!sips) return [];
      if (n < 2 && (seg.who === "left" || seg.who === "right" || seg.who === "give")) return [[0, sips]];
      if (seg.who === "all") return players.map((_, i) => [i, sips]);
      if (seg.who === "self") return [[t, sips]];
      if (seg.who === "left") return [[(t - 1 + n) % n, sips]];
      if (seg.who === "right") return [[(t + 1) % n, sips]];
      if (seg.who === "give") { const i = idOf(g.targetId); return i >= 0 ? [[i, sips]] : []; }
      return [];
    }
    if (n < 2 && (seg.id === "give" || seg.id === "left" || seg.id === "right")) return [[0, 2]];
    if (n < 2 && seg.id === "mate") return [[0, 1]];
    const idOf = (id) => players.findIndex((p) => p.id === id);
    switch (seg.id) {
      case "all": return players.map((_, i) => [i, 1]);
      case "self2": return [[t, 2]];
      case "give": { const i = idOf(g.targetId); return i >= 0 ? [[i, 2]] : []; }
      case "left": return [[(t - 1 + n) % n, 2]];
      case "right": return [[(t + 1) % n, 2]];
      case "except": return players.map((_, i) => [i, 1]).filter(([i]) => i !== t);
      case "mate": { const i = idOf(g.targetId); return i >= 0 ? [[t, 1], [i, 1]] : []; }
      case "story": return g.choice === "drink" ? [[t, 3]] : [];
      default: return [];
    }
  }
  function canAdvance(state) {
    const g = state.game;
    if (!g || g.id !== "rad" || g.stage !== "result" || !g.spin) return false;
    const seg = segmentOf(state);
    if (!seg) return false;
    if (seg.needs === "target" && state.players.length > 1 && !g.targetId) return false;
    if (seg.needs === "choice" && !g.choice) return false;
    return true;
  }
  function applyPlan(state) {
    const players = state.players.map((p) => ({ ...p }));
    for (const [i, n] of sipPlan(state)) if (players[i]) players[i].sips = Math.min(999, players[i].sips + n);
    return players;
  }
  function removePlayer(state, id) {
    const idx = state.players.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const players = state.players.filter((p) => p.id !== id);
    let game = state.game ? { ...state.game } : null;
    if (game && players.length) {
      let turn = game.turn;
      if (idx < turn) turn -= 1;
      if (turn >= players.length) turn = 0;
      if (turn < 0) turn = 0;
      game = { ...game, turn };
    }
    return { ...state, players, game };
  }
  function answerName(g) {
    const meme = g && (g.memes || []).find((m) => m.id === g.order[g.cursor]);
    return meme && meme.name ? String(meme.name).slice(0, 40) : "";
  }
  function keepAnswer(g) {
    const name = answerName(g);
    const answers = (g.answers || []).concat(name ? [name] : []).slice(-40);
    return { ...g, answers };
  }
  function nextMeme(state) {
    const g = state.game;
    const n = state.players.length || 1;
    let order = g.order.slice();
    let cursor = g.cursor + 1;
    let round = g.round || 1;
    if (cursor >= order.length) { order = shuffle(order); cursor = 0; round += 1; }
    return { ...g, order, cursor, round, stage: "watch", note: null, targetId: null, turn: (g.turn + 1) % n };
  }
  function skipTurn(state) {
    if (!state.game || !state.players.length) return null;
    const n = state.players.length;
    const g = state.game;
    const turn = (g.turn + 1) % n;
    if (g.id === "rad") return { ...state, game: { ...g, stage: "ready", turn, targetId: null, choice: null } };
    if (g.id === "vragen") {
      let order = g.order.slice();
      let cursor = g.cursor + 1;
      let round = g.round || 1;
      if (cursor >= order.length) { order = shuffle(order); cursor = 0; round += 1; }
      return { ...state, game: { ...g, order, cursor, round, stage: "ask", note: null, turn } };
    }
    if (g.id === "memes") return { ...state, game: nextMeme({ ...state, game: keepAnswer(g) }) };
    let deck = g.deck;
    let index = g.index;
    let banner = g.banner || "";
    if (g.stage === "reveal") {
      index = g.index + 1;
      if (index >= deck.length - 1) { deck = makeDeck(); index = 0; banner = "Nieuwe stapel"; }
    }
    return { ...state, game: { ...g, deck, index, stage: "guess", guess: null, outcome: null, banner, turn } };
  }
  function reduce(state, action) {
    if (!state || !action) return null;
    switch (action.type) {
      case "join": {
        if (state.phase === "closed") return null;
        const p = sanitizePlayer(action.player);
        if (!p) return null;
        const players = state.players.map((x) => ({ ...x }));
        const i = players.findIndex((x) => x.id === p.id);
        if (i >= 0) {
          players[i] = { ...players[i], name: p.name, icon: p.icon, color: p.color };
          return { ...state, players };
        }
        if (players.length >= 12) return null;
        players.push({ ...p, sips: 0 });
        return { ...state, players };
      }
      case "leave":
        if (action.playerId !== action.by && action.by !== state.hostId) return null;
        return removePlayer(state, action.playerId);
      case "kick":
        if (action.by !== state.hostId || action.playerId === state.hostId) return null;
        return removePlayer(state, action.playerId);
      case "move": {
        if (action.by !== state.hostId || state.phase === "play") return null;
        const i = state.players.findIndex((p) => p.id === action.playerId);
        const j = i + (action.dir < 0 ? -1 : 1);
        if (i < 0 || j < 0 || j >= state.players.length) return null;
        const players = state.players.map((p) => ({ ...p }));
        const [sp] = players.splice(i, 1);
        players.splice(j, 0, sp);
        return { ...state, players };
      }
      case "reset-sips":
        if (action.by !== state.hostId) return null;
        return { ...state, players: state.players.map((p) => ({ ...p, sips: 0 })) };
      case "start": {
        if (action.by !== state.hostId || state.phase !== "lobby" || !state.players.length) return null;
        const game = normalizeGame(action.game);
        if (!game) return null;
        game.turn = ((game.turn % state.players.length) + state.players.length) % state.players.length;
        return { ...state, phase: "play", game };
      }
      case "to-lobby":
        if (action.by !== state.hostId) return null;
        return { ...state, phase: "lobby", game: null };
      case "spin": {
        const g = state.game;
        if (!g || g.id !== "rad" || g.stage !== "ready" || state.phase !== "play" || !actorOk(state, action)) return null;
        const wheel = wheelOf(g);
        const seg = Math.floor(Math.random() * wheel.length);
        const picked = wheel[seg];
        return { ...state, game: { ...g, rotation: spinRotation(g.rotation || 0, seg, wheel.length), stage: "result", targetId: null, choice: null, category: picked.id === "cat" ? pick(CATEGORIES) : "", spin: { id: uid(), segment: seg, at: Date.now() } } };
      }
      case "target": {
        const g = state.game;
        const seg = segmentOf(state);
        if (!g || g.stage !== "result" || !seg || seg.needs !== "target" || !actorOk(state, action)) return null;
        const p = state.players.find((x) => x.id === action.targetId);
        const current = state.players[g.turn];
        if (!p || (current && p.id === current.id)) return null;
        return { ...state, game: { ...g, targetId: p.id } };
      }
      case "choice": {
        const g = state.game;
        const seg = segmentOf(state);
        if (!g || !seg || seg.needs !== "choice" || g.stage !== "result" || !actorOk(state, action)) return null;
        if (action.choice !== "tell" && action.choice !== "drink") return null;
        return { ...state, game: { ...g, choice: action.choice } };
      }
      case "next": {
        const g = state.game;
        if (!g || g.id !== "rad" || g.stage !== "result" || !actorOk(state, action) || !canAdvance(state)) return null;
        const players = applyPlan(state);
        const n = players.length || 1;
        const seg = segmentOf(state);
        const turn = seg && seg.id === "again" ? g.turn % n : (g.turn + 1) % n;
        return remember(state, { ...state, players, game: { ...g, stage: "ready", turn, targetId: null, choice: null } });
      }
      case "answer": {
        const g = state.game;
        if (!g || g.id !== "vragen" || g.stage !== "ask" || !actorOk(state, action)) return null;
        if (action.choice !== "say" && action.choice !== "drink") return null;
        const players = state.players.map((p) => ({ ...p }));
        if (action.choice === "drink" && players[g.turn]) players[g.turn].sips = Math.min(999, players[g.turn].sips + 2);
        return { ...state, players, game: { ...g, stage: "note", note: action.choice } };
      }
      case "next-q": {
        const g = state.game;
        if (!g || g.id !== "vragen" || g.stage !== "note" || !actorOk(state, action)) return null;
        const n = state.players.length || 1;
        let order = g.order.slice();
        let cursor = g.cursor + 1;
        let round = g.round || 1;
        if (cursor >= order.length) { order = shuffle(order); cursor = 0; round += 1; }
        return remember(state, { ...state, game: { ...g, order, cursor, round, stage: "ask", note: null, turn: (g.turn + 1) % n } });
      }
      case "guess": {
        const g = state.game;
        if (!g || g.id !== "kaarten" || g.stage !== "guess" || !actorOk(state, action)) return null;
        if (action.guess !== "higher" && action.guess !== "lower") return null;
        const cur = g.deck[g.index];
        const nxt = g.deck[g.index + 1];
        if (!cur || !nxt) return null;
        let outcome = "tie";
        if (nxt.r > cur.r) outcome = action.guess === "higher" ? "good" : "bad";
        else if (nxt.r < cur.r) outcome = action.guess === "lower" ? "good" : "bad";
        return { ...state, game: { ...g, stage: "reveal", guess: action.guess, outcome, banner: "" } };
      }
      case "next-card": {
        const g = state.game;
        if (!g || g.id !== "kaarten" || g.stage !== "reveal" || !actorOk(state, action)) return null;
        const players = state.players.map((p) => ({ ...p }));
        if (g.outcome === "bad" && players[g.turn]) players[g.turn].sips = Math.min(999, players[g.turn].sips + 2);
        if (g.outcome === "tie") players.forEach((p) => { p.sips = Math.min(999, p.sips + 1); });
        let deck = g.deck;
        let index = g.index + 1;
        let banner = "";
        if (index >= deck.length - 1) { deck = makeDeck(); index = 0; banner = "Nieuwe stapel"; }
        return remember(state, { ...state, players, game: { ...g, deck, index, stage: "guess", guess: null, outcome: null, banner, turn: (g.turn + 1) % (players.length || 1) } });
      }
      case "undo": {
        if (action.by !== state.hostId) return null;
        const history = state.history || [];
        if (!history.length) return null;
        const snap = history[history.length - 1];
        const players = state.players.map((p) => {
          const old = snap.players.find((x) => x.id === p.id);
          return old ? { ...p, sips: old.sips } : p;
        });
        return { ...state, players, phase: snap.game ? "play" : state.phase, game: snap.game, history: history.slice(0, -1) };
      }
      case "meme-miss": {
        const g = state.game;
        if (!g || g.id !== "memes" || g.stage !== "watch" || !actorOk(state, action)) return null;
        const meme = (g.memes || []).find((m) => m.id === g.order[g.cursor]);
        const sips = meme ? meme.sips : 2;
        const players = state.players.map((p) => ({ ...p }));
        if (players[g.turn]) players[g.turn].sips = Math.min(999, players[g.turn].sips + sips);
        const missed = (g.missed || []).concat(meme && meme.name ? [String(meme.name).slice(0, 40)] : []).slice(-30);
        return remember(state, { ...state, players, game: { ...keepAnswer(g), stage: "result", note: "miss", targetId: null, missed } });
      }
      case "meme-know": {
        const g = state.game;
        if (!g || g.id !== "memes" || g.stage !== "watch" || !actorOk(state, action)) return null;
        return { ...state, game: { ...g, stage: "tell", note: "know", targetId: null } };
      }
      case "meme-told": {
        const g = state.game;
        if (!g || g.id !== "memes" || g.stage !== "tell" || !actorOk(state, action)) return null;
        return remember(state, { ...state, game: { ...keepAnswer(g), stage: "result", note: "know", targetId: null } });
      }
      case "meme-next": {
        const g = state.game;
        if (!g || g.id !== "memes" || g.stage !== "result" || !actorOk(state, action)) return null;
        return remember(state, { ...state, game: nextMeme(state) });
      }
      case "skip":
        if (action.by !== state.hostId) return null;
        return skipTurn(state);
      default:
        return null;
    }
  }

  function mePlayer() {
    const p = app.profile || { name: "Speler", icon: "glass", color: "blue" };
    return { id: app.meId, name: p.name, icon: p.icon, color: p.color, photo: cleanPhoto(p.photo), sips: 0 };
  }
  function saveProfileLocal() {
    localStorage.setItem("maatje.profile", JSON.stringify(app.profile));
    localStorage.setItem("maatje.welcomed", "1");
  }
  function persistProfile(p) {
    const previous = cleanPhoto(app.profile && app.profile.photo);
    const photo = p.photo === undefined ? previous : cleanPhoto(p.photo);
    app.profile = { name: cleanName(p.name, "Speler"), icon: validIcon(p.icon), color: validColor(p.color), photo };
    saveProfileLocal();
    if (!(app.account && app.token)) return;
    const patch = (userPhoto) => api("/api/me", { method: "PATCH", body: { name: app.profile.name, icon: app.profile.icon, color: app.profile.color, age: app.ui.age, photo: userPhoto || "" } })
      .then((data) => { app.account = data.user; app.groups = data.groups || app.groups; if (data.user) { app.profile.photo = cleanPhoto(data.user.photo); saveProfileLocal(); } render(); })
      .catch(() => {});
    if (photo.startsWith("data:")) {
      api("/api/me/photo", { method: "POST", body: { data: photo.split(",")[1] || "" } })
        .then((data) => {
          app.profile.photo = cleanPhoto(data.photo || (data.user && data.user.photo));
          if (app.draft) app.draft.photo = app.profile.photo;
          saveProfileLocal();
          return patch(app.profile.photo);
        })
        .catch((err) => toast(err.message));
      return;
    }
    patch(photo.startsWith("/media/") ? photo : "");
  }
  function loadProfile() {
    try {
      const p = JSON.parse(localStorage.getItem("maatje.profile") || "null");
      if (!p) return null;
      return { name: cleanName(p.name, "Speler"), icon: validIcon(p.icon), color: validColor(p.color), photo: cleanPhoto(p.photo) };
    } catch (e) { return null; }
  }
  function myId() {
    let id = localStorage.getItem("maatje.id");
    if (!id || !/^[\w-]{8,40}$/.test(id)) {
      id = uid();
      localStorage.setItem("maatje.id", id);
    }
    return id;
  }
  function backup() {
    try {
      if (app.mode === "multi" && app.isHost && app.roomCode && app.state) localStorage.setItem("maatje.backup", JSON.stringify({ code: app.roomCode, state: app.state }));
    } catch (e) {}
  }
  function readBackup(code) {
    try {
      const raw = JSON.parse(localStorage.getItem("maatje.backup") || "null");
      if (!raw || raw.code !== code) return null;
      return normalizeState(raw.state);
    } catch (e) { return null; }
  }
  function setUrlRoom(code) {
    try {
      const u = new URL(location.href);
      u.searchParams.set("room", code);
      history.replaceState({}, "", u.href);
    } catch (e) {}
  }
  function clearUrlRoom() {
    try {
      const u = new URL(location.href);
      u.searchParams.delete("room");
      history.replaceState({}, "", u.href);
    } catch (e) {}
  }

  function commitDirect(draft) {
    const prev = app.state;
    const next = { ...draft, v: 1, gen: draft.gen != null ? draft.gen : (prev ? prev.gen : 1), rev: ((prev && prev.rev) || 0) + 1, hostBeat: Date.now() };
    if (!next.hostId && prev) next.hostId = prev.hostId;
    app.state = next;
    if (app.mode === "multi" && app.isHost) { publishState(); backup(); }
    noteSpin();
    render();
  }
  function dispatch(action) {
    if (!app.state) return;
    const msg = { ...action, iid: uid(), by: app.meId };
    if (app.mode !== "multi" || app.isHost) {
      const next = reduce(app.state, msg);
      if (next) commitDirect(next);
      return;
    }
    if (!net.client || !net.client.connected) { toast("Even geen verbinding. Probeer nog eens."); return; }
    net.client.publish(net.inTopic, JSON.stringify(msg), { qos: 1 });
  }

  function topicPair(code) {
    return [`maatje/borrel/v1/${code}/state`, `maatje/borrel/v1/${code}/in`];
  }
  function setTopics(code) {
    if (!net.client) return;
    const [s, i] = topicPair(code);
    if (net.stateTopic && net.stateTopic !== s) {
      try { net.client.unsubscribe([net.stateTopic, net.inTopic]); } catch (e) {}
    }
    net.stateTopic = s;
    net.inTopic = i;
    net.client.subscribe([s, i], { qos: 1 });
  }
  function publishState() {
    if (app.mode !== "multi" || !app.isHost || !app.state || !net.stateTopic) return;
    const body = JSON.stringify(app.state);
    if (!net.client || !net.client.connected) return;
    net.client.publish(net.stateTopic, body, { qos: 1, retain: true });
  }
  function sendJoin() {
    if (!net.client || !net.client.connected || !net.inTopic) return;
    net.client.publish(net.inTopic, JSON.stringify({ iid: uid(), type: "join", by: app.meId, player: mePlayer() }), { qos: 1 });
  }
  function scheduleRepair() {
    clearTimeout(net.repairT);
    net.repairT = setTimeout(() => { if (app.isHost && app.state) publishState(); }, 400);
  }
  function onIntent(text) {
    if (!app.isHost || !app.state) return;
    let msg;
    try { msg = JSON.parse(text); } catch (e) { return; }
    if (!msg || typeof msg !== "object" || msg.by === app.meId || !msg.iid || app.seen.has(msg.iid)) return;
    app.seen.add(msg.iid);
    if (app.seen.size > 100) app.seen.delete(app.seen.values().next().value);
    const next = reduce(app.state, msg);
    if (next) commitDirect(next);
  }
  function onNetState(raw) {
    const next = normalizeState(raw);
    if (!next) return;
    if (app.state && !better(app.state, next)) {
      if (app.isHost && (next.gen | 0) < (app.state.gen | 0)) scheduleRepair();
      return;
    }
    const prevHost = app.state ? app.state.hostId : null;
    app.state = next;
    app.isHost = next.hostId === app.meId;
    app.ui.noRoom = false;
    if (app.isHost) backup();
    noteSpin();
    if (prevHost && prevHost !== next.hostId && next.hostId === app.meId && next.phase !== "closed") toast("Jij hebt de leiding over de kamer.");
    render();
  }
  function onMessage(topic, payload) {
    let text = "";
    try { text = payload.toString(); } catch (e) { return; }
    if (!text || text.length > 80000) return;
    if (topic === net.stateTopic) {
      try { onNetState(JSON.parse(text)); } catch (e) {}
    } else if (topic === net.inTopic && app.isHost) onIntent(text);
  }
  function loadMqtt() {
    if (window.mqtt && window.mqtt.connect) return Promise.resolve();
    const urls = ["js/vendor/mqtt.min.js", "https://cdn.jsdelivr.net/npm/mqtt@5.11.0/dist/mqtt.min.js"];
    return new Promise((resolve, reject) => {
      const attempt = (i) => {
        if (i >= urls.length) { reject(new Error("mqtt")); return; }
        const s = document.createElement("script");
        s.src = urls[i];
        s.onload = () => (window.mqtt && window.mqtt.connect ? resolve() : attempt(i + 1));
        s.onerror = () => attempt(i + 1);
        document.head.appendChild(s);
      };
      attempt(0);
    });
  }
  function openBroker() {
    return new Promise((resolve, reject) => {
      let index = 0;
      const fail = (err) => { net.cancelConn = null; reject(err); };
      net.cancelConn = () => fail(new Error("cancel"));
      const next = () => {
        if (index >= BROKERS.length) { fail(new Error("offline")); return; }
        const url = BROKERS[index++];
        const attempt = ++net.attempt;
        if (net.client) {
          net.closing = true;
          try { net.client.end(true); } catch (e) {}
          net.closing = false;
        }
        const client = window.mqtt.connect(url, {
          clientId: "maatje_" + Math.random().toString(16).slice(2, 10),
          clean: true,
          reconnectPeriod: 2500,
          connectTimeout: 7000,
          keepalive: 25,
          protocolVersion: 4,
        });
        net.client = client;
        let settled = false;
        const timer = setTimeout(() => {
          if (settled || attempt !== net.attempt) return;
          try { client.end(true); } catch (e) {}
          next();
        }, 7000);
        client.on("connect", () => {
          if (attempt !== net.attempt) { try { client.end(true); } catch (e) {} return; }
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          net.cancelConn = null;
          app.conn = "on";
          if (net.stateTopic) client.subscribe([net.stateTopic, net.inTopic], { qos: 1 });
          if (app.isHost && app.state) publishState();
          if (app.mode === "multi" && !app.isHost) sendJoin();
          resolve();
          render();
        });
        client.on("message", (topic, payload) => { if (net.client === client) onMessage(topic, payload); });
        client.on("reconnect", () => { if (net.client !== client) return; app.conn = "connecting"; render(); });
        client.on("close", () => { if (net.closing || net.client !== client || !settled) return; app.conn = "connecting"; render(); });
        client.on("error", () => {});
      };
      next();
    });
  }
  function ensureConn() {
    if (net.client && net.client.connected) return Promise.resolve();
    if (net.connecting) return net.connecting;
    net.connecting = loadMqtt().then(() => openBroker()).finally(() => { net.connecting = null; });
    return net.connecting;
  }
  function waitForState(ms) {
    if (app.state) return Promise.resolve(true);
    return new Promise((resolve) => {
      const start = Date.now();
      const t = setInterval(() => {
        if (app.state || Date.now() - start > ms) { clearInterval(t); resolve(!!app.state); }
      }, 80);
    });
  }
  function startJoinLoop() {
    if (app.tv) return;
    clearInterval(app.joinTimer);
    let tries = 0;
    const pump = () => {
      if (app.mode !== "multi" || !app.state || app.state.phase === "closed") return;
      if (app.state.players.some((p) => p.id === app.meId)) {
        clearInterval(app.joinTimer);
        if (app.ui.joinWait) { app.ui.joinWait = ""; render(); }
        return;
      }
      tries += 1;
      if (tries > 5) app.ui.joinWait = app.state.players.length >= 12 ? "Deze kamer zit vol." : "De starter reageert niet. Vraag of die telefoon aanstaat.";
      if (net.client && net.client.connected) sendJoin();
      if (tries === 6) render();
    };
    pump();
    app.joinTimer = setInterval(pump, 1600);
  }
  async function createRoom(opts) {
    const asTv = !!(opts && opts.tv);
    if (needFriendsAccount()) return;
    const token = ++app.op;
    const seeded = app._groupPlayers;
    app._groupPlayers = null;
    clearInterval(app.joinTimer);
    app.mode = "multi";
    app.isHost = true;
    app.tv = asTv;
    try { if (asTv) sessionStorage.setItem("maatje.tv", "1"); else sessionStorage.removeItem("maatje.tv"); } catch (e) {}
    app.state = null;
    app.roomCode = makeCode();
    app.error = "";
    app.ui.noRoom = false;
    app.ui.joinWait = "";
    app.ui.confirmLeave = false;
    app.conn = "connecting";
    render();
    try { await ensureConn(); } catch (e) {
      if (token !== app.op) return;
      app.conn = "error";
      app.error = "Geen verbinding met de speelkamer. Check je internet, of speel op één telefoon.";
      render();
      return;
    }
    if (token !== app.op) return;
    sessionStorage.setItem("maatje.room", app.roomCode);
    setUrlRoom(app.roomCode);
    setTopics(app.roomCode);
    const players = asTv ? [] : (seeded && seeded.length ? seeded : [mePlayer()]);
    app.state = { v: 1, gen: 1, rev: 1, hostId: app.meId, hostBeat: Date.now(), phase: "lobby", players, game: null };
    publishState();
    backup();
    if (app.account && app.groupId) linkGroupRoom(app.groupId, app.roomCode);
    render();
  }
  async function joinRoom(raw) {
    if (needFriendsAccount()) return;
    const norm = normalizeCode(raw);
    if (norm.code.length !== 4) {
      toast(norm.bad ? "Die code klopt niet. Er zit geen O, I, 0 of 1 in." : "Vul de code van 4 tekens in.");
      return;
    }
    const code = norm.code;
    if (app.mode === "multi" && app.roomCode === code && app.state && app.conn !== "error" && !app.ui.noRoom) return;
    const token = ++app.op;
    clearInterval(app.joinTimer);
    app.mode = "multi";
    app.isHost = false;
    try {
      app.tv = sessionStorage.getItem("maatje.tv") === "1" && sessionStorage.getItem("maatje.room") === code;
      if (!app.tv) sessionStorage.removeItem("maatje.tv");
    } catch (e) { app.tv = false; }
    app.roomCode = code;
    app.state = null;
    app.error = "";
    app.ui.noRoom = false;
    app.ui.joinWait = "";
    app.ui.confirmLeave = false;
    app.conn = "connecting";
    app.ui.codeValue = code;
    render();
    try { await ensureConn(); } catch (e) {
      if (token !== app.op) return;
      app.conn = "error";
      app.error = "Geen verbinding met de speelkamer. Check je internet, of speel op één telefoon.";
      render();
      return;
    }
    if (token !== app.op) return;
    sessionStorage.setItem("maatje.room", code);
    setUrlRoom(code);
    setTopics(code);
    const found = await waitForState(4000);
    if (token !== app.op) return;
    if (!found || !app.state) {
      const saved = readBackup(code);
      if (saved && saved.hostId === app.meId && saved.phase !== "closed") {
        app.isHost = true;
        app.state = saved;
        app.state.hostBeat = Date.now();
        app.state.rev = (saved.rev | 0) + 1;
        publishState();
        render();
        return;
      }
      app.ui.noRoom = true;
      app.error = "Geen actief spel met die code. Check de code, en of de telefoon van de starter aanstaat.";
      render();
      return;
    }
    if (app.state.hostId === app.meId && app.state.phase !== "closed") {
      app.isHost = true;
      app.state.hostBeat = Date.now();
      publishState();
    }
    if (app.state.phase !== "closed" && !app.tv) startJoinLoop();
    render();
  }
  function noteEveningMissed() {
    const g = app.state && app.state.game;
    const names = (g && g.missed) || [];
    const have = new Set(app.eveningMissed || []);
    names.forEach((n) => { if (n) have.add(n); });
    app.eveningMissed = [...have];
  }
  function noteEveningAnswers() {
    const g = app.state && app.state.game;
    const have = app.eveningAnswers || [];
    if (!g || g.id !== "memes") { app.eveningAnswers = have.slice(); return; }
    const current = g.stage === "result" ? "" : answerName(g);
    const names = (g.answers || []).concat(current ? [current] : []);
    const seen = new Set();
    app.eveningAnswers = have.concat(names).filter((n) => n && !seen.has(n) && seen.add(n));
  }
  function buildRecap() {
    noteEveningMissed();
    noteEveningAnswers();
    if (!app.state || !(app.state.players || []).length) return null;
    const players = app.state.players.map((p) => ({ name: p.name, sips: p.sips | 0, icon: p.icon, color: p.color })).sort((a, b) => b.sips - a.sips);
    const missed = (app.eveningMissed || []).slice();
    const answers = (app.eveningAnswers || []).slice();
    const games = (app.eveningGames || []).slice();
    if (!players.some((p) => p.sips > 0) && !missed.length && !answers.length && !games.length) return null;
    return { players, missed, answers, games };
  }
  function noteEveningQuestions() {
    const g = app.state && app.state.game;
    if (!g || g.id !== "vragen") return;
    const shown = (g.order || []).slice(0, (g.cursor | 0) + 1);
    const texts = shown.map((id) => (g.custom || []).find((q) => q.id === id)).filter(Boolean).map((q) => q.text);
    const have = new Set(app.eveningQuestions || []);
    texts.forEach((t) => have.add(t));
    app.eveningQuestions = [...have];
  }
  function saveEvening() {
    if (!app.account || !app.groupId || !app.state || !(app.state.players || []).length) return;
    const players = app.state.players.map((p) => ({ name: p.name, sips: p.sips | 0 }));
    const games = app.eveningGames || [];
    if (!players.some((p) => p.sips > 0) && !games.length) return;
    const groupId = app.groupId;
    api("/api/groups/" + encodeURIComponent(groupId) + "/evenings", {
      method: "POST",
      body: { players, games, questions: app.eveningQuestions || [] },
    }).then((data) => {
      app.groups = (app.groups || []).map((g) => g.id === data.group.id ? data.group : g);
    }).catch(() => {});
  }
  function finishLeave() {
    noteEveningQuestions();
    noteEveningMissed();
    noteEveningAnswers();
    const recap = buildRecap();
    saveEvening();
    app.eveningGames = [];
    app.eveningQuestions = [];
    app.eveningMissed = [];
    app.eveningAnswers = [];
    app.recap = recap;
    app.op++;
    net.attempt++;
    if (net.cancelConn) { const c = net.cancelConn; net.cancelConn = null; c(); }
    clearInterval(app.joinTimer);
    clearTimeout(app.ui.revealTimer);
    clearInterval(app.ui.timerInt);
    net.closing = true;
    if (net.client) { try { net.client.end(true); } catch (e) {} }
    net.client = null;
    net.closing = false;
    net.stateTopic = "";
    net.inTopic = "";
    sessionStorage.removeItem("maatje.room");
    try { sessionStorage.removeItem("maatje.tv"); } catch (e) {}
    clearUrlRoom();
    app.mode = null;
    app.state = null;
    app.isHost = false;
    app.tv = false;
    app.ui.how = "";
    app.roomCode = "";
    app.conn = "off";
    app.error = "";
    app.overlay = null;
    app.screen = recap ? "recap" : "home";
    app.ui.stale = false;
    app.ui.noRoom = false;
    app.ui.confirmLeave = false;
    app.ui.joinWait = "";
    app.seen = new Set();
    render();
  }
  function leaveRoom() {
    const token = ++app.op;
    const client = net.client;
    const connected = client && client.connected && app.mode === "multi" && app.state && app.state.phase !== "closed";
    if (!connected) { finishLeave(); return; }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      if (token !== app.op) return;
      finishLeave();
    };
    try {
      if (app.isHost) {
        const others = app.state.players.filter((p) => p.id !== app.meId);
        const next = others.length
          ? { ...app.state, hostId: others[0].id, players: others, gen: (app.state.gen | 0) + 1, rev: (app.state.rev | 0) + 1, hostBeat: Date.now() }
          : { ...app.state, phase: "closed", players: [], game: null, rev: (app.state.rev | 0) + 1, hostBeat: Date.now() };
        if (next.game && next.players.length) next.game = { ...next.game, turn: next.game.turn % next.players.length };
        client.publish(net.stateTopic, JSON.stringify(next), { qos: 1, retain: true }, finish);
      } else {
        client.publish(net.inTopic, JSON.stringify({ iid: uid(), type: "leave", by: app.meId, playerId: app.meId }), { qos: 1 }, finish);
      }
    } catch (e) { finish(); }
    setTimeout(finish, 700);
  }
  function claimHost() {
    if (!app.state) return;
    if (Date.now() - app.state.hostBeat < 10000) { toast("De starter is er nog."); return; }
    if (!app.state.players.some((p) => p.id === app.meId)) { toast("Je zit niet in dit spel."); return; }
    app.isHost = true;
    commitDirect({ ...app.state, hostId: app.meId, gen: (app.state.gen | 0) + 1 });
    toast("Jij hebt de leiding.");
  }

  function noteSpin() {
    const spin = app.state && app.state.game && app.state.game.id === "rad" ? app.state.game.spin : null;
    if (!spin) return;
    if (app.ui.lockSpinId === spin.id) return;
    app.ui.lockSpinId = spin.id;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const age = Date.now() - (Number(spin.at) || 0);
    if (app.ui.soundFor === "pending") app.ui.soundFor = spin.id;
    if (!reduceMotion && age < 1600) {
      app.ui.revealAt = Date.now() + 4300;
      app.ui.justStartedSpin = true;
      clearTimeout(app.ui.revealTimer);
      app.ui.revealTimer = setTimeout(() => {
        app.ui.revealAt = 0;
        if (app.ui.soundFor === spin.id) playBlip();
        render();
      }, 4360);
    } else {
      app.ui.revealAt = 0;
      app.ui.justStartedSpin = false;
    }
  }
  function resultVisible() {
    const g = app.state && app.state.game;
    if (!g || g.id !== "rad" || g.stage !== "result" || !g.spin) return false;
    if (app.ui.lockSpinId === g.spin.id && app.ui.revealAt && Date.now() < app.ui.revealAt) return false;
    return true;
  }
  function syncWheel(animate) {
    const el = document.getElementById("wheelSpin");
    if (!el || !app.state || !app.state.game || app.state.game.id !== "rad") return;
    const to = app.state.game.rotation || 0;
    if (!animate) {
      el.style.transition = "none";
      el.style.transform = "rotate(" + to + "deg)";
      app.ui.wheelRot = to;
      return;
    }
    const from = app.ui.wheelRot || 0;
    el.style.transition = "none";
    el.style.transform = "rotate(" + from + "deg)";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el2 = document.getElementById("wheelSpin");
      if (!el2) return;
      el2.style.transition = "transform 4.3s cubic-bezier(.15,.75,.05,1)";
      el2.style.transform = "rotate(" + to + "deg)";
    }));
    app.ui.wheelRot = to;
  }
  function playBlip() {
    if (!app.sound || !app.audio) return;
    try {
      const ctx = app.audio;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(480, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }
  function ensureAudio() {
    if (!app.sound) return;
    try {
      app.audio = app.audio || new AudioContext();
      if (app.audio.state === "suspended") app.audio.resume();
    } catch (e) {}
  }
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    clearTimeout(app.ui.toastTimer);
    app.ui.toastTimer = setTimeout(() => { const n = document.querySelector(".toast"); if (n) n.remove(); }, 2400);
  }
  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; }
    } catch (e) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }
  function qrBlock() {
    if (app.mode !== "multi" || !app.roomCode || typeof qrcode !== "function") return "";
    try {
      const qr = qrcode(0, "M");
      qr.addData(shareUrl());
      qr.make();
      const local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
      return `<div class="qr-box">${qr.createSvgTag(4, 1)}<p class="fine">${local ? "Scan werkt als iedereen het wifi-adres opent, niet localhost." : "Scan om mee te doen."}</p></div>`;
    } catch (e) { return ""; }
  }
  function shareUrl() {
    const u = new URL(location.href);
    u.searchParams.set("room", app.roomCode);
    u.hash = "";
    return u.toString();
  }
  async function shareRoom() {
    if (!app.roomCode) return;
    const url = shareUrl();
    if (location.protocol !== "file:" && navigator.share) {
      try { await navigator.share({ title: "Maatje", text: "Doe mee met Maatje. Code " + app.roomCode, url }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    const ok = await copyText(location.protocol === "file:" ? app.roomCode : url);
    toast(ok ? (location.protocol === "file:" ? "Code gekopieerd" : "Link gekopieerd") : app.roomCode);
  }

  function api(path, opts) {
    const headers = { "Content-Type": "application/json" };
    if (app.token) headers.Authorization = "Bearer " + app.token;
    if (opts && opts.admin && app.adminToken) headers["X-Admin-Token"] = app.adminToken;
    return fetch(path, { method: (opts && opts.method) || "GET", headers, body: opts && opts.body ? JSON.stringify(opts.body) : undefined })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Het lukte niet. Vernieuw de pagina en probeer opnieuw.");
        return data;
      });
  }
  function setSession(data) {
    app.token = data.token || app.token;
    if (data.token) localStorage.setItem("maatje.token", data.token);
    if (data.user) {
      app.account = data.user;
      app.profile = { name: cleanName(data.user.name, "Speler"), icon: validIcon(data.user.icon), color: validColor(data.user.color), photo: cleanPhoto(data.user.photo) };
      localStorage.setItem("maatje.profile", JSON.stringify(app.profile));
      localStorage.setItem("maatje.welcomed", "1");
      if (AGES.some((a) => a.id === data.user.age)) app.ui.age = data.user.age;
    }
    if (data.groups) app.groups = data.groups;
    app.overlay = null;
  }
  function applyMemes(list) {
    if (!Array.isArray(list) || !list.length) return;
    const clean = list.filter((m) => m && m.id && m.name && m.video).map((m) => ({
      id: String(m.id),
      name: String(m.name).slice(0, 40),
      video: String(m.video).slice(0, 300),
      sips: Math.max(1, Math.min(4, m.sips | 0 || 2)),
    }));
    if (!clean.length) return;
    MEMES = clean;
    app.memesRev += 1;
  }
  function applyQuestions(list) {
    if (!Array.isArray(list) || !list.length) return;
    const clean = list.filter((q) => q && q.id && q.text).map((q) => ({
      id: String(q.id),
      cat: ["licht", "groep", "pittig"].includes(q.cat) ? q.cat : "licht",
      kind: q.kind === "point" ? "point" : "say",
      text: String(q.text).slice(0, 180),
      ages: Array.isArray(q.ages) && q.ages.length ? q.ages.slice() : ["16-18", "18-20", "20-25", "25-35", "35+"],
    }));
    if (!clean.length) return;
    QUESTIONS = clean;
    app.questionsRev += 1;
  }
  function removeMeme(id) {
    if (!id || !confirm("Deze meme weghalen?")) return;
    api("/api/admin/memes/" + encodeURIComponent(id), { method: "DELETE", admin: true })
      .then((data) => {
        applyMemes(data.memes);
        if (app.ui.editId === id) app.ui.editId = "";
        render();
      })
      .catch((err) => {
        if (/beheerder/.test(err.message)) { dropAdmin(); render(); }
        toast(err.message);
      });
  }
  function removeQuestion(id) {
    if (!id || !confirm("Deze vraag weghalen?")) return;
    api("/api/admin/questions/" + encodeURIComponent(id), { method: "DELETE", admin: true })
      .then((data) => {
        applyQuestions(data.questions);
        if (app.ui.editId === id) app.ui.editId = "";
        render();
      })
      .catch((err) => {
        if (/beheerder/.test(err.message)) { dropAdmin(); render(); }
        toast(err.message);
      });
  }
  function dropAdmin() {
    app.admin = false;
    app.adminToken = "";
    try { sessionStorage.removeItem("maatje.admin"); } catch (e) {}
  }
  function loadAccount() {
    if (location.protocol === "file:") return Promise.resolve();
    try {
      const savedAdmin = sessionStorage.getItem("maatje.admin") || "";
      if (savedAdmin) { app.adminToken = savedAdmin; app.admin = true; }
    } catch (e) {}
    const verifyToken = new URLSearchParams(location.search).get("verify") || "";
    const verified = verifyToken
      ? api("/api/verify", { method: "POST", body: { token: verifyToken } }).then((data) => {
          setSession(data);
          try { history.replaceState({}, "", location.pathname); } catch (err) {}
          toast("E-mail bevestigd. Je kunt nu met een code spelen.");
        }).catch((err) => toast(err.message))
      : Promise.resolve();
    return verified.then(() => api("/api/config")).then((cfg) => {
      app.config = cfg || { googleClientId: "" };
      if (app.config.googleClientId) loadGoogle();
      if (!app.token) return null;
      return api("/api/me").then((data) => setSession({ token: app.token, user: data.user, groups: data.groups }));
    }).catch(() => {
      if (app.token) { app.token = ""; localStorage.removeItem("maatje.token"); }
    }).then(() => api("/api/questions").then((data) => applyQuestions(data && data.questions)).catch(() => {}))
      .then(() => api("/api/memes").then((data) => applyMemes(data && data.memes)).catch(() => {}))
      .then(() => { app.authReady = true; render(); });
  }
  function loadGoogle() {
    if (window.google || document.getElementById("googleSdk")) return;
    const s = document.createElement("script");
    s.id = "googleSdk";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => render();
    document.head.appendChild(s);
  }
  function renderGoogle() {
    const el = document.getElementById("googleSlot");
    if (!el || !app.config.googleClientId || !window.google || !google.accounts) return;
    google.accounts.id.initialize({
      client_id: app.config.googleClientId,
      callback: (resp) => { if (resp && resp.credential) googleLogin(resp.credential); },
    });
    el.innerHTML = "";
    google.accounts.id.renderButton(el, { theme: "filled_black", size: "large", shape: "pill", width: 280, text: "continue_with" });
  }
  function googleLogin(credential) {
    api("/api/google", { method: "POST", body: { credential } })
      .then((data) => { setSession(data); toast("Ingelogd met Google"); render(); })
      .catch((err) => toast(err.message));
  }
  function showCheckMail(email, previewLink) {
    app.overlay = "login";
    app.ui.authMode = "check-mail";
    app.ui.pendingEmail = email || "";
    app.ui.previewLink = previewLink || "";
    render();
  }
  function authSubmit(register) {
    const nameEl = document.getElementById("authName");
    const emailEl = document.getElementById("authEmail");
    const passEl = document.getElementById("authPass");
    if (nameEl) app.ui.authName = nameEl.value;
    if (emailEl) app.ui.authEmail = emailEl.value;
    if (passEl) app.ui.authPass = passEl.value;
    const name = app.ui.authName || "";
    const email = app.ui.authEmail || "";
    const password = app.ui.authPass || "";
    if (register) {
      if (name.trim().length < 2) { app.error = "Kies een naam van minstens 2 letters."; toast(app.error); render(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { app.error = "Vul een echt e-mailadres in, bijvoorbeeld naam@mail.nl."; toast(app.error); render(); return; }
      if (password.length < 4) { app.error = "Kies een wachtwoord van minstens 4 tekens."; toast(app.error); render(); return; }
    }
    const body = register ? { name, email, password } : { name, email: name, password };
    api(register ? "/api/register" : "/api/login", { method: "POST", body })
      .then((data) => {
        app.ui.authPass = "";
        app.error = "";
        if (data.pending) { showCheckMail(data.email, data.previewLink); return; }
        setSession(data);
        app.ui.authHint = "";
        toast(register ? "Account gemaakt. Je bent ingelogd." : (data.user && data.user.verified === false ? "Ingelogd. Bevestig je mail om met een code te spelen." : "Welkom terug"));
        render();
      })
      .catch((err) => { app.error = err.message; toast(err.message); render(); });
  }
  function needFriendsAccount() {
    if (location.protocol === "file:") return false;
    if (!app.account) {
      app.overlay = "login";
      app.ui.authMode = "login";
      app.ui.authHint = "Met vrienden via een code heb je een account nodig. Kijken en op één telefoon spelen mag zonder.";
      render();
      return true;
    }
    if (app.account.verified === false) {
      showCheckMail(app.account.email, app.ui.previewLink);
      return true;
    }
    return false;
  }
  function logout() {
    const token = app.token;
    app.token = "";
    app.account = null;
    app.groups = [];
    app.groupId = "";
    localStorage.removeItem("maatje.token");
    if (token) api("/api/logout", { method: "POST" }).catch(() => {});
    app.screen = "home";
    app.overlay = null;
    render();
  }
  function linkGroupRoom(groupId, code) {
    api("/api/groups/" + encodeURIComponent(groupId) + "/room", { method: "POST", body: { code } })
      .then((data) => {
        app.groups = app.groups.map((g) => g.id === data.group.id ? data.group : g);
      }).catch(() => {});
  }
  function groupPlayers(group) {
    if (!group || !group.members || !group.members.length) return null;
    return group.members.slice(0, 12).map((m) => ({
      id: app.account && m.userId === app.account.id ? app.meId : m.userId,
      name: cleanName(m.name, "Speler"),
      icon: validIcon(m.icon),
      color: validColor(m.color),
      sips: 0,
    }));
  }
  function playGroupLocal(group) {
    const players = groupPlayers(group);
    if (!players) return;
    app.groupId = group.id;
    if (group.age && AGES.some((a) => a.id === group.age)) app.ui.age = group.age;
    app.draftPlayers = players;
    app.mode = "local";
    app.isHost = true;
    app.state = { v: 1, gen: 1, rev: 1, hostId: app.meId, hostBeat: Date.now(), phase: "lobby", players, game: null };
    app.screen = "lobby";
    render();
  }
  function homeGroups() {
    if (location.protocol === "file:") return "";
    if (!app.account) {
      return `<section class="section-head"><p class="kicker">Groepen</p><h2>Speel vaker met dezelfde mensen.</h2><p class="lede">Maak een account, start een groep en bewaar jullie eigen vragen.</p><div class="stack" style="max-width:280px;margin-top:12px"><button type="button" class="btn btn-primary" data-act="signup">Account maken</button></div></section>`;
    }
    const cards = (app.groups || []).map((g) => `<button type="button" class="group-card gcard" data-act="open-group" data-id="${esc(g.id)}"><span class="kicker">${esc(g.code)}</span><h3>${esc(g.name)}</h3><div class="faces">${(g.members || []).slice(0, 8).map((m) => `<span class="ava" style="--c:${colorHex(m.color)}">${faceHtml(m)}</span>`).join("")}</div><span class="fine">${(g.members || []).length} ${g.members.length === 1 ? "persoon" : "mensen"} · vragen ${esc((AGES.find((a) => a.id === g.age) || {}).label || "")}</span></button>`).join("");
    return `<section><div class="section-head"><p class="kicker">Jouw groepen</p><h2>${app.groups.length ? "Waar je vaker mee speelt." : "Nog geen groep."}</h2></div><div class="group-grid">${cards}<button type="button" class="group-card gcard" data-act="groups"><h3>Nieuwe groep</h3><p>Of doe mee met een groepscode.</p></button></div></section>`;
  }
  function loginHtml() {
    if (app.overlay !== "login") return "";
    if (app.ui.authMode === "check-mail") {
      const link = app.ui.previewLink
        ? `<p class="fine">Er is nog geen mailserver ingesteld in config.json. Tot die tijd bevestig je via deze link:</p><p class="fine"><a href="${esc(app.ui.previewLink)}">${esc(app.ui.previewLink)}</a></p>`
        : `<p class="fine">Open de mail op ${esc(app.ui.pendingEmail || "je adres")}. Kijk ook in spam.</p>`;
      return `<div class="modal" data-act="close-login"><div class="panel auth" data-act="stop" role="dialog" aria-modal="true"><h3>Check je mail</h3><p class="fine">Klik de link in de mail. Daarna kun je met een code spelen.</p>${link}<button type="button" class="btn btn-primary" data-act="resend-mail">Stuur opnieuw</button><button type="button" class="btn btn-text" data-act="login">Naar inloggen</button><button type="button" class="btn btn-ghost" data-act="close-login">Sluiten</button></div></div>`;
    }
    const reg = app.ui.authMode === "register";
    const google = !reg && app.config.googleClientId
      ? `<div id="googleSlot"></div><p class="or">of met e-mail</p>`
      : (!reg ? `<p class="note">Google zet je aan door een client-id in config.json te zetten.</p>` : "");
    const hint = app.ui.authHint || (reg ? "Je krijgt een mail om het adres te bevestigen." : "Kijken en op één telefoon spelen mag zonder account.");
    const emailField = reg ? `<label class="field">E-mail<input id="authEmail" type="email" maxlength="80" autocomplete="email" value="${esc(app.ui.authEmail || "")}"></label>` : "";
    const err = app.error ? `<p class="fine">${esc(app.error)}</p>` : "";
    return `<div class="modal" data-act="close-login"><div class="panel auth" data-act="stop" role="dialog" aria-modal="true"><h3>${reg ? "Account maken" : "Inloggen"}</h3><p class="fine">${esc(hint)}</p><form data-act="${reg ? "register" : "login-form"}" class="auth-grid"><label class="field">${reg ? "Naam" : "E-mail of naam"}<input id="authName" maxlength="80" autocomplete="username" value="${esc(app.ui.authName || "")}"></label>${emailField}<label class="field">Wachtwoord<input id="authPass" type="password" maxlength="64" autocomplete="${reg ? "new-password" : "current-password"}" value="${esc(app.ui.authPass || "")}"></label><button class="btn btn-primary" type="button" data-act="${reg ? "do-register" : "do-login"}">${reg ? "Account maken" : "Inloggen"}</button></form>${err}${google}<button type="button" class="btn btn-text" data-act="auth-toggle">${reg ? "Ik heb al een account" : "Nog geen account"}</button><button type="button" class="btn btn-ghost" data-act="close-login">Sluiten</button></div></div>`;
  }
  function groupTile(g) {
    const members = g.members || [];
    const people = members.length === 1 ? "1 persoon" : members.length + " mensen";
    const age = (AGES.find((a) => a.id === g.age) || {}).label || "20–25";
    const faces = members.slice(0, 8).map((m) => `<li><span class="ava" style="--c:${colorHex(m.color)}">${faceHtml(m)}</span><b>${esc(m.name)}</b></li>`).join("");
    const questions = (g.questions || []).length;
    const evenings = (g.evenings || []).length;
    const segments = (g.segments || []).length;
    const bits = [people, "Vragen " + age];
    if (questions) bits.push(questions === 1 ? "1 eigen vraag" : questions + " eigen vragen");
    if (evenings) bits.push(evenings === 1 ? "1 avond" : evenings + " avonden");
    if (segments) bits.push(segments === 1 ? "1 vakje" : segments + " vakjes");
    return `<button type="button" class="group-card gcard group-tile" data-act="open-group" data-id="${esc(g.id)}"><div class="tile-top"><span class="kicker">${esc(g.code)}</span><span class="fine">Openen</span></div><h3>${esc(g.name)}</h3><ul class="member-row">${faces}</ul><div class="tile-meta">${bits.map((bit) => `<span>${esc(bit)}</span>`).join("")}</div></button>`;
  }
  function drawGroups() {
    const groups = app.groups || [];
    const tiles = groups.map(groupTile).join("");
    const list = tiles
      ? `<div class="section-head"><p class="kicker">Jullie groepen</p></div><div class="group-grid${groups.length === 1 ? " one" : ""}">${tiles}</div>`
      : `<p class="fine">Nog niks. Maak er een, of vraag de code.</p>`;
    return `<div class="wrap groups-page">${topbar()}<div class="groups-head"><div><p class="kicker">Groepen</p><h2>Jullie vaste tafel.</h2><p class="lede">Eigen vragen, vakjes op het rad, en de stand van de vorige avond.</p></div><button type="button" class="btn btn-text" data-act="logout">Uitloggen</button></div><div class="lobby-layout"><section class="lobby-card"><h3>Nieuwe groep</h3><p class="fine">Een code voor dezelfde mensen, telkens weer.</p><form data-act="create-group" class="auth-grid"><label class="field">Naam<input id="groupName" maxlength="16" placeholder="Vrijdag" value="${esc(app.ui.groupName || "")}"></label><button class="btn btn-primary" type="submit">Maak groep</button></form></section><section class="lobby-card"><h3>Meedoen</h3><p class="fine">Vraag de code aan wie de groep heeft gemaakt.</p><form data-act="join-group" class="auth-grid"><label class="field">Groepscode<input id="groupCode" maxlength="4" autocapitalize="characters" placeholder="K7MP" value="${esc(app.ui.groupCode || "")}"></label><button class="btn btn-primary" type="submit">Doe mee</button></form></section></div>${list}</div>`;
  }
  function groupExtras(g) {
    const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    const names = { rad: "Het Rad", vragen: "Vragenvuur", kaarten: "Kaarten", memes: "Memes" };
    const whoLabel = { self: "jij", all: "iedereen", left: "links", right: "rechts", give: "iemand kiezen", none: "niemand" };
    const evenings = (g.evenings || []).slice().reverse().map((e) => {
      const d = new Date(e.at || 0);
      const when = d.getDate() + " " + months[d.getMonth()];
      const top = (e.players || []).slice().sort((a, b) => b.sips - a.sips)[0];
      const played = (e.games || []).map((id) => names[id] || id).filter(Boolean).join(", ");
      const qs = (e.questions || []).length ? `<span class="fine">Eigen vragen: ${(e.questions || []).map(esc).join(" · ")}</span>` : "";
      return `<li class="prow"><span class="who"><b>${esc(when)}${played ? " · " + esc(played) : ""}</b><small>${top ? esc(top.name) + " · " + sipWord(top.sips) : "geen slokken"}</small>${qs}</span></li>`;
    }).join("");
    const segs = (g.segments || []).map((s) => `<li class="prow"><span class="who"><b>${esc(s.label)}</b><small>${esc(whoLabel[s.who] || s.who)}${s.sips ? " · " + s.sips : ""}${s.text ? " · " + esc(s.text) : ""}</small></span><button type="button" data-act="remove-segment" data-id="${esc(s.id)}" aria-label="Vakje weghalen">×</button></li>`).join("");
    return `<section class="lobby-card" style="margin-top:16px"><p class="kicker">Avonden</p>${evenings ? `<ul class="plist">${evenings}</ul>` : `<p class="fine">Speel een spel vanuit deze groep en stop daarna. De stand komt hier.</p>`}</section><section class="lobby-card" style="margin-top:16px"><p class="kicker">Eigen vakjes</p><p class="fine">Die komen bij Het Rad, naast de vaste vakjes.</p><ul class="plist">${segs}</ul><form data-act="add-segment" class="auth-grid"><label class="field">Korte naam<input id="segLabel" maxlength="10" placeholder="Jarige"></label><label class="field">Wat er gebeurt<input id="segText" maxlength="80" placeholder="De jarige drinkt niet"></label><label class="field">Slokken<input id="segSips" type="number" min="0" max="4" value="0"></label><label class="field">Wie<select id="segWho"><option value="none">Niemand</option><option value="self">Jij</option><option value="all">Iedereen</option><option value="left">Links</option><option value="right">Rechts</option><option value="give">Iemand kiezen</option></select></label><button class="btn btn-primary" type="submit">Op het rad</button></form></section>`;
  }
  function drawGroup() {
    const g = (app.groups || []).find((x) => x.id === app.groupId);
    if (!g) return `<div class="narrow">${topbar()}<p>Die groep is er niet.</p><button type="button" class="btn btn-primary" data-act="groups">Terug</button></div>`;
    const mine = app.account && g.ownerId === app.account.id;
    return `<div class="wrap">${topbar()}<p class="kicker">Groep ${esc(g.code)}</p><h2>${esc(g.name)}</h2><p class="fine">${mine ? "Jij hebt deze groep gemaakt." : "Je zit in deze groep."} Deel de code ${esc(g.code)}.</p><div class="lobby-layout"><section class="lobby-card"><p class="kicker">Mensen</p><ul class="plist">${(g.members || []).map((m, i) => `<li class="prow"><span class="ord">${i + 1}</span><span class="ava" style="--c:${colorHex(m.color)}">${faceHtml(m)}</span><span class="who"><b>${esc(m.name)}</b><small>${app.account && m.userId === app.account.id ? "jij" : ""}</small></span></li>`).join("")}</ul><div class="stack" style="margin-top:12px"><button type="button" class="btn btn-primary" data-act="group-local">Speel op één telefoon</button><button type="button" class="btn btn-ghost" data-act="group-room">Start een kamer</button></div></section><section class="lobby-card"><p class="kicker">Leeftijd voor vragen</p>${AGES.map((a) => `<button type="button" class="chip ${g.age === a.id ? "is-on" : ""}" data-act="group-age" data-age="${a.id}">${a.label}</button>`).join(" ")}<p class="fine">${esc((AGES.find((a) => a.id === g.age) || AGES[2]).hint)}</p><p class="kicker" style="margin-top:16px">Eigen vragen</p><ul class="plist">${(g.questions || []).map((q) => `<li class="prow"><span class="who"><b>${esc(q.text)}</b><small>${esc(q.by || "")}</small></span></li>`).join("") || `<li class="fine">Nog geen eigen vragen.</li>`}</ul><form data-act="add-question" class="auth-grid" style="margin-top:10px"><label class="field">Nieuwe vraag<input id="customQ" maxlength="180" placeholder="Wijs aan: wie regelt de bitterballen?" value="${esc(app.ui.customQ || "")}"></label><button class="btn btn-primary" type="submit">Bewaar vraag</button></form></section></div>${groupExtras(g)}<button type="button" class="btn btn-text" data-act="leave-group">Groep verlaten</button></div>`;
  }
  function applyTheme(theme) {
    const choice = ["system", "dark", "light"].includes(theme) ? theme : "dark";
    app.theme = choice;
    try { localStorage.setItem("maatje.theme", choice); } catch (e) {}
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = choice === "system" ? (systemDark ? "dark" : "light") : choice;
  }
  function drawSettings() {
    const d = app.draft || app.profile || { name: "", icon: "glass", color: "blue" };
    const theme = app.theme || "dark";
    return `<div class="wrap">${topbar()}<div class="set-head"><button type="button" class="btn btn-text" data-act="settings-back">‹ Terug</button><div><p class="kicker">Instellingen</p><h2>Jouw voorkeuren</h2></div></div><div class="set-grid"><section class="set-card"><p class="label">Avatar</p><div class="you-pill" style="--c:${colorHex(d.color)}"><span class="mini-ico">${faceHtml(d)}</span><strong id="settingsPreview">${esc(cleanName(d.name, "") || "Jouw naam")}</strong></div><p class="fine">Kies een foto, een pictogram en een kleur.</p>${photoPicker("settingsPhoto", d)}<label class="field">Naam<input id="settingsName" maxlength="16" value="${esc(d.name || "")}" autocomplete="off" spellcheck="false"></label><p class="label">Pictogram</p><div class="icons">${ICONS.map((ic) => `<button type="button" class="ico ${d.icon === ic.id ? "is-on" : ""}" data-act="pick-icon" data-id="${ic.id}" aria-label="${ic.label}" aria-pressed="${d.icon === ic.id}">${ic.svg}</button>`).join("")}</div><p class="label">Kleur</p><div class="swatches">${COLORS.map((c) => `<button type="button" class="swatch ${d.color === c.id ? "is-on" : ""}" style="--c:${c.hex}" data-act="pick-color" data-id="${c.id}" aria-label="${c.label}" aria-pressed="${d.color === c.id}"></button>`).join("")}</div></section><section class="set-card"><p class="label">Thema</p><div class="seg">${[["system", "Systeem"], ["dark", "Donker"], ["light", "Licht"]].map(([id, label]) => `<button type="button" class="${theme === id ? "is-on" : ""}" data-act="theme" data-theme="${id}">${label}</button>`).join("")}</div><button type="button" class="set-row" data-act="sound"><span>Geluid</span><strong>${app.sound ? "Aan" : "Uit"}</strong></button><p class="label">Leeftijd voor vragen</p>${ageChips()}<p class="fine">${esc((AGES.find((a) => a.id === app.ui.age) || AGES[2]).hint)}</p><button type="button" class="set-row" data-act="admin" data-tab="vragen"><span>Vragen</span><strong>Beheren</strong></button><button type="button" class="set-row" data-act="admin" data-tab="memes"><span>Memes</span><strong>Beheren</strong></button><button type="button" class="set-row" data-act="${app.account ? "groups" : "login"}"><span>${app.account ? "Groepen" : "Account"}</span><strong>${app.account ? esc(app.account.name) : "Inloggen"}</strong></button>${app.account ? `<button type="button" class="set-row" data-act="logout"><span>Uitloggen</span><strong></strong></button>` : ""}</section></div></div>`;
  }
  function ageChecks(selected) {
    const set = new Set(selected && selected.length ? selected : AGES.map((a) => a.id));
    return `<div class="age-checks">${AGES.map((a) => `<label><input type="checkbox" data-age="${a.id}" ${set.has(a.id) ? "checked" : ""}> ${a.label}</label>`).join("")}</div>`;
  }
  function questionEditor(q) {
    const cat = q ? q.cat : "licht";
    const kind = q ? q.kind : "say";
    return `<form data-act="save-question" class="set-card"><input type="hidden" id="qId" value="${q ? esc(q.id) : ""}"><label class="field">Vraag<textarea id="qText" maxlength="180" rows="3" required>${q ? esc(q.text) : ""}</textarea></label><label class="field">Soort<select id="qCat"><option value="licht" ${cat === "licht" ? "selected" : ""}>Licht</option><option value="groep" ${cat === "groep" ? "selected" : ""}>Groep</option><option value="pittig" ${cat === "pittig" ? "selected" : ""}>Pittig</option></select></label><label class="field">Wat je doet<select id="qKind"><option value="say" ${kind !== "point" ? "selected" : ""}>Vertellen</option><option value="point" ${kind === "point" ? "selected" : ""}>Wijs aan</option></select></label><p class="label">Leeftijden</p>${ageChecks(q ? q.ages : null)}<p class="fine">Pittig komt nooit bij 16–18.</p><div class="stack"><button class="btn btn-primary" type="submit">${q ? "Opslaan" : "Toevoegen"}</button><button type="button" class="btn btn-text" data-act="cancel-edit">Annuleren</button></div></form>`;
  }
  function memeEditor(m) {
    const own = m && String(m.video).startsWith("/media/");
    return `<form data-act="save-meme" class="set-card"><input type="hidden" id="mId" value="${m ? esc(m.id) : ""}"><input type="hidden" id="mKeep" value="${own ? esc(m.video) : ""}"><label class="field">Naam van de meme<input id="mName" maxlength="40" value="${m ? esc(m.name) : ""}" placeholder="Jurk!" required></label><label class="field">YouTube-link<input id="mVideo" maxlength="300" value="${m && !own ? esc(m.video) : ""}" placeholder="https://www.youtube.com/watch?v=..."></label><label class="field">Of upload een foto<span class="file-row"><input id="mFile" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"><span class="file-btn">Kies een foto</span><span id="mFileName">Geen bestand</span></span></label><label class="field">Slokken<input id="mSips" type="number" min="1" max="4" value="${m ? m.sips : 2}"></label><p class="fine">${own ? "Er staat al een eigen foto. Upload een nieuwe om hem te vervangen. " : ""}Jpg, png of webp, max 8 MB. Bij een YouTube-link pakt het spel zelf een stil beeld. De naam blijft verborgen tot iemand het niet weet.</p><div class="stack"><button class="btn btn-primary" type="submit">${m ? "Opslaan" : "Toevoegen"}</button><button type="button" class="btn btn-text" data-act="cancel-edit">Annuleren</button></div></form>`;
  }
  function adminTabs() {
    const tab = app.ui.adminTab || "vragen";
    return `<div class="seg">${[["vragen", "Vragen"], ["memes", "Memes"]].map(([id, label]) => `<button type="button" class="${tab === id ? "is-on" : ""}" data-act="admin-tab" data-tab="${id}">${label}</button>`).join("")}</div>`;
  }
  function drawAdmin() {
    if (!app.admin) {
      return `<div class="wrap">${topbar()}<div class="set-head"><button type="button" class="btn btn-text" data-act="admin-back">‹ Terug</button><div><p class="kicker">Beheer</p><h2>Vragen en memes</h2></div></div><section class="set-card"><p class="fine">Gebruikersnaam en wachtwoord staan in config.json als adminUser en adminPassword.</p><form data-act="admin-login" class="auth-grid"><label class="field">Gebruikersnaam<input id="adminUser" maxlength="32" autocomplete="username" required></label><label class="field">Wachtwoord<input id="adminPass" type="password" maxlength="64" autocomplete="current-password" required></label><button class="btn btn-primary" type="submit">Openen</button></form>${app.error ? `<p class="fine">${esc(app.error)}</p>` : ""}</section></div>`;
    }
    const tab = app.ui.adminTab || "vragen";
    if (tab === "memes") {
      const editing = app.ui.editId && app.ui.editId !== "new" ? MEMES.find((m) => m.id === app.ui.editId) : null;
      const form = app.ui.editId ? memeEditor(editing || null) : `<button type="button" class="btn btn-primary" data-act="new-meme">Nieuwe meme</button>`;
      const rows = MEMES.map((m) => `<article class="q-row"><div><strong>${esc(m.name)}</strong><small>${esc(String(m.video).startsWith("/media/") ? "eigen foto" : m.video)} · ${m.sips} ${m.sips === 1 ? "slok" : "slokken"}</small></div><div class="q-actions"><button type="button" class="btn btn-ghost" data-act="edit-meme" data-id="${esc(m.id)}">Aanpassen</button><button type="button" class="btn btn-ghost" data-act="delete-meme" data-id="${esc(m.id)}">Weg</button></div></article>`).join("");
      return `<div class="wrap">${topbar()}<div class="set-head"><button type="button" class="btn btn-text" data-act="admin-back">‹ Terug</button><div><p class="kicker">Beheer</p><h2>${MEMES.length} memes</h2></div></div>${adminTabs()}${form}<div class="q-admin">${rows}</div><button type="button" class="btn btn-text" data-act="admin-logout">Beheer sluiten</button></div>`;
    }
    const editing = app.ui.editId && app.ui.editId !== "new" ? QUESTIONS.find((q) => q.id === app.ui.editId) : null;
    const form = app.ui.editId ? questionEditor(editing || null) : `<button type="button" class="btn btn-primary" data-act="new-question">Nieuwe vraag</button>`;
    const rows = QUESTIONS.map((q) => `<article class="q-row"><div><strong>${esc(q.text)}</strong><small>${esc({ licht: "Licht", groep: "Groep", pittig: "Pittig" }[q.cat] || q.cat)} · ${q.kind === "point" ? "wijs aan" : "vertel"} · ${esc((q.ages || []).join(", "))}</small></div><div class="q-actions"><button type="button" class="btn btn-ghost" data-act="edit-question" data-id="${esc(q.id)}">Aanpassen</button><button type="button" class="btn btn-ghost" data-act="delete-question" data-id="${esc(q.id)}">Weg</button></div></article>`).join("");
    return `<div class="wrap">${topbar()}<div class="set-head"><button type="button" class="btn btn-text" data-act="admin-back">‹ Terug</button><div><p class="kicker">Beheer</p><h2>${QUESTIONS.length} vragen</h2></div></div>${adminTabs()}${form}<div class="q-admin">${rows}</div><button type="button" class="btn btn-text" data-act="admin-logout">Beheer sluiten</button></div>`;
  }
  function view() {
    if (app.screen === "settings") return "settings";
    if (app.screen === "recap") return "recap";
    if (app.screen === "admin") return "admin";
    if (app.overlay === "style") return "style";
    if (app.screen === "groups" && !app.mode) return "groups";
    if (app.screen === "group" && !app.mode) return "group";
    if (app.screen === "style" && localStorage.getItem("maatje.welcomed") !== "1") return "style";
    if (app.mode === "multi") {
      if (app.ui.noRoom || (app.conn === "error" && !app.state)) return "connecting";
      if (!app.state) return "connecting";
      if (app.state.phase === "closed") return "closed";
      if (app.state.phase === "play") return "play";
      return "lobby";
    }
    if (app.mode === "local" && app.state) {
      if (app.screen === "local-players") return "local-players";
      if (app.state.phase === "play") return "play";
      return "lobby";
    }
    if (app.screen === "local-players") return "local-players";
    return app.screen || "home";
  }
  function myTurn() {
    const g = app.state && app.state.game;
    if (!g || !app.state.players.length) return false;
    if (app.mode !== "multi") return true;
    const p = app.state.players[g.turn];
    return !!(p && p.id === app.meId);
  }
  function currentName() {
    const g = app.state && app.state.game;
    const p = g && app.state.players[g.turn];
    return p ? p.name : "Iemand";
  }
  function connClass() { return ["on", "connecting", "error", "off"].includes(app.conn) ? app.conn : "off"; }
  function logoSvg() {
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 6h6l-.7 6.2a2.8 2.8 0 0 1-4.6 0L7 6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M19 6h6l-.7 6.2a2.8 2.8 0 0 1-4.6 0L19 6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 22c1.2 2 2.4 3 4 3s2.6-.8 4-3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  }
  function gearSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
  }
  function soundSvg(on) {
    return on
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4h3l4 3V7L7 10H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 7a7 7 0 0 1 0 10"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4h3l4 3V7L7 10H4z"/><path d="m16 10 5 5M21 10l-5 5"/></svg>';
  }
  function topNav() {
    const v = view();
    const tabs = [
      { act: "brand", label: "Home", on: v === "home" },
      { act: app.account ? "groups" : "login", label: "Groepen", on: v === "groups" || v === "group" },
    ];
    if (app.mode) tabs.push({ act: "nav-play", label: "Spel", on: v === "lobby" || v === "play" || v === "connecting" || v === "local-players" || v === "closed" });
    return `<nav class="nav" aria-label="Pagina's">${tabs.map((tab) => `<button type="button" class="${tab.on ? "is-on" : ""}" data-act="${tab.act}"${tab.on ? ' aria-current="page"' : ""}>${tab.label}</button>`).join("")}</nav>`;
  }
  function topbar() {
    const me = app.profile || { name: "Jij", icon: "glass", color: "blue" };
    const code = app.mode === "multi" && app.roomCode
      ? `<button type="button" class="chip-code ${connClass()}" data-act="copy-code"><i></i>${esc(app.roomCode)}</button>`
      : "";
    const sessionBtn = app.account
      ? `<button type="button" class="bar-logout" data-act="logout">Uitloggen</button>`
      : `<button type="button" class="bar-logout" data-act="login">Inloggen</button>`;
    return `<header class="bar"><div class="top"><div class="top-left"><button type="button" class="brand" data-act="brand">${logoSvg()}<b>Maatje</b></button></div>${topNav()}<div class="top-actions">${code}${sessionBtn}<button type="button" class="iconbtn" data-act="sound" aria-label="${app.sound ? "Geluid uit" : "Geluid aan"}">${soundSvg(app.sound)}</button><button type="button" class="iconbtn" data-act="settings" aria-label="Instellingen">${gearSvg()}</button><button type="button" class="you-mini" data-act="style" aria-label="Jouw stijl"><span class="mini-ico" style="color:${colorHex(me.color)}">${faceHtml(me)}</span><strong>${esc(me.name)}</strong></button></div></div></header>`;
  }
  function codeTiles(code) {
    const chars = String(code || "").slice(0, 4).split("");
    while (chars.length < 4) chars.push("·");
    return `<div class="code-tiles" aria-label="Code ${esc(code || "")}">${chars.map((c) => `<b>${esc(c)}</b>`).join("")}</div>`;
  }
  function ageChips() {
    return `<div class="chips age-chips">${AGES.map((a) => `<button type="button" class="chip ${app.ui.age === a.id ? "is-on" : ""}" data-act="age" data-age="${a.id}">${a.label}</button>`).join("")}</div>`;
  }
  function netNote() {
    if (location.protocol === "file:") return '<p class="note">Dit bestand staat alleen op deze computer. Voor meerdere telefoons: dubbelklik op Start-Maatje en open het wifi-adres. Of zet de map gratis online.</p>';
    const h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return '<p class="note">Andere telefoons openen het wifi-adres uit het zwarte venster, niet localhost. Daarna vullen ze de code in.</p>';
    return '<p class="fine">Iedereen opent deze link en vult de code in. De telefoon die het spel start, blijft aan.</p>';
  }
  function gameCards(canStart) {
    return GAMES.map((g) => {
      const cats = [["mix", "Mix"], ["licht", "Licht"], ["groep", "Groep"]].concat(app.ui.age === "16-18" ? [] : [["pittig", "Pittig"]]);
      const filters = g.id === "vragen" && canStart ? `${ageChips()}<p class="fine">${esc((AGES.find((a) => a.id === app.ui.age) || AGES[2]).hint)}</p><div class="chips">${cats.map(([id, label]) => `<button type="button" class="chip ${app.ui.filter === id ? "is-on" : ""}" data-act="filter" data-filter="${id}">${label}</button>`).join("")}</div>` : "";
      const start = canStart ? `<button type="button" class="btn btn-primary" data-act="start-game" data-game="${g.id}">Start</button>` : "";
      const rules = view() === "home" ? "" : `<button type="button" class="btn btn-text" data-act="rules" data-game="${g.id}">Spelregels</button>`;
      const actions = start || rules ? `<div class="card-actions">${start}${rules}</div>` : "";
      const marks = {
        rad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 4v8l5 3"/><path d="M12 2.5V4M12 20v1.5M2.5 12H4M20 12h1.5"/></svg>',
        vragen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 9a4 4 0 1 1 6.3 3.2c-.8.6-1.3 1.1-1.3 2.1"/><path d="M12 18h.01"/></svg>',
        kaarten: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="7" y="3" width="12" height="16" rx="2"/><rect x="4" y="6" width="12" height="16" rx="2"/><path d="M10 14.2c.6-1.3 1.2-1.3 1.8 0 .5 1.1-.9 2-1.8 2.6-.9-.6-2.3-1.5-1.8-2.6.6-1.3 1.2-1.3 1.8 0z"/></svg>',
        memes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M10 9.5v5l5-2.5-5-2.5z"/></svg>',
      };
      const previews = {
        rad: "img/spel-rad.jpg",
        vragen: "img/spel-vraag.jpg",
        kaarten: "img/spel-kaarten.jpg",
        memes: "img/spel-meme.png",
      };
      return `<article class="gcard game-tile g-${g.id}"><div class="ghead"><span class="mark" aria-hidden="true">${marks[g.id] || ""}</span><div><h3>${g.name}</h3><span class="tag">${g.tag} · ${g.time}</span></div></div><div class="gpreview"><img src="${previews[g.id] || ""}" alt=""></div><p>${g.blurb}</p>${filters}${actions ? `<div class="gfoot">${actions}</div>` : ""}</article>`;
    }).join("");
  }
  function homeRules() {
    const cols = ["rad", "vragen", "kaarten", "memes"].map((id) => {
      const data = RULES[id];
      return `<div class="rule-col"><h3>${esc(data.title)}</h3><ul>${data.lines.map((line) => `<li>${esc(line)}</li>`).join("")}</ul></div>`;
    }).join("");
    return `<section class="home-rules"><p class="kicker">Spelregels</p><h2>Kort en duidelijk.</h2><div class="rule-grid">${cols}</div></section>`;
  }
  function drawRecap() {
    const r = app.recap || { players: [], missed: [], games: [] };
    const topSip = r.players.reduce((max, p) => Math.max(max, p.sips | 0), 0);
    const leaders = r.players.filter((p) => topSip > 0 && p.sips === topSip);
    const names = leaders.map((p) => esc(p.name));
    const who = names.length < 2 ? (names[0] || "") : names.slice(0, -1).join(", ") + " en " + names[names.length - 1];
    const lead = topSip ? who + (leaders.length === 1 ? " had de meeste slokken." : " hadden de meeste slokken.") : "Niemand heeft gedronken.";
    const board = r.players.map((p) => `<li class="prow"><span class="ava" style="--c:${colorHex(p.color)}">${faceHtml(p)}</span><span class="who"><b>${esc(p.name)}</b><small>${topSip && p.sips === topSip ? "meeste · " : ""}${sipWord(p.sips)}</small></span></li>`).join("");
    const answers = (r.answers || []).length ? `<p class="kicker" style="margin-top:22px">Antwoorden</p><ul class="plist">${r.answers.map((n) => `<li class="prow"><span class="who"><b>${esc(n)}</b></span></li>`).join("")}</ul>` : "";
    const missed = (r.missed || []).length ? `<p class="kicker" style="margin-top:22px">Niet geweten</p><ul class="plist">${r.missed.map((n) => `<li class="prow"><span class="who"><b>${esc(n)}</b></span></li>`).join("")}</ul>` : "";
    return `<div class="narrow">${topbar()}<p class="kicker">Einde van de avond</p><h2>${lead}</h2><ul class="plist">${board}</ul>${answers}${missed}<div class="stack" style="margin-top:16px"><button type="button" class="btn btn-primary" data-act="recap-done">Klaar</button></div></div>`;
  }
  function howOneArt() {
    return `<svg viewBox="0 0 160 96" aria-hidden="true">
      <circle cx="80" cy="48" r="36" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-dasharray="2 4"/>
      <g fill="none" stroke-width="1.6" stroke-linecap="round">
        <g stroke="currentColor"><circle cx="34" cy="24" r="6"/><path d="M31.4 24.6c.7.8 1.5 1.1 2.6 1.1s1.9-.3 2.6-1.1"/><path d="M26 38c2.2-6 13.6-6 16 0"/></g>
        <g stroke="#8eb6ff"><circle cx="126" cy="26" r="6"/><path d="M123.4 26.6c.7.8 1.5 1.1 2.6 1.1s1.9-.3 2.6-1.1"/><path d="M118 40c2.2-6 13.6-6 16 0"/></g>
        <g stroke="#3dd68c"><circle cx="42" cy="74" r="6"/><path d="M39.4 74.6c.7.8 1.5 1.1 2.6 1.1s1.9-.3 2.6-1.1"/><path d="M34 88c2.2-6 13.6-6 16 0"/></g>
        <g stroke="currentColor"><circle cx="120" cy="74" r="6"/><path d="M117.4 74.6c.7.8 1.5 1.1 2.6 1.1s1.9-.3 2.6-1.1"/><path d="M112 88c2.2-6 13.6-6 16 0"/></g>
      </g>
      <rect x="68" y="26" width="24" height="42" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <rect x="73" y="34" width="7" height="10" rx="1" transform="rotate(-10 76 39)" fill="none" stroke="currentColor"/>
      <rect x="80" y="34" width="7" height="10" rx="1" transform="rotate(8 83 39)" fill="none" stroke="currentColor"/>
    </svg>`;
  }
  function howPhonesArt() {
    return `<svg viewBox="0 0 160 96" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path d="M48 30c10-14 22-16 32-8" stroke-dasharray="2 3" stroke-opacity=".7"/>
      <path d="M112 30c-10-14-22-16-32-8" stroke-dasharray="2 3" stroke-opacity=".7"/>
      <rect x="22" y="34" width="26" height="44" rx="4"/>
      <rect x="67" y="22" width="26" height="44" rx="4"/>
      <rect x="112" y="34" width="26" height="44" rx="4"/>
    </svg>`;
  }
  function howTvArt() {
    return `<svg viewBox="0 0 36 28" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="2" y="3" width="32" height="18" rx="2"/><path d="M12 25h12" stroke-linecap="round"/></svg>`;
  }
  function photoPicker(id, person) {
    const has = !!cleanPhoto(person && person.photo);
    const source = id === "settingsPhoto" ? "settings" : "style";
    const camId = source === "settings" ? "settingsCamera" : "styleCamera";
    return `<label class="field">Eigen foto<span class="file-row"><input id="${id}" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"><span class="file-btn">Kies een foto</span><span>${has ? "Foto gekozen" : "Geen foto"}</span></span></label><button type="button" class="btn btn-ghost photo-cam" data-act="take-photo" data-source="${source}">Maak een foto</button><input id="${camId}" class="sr-file" type="file" accept="image/*" capture="user">${has ? `<button type="button" class="btn btn-text" data-act="clear-photo">Foto weghalen</button>` : ""}<p class="fine">Op je telefoon opent de camera. Op een laptop de webcam, als die er is. Daarna kies je welk stuk blijft.</p>`;
  }
  function howHead() {
    return `<div class="how-mark">${logoSvg()}</div><h1 class="how-title">Maatje</h1>`;
  }
  function drawHome() {
    const p = app.profile || { name: "Jij", icon: "glass", color: "blue" };
    const you = `<button type="button" class="you-row how-you" data-act="style"><span class="mini-ico" style="color:${colorHex(p.color)}">${faceHtml(p)}</span><span><small>Jij speelt als</small><strong>${esc(p.name)}</strong></span><em>Wijzig</em></button>`;
    const choices = `<div class="how-grid"><button type="button" class="mode-card" data-act="local"><span class="how-ico">${howOneArt()}</span><strong>Eén telefoon</strong><small>Samen op één scherm</small></button><button type="button" class="mode-card" data-act="how-phones"><span class="how-ico">${howPhonesArt()}</span><strong>Iedere telefoon</strong><small>Iedereen op z’n eigen</small></button></div><button type="button" class="how-tv" data-act="tv"><span class="how-tv-ico">${howTvArt()}</span><span class="how-tv-copy"><strong>Dit is de televisie</strong><small>Het grote scherm blijft aan</small></span><em aria-hidden="true">›</em></button>`;
    const joinName = app.ui.joinName != null ? app.ui.joinName : (p.name && p.name !== "Speler" && p.name !== "Jij" ? p.name : "");
    const phones = `<form data-act="join" class="join-card"><h2>Aan tafel</h2><label>Jouw naam<input id="joinName" maxlength="16" autocomplete="nickname" placeholder="Bijvoorbeeld Sam" value="${esc(joinName)}"></label><label>Spelcode<input id="codeInput" class="is-code" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Vier tekens" value="${esc(app.ui.codeValue || "")}"></label><button class="join-go" type="submit">Meedoen</button></form><p class="how-or"><span>of</span></p><button type="button" class="how-start" data-act="create">Start een nieuw spel</button><button type="button" class="btn btn-text" data-act="how-back">Terug</button>`;
    const ask = app.ui.how === "phones" ? `<p class="how-lead">Het rad, vragen, kaarten en memes.<br>Iedereen op een eigen telefoon.</p>` : `<p class="how-q">Hoe spelen jullie?</p>`;
    const below = app.ui.how === "phones" ? "" : `<section class="home-games"><div class="section-head"><p class="kicker">Vier spellen</p><h2>Kies er een.</h2></div><div class="gcards">${gameCards(false)}</div></section>${homeRules()}${homeGroups()}<p class="foot">Alcohol is voor 18+. Drink met mate. Kijken en één telefoon spelen mag zonder account. Met een code heb je een bevestigd e-mailadres nodig. Het account staat lokaal in een JSON-bestand. Deel een spelcode alleen met je tafel.</p>`;
    return `<div class="wrap">${topbar()}<section class="how">${howHead()}${ask}${app.ui.how === "phones" ? phones : choices}${app.ui.how === "phones" ? "" : you}</section>${below}</div>`;
  }
  function drawStyle() {
    const d = app.draft || { name: "", icon: "glass", color: "blue" };
    const hex = colorHex(d.color);
    const shown = cleanName(d.name, "") || "Jouw naam";
    return `<div class="narrow style-screen">${topbar()}<div class="style-head"><div class="palette" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="2.2"/><circle cx="16" cy="9" r="2.2"/><circle cx="9" cy="16" r="2.2"/><circle cx="16" cy="16" r="2.2"/></svg></div><h1>Maak het jouw stijl</h1><div class="preview-wrap"><div class="you-pill" style="--c:${hex}"><span class="mini-ico">${faceHtml(d)}</span><strong id="previewName">${esc(shown)}</strong></div><p class="muted">Zo zie je eruit aan tafel</p></div></div><form data-act="save-style"><label class="field">Jouw naam<input id="styleName" maxlength="16" placeholder="bijv. Alex" autocomplete="off" spellcheck="false" value="${esc(d.name || "")}"></label>${photoPicker("stylePhoto", d)}<p class="label">Pictogram</p><div class="icons">${ICONS.map((ic) => `<button type="button" class="ico ${d.icon === ic.id ? "is-on" : ""}" data-act="pick-icon" data-id="${ic.id}" aria-label="${ic.label}" aria-pressed="${d.icon === ic.id}">${ic.svg}</button>`).join("")}</div><p class="label">Kleur</p><div class="swatches">${COLORS.map((c) => `<button type="button" class="swatch ${d.color === c.id ? "is-on" : ""}" style="--c:${c.hex}" data-act="pick-color" data-id="${c.id}" aria-label="${c.label}" aria-pressed="${d.color === c.id}"></button>`).join("")}</div><div class="stack" style="margin-top:18px"><button class="btn btn-primary" type="submit">Ga verder</button></div></form><div class="split-links"><button type="button" data-act="back-style">‹ Terug</button><button type="button" data-act="skip-style">Overslaan</button></div></div>`;
  }
  function drawLocalPlayers() {
    const rows = app.draftPlayers.map((p, i) => `<li class="prow"><span class="ord">${i + 1}</span><button type="button" class="ava" style="--c:${colorHex(p.color)}" data-act="shuffle-look" data-id="${p.id}" aria-label="Andere look voor ${esc(p.name)}">${faceHtml(p)}</button><input id="nm-${p.id}" data-bind="player" data-id="${p.id}" maxlength="16" value="${esc(p.name)}" aria-label="Naam" spellcheck="false"><span class="row-actions"><button type="button" data-act="move" data-id="${p.id}" data-dir="-1" aria-label="Omhoog">↑</button><button type="button" data-act="move" data-id="${p.id}" data-dir="1" aria-label="Omlaag">↓</button><button type="button" data-act="remove-draft" data-id="${p.id}" aria-label="Weghalen">×</button></span></li>`).join("");
    return `<div class="narrow">${topbar()}<p class="kicker">Eén telefoon</p><h2>Wie spelen er?</h2><p class="hint">Zet ze in de zitvolgorde, met de klok mee. Dat is links en rechts in Het Rad. Tik een pictogram voor een andere look.</p><ul class="plist">${rows}</ul><form data-act="add-player" class="add-row" style="margin-top:10px"><input id="addPlayer" maxlength="16" placeholder="Naam van je maat" value="${esc(app.ui.addName || "")}" aria-label="Nieuwe speler"><button class="btn btn-blue" type="submit">Toevoegen</button></form><div class="stack" style="margin-top:16px"><button type="button" class="btn btn-primary" data-act="save-players">Klaar</button><button type="button" class="btn btn-text" data-act="back-players">Terug</button></div></div>`;
  }
  function confirmBox() {
    if (!app.ui.confirmLeave) return "";
    let line = "Stoppen en terug naar het begin?";
    if (app.mode === "multi" && app.isHost && app.state) line = app.state.players.filter((p) => p.id !== app.meId).length ? "Stoppen? De leiding gaat naar de volgende." : "Stoppen? Dan stopt het spel voor iedereen.";
    else if (app.mode === "multi") line = "De kamer verlaten?";
    else if (app.mode === "local") line = "Stoppen? Spelers en teller gaan weg.";
    return `<div class="banner">${esc(line)} <button type="button" class="btn btn-text" data-act="stay">Blijven</button> <button type="button" class="btn btn-text" data-act="leave">Stoppen</button></div>`;
  }
  function banners() {
    return `${app.ui.stale ? '<div class="banner">De starter reageert niet. <button type="button" class="btn btn-text" data-act="claim">Neem de leiding</button></div>' : ""}${joinBanner()}${confirmBox()}`;
  }
  function joinBanner() {
    if (app.mode !== "multi" || !app.state || app.state.players.some((p) => p.id === app.meId)) return "";
    return `<div class="banner">${esc(app.ui.joinWait || "Je wordt toegevoegd…")}</div>`;
  }
  function playerRows(editable) {
    return app.state.players.map((p, i) => {
      const badges = [p.id === app.meId ? "jij" : "", p.id === app.state.hostId && app.mode === "multi" ? "start" : ""].filter(Boolean).join(" · ");
      const controls = editable ? `<span class="row-actions"><button type="button" data-act="move" data-id="${p.id}" data-dir="-1" aria-label="Omhoog">↑</button><button type="button" data-act="move" data-id="${p.id}" data-dir="1" aria-label="Omlaag">↓</button>${p.id !== app.state.hostId ? `<button type="button" data-act="kick" data-id="${p.id}" aria-label="Weghalen">×</button>` : ""}</span>` : "";
      return `<li class="prow"><span class="ord">${i + 1}</span><span class="ava" style="--c:${colorHex(p.color)}">${faceHtml(p)}</span><span class="who"><b>${esc(p.name)}</b><small>${esc(badges || sipWord(p.sips))}</small></span>${controls}</li>`;
    }).join("");
  }
  function drawLobby() {
    const host = app.mode !== "multi" || app.isHost;
    const codeBlock = app.mode !== "multi"
      ? `<p class="kicker">Eén telefoon</p><h2>Kies een spel</h2><p class="hint">Geef de telefoon door aan wie aan de beurt is.</p>`
      : app.tv
        ? `<p class="kicker">Televisie</p><h2>De code</h2>${codeTiles(app.roomCode)}${qrBlock()}<p class="lede">Laat dit scherm aan. Iedereen vult de code in op een eigen telefoon.</p><div class="share-row"><button type="button" class="btn btn-primary" data-act="share">Deel de code</button><button type="button" class="btn btn-ghost" data-act="copy-code">Kopieer</button></div>`
        : `<p class="kicker">Kamer</p><h2>De code</h2>${codeTiles(app.roomCode)}${qrBlock()}<div class="share-row"><button type="button" class="btn btn-primary" data-act="share">Deel de code</button><button type="button" class="btn btn-ghost" data-act="copy-code">Kopieer</button></div><p class="fine">Laat dit scherm aan op de telefoon die startte. Gaat die op slot, dan kan iemand anders de leiding nemen.</p>`;
    const waiting = app.tv && !app.state.players.length ? "Nog niemand. Vul de code in op een telefoon." : (app.state.players.length < 2 ? "Met z’n tweeën is het leuker. Je kunt ook al starten." : "Hou het gezellig. Eén slok is genoeg.");
    const sips = app.state.players.some((p) => p.sips > 0) && host ? `<button type="button" class="btn btn-text" data-act="reset-sips">Teller op nul</button>` : "";
    const edit = app.mode === "local" ? `<button type="button" class="btn btn-text" data-act="edit-players">Wijzig spelers</button>` : "";
    return `<div class="wrap">${topbar()}${banners()}<div class="lobby-layout"><section class="lobby-card">${codeBlock}</section><section class="lobby-card"><p class="kicker">Spelers</p><ul class="plist">${playerRows(host)}</ul><div class="dock-links">${edit}${sips}</div><p class="fine">${waiting}</p></section></div><div class="gcards lobby-games">${gameCards(host)}</div></div>`;
  }
  function drawConnecting() {
    return `<div class="narrow center-page">${topbar()}<p class="kicker">${app.isHost ? "Nieuwe kamer" : "Meedoen"}</p>${codeTiles(app.roomCode)}<p class="lede">${esc(app.error || "Even verbinden…")}</p><div class="stack">${app.error ? '<button type="button" class="btn btn-primary" data-act="retry">Opnieuw proberen</button>' : '<div class="spinner" aria-hidden="true"></div>'}<button type="button" class="btn btn-ghost" data-act="go-home">Annuleren</button>${app.error ? '<button type="button" class="btn btn-ghost" data-act="local">Speel op één telefoon</button>' : ""}</div></div>`;
  }
  function drawClosed() {
    return `<div class="narrow center-page">${topbar()}<h2>Dit spel is gestopt</h2><p class="lede">Iemand heeft de kamer gesloten.</p><button type="button" class="btn btn-primary" data-act="go-home">Naar het begin</button></div>`;
  }
  function playerStrip() {
    const turn = app.state.game ? app.state.game.turn : -1;
    return `<div class="strip">${app.state.players.map((p, i) => `<div class="pchip ${i === turn ? "is-turn" : ""} ${p.id === app.meId ? "is-me" : ""}"><div class="ava" style="--c:${colorHex(p.color)}">${faceHtml(p)}</div><b>${esc(p.name)}</b><small>${sipWord(p.sips)}</small></div>`).join("")}</div>`;
  }
  function resultInfo() {
    const g = app.state.game;
    const seg = segmentOf(app.state);
    const n = app.state.players.length;
    const t = g.turn % n;
    const me = app.state.players[t];
    const left = app.state.players[(t - 1 + n) % n];
    const right = app.state.players[(t + 1) % n];
    const target = app.state.players.find((p) => p.id === g.targetId);
    if (!seg) return { title: "Vakje", text: "" };
    if (seg.who) {
      const amount = seg.sips === 1 ? "1 slok" : (seg.sips || 0) + " slokken";
      if (seg.text) return { title: seg.label, text: seg.text };
      if (seg.who === "all") return { title: seg.label, text: "Iedereen neemt " + amount + "." };
      if (seg.who === "left") return { title: seg.label, text: left.name + " neemt " + amount + "." };
      if (seg.who === "right") return { title: seg.label, text: right.name + " neemt " + amount + "." };
      if (seg.who === "give") return { title: seg.label, text: target ? target.name + " neemt " + amount + "." : "Kies wie " + amount + " neemt." };
      if (seg.who === "none" || !seg.sips) return { title: seg.label, text: "Niemand drinkt." };
      return { title: seg.label, text: me.name + " neemt " + amount + "." };
    }
    if (n < 2 && (seg.id === "give" || seg.id === "left" || seg.id === "right")) return { title: seg.label, text: me.name + " neemt 2 slokken." };
    if (n < 2 && seg.id === "mate") return { title: "Maatje", text: "Je bent nog alleen. Neem 1 slok." };
    switch (seg.id) {
      case "all": return { title: "Iedereen drinkt", text: "Neem allemaal 1 slok." };
      case "self2": return { title: "2 slokken", text: me.name + " neemt 2 slokken." };
      case "give": return { title: "Geef 2 slokken weg", text: target ? target.name + " neemt 2 slokken." : "Kies wie." };
      case "left": return { title: "Links", text: left.name + " neemt 2 slokken." };
      case "right": return { title: "Rechts", text: right.name + " neemt 2 slokken." };
      case "water": return { title: "Waterval", text: "Iedereen begint met drinken. " + me.name + " mag als eerste stoppen, daarna de volgende. De laatste stopt als laatste." };
      case "cat": return { title: "Thema", text: "Noem om de beurt iets. Wie hapert, neemt 2 slokken." };
      case "free": return { title: "Vrij", text: "Niemand drinkt." };
      case "mate": return { title: "Maatje", text: target ? me.name + " en " + target.name + " nemen allebei 1 slok." : "Kies iemand. Jullie nemen allebei 1 slok." };
      case "story":
        if (g.choice === "tell") return { title: "Verhaal", text: me.name + " vertelt het. Daarna is de volgende." };
        if (g.choice === "drink") return { title: "3 slokken", text: me.name + " neemt 3 slokken." };
        return { title: "Kort verhaal", text: "Vertel 20 seconden iets, of neem 3 slokken." };
      case "except": return { title: "Behalve " + me.name, text: "Iedereen behalve " + me.name + " neemt 1 slok." };
      case "again": return { title: "Nog een keer", text: me.name + " draait nog een keer. Geen slok." };
      default: return { title: seg.label, text: "" };
    }
  }
  function wheelHtml() {
    const parts = wheelOf(app.state && app.state.game);
    const a = 360 / parts.length;
    const bg = `conic-gradient(from 0deg, ${parts.map((s, i) => `${s.bg} ${i * a}deg ${(i + 1) * a}deg`).join(",")})`;
    const labels = parts.map((s, i) => {
      const mid = (i + 0.5) * a;
      const flip = mid > 90 && mid < 270 ? " flip" : "";
      return `<div class="lab" style="transform:rotate(${mid}deg)"><div class="lab-in${flip}" style="color:${s.fg}"><span class="emo">${s.emoji}</span><span class="w">${esc(s.label)}</span></div></div>`;
    }).join("");
    const spokes = parts.map((_, i) => `<i class="spoke" style="transform:rotate(${i * a}deg)"></i>`).join("");
    return `<div class="wheel-wrap"><div class="pointer"></div><div class="wheel-rim"></div><div id="wheelSpin" class="wheel-spin"><div class="wheel-face" style="background:${bg}"></div>${spokes}${labels}</div><div class="wheel-gloss"></div><div class="hub">${iconSvg("glass")}</div></div>`;
  }
  function drawRad() {
    const g = app.state.game;
    let result = "";
    if (resultVisible()) {
      const info = resultInfo();
      const seg = segmentOf(app.state);
      const picks = seg && seg.needs === "target" && app.state.players.length > 1 && myTurn()
        ? `<div class="targets">${app.state.players.filter((p) => p.id !== app.state.players[g.turn].id).map((p) => `<button type="button" class="choice ${g.targetId === p.id ? "is-on" : ""}" data-act="target" data-id="${p.id}">${esc(p.name)}</button>`).join("")}</div>`
        : "";
      const choices = seg && seg.needs === "choice" && myTurn()
        ? `<div class="pair"><button type="button" class="choice ${g.choice === "tell" ? "is-on" : ""}" data-act="choice" data-choice="tell">Ik vertel het</button><button type="button" class="choice ${g.choice === "drink" ? "is-on" : ""}" data-act="choice" data-choice="drink">Liever 3 slokken</button></div>`
        : "";
      const timer = seg && (seg.id === "story" || seg.id === "water") ? '<button type="button" class="btn btn-ghost" data-act="timer" id="timerBtn"><span id="timerLabel">Start 20s</span></button>' : "";
      const cat = seg && seg.id === "cat" && g.category ? `<div class="cat-pill">${esc(g.category)}</div>` : "";
      const adds = sipPlan(app.state).map(([i, n]) => app.state.players[i] ? esc(app.state.players[i].name) + " +" + n : "").filter(Boolean).join(" · ");
      result = `<section class="result" id="result"><h3>${esc(info.title)}</h3>${cat}<p>${esc(info.text)}</p>${picks}${choices}${timer}${adds ? `<p class="fine">${adds}</p>` : ""}</section>`;
    }
    let dockBtn = "";
    if (g.stage === "ready") dockBtn = myTurn() ? '<button type="button" class="btn btn-primary" data-act="spin">Draaien</button>' : `<p class="wait">${esc(currentName())} draait op die telefoon.</p>`;
    else if (!resultVisible()) dockBtn = '<button type="button" class="btn btn-primary" disabled>Draaien…</button>';
    else if (!myTurn()) dockBtn = '<p class="wait">Kijk mee.</p>';
    else {
      const seg = segmentOf(app.state);
      dockBtn = `<button type="button" class="btn btn-primary" data-act="next" ${canAdvance(app.state) ? "" : "disabled"}>${seg && seg.id === "again" ? "Nog een keer draaien" : "Volgende"}</button>`;
    }
    const order = app.state.players.length > 1 ? `<p class="fine">Volgorde: ${app.state.players.map((p) => esc(p.name)).join(" → ")}</p>` : "";
    return `${wheelHtml()}${order}${result}<div class="dock">${dockBtn}${dockLinks()}</div>`;
  }
  function questionById(id) {
    const custom = app.state && app.state.game && app.state.game.custom;
    const extra = custom && custom.find((q) => q.id === id);
    if (extra) return extra;
    return QUESTIONS.find((q) => q.id === id) || QUESTIONS[0];
  }
  function drawVragen() {
    const g = app.state.game;
    const q = questionById(g.order[g.cursor] || QUESTIONS[0].id);
    const cat = { licht: "Licht", groep: "Groep", pittig: "Pittig" }[q.cat] || "Eigen vraag";
    const ageLabel = (AGES.find((a) => a.id === g.age) || {}).label || "";
    const note = g.stage === "note" ? `<p class="fine after">${g.note === "drink" ? esc(currentName()) + " neemt 2 slokken." : esc(currentName()) + " geeft antwoord."}</p>` : "";
    let dockBtn = "";
    if (g.stage === "ask") {
      if (!myTurn()) dockBtn = `<p class="wait">${esc(currentName())} is aan de beurt, op die telefoon.</p>`;
      else dockBtn = `<div class="pair"><button type="button" class="choice" data-act="answer" data-choice="say">${q.kind === "point" ? "Ik heb gewezen" : "Ik geef antwoord"}</button><button type="button" class="choice" data-act="answer" data-choice="drink">Liever 2 slokken</button></div>`;
    } else dockBtn = myTurn() ? '<button type="button" class="btn btn-primary" data-act="next-q">Volgende</button>' : '<p class="wait">Kijk mee.</p>';
    return `<article class="qcard"><div class="eyebrow">Vraag ${g.cursor + 1}${ageLabel ? " · " + ageLabel : ""}${g.round > 1 ? " · ronde " + g.round : ""} · ${cat}</div><p>${esc(q.text)}</p>${note}</article><div class="dock">${dockBtn}${dockLinks()}</div>`;
  }
  function cardFace(card, extra) {
    const suit = SUITS[card.s] || SUITS[0];
    const face = rankFace(card.r);
    const word = rankLabel(card.r);
    const spoken = (word || face) + " van " + suit.name;
    return `<div class="pcard ${suit.red ? "red" : ""} ${extra || ""}" role="img" aria-label="${esc(spoken)}"><span class="corner">${face}<br>${suit.sym}</span><span class="bigsuit">${suit.sym}</span>${word ? `<span class="word">${esc(word)}</span>` : ""}<span class="corner flip">${face}<br>${suit.sym}</span></div>`;
  }
  function cardBack() { return '<div class="pcard back" aria-hidden="true"><span>maatje</span></div>'; }
  function youtubeId(url) {
    const hit = String(url || "").match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    return hit ? hit[1] : "";
  }
  function memeById(g, id) {
    return (g.memes || []).find((m) => m.id === id) || null;
  }
  function memeStill(url) {
    const id = youtubeId(url);
    const src = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : (/^(\/media\/memes\/|https:\/\/).+\.(jpe?g|png|webp)(\?|$)/i.test(url) ? url : "");
    if (!src) return `<p class="fine">Deze foto kan niet worden getoond.</p>`;
    return `<div class="meme-frame"><img src="${esc(src)}" alt=""></div>`;
  }
  function drawMemes() {
    const g = app.state.game;
    const meme = memeById(g, g.order[g.cursor]);
    if (!meme) return `<p>Er zijn geen memes.</p>`;
    const showName = g.stage === "result";
    const line = g.stage === "tell"
      ? "Zeg de meme hardop."
      : (g.stage === "result" ? (g.note === "miss" ? currentName() + " drinkt " + meme.sips + (meme.sips === 1 ? " slok." : " slokken.") : "Dit was het.") : "Welk filmpje is dit?");
    let dockBtn = "";
    if (!myTurn()) dockBtn = `<p class="wait">${esc(currentName())} is aan de beurt, op die telefoon.</p>`;
    else if (g.stage === "watch") dockBtn = `<div class="pair"><button type="button" class="choice" data-act="meme-know">Ik weet ’m</button><button type="button" class="choice" data-act="meme-miss">Weet ik niet</button></div>`;
    else if (g.stage === "tell") dockBtn = '<button type="button" class="btn btn-primary" data-act="meme-told">Verteld</button>';
    else dockBtn = '<button type="button" class="btn btn-primary" data-act="meme-next">Volgende</button>';
    const answer = showName ? `<p class="meme-line">${esc(line)}</p><h3 class="meme-name">${esc(meme.name)}</h3>` : `<p class="meme-line">${esc(line)}</p>`;
    return `<article class="qcard meme-card${showName ? " is-answer" : ""}"><div class="eyebrow">Meme ${g.cursor + 1}${g.round > 1 ? " · ronde " + g.round : ""}</div>${answer}${memeStill(meme.video)}</article><div class="dock">${dockBtn}${dockLinks()}</div>`;
  }
  function drawKaarten() {
    const g = app.state.game;
    const cur = g.deck[g.index];
    const nxt = g.deck[g.index + 1];
    if (!cur) return "<p>Geen kaarten meer.</p>";
    const words = { good: "Goed. Niemand drinkt.", bad: currentName() + " neemt 2 slokken.", tie: "Gelijk. Iedereen neemt 1 slok." };
    const line = g.stage === "guess" ? "Is de volgende hoger of lager? Aas is hoog." : (words[g.outcome] || "");
    let dockBtn = "";
    if (g.stage === "guess") dockBtn = myTurn() ? '<div class="pair"><button type="button" class="btn btn-ghost" data-act="guess" data-guess="lower">Lager</button><button type="button" class="btn btn-primary" data-act="guess" data-guess="higher">Hoger</button></div>' : `<p class="wait">${esc(currentName())} raadt op die telefoon.</p>`;
    else dockBtn = myTurn() ? '<button type="button" class="btn btn-primary" data-act="next-card">Volgende kaart</button>' : '<p class="wait">Kijk mee.</p>';
    return `${g.banner ? `<p class="kicker">${esc(g.banner)}</p>` : ""}<div class="table-cards">${cardFace(cur)}${g.stage === "reveal" && nxt ? cardFace(nxt, "deal") : cardBack()}</div><p class="ruleline ${g.stage === "reveal" ? "outcome " + (g.outcome || "") : ""}">${esc(line)}</p><div class="dock">${dockBtn}${dockLinks()}</div>`;
  }
  function dockLinks() {
    const host = app.mode !== "multi" || app.isHost;
    const undo = host && app.state && app.state.history && app.state.history.length ? '<button type="button" class="btn btn-text" data-act="undo">Ongedaan</button>' : "";
    return `<div class="dock-links">${undo}${host ? '<button type="button" class="btn btn-text" data-act="to-lobby">Ander spel</button>' : ""}${host ? '<button type="button" class="btn btn-text" data-act="skip">Beurt overslaan</button>' : ""}<button type="button" class="btn btn-text" data-act="ask-leave">Stoppen</button></div>`;
  }
  function drawPlay() {
    const g = app.state.game;
    if (!g) return `<div class="narrow">${topbar()}<p>Het spel is kwijt.</p>${app.isHost || app.mode !== "multi" ? '<button type="button" class="btn btn-primary" data-act="to-lobby">Terug</button>' : ""}</div>`;
    const meta = GAMES.find((x) => x.id === g.id) || GAMES[0];
    const body = g.id === "rad" ? drawRad() : g.id === "vragen" ? drawVragen() : g.id === "memes" ? drawMemes() : drawKaarten();
    const live = `${meta.name}. ${currentName()} is aan de beurt.`;
    return `<div class="narrow">${topbar()}${banners()}<div class="play-head"><div><p class="kicker">${esc(meta.name)}</p><h2>${esc(myTurn() && app.mode === "multi" ? "Jij bent aan de beurt" : currentName())}</h2></div><button type="button" class="btn btn-text" data-act="rules" data-game="${g.id}">Spelregels</button></div>${playerStrip()}${body}<p class="sr">${esc(live)}</p></div>`;
  }
  function modalHtml() {
    if (!app.ui.rules || !RULES[app.ui.rules]) return "";
    const data = RULES[app.ui.rules];
    return `<div class="modal" data-act="close-rules"><div class="panel" data-act="stop" role="dialog" aria-modal="true"><h3>${esc(data.title)}</h3><ul>${data.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul><button type="button" class="btn btn-primary" data-act="close-rules">Sluiten</button></div></div>`;
  }
  function drawView() {
    switch (view()) {
      case "style": return drawStyle();
      case "local-players": return drawLocalPlayers();
      case "lobby": return drawLobby();
      case "play": return drawPlay();
      case "connecting": return drawConnecting();
      case "closed": return drawClosed();
      case "groups": return drawGroups();
      case "group": return drawGroup();
      case "settings": return drawSettings();
      case "recap": return drawRecap();
      case "admin": return drawAdmin();
      default: return drawHome();
    }
  }
  function draw() {
    try { return drawView() + modalHtml() + loginHtml() + cameraHtml() + cropHtml(); }
    catch (err) {
      console.error(err);
      return '<div class="narrow"><p>Er ging iets mis.</p><button type="button" class="btn btn-primary" data-act="go-home">Naar het begin</button></div>';
    }
  }
  function fingerprint() {
    const s = app.state;
    const g = s && s.game;
    const gameFp = g ? [g.id, g.stage, g.turn, g.spin && g.spin.id, g.targetId, g.choice, g.cursor, g.index, g.outcome, g.note, g.banner, g.category, g.round].join(".") : "";
    return [view(), app.ui.crop ? 1 : 0, app.ui.camera ? 1 : 0, app.tv ? 1 : 0, app.ui.how || "", app.conn, app.error || "", app.sound ? 1 : 0, app.admin ? 1 : 0, app.questionsRev, app.memesRev, app.ui.adminTab || "", app.ui.editId || "", app.ui.noRoom ? 1 : 0, app.ui.stale ? 1 : 0, app.ui.confirmLeave ? 1 : 0, app.ui.rules || "", app.ui.filter || "", app.ui.age || "", app.ui.joinWait || "", app.overlay || "", app.ui.authMode || "", app.ui.previewLink || "", app.screen || "", app.theme || "", app.groupId || "", app.account ? app.account.id + (app.account.verified === false ? "u" : "v") : "", (app.groups || []).map((g) => g.id + g.activeRoom + (g.questions || []).length + ":" + (g.segments || []).length + ":" + (g.evenings || []).length).join(","), app.roomCode || "", resultVisible() ? 1 : 0, app.profile ? app.profile.name + app.profile.icon + app.profile.color + (app.profile.photo ? app.profile.photo.length + app.profile.photo.slice(-8) : "") : "", app.draft ? app.draft.icon + app.draft.color + (app.draft.photo ? app.draft.photo.length : "") : "", (app.draftPlayers || []).map((p) => p.id + p.icon + p.color).join(","), s ? s.rev + ":" + s.gen + ":" + s.phase + ":" + s.hostId + ":" + s.players.map((p) => p.id + p.name + p.sips + p.icon + p.color).join("/") + ":" + gameFp : ""].join("~");
  }
  function captureForm() {
    const a = document.activeElement;
    if (!a || !a.id || !app.root.contains(a)) return null;
    return { id: a.id, start: a.selectionStart, end: a.selectionEnd };
  }
  function restoreForm(f) {
    if (!f) return;
    const el = document.getElementById(f.id);
    if (!el) return;
    el.focus();
    if (el.setSelectionRange && f.start != null) { try { el.setSelectionRange(f.start, f.end); } catch (e) {} }
  }
  function paintSlots() {
    const slots = document.querySelectorAll("#codeSlots i");
    if (!slots.length) return;
    const v = app.ui.codeValue || "";
    slots.forEach((el, i) => {
      el.textContent = v[i] || "";
      el.classList.toggle("is-on", !!v[i]);
      el.classList.toggle("is-next", i === v.length && v.length < 4);
    });
  }
  function noteMyTurn() {
    if (app.mode !== "multi" || !app.state || !app.state.game) return;
    const g = app.state.game;
    const p = app.state.players[g.turn];
    const active = p && (g.stage === "ready" || g.stage === "ask" || g.stage === "guess");
    const key = active ? p.id + ":" + g.stage + ":" + (g.cursor || 0) + ":" + (g.index || 0) + ":" + ((g.spin && g.spin.id) || "") : "";
    if (key && p.id === app.meId && key !== app.ui.turnKey && navigator.vibrate) navigator.vibrate(25);
    if (key) app.ui.turnKey = key;
  }
  function render() {
    if (!app.root) return;
    const spinId = app.state && app.state.game && app.state.game.spin ? app.state.game.spin.id : "";
    const spinning = !!(spinId && app.ui.revealAt && Date.now() < app.ui.revealAt && app.ui.lockSpinId === spinId);
    if (spinning && app.ui.spinPainted === spinId) return;
    const fp = fingerprint();
    if (fp === app.ui.fp && !app.ui.justStartedSpin) return;
    if (!app.state || !app.state.game || app.state.game.stage !== "result") clearInterval(app.ui.timerInt);
    const focus = captureForm();
    const nextView = view();
    app.root.innerHTML = draw();
    restoreForm(focus);
    paintSlots();
    bindCamera();
    bindCrop();
    renderGoogle();
    const animate = !!app.ui.justStartedSpin;
    app.ui.justStartedSpin = false;
    syncWheel(animate);
    app.ui.fp = fp;
    if (spinning) app.ui.spinPainted = spinId;
    const g = app.state && app.state.game;
    if (g && g.id === "rad" && resultVisible() && app.ui.scrolled !== (g.spin && g.spin.id)) {
      app.ui.scrolled = g.spin.id;
      const el = document.getElementById("result");
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (nextView !== app.ui.lastView) { app.ui.lastView = nextView; window.scrollTo(0, 0); }
    if (app.ui.timerLeft > 0) {
      const label = document.getElementById("timerLabel");
      if (label) label.textContent = app.ui.timerLeft + "s";
    }
    noteMyTurn();
    const title = app.roomCode ? "Maatje · " + app.roomCode : "Maatje";
    if (document.title !== title) document.title = title;
  }

function readStyleName() {
  const el = document.getElementById("styleName");
  if (el && app.draft) app.draft.name = el.value;
}
function readDraftNames() {
  document.querySelectorAll("[data-bind='player']").forEach((el) => {
    const p = app.draftPlayers.find((x) => x.id === el.dataset.id);
    if (p) p.name = el.value;
  });
  const add = document.getElementById("addPlayer");
  if (add) app.ui.addName = add.value;
}
function readCodeInput() {
  const el = document.getElementById("codeInput");
  if (!el) return app.ui.codeValue || "";
  app.ui.codeValue = normalizeCode(el.value).code;
  return app.ui.codeValue;
}
function saveStyleFromDraft(skip) {
  readStyleName();
  const name = (app.draft && app.draft.name) || "";
    if (!skip && !cleanName(name, "")) { toast("Vul je naam in, of tik op Overslaan."); return; }
    persistProfile({
      name: cleanName(name, "Speler"),
      icon: skip ? pick(ICONS).id : validIcon(app.draft.icon),
      color: skip ? pick(COLORS).id : validColor(app.draft.color),
      photo: (app.draft && app.draft.photo) || "",
    });
    const next = app.afterStyle;
    app.afterStyle = null;
    app.overlay = null;
    if (next) { next(); return; }
    if (app.state && (app.mode === "local" || app.mode === "multi")) { dispatch({ type: "join", player: mePlayer() }); return; }
    app.screen = "home";
    render();
  }
  function backFromStyle() {
    app.afterStyle = null;
    if (app.overlay || localStorage.getItem("maatje.welcomed") === "1") {
      app.overlay = null;
      if (!app.mode) app.screen = "home";
      render();
      return;
    }
    persistProfile({ name: cleanName(app.draft && app.draft.name, "Speler"), icon: validIcon(app.draft && app.draft.icon), color: validColor(app.draft && app.draft.color), photo: (app.draft && app.draft.photo) || "" });
    clearUrlRoom();
    sessionStorage.removeItem("maatje.room");
    app.screen = "home";
    render();
  }
  function openStyle() {
    app.draft = { name: app.profile ? app.profile.name : "", icon: app.profile ? app.profile.icon : "glass", color: app.profile ? app.profile.color : "orange", photo: app.profile ? app.profile.photo : "" };
    app.overlay = "style";
    render();
  }
  function openLocal() {
    if (app.mode === "multi") finishLeave();
    const me = mePlayer();
    app.draftPlayers = [{ ...me, sips: 0 }];
    app.mode = "local";
    app.isHost = true;
    app.state = null;
    app.screen = "local-players";
    app.ui.addName = "";
    render();
  }
function saveLocalPlayers() {
  readDraftNames();
  const players = app.draftPlayers.map((p, i) => ({ id: p.id, name: cleanName(p.name, "Speler " + (i + 1)), icon: validIcon(p.icon), color: validColor(p.color), sips: p.sips | 0 }));
    if (!players.length) { toast("Voeg minstens één speler toe."); return; }
    const me = players.find((p) => p.id === app.meId);
    if (me) persistProfile(me);
    if (!app.state) {
      app.mode = "local";
      app.isHost = true;
      app.state = { v: 1, gen: 1, rev: 1, hostId: app.meId, hostBeat: Date.now(), phase: "lobby", players, game: null };
    } else app.state = { ...app.state, players };
    app.screen = "lobby";
    render();
  }
function addDraft(name) {
  readDraftNames();
  if (app.draftPlayers.length >= 12) { toast("Maximaal 12 spelers."); return; }
    const n = cleanName(name, "");
    if (!n) { toast("Vul een naam in."); return; }
    const used = new Set(app.draftPlayers.map((p) => p.color));
    const color = (COLORS.find((c) => !used.has(c.id)) || COLORS[app.draftPlayers.length % COLORS.length]).id;
    app.draftPlayers.push({ id: uid(), name: n, icon: ICONS[app.draftPlayers.length % ICONS.length].id, color, sips: 0 });
    app.ui.addName = "";
    render();
  }
  function shuffleLook(id) {
    const p = app.draftPlayers.find((x) => x.id === id);
    if (!p) return;
    p.icon = pick(ICONS.filter((i) => i.id !== p.icon)).id;
    p.color = pick(COLORS.filter((c) => c.id !== p.color)).id;
    render();
  }
  function moveDraft(id, dir) {
    const i = app.draftPlayers.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= app.draftPlayers.length) return;
    const [sp] = app.draftPlayers.splice(i, 1);
    app.draftPlayers.splice(j, 0, sp);
    render();
  }
  function beginGame(id) {
    if (!app.state || !app.state.players.length) { toast(app.tv ? "Wacht tot er iemand meedoet." : "Er is nog niemand."); return; }
    if (app.mode === "multi" && !app.isHost) return;
    if (!GAMES.some((g) => g.id === id)) return;
    if (id === "memes" && !MEMES.length) { toast("Zet eerst een meme in het beheer."); return; }
    app.screen = "play";
    const group = (app.groups || []).find((g) => g.id === app.groupId);
    app.eveningGames = (app.eveningGames || []).concat(id);
    dispatch({ type: "start", game: initGame(id, { filter: app.ui.filter || "mix", age: (group && group.age) || app.ui.age, custom: group ? group.questions : [], segments: group ? group.segments : [] }, app.state.players.length) });
  }
  function requestHome() {
    if ((app.mode === "multi" && app.state && app.state.phase !== "closed") || (app.mode === "local" && app.state)) {
      app.ui.confirmLeave = true;
      render();
      return;
    }
    app.overlay = null;
    app.screen = "home";
    render();
  }
  function startCountdown(sec) {
    clearInterval(app.ui.timerInt);
    app.ui.timerLeft = sec;
    const paint = () => { const el = document.getElementById("timerLabel"); if (el) el.textContent = app.ui.timerLeft > 0 ? app.ui.timerLeft + "s" : "Tijd"; };
    paint();
    app.ui.timerInt = setInterval(() => {
      app.ui.timerLeft -= 1;
      paint();
      if (app.ui.timerLeft <= 0) { clearInterval(app.ui.timerInt); playBlip(); }
    }, 1000);
  }
  function tick() {
    if (app.mode === "multi" && app.isHost && app.state && net.client && net.client.connected && app.state.phase !== "closed") {
      app.state.hostBeat = Date.now();
      net.client.publish(net.stateTopic, JSON.stringify(app.state), { qos: 0, retain: true });
    }
    const stale = !!(app.mode === "multi" && app.state && !app.isHost && app.state.phase !== "closed" && Date.now() - app.state.hostBeat > 12000);
    if (stale !== app.ui.stale) { app.ui.stale = stale; render(); }
  }

  function onClick(e) {
    const t = e.target.closest("[data-act]");
    if (!t || !app.root.contains(t)) return;
    const act = t.dataset.act;
    if (act === "stop") return;
    ensureAudio();
    if (act === "brand") return requestHome();
    if (act === "nav-play") {
      app.overlay = null;
      app.screen = app.state ? "" : "local-players";
      render();
      return;
    }
    if (act === "style") return openStyle();
    if (act === "sound") {
      app.sound = !app.sound;
      localStorage.setItem("maatje.sound", app.sound ? "on" : "off");
      if (app.sound) { ensureAudio(); playBlip(); }
      render();
      return;
    }
    if (act === "take-photo") { startCamera(t.dataset.source === "settings" ? "settings" : "style"); return; }
    if (act === "camera-snap") { snapCamera(); return; }
    if (act === "camera-cancel") { stopCamera(); render(); return; }
    if (act === "crop-save") { applyCrop(); return; }
    if (act === "crop-cancel") { closeCrop(); render(); return; }
    if (act === "clear-photo") {
      if (!app.draft) app.draft = { ...(app.profile || { name: "", icon: "glass", color: "blue" }) };
      app.draft.photo = "";
      if (app.screen === "settings") persistProfile(app.draft);
      render();
      return;
    }
    if (act === "pick-icon" || act === "pick-color") {
      if (!app.draft) app.draft = { ...(app.profile || { name: "", icon: "glass", color: "blue" }) };
      if (act === "pick-icon") { app.draft.icon = validIcon(t.dataset.id); app.draft.photo = ""; }
      else app.draft.color = validColor(t.dataset.id);
      if (app.screen === "settings") persistProfile(app.draft);
      render();
      return;
    }
    if (act === "settings") {
      app.ui.beforeScreen = app.screen === "settings" ? "home" : app.screen;
      app.draft = { ...(app.profile || { name: "", icon: "glass", color: "blue" }) };
      app.screen = "settings";
      render();
      return;
    }
    if (act === "settings-back") {
      app.screen = app.ui.beforeScreen && app.ui.beforeScreen !== "settings" ? app.ui.beforeScreen : "home";
      render();
      return;
    }
    if (act === "admin") {
      app.screen = "admin";
      app.ui.adminTab = t.dataset.tab === "memes" ? "memes" : "vragen";
      app.ui.editId = "";
      app.error = "";
      render();
      return;
    }
    if (act === "admin-tab") { app.ui.adminTab = t.dataset.tab === "memes" ? "memes" : "vragen"; app.ui.editId = ""; app.error = ""; render(); return; }
    if (act === "new-meme") { app.ui.editId = "new"; app.error = ""; render(); return; }
    if (act === "edit-meme") { app.ui.editId = t.dataset.id || ""; app.error = ""; render(); return; }
    if (act === "delete-meme") { removeMeme(t.dataset.id); return; }
    if (act === "meme-know") { dispatch({ type: "meme-know" }); return; }
    if (act === "meme-told") { dispatch({ type: "meme-told" }); return; }
    if (act === "meme-miss") { dispatch({ type: "meme-miss" }); return; }
    if (act === "meme-next") { dispatch({ type: "meme-next" }); return; }
    if (act === "admin-back") {
      app.screen = "settings";
      app.ui.editId = "";
      app.error = "";
      render();
      return;
    }
    if (act === "admin-logout") { dropAdmin(); app.ui.editId = ""; render(); return; }
    if (act === "new-question") { app.ui.editId = "new"; app.error = ""; render(); return; }
    if (act === "cancel-edit") { app.ui.editId = ""; app.error = ""; render(); return; }
    if (act === "edit-question") { app.ui.editId = t.dataset.id || ""; app.error = ""; render(); return; }
    if (act === "delete-question") { removeQuestion(t.dataset.id); return; }
    if (act === "theme") { applyTheme(t.dataset.theme); render(); return; }
    if (act === "back-style") return backFromStyle();
    if (act === "skip-style") return saveStyleFromDraft(true);
    if (act === "local") return openLocal();
    if (act === "how-phones") { app.ui.how = "phones"; render(); return; }
    if (act === "how-back") { app.ui.how = ""; render(); return; }
    if (act === "tv") return createRoom({ tv: true });
    if (act === "create") return createRoom();
    if (act === "save-players") return saveLocalPlayers();
    if (act === "back-players") {
      if (app.state) { app.screen = "lobby"; render(); }
      else finishLeave();
      return;
    }
    if (act === "shuffle-look") return shuffleLook(t.dataset.id);
    if (act === "remove-draft") { app.draftPlayers = app.draftPlayers.filter((p) => p.id !== t.dataset.id); render(); return; }
    if (act === "move") {
      const dir = Number(t.dataset.dir) < 0 ? -1 : 1;
      if (view() === "local-players") moveDraft(t.dataset.id, dir);
      else dispatch({ type: "move", playerId: t.dataset.id, dir });
      return;
    }
    if (act === "edit-players") {
      if (!app.state) return;
      app.draftPlayers = app.state.players.map((p) => ({ ...p }));
      app.screen = "local-players";
      render();
      return;
    }
    if (act === "kick") return dispatch({ type: "kick", playerId: t.dataset.id });
    if (act === "reset-sips") return dispatch({ type: "reset-sips" });
    if (act === "filter") { app.ui.filter = t.dataset.filter; render(); return; }
    if (act === "age") {
      if (!AGES.some((a) => a.id === t.dataset.age)) return;
      app.ui.age = t.dataset.age;
      localStorage.setItem("maatje.age", app.ui.age);
      if (app.account) api("/api/me", { method: "PATCH", body: { age: app.ui.age } }).then((data) => { app.account = data.user; }).catch(() => {});
      render();
      return;
    }
    if (act === "login") { app.overlay = "login"; app.ui.authMode = "login"; app.error = ""; render(); return; }
    if (act === "signup") { app.overlay = "login"; app.ui.authMode = "register"; app.error = ""; render(); return; }
    if (act === "do-login") { authSubmit(false); return; }
    if (act === "do-register") { authSubmit(true); return; }
    if (act === "close-login") { app.overlay = null; app.ui.authHint = ""; render(); return; }
    if (act === "resend-mail") {
      api("/api/resend", { method: "POST", body: { email: app.ui.pendingEmail || "" } })
        .then((data) => { app.ui.previewLink = data.previewLink || ""; toast(data.mailed ? "Mail opnieuw verstuurd." : "De link staat hieronder."); render(); })
        .catch((err) => toast(err.message));
      return;
    }
    if (act === "auth-toggle") { app.ui.authMode = app.ui.authMode === "register" ? "login" : "register"; app.error = ""; render(); return; }
    if (act === "groups") {
      if (!app.account) { app.overlay = "login"; render(); return; }
      if (app.mode) { toast("Stop het spel eerst."); return; }
      app.screen = "groups";
      render();
      return;
    }
    if (act === "open-group") {
      if (app.mode) { toast("Stop het spel eerst."); return; }
      app.groupId = t.dataset.id;
      app.screen = "group";
      render();
      return;
    }
    if (act === "logout") return logout();
    if (act === "group-local") {
      const group = (app.groups || []).find((g) => g.id === app.groupId);
      if (group) playGroupLocal(group);
      return;
    }
    if (act === "group-room") {
      const group = (app.groups || []).find((g) => g.id === app.groupId);
      if (!group) return;
      app.groupId = group.id;
      if (group.age && AGES.some((a) => a.id === group.age)) app.ui.age = group.age;
      app._groupPlayers = groupPlayers(group);
      createRoom();
      return;
    }
    if (act === "group-age") {
      const group = (app.groups || []).find((g) => g.id === app.groupId);
      if (!group || !app.account || group.ownerId !== app.account.id) { toast("Alleen de maker wijzigt de leeftijd."); return; }
      api("/api/groups/" + encodeURIComponent(group.id), { method: "PATCH", body: { age: t.dataset.age } })
        .then((data) => { app.groups = app.groups.map((g) => g.id === data.group.id ? data.group : g); app.ui.age = data.group.age; render(); })
        .catch((err) => toast(err.message));
      return;
    }
    if (act === "remove-segment") {
      api("/api/groups/" + encodeURIComponent(app.groupId) + "/segments", { method: "POST", body: { remove: t.dataset.id } })
        .then((data) => { app.groups = app.groups.map((g) => g.id === data.group.id ? data.group : g); render(); })
        .catch((err) => toast(err.message));
      return;
    }
    if (act === "leave-group") {
      api("/api/groups/" + encodeURIComponent(app.groupId), { method: "POST", body: {} })
        .then(() => api("/api/me"))
        .then((data) => { app.groups = data.groups || []; app.groupId = ""; app.screen = "groups"; render(); })
        .catch((err) => toast(err.message));
      return;
    }
    if (act === "rules") { app.ui.rules = t.dataset.game || (app.state && app.state.game && app.state.game.id) || "rad"; render(); return; }
    if (act === "close-rules") { app.ui.rules = ""; render(); return; }
    if (act === "start-game") return beginGame(t.dataset.game);
    if (act === "spin") {
      if (app.ui.spinLock) return;
      app.ui.spinLock = true;
      t.disabled = true;
      app.ui.soundFor = "pending";
      dispatch({ type: "spin" });
      setTimeout(() => { app.ui.spinLock = false; }, 1500);
      return;
    }
    if (act === "next") return dispatch({ type: "next" });
    if (act === "target") return dispatch({ type: "target", targetId: t.dataset.id });
    if (act === "choice") return dispatch({ type: "choice", choice: t.dataset.choice });
    if (act === "answer") return dispatch({ type: "answer", choice: t.dataset.choice });
    if (act === "next-q") return dispatch({ type: "next-q" });
    if (act === "guess") return dispatch({ type: "guess", guess: t.dataset.guess });
    if (act === "next-card") return dispatch({ type: "next-card" });
    if (act === "skip") return dispatch({ type: "skip" });
    if (act === "undo") return dispatch({ type: "undo" });
    if (act === "to-lobby") {
      noteEveningQuestions();
      noteEveningMissed();
      noteEveningAnswers();
      if (app.mode === "multi") dispatch({ type: "to-lobby" });
      else if (app.state) { app.state = { ...app.state, phase: "lobby", game: null }; app.screen = "lobby"; render(); }
      return;
    }
    if (act === "timer") return startCountdown(20);
    if (act === "ask-leave") { app.ui.confirmLeave = true; render(); return; }
    if (act === "stay") { app.ui.confirmLeave = false; render(); return; }
    if (act === "leave") return leaveRoom();
    if (act === "recap-done") { app.recap = null; app.screen = "home"; render(); return; }
    if (act === "go-home") return finishLeave();
    if (act === "claim") return claimHost();
    if (act === "copy-code") {
      copyText(app.roomCode || app.ui.codeValue || "").then((ok) => toast(ok ? "Code gekopieerd" : (app.roomCode || "")));
      return;
    }
    if (act === "share") return shareRoom();
    if (act === "retry") {
      const wasHost = app.isHost;
      const code = app.roomCode;
      finishLeave();
      if (wasHost) createRoom();
      else joinRoom(code);
    }
  }
  function onInput(e) {
    const t = e.target;
    if (t.id === "joinName") { app.ui.joinName = t.value; return; }
    if (t.id === "codeInput") {
      const norm = normalizeCode(t.value);
      if (t.value !== norm.code) t.value = norm.code;
      app.ui.codeValue = norm.code;
      paintSlots();
      if (norm.code.length === 4 && !document.getElementById("joinName")) joinRoom(norm.code);
      return;
    }
    if (t.id === "settingsName") {
      if (!app.draft) app.draft = { name: "", icon: "glass", color: "blue" };
      app.draft.name = t.value;
      const prev = document.getElementById("settingsPreview");
      if (prev) prev.textContent = cleanName(t.value, "") || "Jouw naam";
      persistProfile(app.draft);
      return;
    }
    if (t.id === "styleName") {
      app.draft.name = t.value;
      const prev = document.getElementById("previewName");
      if (prev) prev.textContent = cleanName(t.value, "") || "Jouw naam";
      return;
    }
    if (t.dataset.bind === "player") {
      const p = app.draftPlayers.find((x) => x.id === t.dataset.id);
      if (p) p.name = t.value;
      return;
    }
    if (t.id === "addPlayer") app.ui.addName = t.value;
    if (t.id === "authName") app.ui.authName = t.value;
    if (t.id === "authEmail") app.ui.authEmail = t.value;
    if (t.id === "authPass") app.ui.authPass = t.value;
    if (t.id === "groupName") app.ui.groupName = t.value;
    if (t.id === "groupCode") app.ui.groupCode = normalizeCode(t.value).code;
    if (t.id === "customQ") app.ui.customQ = t.value;
  }
  function onSubmit(e) {
    const form = e.target;
    if (!form || !app.root.contains(form)) return;
    e.preventDefault();
    if (form.dataset.act === "save-style") saveStyleFromDraft(false);
    if (form.dataset.act === "join") {
      const nameEl = document.getElementById("joinName");
      if (nameEl) {
        const name = cleanName(nameEl.value, "");
        if (!name) { toast("Vul je naam in."); return; }
        const cur = app.profile || { icon: "glass", color: "blue" };
        persistProfile({ name, icon: cur.icon, color: cur.color });
        app.ui.joinName = name;
      }
      joinRoom(readCodeInput());
    }
    if (form.dataset.act === "add-player") addDraft(app.ui.addName || "");
    if (form.dataset.act === "register") authSubmit(true);
    if (form.dataset.act === "login-form") authSubmit(false);
    if (form.dataset.act === "create-group") {
      const gn = document.getElementById("groupName");
      if (gn) app.ui.groupName = gn.value;
      api("/api/groups", { method: "POST", body: { name: app.ui.groupName || "" } })
        .then((data) => { app.groups = app.groups.concat(data.group); app.groupId = data.group.id; app.ui.groupName = ""; app.screen = "group"; render(); })
        .catch((err) => toast(err.message));
    }
    if (form.dataset.act === "join-group") {
      const gc = document.getElementById("groupCode");
      if (gc) app.ui.groupCode = normalizeCode(gc.value).code;
      api("/api/groups/join", { method: "POST", body: { code: app.ui.groupCode || "" } })
        .then((data) => {
          app.groups = app.groups.filter((g) => g.id !== data.group.id).concat(data.group);
          app.groupId = data.group.id;
          app.screen = "group";
          render();
        }).catch((err) => toast(err.message));
    }
    if (form.dataset.act === "add-segment") {
      const label = (document.getElementById("segLabel") || {}).value || "";
      const text = (document.getElementById("segText") || {}).value || "";
      const sips = Number((document.getElementById("segSips") || {}).value || 0);
      const who = (document.getElementById("segWho") || {}).value || "none";
      api("/api/groups/" + encodeURIComponent(app.groupId) + "/segments", { method: "POST", body: { label, text, sips, who } })
        .then((data) => { app.groups = app.groups.map((g) => g.id === data.group.id ? data.group : g); render(); })
        .catch((err) => toast(err.message));
    }
    if (form.dataset.act === "admin-login") {
      const username = (document.getElementById("adminUser") || {}).value || "";
      const pass = (document.getElementById("adminPass") || {}).value || "";
      api("/api/admin/login", { method: "POST", body: { username, password: pass } })
        .then((data) => {
          app.adminToken = data.token;
          app.admin = true;
          try { sessionStorage.setItem("maatje.admin", data.token); } catch (e) {}
          app.error = "";
          render();
        }).catch((err) => { app.error = err.message; render(); });
    }
    if (form.dataset.act === "save-meme") {
      const id = (document.getElementById("mId") || {}).value || "";
      const fileEl = document.getElementById("mFile");
      const file = fileEl && fileEl.files && fileEl.files[0];
      const keep = (document.getElementById("mKeep") || {}).value || "";
      const body = {
        name: (document.getElementById("mName") || {}).value || "",
        video: (document.getElementById("mVideo") || {}).value || keep,
        sips: Number((document.getElementById("mSips") || {}).value || 2),
      };
      const send = () => api(id ? "/api/admin/memes/" + encodeURIComponent(id) : "/api/admin/memes", { method: id ? "PATCH" : "POST", body, admin: true })
        .then((data) => { applyMemes(data.memes); app.ui.editId = ""; app.error = ""; render(); })
        .catch((err) => {
          if (/beheerder/.test(err.message)) { dropAdmin(); render(); }
          toast(err.message);
        });
      if (!file) { send(); return; }
      if (file.size > 8 * 1024 * 1024) { toast("Foto is te groot. Max 8 MB."); return; }
      toast("Bezig met uploaden…");
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result || "").split(",")[1] || "";
        api("/api/admin/memes/upload", { method: "POST", body: { data }, admin: true })
          .then((up) => { body.video = up.video; send(); })
          .catch((err) => {
            if (/beheerder/.test(err.message)) { dropAdmin(); render(); }
            toast(err.message);
          });
      };
      reader.onerror = () => toast("Upload mislukt.");
      reader.readAsDataURL(file);
    }
    if (form.dataset.act === "save-question") {
      const id = (document.getElementById("qId") || {}).value || "";
      const body = {
        text: (document.getElementById("qText") || {}).value || "",
        cat: (document.getElementById("qCat") || {}).value || "licht",
        kind: (document.getElementById("qKind") || {}).value || "say",
        ages: Array.from(document.querySelectorAll("[data-age]:checked")).map((el) => el.dataset.age),
      };
      api(id ? "/api/admin/questions/" + encodeURIComponent(id) : "/api/admin/questions", { method: id ? "PATCH" : "POST", body, admin: true })
        .then((data) => { applyQuestions(data.questions); app.ui.editId = ""; app.error = ""; render(); })
        .catch((err) => {
          if (/beheerder/.test(err.message)) { dropAdmin(); render(); }
          toast(err.message);
        });
    }
    if (form.dataset.act === "add-question") {
      const cq = document.getElementById("customQ");
      if (cq) app.ui.customQ = cq.value;
      api("/api/groups/" + encodeURIComponent(app.groupId) + "/questions", { method: "POST", body: { text: app.ui.customQ || "" } })
        .then((data) => { app.groups = app.groups.map((g) => g.id === data.group.id ? data.group : g); app.ui.customQ = ""; render(); })
        .catch((err) => toast(err.message));
    }
  }
  function onKey(e) {
    if (e.key === "Escape") {
      if (app.ui.camera) { stopCamera(); render(); return; }
      if (app.ui.crop) { closeCrop(); render(); return; }
      if (app.ui.rules) { app.ui.rules = ""; render(); return; }
      if (app.overlay === "login") { app.overlay = null; app.ui.authHint = ""; render(); return; }
      if (app.ui.confirmLeave) { app.ui.confirmLeave = false; render(); return; }
    }
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (view() === "play" && app.state && app.state.game && app.state.game.id === "kaarten" && app.state.game.stage === "guess" && myTurn()) {
      if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); dispatch({ type: "guess", guess: "higher" }); }
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); dispatch({ type: "guess", guess: "lower" }); }
    }
  }
  function boot() {
    app.root = document.getElementById("app");
    app.meId = myId();
    app.profile = loadProfile();
    app.sound = localStorage.getItem("maatje.sound") !== "off";
    applyTheme(localStorage.getItem("maatje.theme") || "dark");
    app.token = localStorage.getItem("maatje.token") || "";
    const savedAge = localStorage.getItem("maatje.age");
    if (AGES.some((a) => a.id === savedAge)) app.ui.age = savedAge;
    app.root.addEventListener("click", onClick);
    app.root.addEventListener("input", onInput);
    app.root.addEventListener("change", (e) => {
      const photoSource = { stylePhoto: "style", settingsPhoto: "settings", styleCamera: "style", settingsCamera: "settings" }[e.target && e.target.id];
      if (photoSource) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) { toast("Foto is te groot. Max 8 MB."); return; }
        e.target.value = "";
        openCrop(file, photoSource);
        return;
      }
      if (!e.target || e.target.id !== "mFile") return;
      const name = document.getElementById("mFileName");
      const file = e.target.files && e.target.files[0];
      if (name) name.textContent = file ? file.name : "Geen bestand";
    });
    app.root.addEventListener("submit", onSubmit);
    document.addEventListener("keydown", onKey);
    const urlRoom = normalizeCode(new URLSearchParams(location.search).get("room") || "").code;
    const saved = normalizeCode(sessionStorage.getItem("maatje.room") || "").code;
    const pending = (urlRoom.length === 4 && urlRoom) || (saved.length === 4 && saved) || "";
    if (pending) app.ui.codeValue = pending;
    if (localStorage.getItem("maatje.welcomed") !== "1") {
      app.screen = "style";
      app.draft = app.profile || { name: "", icon: "glass", color: "blue" };
      if (urlRoom.length === 4) app.afterStyle = () => joinRoom(urlRoom);
      render();
    } else if (pending) {
      render();
      joinRoom(pending);
    } else {
      app.screen = "home";
      render();
    }
    loadAccount();
    setInterval(tick, 3000);
  }

  function runTests() {
    let n = 0;
    const check = (cond, msg) => { if (!cond) throw new Error(msg || "check faalde"); n += 1; };
    const norm = normalizeCode("k7mp");
    check(cleanPhoto("/media/avatars/ava-abc.jpg") === "/media/avatars/ava-abc.jpg", "foto pad");
    check(cleanPhoto("https://example.com/a.jpg") === "", "geen vreemde foto");
    check(norm.code === "K7MP" && !norm.bad, "code");
    const bad = normalizeCode("KOMP");
    check(bad.bad && bad.code === "KMP", "geen O");
    for (let i = 0; i < 12; i++) {
      for (const cur of [0, 10, 359, 720, 345]) {
        const rot = spinRotation(cur, i, 12);
        check(segmentAt(rot, 12) === i, "segment " + i + " vanaf " + cur);
        check(rot > cur, "draait vooruit");
      }
    }
    const players = [
      { id: "host-0001", name: "Alex", icon: "glass", color: "blue", sips: 0 },
      { id: "play-0002", name: "Sam", icon: "star", color: "blue", sips: 1 },
      { id: "play-0003", name: "Noor", icon: "moon", color: "pink", sips: 0 },
    ];
    const base = () => ({ v: 1, gen: 1, rev: 3, hostId: "host-0001", hostBeat: 10, phase: "play", players: players.map((p) => ({ ...p })), game: { id: "rad", turn: 0, rotation: 0, stage: "ready", spin: null, targetId: null, choice: null, category: "" } });
    check(!reduce(base(), { type: "spin", by: "play-0002" }), "ander mag niet draaien");
    const spun = reduce(base(), { type: "spin", by: "host-0001" });
    check(spun.game.stage === "result" && segmentAt(spun.game.rotation, 12) === spun.game.spin.segment, "draai landt");
    const self2 = SEGMENTS.findIndex((s) => s.id === "self2");
    const ready = base();
    ready.game.stage = "result";
    ready.game.spin = { id: "spin-1", segment: self2, at: 1 };
    const drank = reduce(ready, { type: "next", by: "host-0001" });
    check(drank.players[0].sips === 2 && drank.game.turn === 1 && drank.game.stage === "ready", "2 slokken");
    const back = reduce(drank, { type: "undo", by: "host-0001" });
    check(back && back.players[0].sips === 0 && back.game.turn === 0 && back.game.stage === "result", "ongedaan");
    const give = base();
    give.game.stage = "result";
    give.game.spin = { id: "spin-2", segment: SEGMENTS.findIndex((s) => s.id === "give"), at: 1 };
    check(!reduce(give, { type: "next", by: "host-0001" }), "eerst iemand kiezen");
    give.game.targetId = "play-0002";
    const given = reduce(give, { type: "next", by: "host-0001" });
    check(given.players[1].sips === 3, "weggeven houdt oude slokken");
    const again = base();
    again.game.stage = "result";
    again.game.spin = { id: "spin-3", segment: SEGMENTS.findIndex((s) => s.id === "again"), at: 1 };
    check(reduce(again, { type: "next", by: "host-0001" }).game.turn === 0, "opnieuw");
    const lobby = base();
    lobby.phase = "lobby";
    lobby.game = null;
    const joined = reduce(lobby, { type: "join", player: { id: "play-0004", name: "Bo", icon: "nope", color: "nope" } });
    check(joined.players.length === 4 && joined.players[3].icon === "glass", "join");
    const renamed = reduce(joined, { type: "join", player: { id: "play-0002", name: "Sammie", icon: "moon", color: "pink", sips: 9 } });
    check(renamed.players.length === 4 && renamed.players[1].name === "Sammie" && renamed.players[1].sips === 1, "zelfde speler");
    const kicked = reduce(base(), { type: "kick", by: "host-0001", playerId: "host-0001" });
    check(!kicked, "host blijft");
    const gone = reduce({ ...base(), game: { ...base().game, turn: 2 } }, { type: "kick", by: "host-0001", playerId: "play-0002" });
    check(gone.players.length === 2 && gone.players[1].id === "play-0003" && gone.game.turn === 1, "beurt na weghalen");
    check(better({ gen: 1, rev: 4, hostId: "a", hostBeat: 1 }, { gen: 2, rev: 1, hostId: "b", hostBeat: 1 }), "hogere generatie");
    check(!better({ gen: 2, rev: 4, hostId: "a", hostBeat: 5 }, { gen: 2, rev: 4, hostId: "a", hostBeat: 5 }), "gelijk is niet nieuwer");
    const cards = base();
    cards.game = { id: "kaarten", turn: 0, deck: [{ r: 5, s: 0 }, { r: 9, s: 1 }, { r: 9, s: 2 }, { r: 3, s: 3 }], index: 0, stage: "guess", guess: null, outcome: null, banner: "" };
    const good = reduce(cards, { type: "guess", by: "host-0001", guess: "higher" });
    check(good.game.outcome === "good", "hoger goed");
    const badGuess = reduce(cards, { type: "guess", by: "host-0001", guess: "lower" });
    check(badGuess.game.outcome === "bad", "lager fout");
    const tieState = reduce(badGuess, { type: "next-card", by: "host-0001" });
    check(tieState.players[0].sips === 2 && tieState.game.index === 1 && tieState.game.turn === 1, "straf en volgende kaart");
    check(!reduce(tieState, { type: "guess", by: "play-0003", guess: "higher" }), "niet jouw beurt");
    const tied = reduce(tieState, { type: "guess", by: "play-0002", guess: "lower" });
    check(tied && tied.game.outcome === "tie", "gelijk");
    const vragen = base();
    vragen.game = { id: "vragen", turn: 0, order: ["q01", "q13"], cursor: 0, round: 1, stage: "ask", note: null, filter: "mix" };
    const answered = reduce(vragen, { type: "answer", by: "host-0001", choice: "drink" });
    check(answered.players[0].sips === 2 && answered.game.stage === "note", "vraag drinken");
    const nxt = reduce(answered, { type: "next-q", by: "host-0001" });
    check(nxt.game.cursor === 1 && nxt.game.turn === 1 && nxt.game.stage === "ask", "volgende vraag");
    const memes = base();
    memes.game = { id: "memes", turn: 0, order: ["m01", "m02"], cursor: 0, round: 1, stage: "watch", note: null, targetId: null, missed: [], memes: [{ id: "m01", name: "Jurk!", video: "https://www.youtube.com/watch?v=lsTMQ3SGF_g", sips: 2 }, { id: "m02", name: "Let's go", video: "https://www.youtube.com/watch?v=xb0-7XOYDxg", sips: 2 }] };
    const missed = reduce(memes, { type: "meme-miss", by: "host-0001" });
    check(missed.players[0].sips === 2 && missed.game.stage === "result" && missed.game.missed[0] === "Jurk!", "meme gemist");
    const told = reduce(reduce(memes, { type: "meme-know", by: "host-0001" }), { type: "meme-told", by: "host-0001" });
    check(told.game.stage === "result" && told.game.note === "know" && told.game.cursor === 0 && told.game.answers[0] === "Jurk!" && told.players[0].sips === 0, "verteld toont antwoord");
    const after = reduce(told, { type: "meme-next", by: "host-0001" });
    check(after.game.stage === "watch" && after.game.cursor === 1 && after.game.note === null, "daarna de volgende");
    const round = normalizeState(spun);
    check(round && round.game.spin.segment === spun.game.spin.segment && round.game.rotation === spun.game.rotation, "staat blijft gelijk");
    console.log("ok", n);
  }

  const isTest = typeof process !== "undefined" && process.argv && process.argv.includes("--test");
  if (isTest) runTests();
  else if (typeof document !== "undefined") {
    try { boot(); } catch (err) {
      console.error(err);
      const root = document.getElementById("app");
      if (root) root.textContent = "Laden mislukt. Vernieuw de pagina.";
    }
  }
})();
