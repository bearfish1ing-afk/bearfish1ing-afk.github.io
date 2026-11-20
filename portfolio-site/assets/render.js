/* =====================================================================
 *  render.js — data/portfolio.js 의 내용을 HTML 로 바꾸는 규칙 모음
 *  (내용 수정은 data/portfolio.js 에서만 하세요. 이 파일은 손대지 않아도 됩니다.)
 * ===================================================================== */
(function (root) {
  "use strict";

  /* ---------- 공통 규칙 ---------- */
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var rich = function (s) { // **굵게**, `코드`
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  };
  var has = function (v) { // 규칙 1: 빈 값·{자리표시} 숨김
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    var t = String(v).trim();
    return t !== "" && !/^\{.*\}$/.test(t);
  };
  var map = function (arr, fn) { return (arr || []).map(fn).join(""); };
  var OPTS = { openDetails: false };

  /* ---------- 아이콘 (선 아이콘, 직접 그림) ---------- */
  var SVG = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    github: '<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    badge: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    arrow: '<path d="M7 17L17 7M8 7h9v9"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  };
  var svg = function (name, cls) {
    return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (SVG[name] || SVG.pin) + "</svg>";
  };
  var mark = '<span class="mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

  var linkify = function (v) {
    var t = String(v);
    if (/^https?:\/\//.test(t)) return '<a href="' + esc(t) + '" target="_blank" rel="noopener">' + esc(t.replace(/^https?:\/\//, "")) + "</a>";
    if (/@/.test(t)) return '<a href="mailto:' + esc(t) + '">' + esc(t) + "</a>";
    return rich(t);
  };
  var linkBtn = function (l) {
    if (!has(l.label)) return "";
    if (!has(l.url)) return '<span class="btn btn-ghost is-off">' + esc(l.label) + "</span>";
    return '<a class="btn btn-ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + svg("arrow") + "</a>";
  };
  var tags = function (arr, cls) {
    return has(arr) ? '<ul class="tags ' + (cls || "") + '">' + map(arr, function (s) { return "<li>" + esc(s) + "</li>"; }) + "</ul>" : "";
  };

  /* ---------- 블록 규칙 (규칙 4) ---------- */
  var BLOCKS = {
    list: function (b) {
      return '<ul class="b-list">' + map(b.items, function (i) { return has(i) ? "<li>" + rich(i) + "</li>" : ""; }) + "</ul>";
    },
    steps: function (b) {
      return '<ol class="b-steps">' + map(b.items, function (i, k) {
        return has(i) ? '<li><span class="step-no">' + (k + 1) + "</span><span>" + rich(i) + "</span></li>" : "";
      }) + "</ol>";
    },
    table: function (b) {
      return '<div class="table-wrap"><table class="b-table"><thead><tr>' +
        map(b.head, function (h) { return "<th>" + esc(h) + "</th>"; }) + "</tr></thead><tbody>" +
        map(b.rows, function (r) { return "<tr>" + map(r, function (c) { return "<td>" + rich(c) + "</td>"; }) + "</tr>"; }) +
        "</tbody></table></div>";
    },
    trouble: function (b) {
      return '<div class="b-trouble">' + map(b.items, function (t, k) {
        return '<article class="trouble">' +
          '<h5 class="trouble-title"><span class="trouble-no">#' + (k + 1) + "</span>" + rich(t.title) + "</h5>" +
          '<dl class="trouble-steps">' + map(t.steps, function (s) {
            if (!has(s[1])) return "";
            var tone = /해결/.test(s[0]) ? "ok" : /원인|재발/.test(s[0]) ? "warn" : "base";
            return '<div class="t-row"><dt class="tag tag-' + tone + '">' + esc(s[0]) + "</dt><dd>" + rich(s[1]) + "</dd></div>";
          }) + "</dl></article>";
      }) + "</div>";
    },
    quote: function (b) {
      return '<div class="b-quote">' + map(b.items, function (i) { return has(i) ? "<p>" + rich(i) + "</p>" : ""; }) + "</div>";
    },
  };
  var block = function (b) {
    var fn = BLOCKS[b.type] || BLOCKS.list;
    return '<section class="block block-' + esc(b.type) + '"><h4 class="block-title">' + esc(b.title) + "</h4>" + fn(b) + "</section>";
  };
  var findBlock = function (p, title) {
    return (p.blocks || []).filter(function (b) { return b.title === title; })[0];
  };

  /* ---------- 섹션 공통 머리 ---------- */
  function head(id, en, ko, desc) {
    return '<header class="sec-head">' + mark +
      '<p class="sec-en">' + esc(en) + "</p>" +
      '<h2 class="sec-title" id="' + id + '-title">' + esc(ko) + "</h2>" +
      (desc ? '<p class="sec-desc">' + esc(desc) + "</p>" : "") + "</header>";
  }

  /* ---------- 네비 ---------- */
  function nav(d) {
    var items = (d.sections || []).filter(function (x) { return has(x.nav); });
    return '<nav class="nav" aria-label="섹션 이동"><div class="nav-inner">' +
      '<a class="nav-brand" href="#top">' + esc(d.profile.name) + "<span>'s Portfolio</span></a>" +
      '<ul class="nav-links">' + map(items, function (n) {
        return '<li><a href="#' + esc(n.id) + '">' + esc(n.nav) + "</a></li>";
      }) + '<li><a href="#contact">연락</a></li></ul></div></nav>';
  }

  /* ---------- 히어로 ---------- */
  function hero(p) {
    return '<header class="hero" id="top"><div class="hero-inner">' +
      '<div class="hero-copy">' +
      (has(p.heroLabel) ? '<p class="hero-label">' + esc(p.heroLabel) + "</p>" : "") +
      '<h1 class="hero-title">' + rich(p.greeting).replace(/\\n|\n/g, "<br>") + "</h1>" +
      (has(p.intro) ? '<p class="hero-intro">' + rich(p.intro) + "</p>" : "") +
      '<a class="btn btn-white" href="#about">더 알아보기' + svg("down") + "</a>" +
      "</div>" +
      '<span class="sparkle s1"></span><span class="sparkle s2"></span><span class="sparkle s3"></span><span class="sparkle s4"></span>' +
      "</div></header>";
  }

  /* ---------- About ---------- */
  function open(sec, tint) {
    return '<section class="section' + (tint ? " section-tint" : "") + '" id="' + esc(sec.id) + '" aria-labelledby="' + esc(sec.id) + '-title"><div class="wrap">' +
      head(sec.id, sec.en, sec.title, sec.desc);
  }
  var close = "</div></section>";

  function about(a, p, sec, tint) {
    var dept = has(p.department) ? p.department : "";
    var fill = function (t) { return String(t).replace(/\{학과\}/g, dept).replace(/ {2,}/g, " ").trim(); };
    var info = (p.info || []).map(function (r) { return [r[0], fill(r[1]), r[2]]; }).filter(function (r) { return has(r[1]); });
    return open(sec, tint) +
      (info.length ? '<ul class="info-grid">' + map(info, function (r) {
        return '<li class="info"><span class="info-ico">' + svg(r[2]) + "</span>" +
          '<div><p class="info-label">' + esc(r[0]) + '</p><p class="info-value">' + linkify(r[1]) + "</p></div></li>";
      }) + "</ul>" : "") +
      (a && has(a.text) ? '<div class="about-text">' + map(a.text, function (t) { return has(t) ? "<p>" + rich(fill(t)) + "</p>" : ""; }) + "</div>" : "") +
      (a && has(a.ways) ? '<h3 class="sub-title">' + esc(a.waysTitle || "") + "</h3>" +
        '<div class="ways">' + map(a.ways, function (w, i) {
          return '<article class="way card">' +
            '<span class="pill">0' + (i + 1) + "</span>" +
            '<h4 class="way-name">' + rich(w.title) + "</h4>" +
            '<p class="way-text">' + rich(w.text) + "</p></article>";
        }) + "</div>" : "") +
      "</div></section>";
  }

  /* ---------- Skills ---------- */
  function skills(list, sec, tint) {
    if (!has(list)) return "";
    var letters = "ABCDEFG";
    return open(sec, tint) +
      '<div class="skills">' + map(list, function (s, i) {
        return '<article class="skill card">' +
          '<div class="skill-head"><span class="letter" aria-hidden="true">' + letters[i] + "</span>" +
          '<div><h3 class="skill-level">' + esc(s.level) + "</h3>" +
          (has(s.desc) ? '<p class="skill-desc">' + rich(s.desc) + "</p>" : "") + "</div></div>" +
          tags(s.items, "tags-strong") + "</article>";
      }) + "</div></div></section>";
  }

  /* ---------- 프로젝트 카드 (CDG 스타일: 왼쪽 요약 패널 + 오른쪽 정보) ---------- */
  function projectCard(p, num, kind) {
    var roles = findBlock(p, "나의 역할");
    var rest = (p.blocks || []).filter(function (b) { return b !== roles; });
    var meta = (p.meta || []).filter(function (m) { return has(m[1]); });
    var links = (p.links || []).filter(function (l) { return has(l.label); });
    return '<article class="project card" id="' + kind + "-" + esc(p.id) + '">' +
      '<header class="project-head">' +
      (num ? '<span class="project-num">' + String(num).padStart(2, "0") + "</span>" : "") +
      '<h3 class="project-title">' + esc(p.title) + (has(p.badge) ? ' <span class="badge">' + esc(p.badge) + "</span>" : "") + "</h3>" +
      (has(p.subtitle) ? '<p class="project-sub">' + esc(p.subtitle) + "</p>" : "") +
      (meta.length ? '<p class="project-meta">' + meta.map(function (m) { return "<span>" + rich(m[1]) + "</span>"; }).join("") + "</p>" : "") +
      "</header>" +
      '<div class="project-body">' +
      // 왼쪽: 그라데이션 패널 (요약 + Problem/Solution)
      '<div class="panel">' +
      '<span class="panel-orb panel-' + esc(p.icon || "orb") + '" aria-hidden="true"></span>' +
      (has(p.summary) ? '<p class="panel-summary">' + rich(p.summary) + "</p>" : "") +
      (has(p.pain) ? '<div class="panel-note"><span class="note-label">Problem</span><p>' + rich(p.pain) + "</p></div>" : "") +
      (has(p.need) ? '<div class="panel-note"><span class="note-label">Solution</span><p>' + rich(p.need) + "</p></div>" : "") +
      "</div>" +
      // 오른쪽: 역할 + 정보 행
      '<div class="project-info">' +
      (roles ? '<h4 class="info-title">' + esc(roles.title) + "</h4>" + BLOCKS.list(roles) : "") +
      '<dl class="kv">' +
      meta.map(function (m) { return '<div><dt>' + esc(m[0]) + "</dt><dd>" + rich(m[1]) + "</dd></div>"; }).join("") +
      (has(p.stack) ? "<div><dt>기술 스택</dt><dd>" + tags(p.stack) + "</dd></div>" : "") +
      "</dl>" +
      (links.length ? '<div class="links">' + map(links, linkBtn) + "</div>" : "") +
      "</div></div>" +
      // 상세 (펼치기)
      (rest.length ? '<details class="more"' + (OPTS.openDetails ? " open" : "") + ">" +
        '<summary><span class="more-open">상세 내용 보기</span><span class="more-close">상세 내용 접기</span>' + svg("down") + "</summary>" +
        '<div class="more-body">' + map(rest, block) + "</div></details>" : "") +
      "</article>";
  }

  function projects(list, sec, tint) {
    if (!has(list)) return "";
    return open(sec, tint) +
      '<div class="project-list">' + map(list, function (p, i) { return projectCard(p, i + 1, "project"); }) + "</div>" +
      "</div></section>";
  }

  /* ---------- 교육이수 ---------- */
  function eduCard(e) {
    var rows = (e.rows || []).filter(function (r) { return has(r[1]); });
    var links = (e.links || []).filter(function (l) { return has(l.label); });
    return '<article class="edu card" id="edu-' + esc(e.id) + '">' +
      '<header class="edu-head"><div><h3 class="edu-title">' + esc(e.title) + "</h3>" +
      (has(e.org) ? '<p class="edu-org">' + esc(e.org) + "</p>" : "") + "</div>" +
      (has(e.period) ? '<p class="edu-period">' + esc(e.period) + "</p>" : "") + "</header>" +
      (rows.length ? '<dl class="kv edu-kv">' + map(rows, function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + rich(r[1]) + "</dd></div>"; }) +
        (has(e.stack) ? "<div><dt>기술</dt><dd>" + tags(e.stack) + "</dd></div>" : "") + "</dl>" : "") +
      (links.length ? '<div class="links">' + map(links, linkBtn) + "</div>" : "") +
      (has(e.blocks) ? '<details class="more"' + (OPTS.openDetails ? " open" : "") + ">" +
        '<summary><span class="more-open">과제 상세 보기</span><span class="more-close">과제 상세 접기</span>' + svg("down") + "</summary>" +
        '<div class="more-body">' + map(e.blocks, block) + "</div></details>" : "") +
      "</article>";
  }
  function education(list, sec, tint) {
    if (!has(list)) return "";
    return open(sec, tint) + '<div class="edu-list">' + map(list, eduCard) + "</div>" + close;
  }

  /* ---------- 자격증 · 대외활동 · 수상 (같은 형식) ---------- */
  function records(list, sec, tint) {
    if (!has(list)) return "";
    return open(sec, tint) + '<ol class="timeline">' + map(list, function (h) {
      return '<li class="t-item card">' +
        '<div class="t-side"><span class="pill">' + esc(h.tag) + '</span><p class="t-date">' + esc(h.date) + "</p></div>" +
        '<div class="t-body"><h3>' + esc(h.title) + "</h3>" +
        (has(h.org) ? '<p class="t-org">' + rich(h.org) + "</p>" : "") +
        (has(h.notes) ? '<ul class="b-list">' + map(h.notes, function (n) { return "<li>" + rich(n) + "</li>"; }) + "</ul>" : "") +
        "</div></li>";
    }) + "</ol>" + close;
  }

  /* ---------- 마무리 ---------- */
  function footer(d) {
    var p = d.profile;
    var c = [
      has(p.email) ? '<a class="btn btn-white" href="mailto:' + esc(p.email) + '">' + svg("mail") + esc(p.email) + "</a>" : "",
      has(p.github) ? '<a class="btn btn-white" href="' + esc(p.github) + '" target="_blank" rel="noopener">' + svg("github") + "GitHub</a>" : "",
    ].join("");
    return '<section class="closing" id="contact" aria-labelledby="contact-title"><div class="wrap closing-inner">' +
      '<p class="hero-label">Contact</p>' +
      '<h2 class="closing-title" id="contact-title">' + esc(d.closing) + "</h2>" +
      (c ? '<div class="closing-actions">' + c + "</div>" : "") +
      "</div></section>" +
      '<footer class="footer"><div class="wrap footer-inner"><p>© 2026 ' + esc(p.name) + ". All rights reserved.</p>" +
      '<a class="to-top" href="#top" aria-label="맨 위로">' + svg("up") + "</a></div></footer>";
  }

  function renderPortfolio(d, opts) {
    OPTS = Object.assign({ openDetails: false }, opts || {});
    var body = map(d.sections, function (sec, i) {
      var tint = i % 2 === 1;  // 섹션 배경은 흰색/연보라가 번갈아 나옵니다
      switch (sec.id) {
        case "about": return about(d.about, d.profile, sec, tint);
        case "skills": return skills(d.skills, sec, tint);
        case "projects": return projects(d.projects, sec, tint);
        case "education": return education(d.education, sec, tint);
        default: return records(d[sec.id], sec, tint);  // certificates · activities · awards 등
      }
    });
    return nav(d) + hero(d.profile) + '<main class="main">' + body + "</main>" + footer(d);
  }

  root.renderPortfolio = renderPortfolio;
  if (typeof module !== "undefined") module.exports = renderPortfolio;
})(typeof window !== "undefined" ? window : globalThis);
