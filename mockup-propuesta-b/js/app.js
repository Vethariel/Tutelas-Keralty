/* Mockup navegable · Propuesta B. Sin servidor: todo ocurre en el navegador con datos ficticios. */
(function () {
  "use strict";
  const D = window.DATA;
  const STORE_KEY = "mockupB_v1";
  const SEM_ORDER = { ROJO: 0, GRIS: 1, AMARILLO: 2, VERDE: 3 };
  const ACTIVE_STATES = ["Nuevo", "En validación", "Por revisar", "Asignado", "En gestión"];

  /* ---------- Estado ---------- */
  const fresh = () => ({
    v: 1,
    clinica: "norte",
    rol: null,
    route: "login",
    caseId: null,
    grisId: null,
    umbral: 24,
    filters: { color: "", area: "", estado: "" },
    guideStep: 0,
    guideMin: false,
    notes: true,
    font: 0,
    clock: 9 * 60 + 42,
    casos: JSON.parse(JSON.stringify(D.casos)),
    usuarios: JSON.parse(JSON.stringify(D.usuarios)),
    log: [],
    menuOpen: false,
  });
  let S = fresh();

  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } };
  const load = () => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) { const o = JSON.parse(raw); if (o && o.casos && o.v === 1) return Object.assign(fresh(), o); }
    } catch (e) { /* ignorar */ }
    return null;
  };

  /* ---------- Utilidades ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const roleName = (id) => (D.roles.find((r) => r.id === id) || {}).nombre || "";
  const clinicName = (id) => (D.clinicas.find((c) => c.id === id) || {}).nombre || "";
  const getCase = (id) => S.casos.find((c) => c.id === id);
  const clinicCases = () => S.casos.filter((c) => c.clinica === S.clinica);
  const clock = () => { const m = S.clock; return String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };

  const ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4H5v16h5M16 8l4 4-4 4M20 12H9"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  };

  const horasLabel = (c) => {
    if (c.horas == null) return '<span class="hours late">Sin plazo legible</span>';
    if (c.horas < 0) return `<span class="hours late">Vencido hace ${Math.abs(c.horas)} h</span>`;
    const cls = c.horas <= 12 ? "soon" : "";
    if (c.horas >= 48) return `<span class="hours ${cls}">Quedan ${Math.floor(c.horas / 24)} d ${c.horas % 24} h</span>`;
    return `<span class="hours ${cls}">Quedan ${c.horas} h</span>`;
  };
  const semChip = (s) => `<span class="sem ${esc(s)}">${esc(s)}</span>`;
  const confBar = (n) => `<div class="conf"><span>Confianza de la extracción</span><div class="conf-bar"><i class="${n < 60 ? "low" : ""}" style="width:${n}%"></i></div><b class="num">${n} %</b></div>`;

  const sortCases = (arr) => arr.slice().sort((a, b) => (SEM_ORDER[a.semaforo] - SEM_ORDER[b.semaforo]) || ((a.horas == null ? -999 : a.horas) - (b.horas == null ? -999 : b.horas)));

  /* ---------- Historial y auditoría ---------- */
  const addHist = (c, texto) => { c.hist.push({ t: clock(), who: S.rol ? roleName(S.rol) : "Sistema", texto }); };
  const logAct = (accion, caso, detalle) => {
    S.log.unshift({ t: clock(), who: S.rol ? roleName(S.rol) : "Sistema", clinica: clinicName(S.clinica), accion, caso: caso || "—", detalle: detalle || "" });
    S.clock += 1 + Math.floor(Math.random() * 2);
  };
  const seedHistory = () => {
    S.casos.forEach((c) => {
      if (c.hist) return;
      c.hist = [
        { t: c.recibido, who: "Sistema", texto: `Ingreso por ${c.canal === "Ambos" ? "correo e Imperium" : c.canal.toLowerCase()}` },
        { t: c.recibido, who: "Sistema", texto: `Extracción automática (confianza ${c.conf} %)` },
        { t: c.recibido, who: "Sistema", texto: `Clasificado ${c.semaforo}${c.regla ? " por " + c.regla : ""}` },
      ];
      if (c.id === "T-0425") {
        c.corregido = true; c.regla = "Manual";
        c.hist.push({ t: "Ayer 17:10", who: "Jurídica", texto: "Corrigió el semáforo de VERDE a AMARILLO: el plazo real era menor" });
      }
      if (["Asignado", "En gestión", "Respondido"].includes(c.estado)) c.hist.push({ t: c.recibido, who: "Operativo", texto: `Confirmó y asignó a ${c.area}` });
    });
    if (!S.log.length) {
      S.log = [
        { t: "08:58", who: "Operativo", clinica: "Clínica Sede Norte", accion: "Confirmó clasificación", caso: "T-0414", detalle: "Asignado a Farmacia" },
        { t: "08:41", who: "Jurídica", clinica: "Clínica Sede Norte", accion: "Corrigió semáforo", caso: "T-0425", detalle: "VERDE → AMARILLO" },
        { t: "08:30", who: "Administrador de clínica", clinica: "Clínica Sede Norte", accion: "Alta de usuario", caso: "—", detalle: "Rol Operativo" },
      ];
    }
  };

  /* ---------- Reglas: umbral ---------- */
  const applyUmbral = (u) => {
    S.casos.forEach((c) => {
      if (["R07", "R08"].includes(c.regla) && !c.corregido && c.horas != null) {
        c.semaforo = c.horas <= u ? "AMARILLO" : "VERDE";
        c.regla = c.horas <= u ? "R07" : "R08";
      }
    });
  };
  const umbralPreview = (u) => {
    const ruled = clinicCases().filter((c) => ["R07", "R08"].includes(c.regla) && !c.corregido && c.horas != null);
    const am = ruled.filter((c) => c.horas <= u).length;
    return { am, ve: ruled.length - am };
  };

  /* ---------- Notificaciones ---------- */
  const notifs = () => {
    const cs = clinicCases();
    const out = [];
    const push = (c, tipo, texto) => out.push({ id: c.id, tipo, texto });
    if (S.rol === "operativo" || S.rol === "juridica") {
      sortCases(cs).forEach((c) => {
        if (c.semaforo === "ROJO" && ["Nuevo", "En validación"].includes(c.estado)) push(c, "ROJO", `Caso en ROJO (${c.regla}) pendiente de validar: ${c.tipo}`);
        if (c.semaforo === "GRIS" && c.estado === "Por revisar") push(c, "GRIS", `Caso en GRIS por revisar: ${c.gris_motivo}`);
      });
    } else if (S.rol === "lider") {
      cs.filter((c) => c.area === "Oncología" && ["Asignado", "En gestión"].includes(c.estado)).forEach((c) => push(c, c.semaforo, `Caso asignado a Oncología: ${c.tipo}. ${c.horas != null && c.horas >= 0 ? "Plazo en " + c.horas + " h" : ""}`));
    } else if (S.rol === "admin_clinica") {
      cs.filter((c) => c.horas != null && c.horas < 0 && c.estado !== "Respondido").forEach((c) => push(c, "ROJO", `Plazo aparentemente vencido en ${c.id}`));
      cs.filter((c) => c.semaforo === "GRIS" && c.estado === "Por revisar").forEach((c) => push(c, "GRIS", `${c.id} lleva pendiente en GRIS: ${c.gris_motivo}`));
    }
    return out;
  };

  /* ---------- Navegación por rol ---------- */
  const NAV = {
    operativo: [["bandeja", "Bandeja de casos"], ["gris", "Revisión en GRIS"], ["notificaciones", "Notificaciones"]],
    juridica: [["bandeja", "Bandeja de casos"], ["gris", "Revisión en GRIS"], ["indicadores", "Indicadores"], ["config", "Reglas de la clínica"], ["notificaciones", "Notificaciones"]],
    lider: [["miscasos", "Mis casos"], ["notificaciones", "Notificaciones"]],
    admin_clinica: [["config", "Configuración"], ["usuarios", "Usuarios y roles"], ["indicadores", "Indicadores"], ["auditoria", "Auditoría"], ["notificaciones", "Notificaciones"]],
    admin_red: [["red", "Vista de la red"]],
  };
  const LANDING = { operativo: "bandeja", juridica: "bandeja", lider: "miscasos", admin_clinica: "config", admin_red: "red" };

  const NOTES = {
    bandeja: "<b>Qué mirar:</b> los casos llegan ordenados por color y por horas restantes. Cada fila muestra el plazo, el tipo de actuación, el área sugerida y el estado.",
    detalle: "<b>Qué mirar:</b> el documento tiene resaltado el fragmento de donde sale cada dato. Abajo se ve la regla aplicada y por qué. Ninguna sugerencia se aplica sin que una persona la confirme.",
    gris: "<b>Qué mirar:</b> el color GRIS nunca descarta un caso: lo manda a revisión y explica el motivo. Aquí se compara con el caso relacionado.",
    miscasos: "<b>Qué mirar:</b> el líder de área solo ve los casos asignados a su área, con el plazo y el estado, y marca su avance.",
    config: "<b>Qué mirar:</b> las reglas son una tabla que Jurídica puede revisar. Cambia el umbral y observa cómo cambian los colores sin tocar código.",
    usuarios: "<b>Qué mirar:</b> cada usuario tiene un rol y cada rol tiene permisos distintos.",
    indicadores: "<b>Qué mirar:</b> casos por color, carga por área, plazos y porcentaje de clasificaciones que las personas corrigieron.",
    red: "<b>Qué mirar:</b> la red ve indicadores consolidados por clínica, pero no puede abrir casos individuales. Los datos de cada clínica están separados.",
    auditoria: "<b>Qué mirar:</b> cada acción queda registrada: quién la hizo, cuándo y sobre qué caso.",
    notificaciones: "<b>Qué mirar:</b> alertas de casos en ROJO y GRIS, nuevas asignaciones y plazos próximos.",
  };

  /* ---------- Recorrido guiado ---------- */
  const STEPS = [
    { title: "Inicio de sesión", text: "Se elige la clínica y el rol. Cada clínica ve solo sus casos. Pulsa Siguiente para entrar como Operativo.", set: () => { S.rol = null; S.route = "login"; S.clinica = "norte"; } },
    { title: "La bandeja ordena por urgencia", text: "Como Operativo, los casos nuevos llegan ordenados por color y horas restantes. Abre el caso T-0412 (ROJO, medida provisional).", set: () => { S.rol = "operativo"; S.route = "bandeja"; S.clinica = "norte"; } },
    { title: "Cada dato tiene su evidencia", text: "Pulsa «Ver en el documento» junto a un campo: se resalta el fragmento de origen. Revisa la regla (R04) y usa «Validar este caso» para confirmar.", set: () => { S.rol = "operativo"; S.route = "detalle"; S.caseId = "T-0412"; S.clinica = "norte"; } },
    { title: "El líder de área recibe su caso", text: "El caso confirmado aparece en «Mis casos» de Oncología con su plazo. Desde aquí se marca el avance.", set: () => { autoConfirm("T-0412"); S.rol = "lider"; S.route = "miscasos"; S.clinica = "norte"; } },
    { title: "Los casos en GRIS se revisan, no se descartan", text: "El sistema detectó un posible duplicado. Compara lado a lado con el caso original y pulsa «Vincular como duplicado».", set: () => { S.rol = "operativo"; S.route = "gris"; S.grisId = "T-0422"; S.clinica = "norte"; } },
    { title: "Las reglas son una tabla editable", text: "Como administrador de clínica, cambia el umbral del semáforo (por ejemplo a 12 h), mira el efecto y guarda. No hace falta tocar código.", set: () => { S.rol = "admin_clinica"; S.route = "config"; S.clinica = "norte"; } },
    { title: "La red ve indicadores, no casos", text: "Vista consolidada por clínica. El administrador de red no puede abrir los casos individuales.", set: () => { S.rol = "admin_red"; S.route = "red"; } },
  ];
  const autoConfirm = (id) => {
    const c = getCase(id);
    if (c && c.estado === "Nuevo") { const prev = S.rol; S.rol = "operativo"; c.estado = "Asignado"; c.validado_por = "Operativo"; addHist(c, `Confirmó y asignó a ${c.area}`); logAct("Confirmó clasificación", c.id, `Asignado a ${c.area}`); S.rol = prev; }
  };
  const goStep = (i) => {
    S.guideStep = Math.max(0, Math.min(STEPS.length - 1, i));
    STEPS[S.guideStep].set();
    S.menuOpen = false;
    render(); window.scrollTo({ top: 0 });
  };

  /* ---------- Renderizado ---------- */
  function renderHeader() {
    const h = $("#header");
    const logged = !!S.rol;
    const n = logged ? notifs().length : 0;
    h.innerHTML = `
      <div class="header-left">
        ${logged ? `<button class="icon-btn solid menu-toggle" data-action="menu" aria-label="Abrir menú">${ICON.menu}</button>` : ""}
        <button class="icon-btn font-btn" data-action="font-" aria-label="Reducir tamaño del texto">A−</button>
        <button class="icon-btn font-btn" data-action="font+" aria-label="Aumentar tamaño del texto">A+</button>
      </div>
      <a class="brand" href="#" data-action="home" aria-label="Triaje de tutelas, inicio">
        <span class="brand-mark" aria-hidden="true">T</span>
        <span><span class="brand-text">Triaje de tutelas</span><span class="brand-sub">MOCKUP · PROPUESTA B · DATOS FICTICIOS</span></span>
      </a>
      <div class="header-right">
        ${logged ? `<div class="chip-user"><b>${esc(roleName(S.rol))}</b><span>${S.rol === "admin_red" ? "Red de clínicas" : esc(clinicName(S.clinica))}</span></div>
        ${S.rol !== "admin_red" ? `<button class="icon-btn" data-action="go" data-route="notificaciones" aria-label="Notificaciones, ${n} nuevas">${ICON.bell}${n ? `<span class="badge">${n}</span>` : ""}</button>` : ""}
        <button class="icon-btn" data-action="logout" aria-label="Salir">${ICON.out}</button>` : ""}
      </div>`;
  }

  function renderLogin() {
    return `<main class="login-wrap" id="main">
      <div class="login-card">
        <span class="demo-pill">Demo con datos ficticios</span>
        <h1>Ingresar a la plataforma</h1>
        <p style="color:var(--muted);margin-top:6px">Selecciona la clínica y el rol con el que quieres recorrer la demo. No se pide contraseña.</p>
        <label class="field">Clínica
          <select id="login-clinica">${D.clinicas.map((c) => `<option value="${c.id}" ${S.clinica === c.id ? "selected" : ""}>${esc(c.nombre)} (ficticia)</option>`).join("")}</select>
        </label>
        <label class="field">Rol
          <select id="login-rol">${D.roles.map((r) => `<option value="${r.id}" ${r.id === "operativo" ? "selected" : ""}>${esc(r.nombre)}</option>`).join("")}</select>
        </label>
        <p class="role-hint" id="role-hint">${esc(D.roles[0].desc)}</p>
        <div class="btn-row" style="margin-top:22px"><button class="btn" data-action="login">Entrar</button></div>
      </div>
    </main>`;
  }

  function renderShell(content) {
    const items = NAV[S.rol] || [];
    const nCount = notifs().length;
    const redCount = clinicCases().filter((c) => c.semaforo === "ROJO" && ["Nuevo", "En validación"].includes(c.estado)).length;
    const grisCount = clinicCases().filter((c) => c.semaforo === "GRIS" && c.estado === "Por revisar").length;
    const countOf = (r) => (r === "bandeja" ? redCount : r === "gris" ? grisCount : r === "notificaciones" ? nCount : 0);
    const active = S.route === "detalle" ? "bandeja" : S.route;
    return `<div class="shell">
      <nav class="sidebar ${S.menuOpen ? "open" : ""}" aria-label="Menú principal">
        <div class="nav-title">${esc(roleName(S.rol))}</div>
        ${items.map(([r, label]) => `<button class="nav-item ${active === r ? "active" : ""}" data-action="go" data-route="${r}" ${active === r ? 'aria-current="page"' : ""}><span>${esc(label)}</span>${countOf(r) ? `<span class="count">${countOf(r)}</span>` : ""}</button>`).join("")}
        ${S.rol !== "admin_red" ? `<div class="clinic-box"><b>${esc(clinicName(S.clinica))}</b>Solo ves los datos de esta clínica.
          <label class="field" style="margin-top:10px">Cambiar de clínica (demo)
            <select data-action-change="clinica">${D.clinicas.map((c) => `<option value="${c.id}" ${S.clinica === c.id ? "selected" : ""}>${esc(c.nombre)}</option>`).join("")}</select>
          </label></div>` : ""}
      </nav>
      <main class="main" id="main">${content}</main>
    </div>`;
  }

  const crumbs = (...parts) => `<div class="crumbs">${parts.map((p, i) => (i === parts.length - 1 ? `<b>${esc(p)}</b>` : esc(p))).join(" / ")}</div>`;
  const noteBox = () => (S.notes && NOTES[S.route] ? `<div class="note">${ICON.info}<p>${NOTES[S.route]}</p></div>` : "");

  /* --- Bandeja --- */
  function bandejaTable() {
    const f = S.filters;
    const rows = sortCases(clinicCases()).filter((c) => (!f.color || c.semaforo === f.color) && (!f.area || c.area === f.area) && (!f.estado || c.estado === f.estado));
    if (!rows.length) return `<div class="card empty">No hay casos con estos filtros.</div>`;
    return `<div class="table-wrap"><table>
      <thead><tr><th>Semáforo</th><th>Caso</th><th>Plazo</th><th>Tipo de actuación</th><th>Área sugerida</th><th>Canal</th><th>Estado</th></tr></thead>
      <tbody>${rows.map((c) => `<tr class="row-link" tabindex="0" data-action="open-case" data-id="${c.id}" aria-label="Abrir caso ${c.id}">
        <td>${semChip(c.semaforo)}</td>
        <td><span class="case-id">${c.id}</span><span class="sub">Recibido: ${esc(c.recibido)}</span></td>
        <td>${horasLabel(c)}</td><td>${esc(c.tipo)}</td><td>${esc(c.area)}</td><td><span class="tag">${esc(c.canal)}</span></td>
        <td><span class="tag ${c.estado === "Nuevo" ? "blue" : ""}">${esc(c.estado)}</span></td></tr>`).join("")}</tbody></table></div>`;
  }
  function renderBandeja() {
    const cs = clinicCases();
    const act = (s) => cs.filter((c) => c.semaforo === s && c.estado !== "Respondido").length;
    const estados = [...new Set(cs.map((c) => c.estado))];
    const areas = [...new Set(cs.map((c) => c.area))];
    return `${crumbs("Inicio", "Bandeja de casos")}
      <div class="page-head"><div><h1>Bandeja de casos</h1><p>Cola de trabajo de ${esc(clinicName(S.clinica))}, ordenada por urgencia.</p></div></div>
      ${noteBox()}
      <div class="counts">
        <div class="count-card"><b>${cs.filter((c) => c.estado !== "Respondido").length}</b><span>Casos activos</span></div>
        <div class="count-card"><b style="color:var(--red)">${act("ROJO")}</b><span>ROJO</span></div>
        <div class="count-card"><b style="color:#555">${act("GRIS")}</b><span>GRIS por revisar</span></div>
        <div class="count-card"><b style="color:var(--amber)">${act("AMARILLO")}</b><span>AMARILLO</span></div>
        <div class="count-card"><b style="color:var(--ok)">${act("VERDE")}</b><span>VERDE</span></div>
      </div>
      <div class="filters">
        <label class="field">Semáforo<select data-filter="color"><option value="">Todos</option>${["ROJO", "GRIS", "AMARILLO", "VERDE"].map((x) => `<option ${S.filters.color === x ? "selected" : ""}>${x}</option>`).join("")}</select></label>
        <label class="field">Área<select data-filter="area"><option value="">Todas</option>${areas.map((x) => `<option ${S.filters.area === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></label>
        <label class="field">Estado<select data-filter="estado"><option value="">Todos</option>${estados.map((x) => `<option ${S.filters.estado === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></label>
      </div>
      <div id="bandeja-results">${bandejaTable()}</div>`;
  }

  /* --- Detalle --- */
  const mark = (id, text) => (String(text).startsWith("[") ? `<span class="redact">${esc(text)}</span>` : `<mark class="ev" data-ev="${id}">${esc(text)}</mark>`);
  function docHtml(c) {
    return `<div class="doc"><div class="doc-head">${mark("juzgado", c.juzgado)} · Radicado ${mark("radicado", c.radicado)}</div>
      <p>Providencia del ${esc(c.fecha)}.</p>
      <p>Asunto: ${mark("tipo", c.tipo_frase)}.</p>
      <p>La parte accionante, identificada con las iniciales ${esc(c.iniciales)}, solicita ${mark("peticion", c.peticion_texto)}.</p>
      ${c.riesgo_texto ? `<p>En el escrito se indica que ${mark("riesgo", c.riesgo_texto)}.</p>` : ""}
      <p>Se ordena a la entidad accionada que dé respuesta ${mark("plazo", c.plazo_literal)}, informando al despacho de lo actuado.</p>
      <p>Notifíquese y cúmplase.</p></div>`;
  }
  const canAct = () => S.rol === "operativo" || S.rol === "juridica";
  function renderDetalle() {
    const c = getCase(S.caseId);
    if (!c) return `<div class="card empty">Selecciona un caso desde la bandeja.</div>`;
    const rule = D.reglas.find((r) => r.id === c.regla);
    const ev = (id, label) => `<button class="linkish" data-action="ev" data-ev="${id}">${label || "Ver en el documento"}</button>`;
    const confirmed = ["Asignado", "En gestión", "Respondido"].includes(c.estado);
    const actions = !canAct()
      ? `<p class="role-hint">Tu rol (${esc(roleName(S.rol))}) puede ver este caso, pero no confirmarlo ni corregirlo.</p>`
      : confirmed
        ? `<div class="note" style="margin:0"><p><b>Caso confirmado.</b> Quedó asignado a ${esc(c.area)} y el líder del área ya lo ve en «Mis casos».</p></div><div class="btn-row" style="margin-top:12px"><button class="btn outline" data-action="go" data-route="bandeja">Volver a la bandeja</button><button class="btn outline" data-action="open-reassign">Reasignar</button></div>`
        : c.semaforo === "GRIS"
          ? `<div class="note" style="margin:0"><p>Este caso está en GRIS. Primero hay que resolver el motivo en <b>Revisión en GRIS</b>.</p></div><div class="btn-row" style="margin-top:12px"><button class="btn" data-action="go-gris" data-id="${c.id}">Ir a revisión en GRIS</button></div>`
          : `<div class="btn-row"><button class="btn green" data-action="confirm-case">Confirmar y asignar a ${esc(c.area)}</button><button class="btn outline" data-action="open-correct">Corregir</button><button class="btn outline" data-action="open-reassign">Reasignar</button></div>`;
    return `${crumbs("Inicio", "Bandeja de casos", c.id)}
      <div class="page-head"><div><h1>Caso ${c.id} ${semChip(c.semaforo)}</h1><p>${esc(c.tipo)} · recibido ${esc(c.recibido)} por ${esc(c.canal === "Ambos" ? "correo e Imperium" : c.canal.toLowerCase())}</p></div>
        <div class="btn-row">${canAct() && !confirmed && c.semaforo !== "GRIS" ? `<button class="btn green" data-action="scroll-validate">Validar este caso ↓</button>` : ""}<button class="btn outline" data-action="go" data-route="bandeja">← Volver a la bandeja</button></div></div>
      ${noteBox()}
      <div class="detail">
        <div><h3 style="margin-bottom:10px">Documento recibido <span class="tag">Texto equivalente al PDF</span></h3>${docHtml(c)}</div>
        <div>
          <div class="card"><h3>Lo que entendió el sistema</h3>
            <dl class="fields" style="margin:8px 0 0">
              <div class="field-row"><dt>Tipo</dt><dd>${esc(c.tipo)}</dd>${ev("tipo")}</div>
              <div class="field-row"><dt>Petición</dt><dd>${esc(c.peticion_texto.replace(/^\[…\]\s*/, ""))}</dd>${String(c.peticion_texto).startsWith("[") ? "<span></span>" : ev("peticion")}</div>
              <div class="field-row"><dt>Plazo</dt><dd>${esc(c.plazo_literal)}<br>${horasLabel(c)}</dd>${String(c.plazo_literal).startsWith("[") ? "<span></span>" : ev("plazo")}</div>
              <div class="field-row"><dt>Riesgo clínico</dt><dd>${c.riesgo_texto ? esc(c.riesgo_texto) : "No se mencionan señales de riesgo"}</dd>${c.riesgo_texto ? ev("riesgo") : "<span></span>"}</div>
              <div class="field-row"><dt>Despacho</dt><dd>${esc(c.juzgado)}<br><span class="tag">Radicado ${esc(c.radicado)}</span></dd>${ev("juzgado")}</div>
            </dl>${confBar(c.conf)}</div>
          <div class="card"><h3>Resumen en lenguaje claro</h3><p style="margin-top:6px">${esc(c.resumen)}</p></div>
          <div class="card"><h3>Prioridad sugerida</h3>
            <div style="margin-top:8px">${semChip(c.semaforo)} <span class="tag blue">Área sugerida: ${esc(c.area)}</span></div>
            <div class="axes"><div class="axis"><span>Urgencia jurídica</span><b>${esc(c.urg_j)}</b></div><div class="axis"><span>Urgencia clínica</span><b>${esc(c.urg_c)}</b></div></div>
            <div class="rule-box"><b>${esc(c.semaforo)} por ${esc(c.regla)}</b>${rule ? `: ${esc(rule.cond)}.` : c.regla === "Manual" ? ": corrección manual de una persona." : ""}${rule ? `<br><span style="color:var(--muted)">${esc(rule.adv)}</span>` : ""}</div>
            ${c.duplicado_de ? `<p class="role-hint">Posible duplicado de <b>${esc(c.duplicado_de)}</b>.</p>` : ""}</div>
          <div class="card" id="validar"><h3 style="margin-bottom:10px">Validación humana</h3>${actions}</div>
          <div class="card"><h3 style="margin-bottom:12px">Historial del caso</h3><ul class="history">${c.hist.slice().reverse().map((h) => `<li>${esc(h.texto)}<small>${esc(h.who)} · ${esc(h.t)}</small></li>`).join("")}</ul></div>
        </div>
      </div>`;
  }

  /* --- Revisión GRIS --- */
  function renderGris() {
    const list = clinicCases().filter((c) => c.semaforo === "GRIS");
    if (!list.length) return `${crumbs("Inicio", "Revisión en GRIS")}<div class="page-head"><h1>Revisión en GRIS</h1></div>${noteBox()}<div class="card empty">No hay casos en GRIS en esta clínica.</div>`;
    if (!list.find((c) => c.id === S.grisId)) S.grisId = list[0].id;
    const c = getCase(S.grisId);
    const related = c.duplicado_de ? getCase(c.duplicado_de) : null;
    const pending = c.estado === "Por revisar";
    const cmpRow = (label, a, b) => `<div class="h" style="${""}">${esc(label)}</div><div class="${b == null ? "" : a === b ? "same" : "diff"}">${esc(a)}</div><div class="${a === b ? "same" : "diff"}">${esc(b)}</div>`;
    let tools = "";
    if (!pending) {
      tools = `<div class="note" style="margin:0"><p><b>Resuelto:</b> ${esc(c.estado)}. Quedó registrado en el historial y en la auditoría.</p></div>`;
    } else if (c.regla === "R10" && related) {
      tools = `<div class="btn-row"><button class="btn green" data-action="gris-link">Vincular como duplicado de ${esc(related.id)}</button><button class="btn outline" data-action="gris-notdup">No es un duplicado</button></div>`;
    } else if (c.regla === "R09") {
      tools = `<label class="field" style="max-width:320px;margin-bottom:12px">Si corresponde a la clínica, asignar a
        <select id="gris-area">${D.areas.map((a) => `<option>${esc(a.id)}</option>`).join("")}</select></label>
        <div class="btn-row"><button class="btn green" data-action="gris-comp-area">Es de la clínica: asignar</button><button class="btn outline" data-action="gris-juridica">Enviar a Jurídica para decidir</button></div>`;
    } else {
      tools = `<div class="btn-row"><button class="btn green" data-action="gris-manual">Capturar los datos a mano</button><button class="btn outline" data-action="gris-request">Solicitar el documento completo</button></div>`;
    }
    const compare = related
      ? `<h3 style="margin:18px 0 8px">Comparación con el caso relacionado</h3>
        <div class="legend"><span>■ Verde: coincide</span><span>■ Ámbar: difiere</span></div>
        <div class="compare"><div class="h"></div><div class="h">${esc(c.id)} (nuevo)</div><div class="h">${esc(related.id)} (original)</div>
        ${cmpRow("Radicado", c.radicado, related.radicado)}${cmpRow("Despacho", c.juzgado, related.juzgado)}${cmpRow("Tipo", c.tipo, related.tipo)}${cmpRow("Fecha", c.fecha, related.fecha)}${cmpRow("Plazo", c.plazo_literal, related.plazo_literal)}${cmpRow("Canal", c.canal === "Ambos" ? "Correo e Imperium" : c.canal, related.canal === "Ambos" ? "Correo e Imperium" : related.canal)}${cmpRow("Recibido", c.recibido, related.recibido)}</div>`
      : "";
    return `${crumbs("Inicio", "Revisión en GRIS")}
      <div class="page-head"><div><h1>Revisión en GRIS</h1><p>Casos que necesitan una persona antes de asignarse. Ninguno se descarta.</p></div></div>
      ${noteBox()}
      <div class="review"><div>${list.map((g) => `<button class="gray-item ${g.id === S.grisId ? "active" : ""}" data-action="gris-select" data-id="${g.id}"><b>${g.id}</b> · ${esc(g.gris_motivo)}<span class="sub" style="display:block;font-size:.8125rem;color:var(--soft)">${esc(g.estado)}</span></button>`).join("")}</div>
      <div><div class="card"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${semChip("GRIS")}<h2 style="font-size:1.25rem">${esc(c.gris_motivo)}</h2></div>
        <p style="margin:10px 0 4px">${esc(c.gris_texto)}</p><p class="role-hint">Regla: ${esc(c.regla)} · ${esc((D.reglas.find((r) => r.id === c.regla) || {}).adv || "")}</p>
        <h3 style="margin:18px 0 10px">¿Qué hace la persona?</h3>${tools}${compare}
        <div style="margin-top:14px"><button class="linkish" data-action="open-case" data-id="${c.id}">Ver el documento completo del caso ${c.id}</button></div></div></div></div>`;
  }

  /* --- Mis casos --- */
  function renderMisCasos() {
    const rows = sortCases(clinicCases().filter((c) => c.area === "Oncología" && ["Asignado", "En gestión", "Respondido"].includes(c.estado)));
    const wait = clinicCases().filter((c) => c.area === "Oncología" && ["Nuevo", "En validación"].includes(c.estado)).length;
    return `${crumbs("Inicio", "Mis casos")}
      <div class="page-head"><div><h1>Mis casos · Oncología</h1><p>Casos asignados a tu área. ${wait ? `Hay ${wait} más esperando validación del equipo operativo.` : ""}</p></div></div>
      ${noteBox()}
      ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>Semáforo</th><th>Caso</th><th>Plazo</th><th>Qué se pide</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
      ${rows.map((c) => `<tr><td>${semChip(c.semaforo)}</td><td><button class="linkish case-id" data-action="open-case" data-id="${c.id}">${c.id}</button><span class="sub">${esc(c.tipo)}</span></td><td>${horasLabel(c)}</td><td style="max-width:360px">${esc(c.resumen)}</td><td><span class="tag ${c.estado === "Respondido" ? "green" : "blue"}">${esc(c.estado)}</span></td>
      <td><div class="btn-row">${c.estado === "Asignado" ? `<button class="btn small outline" data-action="case-status" data-id="${c.id}" data-status="En gestión">Marcar en gestión</button>` : ""}${c.estado !== "Respondido" ? `<button class="btn small" data-action="case-status" data-id="${c.id}" data-status="Respondido">Respuesta enviada</button>` : "—"}</div></td></tr>`).join("")}</tbody></table></div>`
        : `<div class="card empty">Aún no hay casos asignados a Oncología.</div>`}`;
  }

  /* --- Configuración --- */
  function renderConfig() {
    const pv = umbralPreview(S.umbral);
    const editable = S.rol === "admin_clinica";
    return `${crumbs("Inicio", S.rol === "juridica" ? "Reglas de la clínica" : "Configuración")}
      <div class="page-head"><div><h1>${S.rol === "juridica" ? "Reglas de la clínica" : "Configuración de la clínica"}</h1><p>Áreas, responsables y reglas de ${esc(clinicName(S.clinica))}.</p></div></div>
      ${noteBox()}
      <h2 class="section-title">Umbral del semáforo</h2>
      <div class="card"><label class="field" style="max-width:340px">Horas para pasar de VERDE a AMARILLO
        <input type="number" id="umbral" min="1" max="96" value="${S.umbral}" ${editable ? "" : "disabled"}></label>
        <p id="umbral-preview" style="margin:10px 0 14px">Con <b>${S.umbral} h</b>: <b>${pv.am}</b> casos quedarían en AMARILLO y <b>${pv.ve}</b> en VERDE.</p>
        ${editable ? `<button class="btn" data-action="save-umbral">Guardar umbral</button>` : `<p class="role-hint">Solo el administrador de clínica puede cambiar el umbral. Jurídica puede revisarlo.</p>`}</div>
      <h2 class="section-title">Reglas</h2>
      <div class="table-wrap"><table><thead><tr><th>Regla</th><th>Condición</th><th>Resultado</th><th>Advertencia</th></tr></thead><tbody>
      ${D.reglas.map((r) => `<tr><td><b>${r.id}</b></td><td>${esc(r.cond.replace("24 h por defecto", S.umbral + " h"))}</td><td>${["ROJO", "AMARILLO", "VERDE", "GRIS"].includes(r.sal) ? semChip(r.sal) : `<span class="tag">${esc(r.sal)}</span>`}</td><td>${esc(r.adv)}</td></tr>`).join("")}</tbody></table></div>
      <p class="role-hint" style="margin-top:8px">Reglas ilustrativas del mockup. Las oficiales se validan con Jurídica. En esta demo solo el umbral es editable.</p>
      <h2 class="section-title">Áreas y responsables</h2>
      <div class="table-wrap"><table><thead><tr><th>Área</th><th>Responsable</th><th>Correo de aviso</th></tr></thead><tbody>
      ${D.areas.map((a) => `<tr><td><b>${esc(a.id)}</b></td><td>${esc(a.responsable)}</td><td>${esc(a.correo)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  /* --- Usuarios --- */
  function renderUsuarios() {
    return `${crumbs("Inicio", "Usuarios y roles")}
      <div class="page-head"><div><h1>Usuarios y roles</h1><p>Quién puede hacer qué en ${esc(clinicName(S.clinica))}.</p></div></div>
      ${noteBox()}
      <div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th></tr></thead><tbody>
      ${S.usuarios.map((u) => `<tr><td><b>${esc(u.nombre)}</b></td><td>${esc(u.correo)}</td><td>${esc(u.rol)}</td><td><span class="tag green">${esc(u.estado)}</span></td></tr>`).join("")}</tbody></table></div>
      <h2 class="section-title">Dar de alta un usuario</h2>
      <div class="card"><div class="filters" style="margin:0">
        <label class="field">Nombre<input type="text" id="u-nombre" placeholder="Nombre ficticio"></label>
        <label class="field">Correo<input type="email" id="u-correo" placeholder="nombre@ejemplo.test"></label>
        <label class="field">Rol<select id="u-rol">${["Operativo", "Jurídica", "Líder de área", "Administrador de clínica"].map((r) => `<option>${r}</option>`).join("")}</select></label>
        <button class="btn" data-action="add-user">Agregar usuario</button></div></div>
      <h2 class="section-title">Qué puede hacer cada rol</h2>
      <div class="table-wrap"><table><thead><tr><th>Rol</th><th>Puede</th></tr></thead><tbody>
      ${D.roles.map((r) => `<tr><td><b>${esc(r.nombre)}</b></td><td>${esc(r.desc)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  /* --- Indicadores --- */
  const barRow = (label, v, max, cls) => `<div class="bar-row"><span>${esc(label)}</span><div class="bar-track"><i class="${cls || ""}" style="width:${max ? Math.round((v / max) * 100) : 0}%"></i></div><b class="num">${v}</b></div>`;
  function renderIndicadores() {
    const cs = clinicCases();
    const act = cs.filter((c) => c.estado !== "Respondido");
    const venc = act.filter((c) => c.horas != null && c.horas < 0).length;
    const corr = cs.filter((c) => c.corregido).length;
    const prox = act.filter((c) => c.horas != null && c.horas >= 0).map((c) => c.horas).sort((a, b) => a - b)[0];
    const colors = ["ROJO", "GRIS", "AMARILLO", "VERDE"].map((s) => [s, act.filter((c) => c.semaforo === s).length]);
    const areas = {}; act.forEach((c) => { areas[c.area] = (areas[c.area] || 0) + 1; });
    const buckets = [["Vencidos", (c) => c.horas != null && c.horas < 0], ["0 a 12 h", (c) => c.horas != null && c.horas >= 0 && c.horas <= 12], ["12 a 24 h", (c) => c.horas > 12 && c.horas <= 24], ["24 a 48 h", (c) => c.horas > 24 && c.horas <= 48], ["Más de 48 h", (c) => c.horas > 48], ["Sin plazo legible", (c) => c.horas == null]]
      .map(([l, fn]) => [l, act.filter(fn).length]);
    return `${crumbs("Inicio", "Indicadores")}
      <div class="page-head"><div><h1>Indicadores de la clínica</h1><p>${esc(clinicName(S.clinica))}. Se calculan con los casos de la demo y cambian cuando validas o corriges.</p></div></div>
      ${noteBox()}
      <div class="kpis">
        <div class="kpi"><b>${act.length}</b><span>Casos activos</span></div>
        <div class="kpi"><b style="color:${venc ? "var(--red)" : "var(--blue)"}">${venc}</b><span>Con plazo aparentemente vencido</span></div>
        <div class="kpi"><b>${prox != null ? prox + " h" : "—"}</b><span>Hasta el próximo plazo</span></div>
        <div class="kpi"><b>${cs.length ? Math.round((corr / cs.length) * 100) : 0} %</b><span>Clasificaciones corregidas (${corr} de ${cs.length})</span></div>
      </div>
      <div class="grid-2">
        <div class="card"><h3 style="margin-bottom:12px">Casos activos por color</h3><div class="bars">${colors.map(([s, n]) => barRow(s, n, Math.max(...colors.map((x) => x[1]), 1), s)).join("")}</div></div>
        <div class="card" style="margin-top:0"><h3 style="margin-bottom:12px">Carga por área</h3><div class="bars">${Object.entries(areas).sort((a, b) => b[1] - a[1]).map(([a, n]) => barRow(a, n, Math.max(...Object.values(areas), 1))).join("")}</div></div>
      </div>
      <div class="card"><h3 style="margin-bottom:12px">Horas restantes de los casos activos</h3><div class="bars">${buckets.map(([l, n]) => barRow(l, n, Math.max(...buckets.map((x) => x[1]), 1), l === "Vencidos" ? "ROJO" : "")).join("")}</div></div>`;
  }

  /* --- Red --- */
  function renderRed() {
    const t = D.red.reduce((a, r) => ({ casos: a.casos + r.casos, rojo: a.rojo + r.rojo, gris: a.gris + r.gris, venc: a.venc + r.vencimientos }), { casos: 0, rojo: 0, gris: 0, venc: 0 });
    const max = Math.max(...D.red.map((r) => r.casos));
    return `${crumbs("Inicio", "Vista de la red")}
      <div class="page-head"><div><h1>Vista de la red</h1><p>Indicadores consolidados del último mes. Cifras ficticias.</p></div><span class="tag blue">Sin acceso a casos individuales</span></div>
      ${noteBox()}
      <div class="kpis">
        <div class="kpi"><b>${t.casos}</b><span>Casos en el mes</span></div>
        <div class="kpi"><b>${Math.round((t.rojo / t.casos) * 100)} %</b><span>Casos en ROJO</span></div>
        <div class="kpi"><b>${t.gris}</b><span>Casos que pasaron por revisión GRIS</span></div>
        <div class="kpi"><b style="color:var(--red)">${t.venc}</b><span>Plazos vencidos</span></div>
      </div>
      <div class="table-wrap"><table><thead><tr><th>Clínica</th><th>Casos</th><th>ROJO</th><th>GRIS</th><th>Corregidas</th><th>Vencidos</th><th>Horas medianas al direccionar</th></tr></thead><tbody>
      ${D.red.map((r) => `<tr><td><b>${esc(r.clinica)}</b></td><td class="num">${r.casos}</td><td class="num">${r.rojo}</td><td class="num">${r.gris}</td><td class="num">${r.corregidas} %</td><td class="num">${r.vencimientos}</td><td class="num">${r.horas} h</td></tr>`).join("")}</tbody></table></div>
      <div class="card"><h3 style="margin-bottom:12px">Casos por clínica</h3><div class="bars">${D.red.map((r) => barRow(r.clinica.replace("Clínica ", ""), r.casos, max)).join("")}</div></div>`;
  }

  /* --- Auditoría --- */
  function renderAuditoria() {
    return `${crumbs("Inicio", "Auditoría")}
      <div class="page-head"><div><h1>Auditoría</h1><p>Registro de quién vio, cambió o validó cada caso. Las acciones que hagas en la demo aparecen aquí.</p></div></div>
      ${noteBox()}
      <div class="table-wrap"><table><thead><tr><th>Hora</th><th>Quién</th><th>Acción</th><th>Caso</th><th>Detalle</th></tr></thead><tbody>
      ${S.log.map((l) => `<tr class="audit-row"><td>${esc(l.t)}</td><td>${esc(l.who)}</td><td><b>${esc(l.accion)}</b></td><td>${esc(l.caso)}</td><td>${esc(l.detalle)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  /* --- Notificaciones --- */
  function renderNotificaciones() {
    const n = notifs();
    return `${crumbs("Inicio", "Notificaciones")}
      <div class="page-head"><div><h1>Notificaciones</h1><p>Alertas para tu rol en ${esc(clinicName(S.clinica))}.</p></div></div>
      ${noteBox()}
      ${n.length ? n.map((x) => `<div class="notif">${semChip(x.tipo === "GRIS" ? "GRIS" : x.tipo)}<div class="grow"><b>${esc(x.id)}</b> · ${esc(x.texto)}<small>Aviso enviado también por correo</small></div>
        <button class="btn small outline" data-action="${x.tipo === "GRIS" && S.rol !== "lider" ? "go-gris" : "open-case"}" data-id="${x.id}">Abrir</button></div>`).join("") : `<div class="card empty">No tienes notificaciones pendientes.</div>`}`;
  }

  const VIEWS = { bandeja: renderBandeja, detalle: renderDetalle, gris: renderGris, miscasos: renderMisCasos, config: renderConfig, usuarios: renderUsuarios, indicadores: renderIndicadores, red: renderRed, auditoria: renderAuditoria, notificaciones: renderNotificaciones };

  function renderGuide() {
    const g = $("#guide");
    const s = STEPS[S.guideStep];
    const last = S.guideStep === STEPS.length - 1;
    if (S.guideMin) {
      g.innerHTML = `<div class="guide min"><div class="guide-body"><small>Recorrido guiado · paso ${S.guideStep + 1} de ${STEPS.length}</small></div><div class="guide-nav"><button class="btn small" data-action="guide-toggle">Mostrar guía</button></div></div>`;
      return;
    }
    g.innerHTML = `<div class="guide" role="region" aria-label="Recorrido guiado">
      <div class="guide-step" aria-hidden="true">${S.guideStep + 1}</div>
      <div class="guide-body"><small>Recorrido guiado · paso ${S.guideStep + 1} de ${STEPS.length}</small><b>${esc(s.title)}</b><p>${esc(s.text)}</p></div>
      <div class="dots" aria-hidden="true">${STEPS.map((_, i) => `<i class="${i === S.guideStep ? "on" : i < S.guideStep ? "done" : ""}"></i>`).join("")}</div>
      <div class="guide-nav">
        <button class="btn ghost small" data-action="guide-prev" ${S.guideStep === 0 ? "disabled" : ""}>← Anterior</button>
        <button class="btn small" data-action="${last ? "guide-restart" : "guide-next"}">${last ? "Volver al inicio" : "Siguiente →"}</button>
        <button class="btn ghost small" data-action="notes-toggle">${S.notes ? "Ocultar notas" : "Mostrar notas"}</button>
        <button class="btn ghost small" data-action="guide-toggle">Minimizar</button>
        <button class="btn ghost small" data-action="reset-demo" title="Devuelve todos los casos a su estado inicial">Reiniciar demo</button>
      </div></div>`;
  }

  function render() {
    document.documentElement.style.fontSize = 16 + S.font * 1.5 + "px";
    renderHeader();
    const app = $("#app");
    if (!S.rol || S.route === "login") app.innerHTML = renderLogin();
    else app.innerHTML = renderShell((VIEWS[S.route] || renderBandeja)());
    renderGuide();
    save();
  }

  /* ---------- Modales y avisos ---------- */
  const closeModal = () => { $("#overlay").innerHTML = ""; };
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }
  function modal(title, body) {
    $("#overlay").innerHTML = `<div class="modal-back" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" onclick="event.stopPropagation()"><h2>${esc(title)}</h2>${body}</div></div>`;
    const f = $("#overlay select, #overlay textarea, #overlay button"); if (f) f.focus();
  }
  const areaOptions = (sel) => D.areas.map((a) => `<option ${a.id === sel ? "selected" : ""}>${esc(a.id)}</option>`).join("");

  /* ---------- Acciones ---------- */
  function flashEv(id) {
    const marks = document.querySelectorAll(`mark.ev[data-ev="${id}"]`);
    if (!marks.length) return;
    marks[0].scrollIntoView({ block: "center", behavior: "smooth" });
    marks.forEach((m) => { m.classList.add("flash"); setTimeout(() => m.classList.remove("flash"), 1800); });
  }
  const resolveGris = (c, estado, texto, extra) => {
    c.estado = estado; addHist(c, texto); logAct("Resolvió caso en GRIS", c.id, texto); if (extra) extra(); toast(texto);
  };

  const ACTIONS = {
    login() {
      S.clinica = $("#login-clinica").value; S.rol = $("#login-rol").value; S.route = LANDING[S.rol];
      S.guideStep = Math.max(S.guideStep, 1); logAct("Inicio de sesión", null, roleName(S.rol));
      render(); window.scrollTo({ top: 0 });
    },
    logout() { S.rol = null; S.route = "login"; S.guideStep = 0; render(); },
    home() { if (S.rol) { S.route = LANDING[S.rol]; render(); } },
    menu() { S.menuOpen = !S.menuOpen; render(); },
    "font+"() { S.font = Math.min(3, S.font + 1); render(); },
    "font-"() { S.font = Math.max(-2, S.font - 1); render(); },
    go(el) { S.route = el.dataset.route; S.menuOpen = false; render(); window.scrollTo({ top: 0 }); },
    "open-case"(el) { S.caseId = el.dataset.id; S.route = "detalle"; render(); window.scrollTo({ top: 0 }); },
    "go-gris"(el) { S.grisId = el.dataset.id; S.route = "gris"; render(); window.scrollTo({ top: 0 }); },
    ev(el) { flashEv(el.dataset.ev); },
    "scroll-validate"() { const v = $("#validar"); if (v) v.scrollIntoView({ block: "center", behavior: "smooth" }); },
    "confirm-case"() {
      const c = getCase(S.caseId); c.estado = "Asignado"; c.validado_por = roleName(S.rol);
      addHist(c, `Confirmó y asignó a ${c.area}`); logAct("Confirmó clasificación", c.id, `Asignado a ${c.area}`);
      render(); toast(`Caso ${c.id} confirmado y enviado a ${c.area}`);
    },
    "open-correct"() {
      const c = getCase(S.caseId);
      modal("Corregir la clasificación", `<p style="margin-bottom:12px;color:var(--muted)">La corrección queda registrada y ayuda a mejorar las reglas.</p>
        <label class="field">Semáforo<select id="m-sem">${["ROJO", "AMARILLO", "VERDE", "GRIS"].map((s) => `<option ${s === c.semaforo ? "selected" : ""}>${s}</option>`).join("")}</select></label>
        <label class="field">Área<select id="m-area">${areaOptions(c.area)}</select></label>
        <label class="field">Motivo de la corrección<textarea id="m-motivo" placeholder="Ej.: el plazo real es menor al que extrajo el sistema"></textarea></label>
        <div class="btn-row"><button class="btn" data-action="apply-correct">Guardar corrección</button><button class="btn outline" data-action="close-modal">Cancelar</button></div>`);
    },
    "apply-correct"() {
      const c = getCase(S.caseId); const sem = $("#m-sem").value, area = $("#m-area").value, mot = $("#m-motivo").value.trim();
      const detalle = `${c.semaforo} → ${sem}${area !== c.area ? `; área ${c.area} → ${area}` : ""}${mot ? ". " + mot : ""}`;
      c.semaforo = sem; c.area = area; c.regla = "Manual"; c.corregido = true;
      addHist(c, "Corrigió la clasificación: " + detalle); logAct("Corrigió clasificación", c.id, detalle);
      closeModal(); render(); toast("Corrección guardada");
    },
    "open-reassign"() {
      const c = getCase(S.caseId);
      modal("Reasignar el caso", `<label class="field">Nueva área<select id="m-area">${areaOptions(c.area)}</select></label>
        <div class="btn-row"><button class="btn" data-action="apply-reassign">Reasignar</button><button class="btn outline" data-action="close-modal">Cancelar</button></div>`);
    },
    "apply-reassign"() {
      const c = getCase(S.caseId); const area = $("#m-area").value; const prev = c.area; c.area = area;
      addHist(c, `Reasignó de ${prev} a ${area}`); logAct("Reasignó caso", c.id, `${prev} → ${area}`);
      closeModal(); render(); toast(`Caso reasignado a ${area}`);
    },
    "close-modal"() { closeModal(); },
    "gris-select"(el) { S.grisId = el.dataset.id; render(); },
    "gris-link"() {
      const c = getCase(S.grisId);
      resolveGris(c, "Vinculado", `Vinculado como duplicado de ${c.duplicado_de}; se conserva la traza de ambos ingresos`, () => { c.area = getCase(c.duplicado_de).area; });
      render();
    },
    "gris-notdup"() {
      const c = getCase(S.grisId);
      resolveGris(c, "En validación", "Marcado como caso distinto; pasa a la bandeja como ROJO", () => { c.semaforo = "ROJO"; c.regla = "Manual"; c.corregido = true; });
      render();
    },
    "gris-comp-area"() {
      const c = getCase(S.grisId); const a = $("#gris-area").value;
      resolveGris(c, "Asignado", `Confirmado como competencia de la clínica y asignado a ${a}`, () => { c.area = a; c.semaforo = c.horas <= S.umbral ? "AMARILLO" : "VERDE"; c.regla = "Manual"; c.corregido = true; });
      render();
    },
    "gris-juridica"() { const c = getCase(S.grisId); resolveGris(c, "En revisión jurídica", "Enviado a Jurídica para decidir la competencia"); render(); },
    "gris-manual"() { const c = getCase(S.grisId); resolveGris(c, "Captura manual", "Se abrió la captura manual de los datos del documento"); render(); },
    "gris-request"() { const c = getCase(S.grisId); resolveGris(c, "Documento solicitado", "Se solicitó el documento completo al despacho o a quien lo envió"); render(); },
    "case-status"(el) {
      const c = getCase(el.dataset.id); c.estado = el.dataset.status;
      addHist(c, c.estado === "Respondido" ? "El líder de área marcó la respuesta como enviada" : "El líder de área marcó el caso en gestión");
      logAct("Actualizó estado", c.id, c.estado); render(); toast(`Caso ${c.id}: ${c.estado}`);
    },
    "save-umbral"() {
      const v = Math.max(1, Math.min(96, parseInt($("#umbral").value, 10) || 24));
      const prev = S.umbral; S.umbral = v; applyUmbral(v);
      logAct("Cambió el umbral del semáforo", null, `${prev} h → ${v} h`); render();
      toast(`Umbral guardado: ${v} h. Los colores de la bandeja se actualizaron`);
    },
    "add-user"() {
      const n = $("#u-nombre").value.trim(), m = $("#u-correo").value.trim();
      if (!n || !m) { toast("Escribe un nombre y un correo"); return; }
      S.usuarios.push({ nombre: n, correo: m, rol: $("#u-rol").value, estado: "Activo" });
      logAct("Alta de usuario", null, $("#u-rol").value); render(); toast("Usuario agregado");
    },
    "guide-next"() { goStep(S.guideStep + 1); },
    "guide-prev"() { goStep(S.guideStep - 1); },
    "guide-restart"() { goStep(0); },
    "guide-toggle"() { S.guideMin = !S.guideMin; render(); },
    "notes-toggle"() { S.notes = !S.notes; render(); },
    "reset-demo"() { const keep = { notes: S.notes, font: S.font }; S = Object.assign(fresh(), keep); seedHistory(); render(); toast("Demo reiniciada"); window.scrollTo({ top: 0 }); },
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const fn = ACTIONS[el.dataset.action];
    if (fn) { if (el.tagName === "A") e.preventDefault(); fn(el); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("tr.row-link")) { e.preventDefault(); ACTIONS["open-case"](e.target); }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.filter) { S.filters[t.dataset.filter] = t.value; const r = $("#bandeja-results"); if (r) r.innerHTML = bandejaTable(); save(); }
    else if (t.dataset.actionChange === "clinica") { S.clinica = t.value; S.caseId = null; S.grisId = null; S.filters = { color: "", area: "", estado: "" }; render(); toast(`Ahora ves solo los datos de ${clinicName(S.clinica)}`); }
    else if (t.id === "login-rol") { const r = D.roles.find((x) => x.id === t.value); $("#role-hint").textContent = r ? r.desc : ""; }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "umbral") {
      const v = Math.max(1, Math.min(96, parseInt(e.target.value, 10) || 1)); const pv = umbralPreview(v);
      $("#umbral-preview").innerHTML = `Con <b>${v} h</b>: <b>${pv.am}</b> casos quedarían en AMARILLO y <b>${pv.ve}</b> en VERDE.`;
    }
  });

  /* ---------- Inicio ---------- */
  const saved = load();
  if (saved) S = saved;
  S.v = 1;
  seedHistory();
  render();
})();
