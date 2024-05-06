let animation;

// 初期化関数。ページのロード時に実行され、必要なセットアップを行います。
function init() {
  setupCanvas();  // キャンバスを設定します
  window.addEventListener('resize', setupCanvas);  // ウィンドウのリサイズに対応します
  window.addEventListener('scroll', handleScroll);  // スクロールイベントに対応します
  observeFadeInElements();  // フェードイン要素の監視を開始します
  setupCollapseIconChanges();  // 折りたたみセクションのアイコン変更を設定します
  addEventListeners();  // その他のイベントリスナーを追加します
}

// キャンバスの設定とアニメーションの初期化を行います。
function setupCanvas() {
  const canvas = document.getElementById("waveCanvas");
  canvas.width = document.documentElement.clientWidth * 1.3;
  canvas.height = document.documentElement.clientWidth < 768 ? 150 : 200;
  canvas.contextCache = canvas.getContext("2d");

  const info = {
    t: 0,
    unit: 200,
    amplitude: 0.3,
    frequency: 0.002,
    phase: 0
  };

  if (animation) {
    animation.kill();  // 既存のアニメーションを停止します
  }

  animation = gsap.to(info, {
    duration: 1000,
    repeat: -1,
    ease: "none",
    phase: "+=360",
    onUpdate: () => draw(canvas, info)
  });
}

// キャンバス上に波形を描画するための関数です。
function draw(canvas, info) {
  const context = canvas.contextCache;
  context.clearRect(0, 0, canvas.width, canvas.height);

  let gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(221,255,245, 1)');

  context.fillStyle = gradient;
  context.beginPath();
  drawSine(canvas, info);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();
}

// サイン波を描画します。
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

// スクロールイベントを処理します。キャンバス位置の更新、コンテンツの透明度更新、透明度の更新を行います。
function handleScroll() {
  updateCanvasPosition();
  updateContentOpacity();
  updateOpacity();
}

// キャンバスの位置を更新します。画面幅993px以上では常に表示されません。
function updateCanvasPosition() {
  const scrollY = window.scrollY;
  const heroSection = document.querySelector('.hero-section');
  const screenWidth = window.innerWidth;  // 画面の幅を取得

  // 993px以上の場合、ヒーローセクションを固定表示しないように設定
  if (screenWidth >= 993) {
    heroSection.style.position = 'relative';
    heroSection.style.top = '0px';
  } else {
    // 993px未満の場合、スクロールに応じてヒーローセクションの位置を動的に変更
    if (scrollY > heroSection.offsetHeight) {
      heroSection.style.position = 'fixed';
      heroSection.style.top = `-${heroSection.offsetHeight}px`;
    } else {
      heroSection.style.position = 'relative';
      heroSection.style.top = '0px';
    }
  }
}

// スクロール位置に応じてコンテンツの透明度を更新します。
function updateContentOpacity() {
  const scrollY = window.scrollY;
  const opacity = 1 - Math.min(1, (scrollY - 2) / (500 - 2));  // 透明度を計算
  document.querySelector('.text-contents').style.opacity = opacity;  // テキストコンテンツの透明度を設定
  document.querySelector('.img-contents').style.opacity = opacity;  // 画像コンテンツの透明度を設定
}

// スクロール位置に基づき、キャンバスと青色のキャンバスの透明度を更新します。
function updateOpacity() {
  const scrollY = window.scrollY;
  const setOpacity = (triggerHeight, maxScroll) => Math.min(1, (scrollY - triggerHeight) / (maxScroll - triggerHeight));  // 透明度を計算する関数
  document.querySelector('#waveCanvas').style.opacity = setOpacity(0, 300);  // 波のキャンバスの透明度を更新
  document.querySelector('#blue-canvas').style.opacity = setOpacity(0, 300);  // 青色のキャンバスの透明度を更新
  animation[scrollY <= 0 ? 'resume' : 'pause']();  // アニメーションを再開または一時停止
}
// スクロール位置に基づき、キャンバスと青色のキャンバスの透明度を更新します。
function updateOpacity() {
  const scrollY = window.scrollY;
  const setOpacity = (triggerHeight, maxScroll) => Math.min(1, (scrollY - triggerHeight) / (maxScroll - triggerHeight));  // 透明度を計算する関数

  if (scrollY <= 0) {
    document.querySelector('#waveCanvas').style.opacity = 1;  // 波のキャンバスの透明度を不透明に設定
    document.querySelector('#blue-canvas').style.opacity = 1;  // 青色のキャンバスの透明度を不透明に設定
    animation.resume();  // アニメーションを再開
  } else {
    document.querySelector('#waveCanvas').style.opacity = setOpacity(0, 300);  // 波のキャンバスの透明度を更新
    document.querySelector('#blue-canvas').style.opacity = setOpacity(0, 300);  // 青色のキャンバスの透明度を更新
    animation.pause();  // アニメーションを一時停止
  }
}

// フェードイン要素の監視を行います。
function observeFadeInElements() {
  const fadeElements = document.querySelectorAll(".fd");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fd-in");
        observer.unobserve(entry.target);
      }
    });
  });
  fadeElements.forEach(element => observer.observe(element));
}

// 折りたたみ要素のアイコン変更を設定します。
function setupCollapseIconChanges() {
  document.addEventListener('DOMContentLoaded', function () {
    const toggleIcons = [
      { id: 'clrtp-collapse', selector: 'a[href="#clrtp-collapse"] .wht-pls img', openImg: './img/plus.webp', closeImg: './img/cross.webp' },
      { id: 'cns-collapse', selector: 'a[href="#cns-collapse"] .wht-pls img', openImg: './img/plus.webp', closeImg: './img/cross.webp' }
    ];

    toggleIcons.forEach(item => {
      const element = document.getElementById(item.id);
      const icon = document.querySelector(item.selector);

      element.addEventListener('show.bs.collapse', function () {
        icon.src = item.closeImg;
        icon.alt = 'Close';
      });
      element.addEventListener('hide.bs.collapse', function () {
        icon.src = item.openImg;
        icon.alt = 'Open';
      });
    });
  });
}

// ハンバーガーメニューのトグル機能とフッターの追従ボタン設定を行います。
function addEventListeners() {
  let navbarToggler = document.querySelector('.navbar-toggler');
  navbarToggler.addEventListener('click', function() {
    this.classList.toggle('toggled');
  });

  const heroSection = document.querySelector('.hero-section');
  const footerButton = document.querySelector('.fixed-bottom');
  const checkHeroSectionPosition = () => {
    const heroSectionBottom = heroSection.getBoundingClientRect().bottom;
    footerButton.style.opacity = window.scrollY > heroSectionBottom ? 1 : 0;
  };

  window.addEventListener('scroll', checkHeroSectionPosition);
  window.addEventListener('resize', checkHeroSectionPosition);
  checkHeroSectionPosition();
}

// フッターの高さに基づいてページ下部のバーのパディングを調整する機能
function adjustFooterPadding() {
  const footer = document.querySelector('.footer');
  const fixedBottom = document.querySelector('.container-fluid.fixed-bottom');
  const footerVisible = footer.getBoundingClientRect().top < window.innerHeight;

  fixedBottom.style.paddingBottom = footerVisible ? `${footer.offsetHeight}px` : '0px';
}

// イベントリスナーにフッターのパディング調整機能を追加
window.addEventListener('scroll', adjustFooterPadding);
window.addEventListener('resize', adjustFooterPadding);

// 初期設定で一度実行しておく
adjustFooterPadding();


init();  // 初期化関数を呼び出します。
