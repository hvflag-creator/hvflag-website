/* =============================================================================
 * HVFF Halloween 🎃  — October 2026 decorations.
 *
 * One plain script shared by FlagBucks (hvff-sportsbook.web.app) and
 * hvflag.com. Draws cobwebs, a dangling spider, pumpkins, a peeking skeleton,
 * drifting ghosts, and the occasional ghost carrying a FlagBucks coin.
 *
 *   HVFFHalloween.start({
 *     mode:     "app" | "site",
 *     tokenSrc: "/assets/logos/hvff-token.png",
 *     // app mode only:
 *     state:    () => ({ loggedIn: bool, remaining: number }),   // catches left
 *     onCatch:  async () => ({ granted, remaining }),            // throws on failure
 *   });
 *
 * It switches itself off after Oct 31 (local time), so nothing needs removing.
 * ============================================================================= */
(function () {
  "use strict";

  var START = new Date(2026, 9, 1);   // Oct 1
  var END   = new Date(2026, 10, 1);  // Nov 1 (exclusive)
  var started = false;

  // ── Art ────────────────────────────────────────────────────────────────────
  var GHOST_SVG =
    '<svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs><linearGradient id="hwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd6ee"/></linearGradient></defs>' +
    '<path d="M6 40C6 16 18 3 32 3s26 13 26 37v34l-8-8-9 10-9-10-9 10-9-10-8 8z" fill="url(#hwg)"/>' +
    '<ellipse cx="23" cy="33" rx="4.2" ry="6.2" fill="#14122b"/><ellipse cx="41" cy="33" rx="4.2" ry="6.2" fill="#14122b"/>' +
    '<ellipse cx="32" cy="49" rx="4.4" ry="6" fill="#14122b"/>' +
    '<ellipse cx="14" cy="45" rx="4" ry="2.4" fill="#ffb3c7" opacity=".55"/><ellipse cx="50" cy="45" rx="4" ry="2.4" fill="#ffb3c7" opacity=".55"/>' +
    '</svg>';

  var PUMPKIN_SVG =
    '<svg viewBox="0 0 100 92" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M50 18c-2-8 2-14 9-16-1 6-2 11-5 17z" fill="#4d7c0f"/>' +
    '<ellipse cx="29" cy="55" rx="25" ry="33" fill="#ea580c"/><ellipse cx="71" cy="55" rx="25" ry="33" fill="#ea580c"/>' +
    '<ellipse cx="50" cy="55" rx="27" ry="35" fill="#f97316"/><ellipse cx="39" cy="55" rx="14" ry="33" fill="#fb923c" opacity=".55"/>' +
    '<g class="hw-glow"><path d="M30 42l10 4-10 7z M70 42l-10 4 10 7z" fill="#fde047"/>' +
    '<path d="M46 56h8l-4 8z" fill="#fde047"/>' +
    '<path d="M28 68q22 18 44 0l-5-2-5 6-6-5-6 5-6-5-5 6z" fill="#fde047"/></g>' +
    '</svg>';

  var COBWEB_SVG =
    '<svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" stroke="#e8ecf6" stroke-width="1" stroke-linecap="round">' +
    '<path d="M0 0L130 0M0 0L120 45M0 0L92 92M0 0L45 120M0 0L0 130"/>' +
    '<path d="M0 30Q22 26 30 0M0 55Q38 46 55 0M0 82Q58 66 82 0M0 108Q76 86 108 0"/>' +
    '<path d="M30 0Q26 22 0 30"/>' +
    '</svg>';

  var SPIDER_SVG =
    '<svg viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M20 0v20" stroke="#e8ecf6" stroke-width="1"/>' +
    '<g stroke="#15131f" stroke-width="2" stroke-linecap="round" fill="none">' +
    '<path d="M16 28L4 22L2 32M16 31L3 33L4 44M17 34L8 44L10 50M17 26L8 18L12 14"/>' +
    '<path d="M24 28L36 22L38 32M24 31L37 33L36 44M23 34L32 44L30 50M23 26L32 18L28 14"/></g>' +
    '<ellipse cx="20" cy="31" rx="7.5" ry="9.5" fill="#15131f"/><circle cx="20" cy="22" r="5" fill="#15131f"/>' +
    '<circle cx="18" cy="21.5" r="1.1" fill="#f97316"/><circle cx="22" cy="21.5" r="1.1" fill="#f97316"/>' +
    '</svg>';

  var SKELETON_SVG =
    '<svg viewBox="0 0 150 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    // hands gripping the screen edge
    '<g fill="#e9e6da" stroke="#9a968a" stroke-width="1">' +
    '<rect x="6" y="52" width="8" height="26" rx="4"/><rect x="16" y="46" width="8" height="32" rx="4"/><rect x="26" y="50" width="8" height="28" rx="4"/><rect x="36" y="56" width="8" height="22" rx="4"/>' +
    '<rect x="106" y="56" width="8" height="22" rx="4"/><rect x="116" y="50" width="8" height="28" rx="4"/><rect x="126" y="46" width="8" height="32" rx="4"/><rect x="136" y="52" width="8" height="26" rx="4"/>' +
    '</g>' +
    // skull
    '<g stroke="#9a968a" stroke-width="1.2">' +
    '<path d="M42 44C42 18 56 4 75 4s33 14 33 40c0 8-3 12-9 15v12H51V59c-6-3-9-7-9-15z" fill="#f1eee2"/></g>' +
    '<ellipse cx="62" cy="38" rx="9" ry="10" fill="#12101c"/><ellipse cx="88" cy="38" rx="9" ry="10" fill="#12101c"/>' +
    '<circle class="hw-eye" cx="62" cy="39" r="2.6" fill="#f97316"/><circle class="hw-eye" cx="88" cy="39" r="2.6" fill="#f97316"/>' +
    '<path d="M75 48l-5 9h10z" fill="#12101c"/>' +
    '<path d="M58 66h34M64 66v10M70 66v10M76 66v10M82 66v10M88 66v10" stroke="#9a968a" stroke-width="1.2" fill="none"/>' +
    '</svg>';

  // ── Styles ─────────────────────────────────────────────────────────────────
  var CSS = [
    '#hw-decor,#hw-top,#hw-ghosts,#hw-vignette{position:fixed;inset:0;pointer-events:none}',
    '#hw-top{z-index:60;overflow:hidden}',
    '#hw-vignette{z-index:44;background:radial-gradient(70% 55% at 0% 0%,rgba(139,92,246,.16),transparent 70%),radial-gradient(70% 55% at 100% 0%,rgba(139,92,246,.12),transparent 70%),radial-gradient(80% 45% at 50% 100%,rgba(249,115,22,.14),transparent 75%)}',
    '#hw-decor{z-index:45;overflow:hidden}',
    '#hw-ghosts{z-index:150;overflow:hidden}',
    '.hw-web{position:absolute;top:0;width:clamp(90px,15vw,190px);opacity:.5}',
    '.hw-web.l{left:0}.hw-web.r{right:0;transform:scaleX(-1)}',
    '.hw-spider{position:absolute;top:0;width:clamp(26px,3.2vw,40px);transform-origin:50% 0;animation:hw-swing 4.2s ease-in-out infinite}',
    '.hw-pump{position:absolute;bottom:-4px;filter:drop-shadow(0 0 14px rgba(249,115,22,.55))}',
    '.hw-pump.big{left:8px;width:clamp(58px,8.5vw,108px)}',
    '.hw-pump.sm{left:calc(8px + clamp(58px,8.5vw,108px) - 8px);width:clamp(38px,5.2vw,64px);bottom:-2px}',
    '.hw-pump.rt{right:10px;width:clamp(54px,7.5vw,96px)}',
    '.hw-glow{animation:hw-flicker 3.6s infinite}',
    '.hw-skel{position:absolute;left:50%;bottom:0;width:clamp(96px,12vw,150px);margin-left:calc(clamp(96px,12vw,150px)/-2);animation:hw-peek 6s ease-in-out infinite}',
    '.hw-eye{animation:hw-flicker 2.4s infinite}',
    '.hw-ghost{position:absolute;left:0;will-change:transform}',
    '.hw-ghost>div{will-change:transform;animation:hw-bob 3.4s ease-in-out infinite}',
    '.hw-ghost svg{display:block;width:100%;height:auto;filter:drop-shadow(0 0 10px rgba(190,200,255,.55))}',
    '.hw-buck{pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.hw-buck svg{filter:drop-shadow(0 0 16px rgba(253,224,71,.8))}',
    '.hw-coin{position:absolute;left:50%;bottom:-8%;width:46%;margin-left:-23%;animation:hw-coin 1.8s ease-in-out infinite;filter:drop-shadow(0 0 8px rgba(253,224,71,.9))}',
    '.hw-pop{position:absolute;font:800 22px/1 system-ui,sans-serif;color:#fde047;text-shadow:0 2px 12px rgba(0,0,0,.8),0 0 14px rgba(249,115,22,.9);white-space:nowrap;pointer-events:none;animation:hw-rise 1.8s ease-out forwards}',
    '.hw-spark{position:absolute;width:10px;height:10px;border-radius:50%;background:#fde047;box-shadow:0 0 10px #f97316;pointer-events:none;animation:hw-spark .9s ease-out forwards}',
    '@keyframes hw-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-14px) rotate(3deg)}}',
    '@keyframes hw-coin{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-5px) rotate(6deg)}}',
    '@keyframes hw-swing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}',
    '@keyframes hw-flicker{0%,100%{opacity:1}42%{opacity:.82}46%{opacity:.5}50%{opacity:.95}78%{opacity:.88}}',
    '@keyframes hw-peek{0%,100%{transform:translateY(34%)}45%,60%{transform:translateY(8%)}}',
    '@keyframes hw-rise{0%{opacity:0;transform:translateY(8px) scale(.8)}15%{opacity:1;transform:translateY(0) scale(1.15)}100%{opacity:0;transform:translateY(-70px) scale(1)}}',
    '@keyframes hw-spark{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}}',
    '@media (max-width:700px){.hw-skel{display:none}.hw-pump.sm{display:none}}',
    '@media (prefers-reduced-motion:reduce){.hw-spider,.hw-skel,.hw-glow,.hw-eye{animation:none}.hw-skel{transform:translateY(20%)}}'
  ].join('\n');

  // ── Helpers ────────────────────────────────────────────────────────────────
  function rand(a, b) { return a + Math.random() * (b - a); }
  function div(cls, html) { var d = document.createElement("div"); if (cls) d.className = cls; if (html) d.innerHTML = html; return d; }
  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }

  // Float a ghost from off-screen left to off-screen right. Returns the element.
  function drift(layer, o) {
    var vw = window.innerWidth, size = o.size;
    var g = div("hw-ghost" + (o.cls ? " " + o.cls : ""));
    g.style.width = size + "px";
    g.style.top = o.top + "px";
    g.style.opacity = o.opacity == null ? 1 : o.opacity;
    var inner = div(null, GHOST_SVG);
    inner.style.animationDelay = (-rand(0, 3)) + "s";
    g.appendChild(inner);
    if (o.coin) {
      var c = document.createElement("img");
      c.className = "hw-coin"; c.src = o.coin; c.alt = ""; c.draggable = false;
      inner.appendChild(c);
      inner.style.position = "relative";
    }
    layer.appendChild(g);
    var fromX = o.dir > 0 ? -size - 20 : vw + 20, toX = o.dir > 0 ? vw + 20 : -size - 20;
    // Gentle vertical wander on top of the CSS bob.
    var wob = rand(20, 60);
    var anim = g.animate([
      { transform: "translate(" + fromX + "px,0)" },
      { transform: "translate(" + (fromX + (toX - fromX) * .5) + "px," + wob + "px)", offset: .5 },
      { transform: "translate(" + toX + "px,0)" }
    ], { duration: o.duration * 1000, easing: "linear", fill: "forwards" });
    anim.onfinish = function () { if (g.parentNode) g.remove(); if (o.done) o.done(false); };
    return { el: g, anim: anim };
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  function start(opts) {
    opts = opts || {};
    var now = new Date();
    if (started || now < START || now >= END) return;
    started = true;

    var style = document.createElement("style");
    style.id = "hw-style"; style.textContent = CSS;
    document.head.appendChild(style);

    var vignette = div(); vignette.id = "hw-vignette";
    var decor = div(); decor.id = "hw-decor";
    var layer = div(); layer.id = "hw-ghosts";

    // Webs + spiders sit above the sticky header; pumpkins/skeleton stay under bet slips & modals.
    var top = div(); top.id = "hw-top";
    top.appendChild(div("hw-web l", COBWEB_SVG));
    top.appendChild(div("hw-web r", COBWEB_SVG));
    var sp1 = div("hw-spider", SPIDER_SVG); sp1.style.left = "min(18vw, 220px)"; top.appendChild(sp1);
    var sp2 = div("hw-spider", SPIDER_SVG); sp2.style.right = "min(12vw, 150px)"; sp2.style.animationDelay = "-2s"; sp2.style.width = "clamp(20px,2.4vw,30px)"; top.appendChild(sp2);
    decor.appendChild(div("hw-pump big", PUMPKIN_SVG));
    decor.appendChild(div("hw-pump sm", PUMPKIN_SVG));
    decor.appendChild(div("hw-pump rt", PUMPKIN_SVG));
    decor.appendChild(div("hw-skel", SKELETON_SVG));

    document.body.appendChild(vignette);
    document.body.appendChild(decor);
    document.body.appendChild(top);
    document.body.appendChild(layer);

    if (reduced()) return; // static decorations only

    // Ambient ghosts: always a few floating, never clickable.
    function ambient() {
      if (document.hidden) { setTimeout(ambient, 4000); return; }
      drift(layer, {
        size: rand(46, 92), top: rand(70, Math.max(120, window.innerHeight - 160)),
        opacity: rand(0.22, 0.42), dir: Math.random() < .5 ? 1 : -1,
        duration: rand(32, 60), done: function () { setTimeout(ambient, rand(1500, 9000)); }
      });
    }
    for (var i = 0; i < 3; i++) setTimeout(ambient, i * 5500 + 800);

    // Ghosts carrying FlagBucks.
    var carrying = false;
    function canCarry() {
      if (opts.mode === "site") return true;
      var s = opts.state ? opts.state() : null;
      return !!(s && s.loggedIn && s.remaining > 0);
    }
    function scheduleBuck(delay) {
      setTimeout(function () {
        if (document.hidden || carrying || !canCarry()) { scheduleBuck(rand(15000, 30000)); return; }
        spawnBuck();
      }, delay);
    }
    function spawnBuck() {
      carrying = true;
      var size = Math.min(110, Math.max(78, window.innerWidth * 0.09));
      var dir = Math.random() < .5 ? 1 : -1;
      var h = drift(layer, {
        size: size, top: rand(110, Math.max(160, window.innerHeight * 0.6)), opacity: 1, dir: dir,
        duration: rand(13, 17), cls: "hw-buck", coin: opts.tokenSrc,
        done: function () { carrying = false; scheduleBuck(rand(35000, 70000)); }
      });
      var busy = false;
      h.el.title = "Catch me!";
      h.el.addEventListener("click", function (ev) {
        ev.stopPropagation();
        if (busy) return; busy = true;
        var r = h.el.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        h.anim.cancel(); h.el.style.transform = "translate(" + r.left + "px,0)";
        h.el.style.top = r.top + "px";
        h.el.style.pointerEvents = "none";
        burst(cx, cy);
        function finish(text, good) {
          pop(cx, cy, text, good);
          h.el.style.transition = "opacity .35s, transform .35s";
          h.el.style.opacity = "0";
          setTimeout(function () { if (h.el.parentNode) h.el.remove(); carrying = false; scheduleBuck(rand(35000, 70000)); }, 400);
        }
        if (opts.mode === "site") {
          finish("Boo! You caught a ghost! 👻", true);   // just for fun — no redirect
          return;
        }
        Promise.resolve(opts.onCatch ? opts.onCatch() : null).then(function (res) {
          var left = res && typeof res.remaining === "number" ? res.remaining : 0;
          finish("+" + (res && res.granted || 10) + " FlagBucks!" + (left > 0 ? "  (" + left + " left)" : "  (that's all 3!)"), true);
        }).catch(function (e) {
          finish((e && e.message) || "The ghost got away…", false);
        });
      });
    }
    function burst(x, y) {
      for (var k = 0; k < 14; k++) {
        var s = div("hw-spark");
        var ang = (k / 14) * Math.PI * 2, d = rand(40, 110);
        s.style.left = x + "px"; s.style.top = y + "px";
        s.style.setProperty("--dx", Math.cos(ang) * d + "px"); s.style.setProperty("--dy", Math.sin(ang) * d + "px");
        layer.appendChild(s); setTimeout(function (el) { return function () { el.remove(); }; }(s), 950);
      }
    }
    function pop(x, y, text, good) {
      var p = div("hw-pop"); p.textContent = text;
      p.style.left = Math.max(8, Math.min(window.innerWidth - 220, x - 90)) + "px"; p.style.top = (y - 20) + "px";
      if (!good) { p.style.color = "#fca5a5"; }
      layer.appendChild(p); setTimeout(function () { p.remove(); }, 1900);
    }
    scheduleBuck(opts.firstDelay == null ? 9000 : opts.firstDelay);
    window.HVFFHalloween.spawnBuck = function () { if (!carrying) spawnBuck(); }; // handy for testing
  }

  window.HVFFHalloween = { start: start };
})();

// hvflag.com: self-start (ghosts are just for fun here; FlagBucks catches only count in the app).
HVFFHalloween.start({ mode: "site", tokenSrc: "/hvff-token.png" });
