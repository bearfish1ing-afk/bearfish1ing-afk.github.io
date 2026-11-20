/* 화면 그리기 + 스크롤 효과 (손대지 않아도 됩니다) */
(function () {
  var data = window.PORTFOLIO;
  var app = document.getElementById("app");
  if (!data || !app) {
    app.innerHTML = "<p style='padding:40px'>data/portfolio.js 를 불러오지 못했습니다. 문법 오류(쉼표, 따옴표)를 확인하세요.</p>";
    return;
  }
  document.title = data.profile.name + " · " + data.profile.role + " 포트폴리오";
  app.innerHTML = window.renderPortfolio(data);

  // 스크롤 등장 효과
  var targets = document.querySelectorAll(".info, .about-text, .way, .skill, .project, .t-item");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  // 현재 섹션 메뉴 강조
  var links = document.querySelectorAll(".nav-links a");
  var sections = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute("href")); });
  var navEl = document.querySelector(".nav");
  var onScroll = function () {
    if (navEl) navEl.classList.toggle("scrolled", window.scrollY > 40);
    var y = window.scrollY + 140, idx = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) idx = i; });
    links.forEach(function (a, i) { a.classList.toggle("active", i === idx); });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
