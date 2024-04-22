// 初期化関数。ページのロード時に実行される
function init() {
  const canvas = document.getElementById("waveCanvas");  // Canvas要素を取得
  const info = {
    t: 0,  // 時間変数
    unit: 100,  // 波の振幅スケール
    amplitude: 0.5,  // 波の振幅
    frequency: 0.005,  // 波の周波数
    phase: 0  // 波の初期位相
  };

  // デバイスの幅に応じてCanvasのサイズと高さを設定
  canvas.width = document.documentElement.clientWidth * 1.3;
  canvas.height = document.documentElement.clientWidth < 768 ? 150 : 200;  // 小さなデバイスでは高さを減らす

  canvas.contextCache = canvas.getContext("2d");

  gsap.to(info, {
    duration: 900,
    repeat: -1,
    ease: "none",
    phase: "+=360",
    onUpdate: function() { draw(canvas, info); }
  });
}

function draw(canvas, info) {
  const context = canvas.contextCache;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // グラデーションの調整
  var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(142, 245, 215, 1)');  // 軽い青色
  gradient.addColorStop(0.7, 'rgba(142, 245, 215, 1)');  // 青色部分を下げる
  gradient.addColorStop(1, 'rgba(253, 253, 253, 1)');  // 白色

  context.fillStyle = gradient;
  context.beginPath();
  drawSine(canvas, info);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();
}

function drawSine(canvas, info) {
  const context = canvas.contextCache;
  const xAxis = Math.floor(canvas.height / 2);
  for (let i = -10; i <= canvas.width + 10; i += 10) {
    const x = (info.t + i) * info.frequency + info.phase;
    const y = Math.sin(x) * info.amplitude * info.unit;
    context.lineTo(i, y + xAxis);
  }
}

init();  // init関数を直接呼び出し


// ハンバーガーメニューのtoggle
var navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', function () {
  navbarToggler.classList.toggle('toggled');
});
