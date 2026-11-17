// ===== 背景の幾何学模様(全ページ共通) =====
// 四角・三角・丸などを画面に固定したレイヤーに置き、スクロール量に応じて
// 図形ごとの速さで上へ流し、回転させる(画面外に出たら下から戻ってくる)。
// 色はCSS変数(--geo-a〜d)なので、テーマ切替([data-theme])で自動的に変わる。
// 各ページの<head>で <script src="geo-bg.js" defer></script> と読み込むだけでよい
(function () {
var CSS = "/* ==== 背景の幾何学模様(スクロールに合わせて流れ・回転する) ==== */\r\n:root{--geo-a:rgba(168,154,224,.30);--geo-b:rgba(122,104,200,.24);--geo-c:rgba(92,122,210,.22);--geo-d:rgba(212,150,220,.20)}\r\n[data-theme=light]{--geo-a:rgba(107,92,165,.22);--geo-b:rgba(140,120,210,.20);--geo-c:rgba(60,90,168,.15);--geo-d:rgba(176,96,170,.14)}\r\n.geo-bg{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}\r\n.geo-bg .geo{position:absolute;left:0;top:0;will-change:transform}\r\n.geo-bg svg{display:block;width:100%;height:100%;overflow:visible}\r";
function mountGeoBg() {
  const P = {
    sq:  '<rect x="10" y="10" width="80" height="80" rx="6"/>',
    tri: '<path d="M50 8 L93 86 H7 Z" stroke-linejoin="round"/>',
    ci:  '<circle cx="50" cy="50" r="42"/>',
    ring:'<circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="24"/>',
    hex: '<path d="M50 6 L88 28 V72 L50 94 L12 72 V28 Z" stroke-linejoin="round"/>',
    plus:'<path d="M38 10 H62 V38 H90 V62 H62 V90 H38 V62 H10 V38 H38 Z" stroke-linejoin="round"/>',
  };
  // [図形, 色, 塗り?, 横位置(画面幅比), 縦位置(画面高比), 大きさpx, 流れる速さ, 回転(度/画面1枚分)]
  const DEF = [
    ['sq',  'a', false, .08, .15, 90,  .35,  40],
    ['tri', 'b', true,  .82, .30, 120, .55, -60],
    ['ci',  'c', false, .55, .70, 70,  .25,   0],
    ['ring','a', false, .20, .95, 110, .45,  30],
    ['hex', 'd', true,  .90, .80, 80,  .30,  50],
    ['plus','b', false, .40, .40, 56,  .65,  90],
    ['tri', 'c', false, .12, .60, 76,  .50,  70],
    ['sq',  'd', true,  .68, .05, 52,  .70, -80],
    ['ci',  'b', true,  .30, .25, 34,  .80,   0],
    ['hex', 'a', false, .62, 1.1, 130, .20, -25],
    ['sq',  'c', false, .95, .55, 64,  .40, 120],
    ['tri', 'a', true,  .48, .92, 44,  .60, -100],
  ];
  const root = document.createElement('div');
  root.className = 'geo-bg';
  root.setAttribute('aria-hidden', 'true');
  const shapes = DEF.map(function (d) {
    const el = document.createElement('div');
    el.className = 'geo';
    el.style.width = el.style.height = d[5] + 'px';
    const c = 'var(--geo-' + d[1] + ')';
    // var()は属性では効かないのでstyleで指定する
    const paint = d[2] ? 'fill:' + c + ';stroke:none' : 'fill:none;stroke:' + c + ';stroke-width:5';
    el.innerHTML = '<svg viewBox="0 0 100 100" style="' + paint + '">' + P[d[0]] + '</svg>';
    root.appendChild(el);
    return { el: el, d: d };
  });
  document.body.insertBefore(root, document.body.firstChild);

  const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = window.scrollY, raf = 0;
  function draw() {
    raf = 0;
    const target = window.scrollY;
    // 少し遅れて追いかけ、動きをなめらかにする
    cur += (target - cur) * .14;
    if (Math.abs(target - cur) < .5) cur = target;
    const w = window.innerWidth, h = window.innerHeight;
    shapes.forEach(function (s) {
      const d = s.d, size = d[5], span = h + size * 2;
      let y = (d[4] * h - cur * d[6]) % span;
      if (y < 0) y += span;
      y -= size;
      const x = d[3] * w - size / 2 + Math.sin(cur / h * 1.6 + d[3] * 6) * 24;
      const r = cur / h * d[7];
      s.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + r.toFixed(1) + 'deg)';
    });
    if (cur !== target) raf = requestAnimationFrame(draw);
  }
  function req() { if (!raf) raf = requestAnimationFrame(draw); }
  function onScroll() { if (still) { cur = window.scrollY; } req(); }
  cur = window.scrollY;
  draw();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', req);
  return function () {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', req);
    if (raf) cancelAnimationFrame(raf);
    root.remove();
  };
}
function start() {
  var st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);
  mountGeoBg();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
})();
