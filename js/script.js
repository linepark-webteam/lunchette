let animation;

// 初期化関数。ページのロード時に実行される
function init() {
  const canvas = document.getElementById("waveCanvas");
  const info = {
    t: 0,
    unit: 200,
    amplitude: 0.3,
    frequency: 0.002,
    phase: 0
  };

  canvas.width = document.documentElement.clientWidth * 1.3;
  canvas.height = document.documentElement.clientWidth < 768 ? 150 : 200;

  canvas.contextCache = canvas.getContext("2d");

  animation = gsap.to(info, {
    duration: 1000,
    repeat: -1,
    ease: "none",
    phase: "+=360",
    onUpdate: function() { draw(canvas, info); }
  });
}

// 波を描画する関数
function draw(canvas, info) {
  const context = canvas.contextCache;
  context.clearRect(0, 0, canvas.width, canvas.height);

  var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(221,255,245, 1)');

  context.fillStyle = gradient;
  context.beginPath();
  drawSine(canvas, info);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();
}

// サイン波を描画する関数
function drawSine(canvas, info) {
  const context = canvas.contextCache;
  const xAxis = Math.floor(canvas.height / 2);

  context.moveTo(-10, xAxis);

  for (let i = -10; i <= canvas.width + 10; i += 10) {
    const x = (info.t + i) * info.frequency + info.phase;
    const y = Math.sin(x) * info.amplitude * info.unit;
    context.lineTo(i, y + xAxis);
  }
}

// スクロール位置に基づいてキャンバスの位置を変える関数
function updateCanvasPosition() {
  const scrollY = window.scrollY;
  const triggerHeight = 300;
  const maxScroll = 300;

  if (scrollY > triggerHeight) {
    const moveFraction = (scrollY - triggerHeight) / (maxScroll - triggerHeight);
    const moveUp = 30 * moveFraction;
    document.querySelector('#waveCanvas').style.transform = `translateY(-${moveUp}vh)`;
  } else {
    document.querySelector('#waveCanvas').style.transform = `translateY(0)`;
  }
}

// スクロール位置に基づいてコンテンツの透明度を更新する関数
function updateContentOpacity() {
  const scrollY = window.scrollY;
  const triggerHeight = 2;
  const maxScroll = 500;

  const opacity = 1 - Math.min(1, (scrollY - triggerHeight) / (maxScroll - triggerHeight));

  document.querySelector('.text-contents').style.opacity = opacity;
  document.querySelector('.img-contents').style.opacity = opacity;
}

// スクロール位置に基づいて透明度を更新する関数
function updateOpacity() {
  const scrollY = window.scrollY;

  const waveCanvasTriggerHeight = 0;
  const waveCanvasMaxScroll = 300;
  const waveCanvasOpacity = Math.min(1, (scrollY - waveCanvasTriggerHeight) / (waveCanvasMaxScroll - waveCanvasTriggerHeight));

  const blueCanvasTriggerHeight = 0;
  const blueCanvasMaxScroll = 300;
  const blueCanvasOpacity = Math.min(1, (scrollY - blueCanvasTriggerHeight) / (blueCanvasMaxScroll - blueCanvasTriggerHeight));

  if (scrollY <= waveCanvasTriggerHeight) {
    document.querySelector('#waveCanvas').style.opacity = 1;
    animation.resume();
  } else {
    document.querySelector('#waveCanvas').style.opacity = waveCanvasOpacity;
    document.querySelector('#blue-canvas').style.opacity = blueCanvasOpacity;
    animation.pause();
  }
}

// 初期化関数を呼び出す
init();

// ハンバーガーメニューのトグルを設定
toggleNavbar();

// スクロールイベントをリッスン
window.addEventListener('scroll', updateCanvasPosition);
window.addEventListener('scroll', updateContentOpacity);
window.addEventListener('scroll', updateOpacity);

// フェードイン効果を追加するためのIntersectionObserver
const fadeElements = document.querySelectorAll(".fd");  // フェードイン対象の要素
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fd-in");  // フェードインさせる
      observer.unobserve(entry.target);  // 監視を停止
    }
  });
});

// フェードイン対象の要素を監視
fadeElements.forEach((element) => {
  observer.observe(element);  // フェードイン効果を監視
});

// What is …のトグル(+)->(×)へ
document.addEventListener('DOMContentLoaded', function () {
  // clrtp-collapseの設定
  const clrtpCollapseElement = document.getElementById('clrtp-collapse');
  const clrtpToggleIcon = document.querySelector('a[href="#clrtp-collapse"] .wht-pls img');

  clrtpCollapseElement.addEventListener('show.bs.collapse', function () {
    clrtpToggleIcon.src = './img/cross.webp';
    clrtpToggleIcon.alt = 'Close';
  });

  clrtpCollapseElement.addEventListener('hide.bs.collapse', function () {
    clrtpToggleIcon.src = './img/plus.webp';
    clrtpToggleIcon.alt = 'Open';
  });

  // cns-collapseの設定
  const cnsCollapseElement = document.getElementById('cns-collapse');
  const cnsToggleIcon = document.querySelector('a[href="#cns-collapse"] .wht-pls img');

  cnsCollapseElement.addEventListener('show.bs.collapse', function () {
    cnsToggleIcon.src = './img/cross.webp';
    cnsToggleIcon.alt = 'Close';
  });

  cnsCollapseElement.addEventListener('hide.bs.collapse', function () {
    cnsToggleIcon.src = './img/plus.webp';
    cnsToggleIcon.alt = 'Open';
  });
});


// ハンバーガーメニューのトグル
function toggleNavbar() {
  var navbarToggler = document.querySelector('.navbar-toggler');
  navbarToggler.addEventListener('click', function() {
    this.classList.toggle('toggled');
  });
}
