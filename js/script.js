let animation;

// 初期化関数: ページロード時に実行され、初期設定を行います。
function init() {
  setupCanvas();  // キャンバス設定
  window.addEventListener('resize', setupCanvas);  // リサイズ時のキャンバス再設定
  window.addEventListener('scroll', handleScroll);  // スクロールイベントの処理
  window.addEventListener('resize', updateHeaderSpacing);  // リサイズ時のヘッダー高さ調整
  updateHeaderSpacing();  // 初期ロード時にも実行
  observeFadeInElements();  // フェードイン要素の監視
  setupCollapseIconChanges();  // 折りたたみアイコンの動作設定
  addEventListeners();  // 追加のイベントリスナーを設定
}

// ヘッダーの高さに基づく余白の調整
function updateHeaderSpacing() {
  const header = document.querySelector('.fixed-top');  // 取得するヘッダーのセレクタ
  const heroSection = document.querySelector('.hero-section');

  if (window.innerWidth < 993) {
    const headerHeight = header ? header.offsetHeight : 0;
    heroSection.style.marginTop = `${headerHeight}px`;
  } else {
    heroSection.style.marginTop = '0px';
  }
}

// キャンバス設定と波のアニメーションの初期化
function setupCanvas() {
  const canvas = document.getElementById("waveCanvas");
  canvas.width = document.documentElement.clientWidth * 1.3;  // キャンバス幅設定
  canvas.height = document.documentElement.clientWidth < 768 ? 150 : 200;  // キャンバス高さ設定
  canvas.contextCache = canvas.getContext("2d");  // コンテキストキャッシング

  // アニメーションパラメータ
  const info = { t: 0, unit: 200, amplitude: 0.3, frequency: 0.002, phase: 0 };

  // 既存のアニメーションがあれば停止
  if (animation) {
    animation.kill();
  }

  // GSAPアニメーションの設定
  animation = gsap.to(info, {
    duration: 1000,
    repeat: -1,
    ease: "none",
    phase: "+=360",
    onUpdate: () => draw(canvas, info)  // 更新時に波形を描画
  });
}

// 波形の描画
function draw(canvas, info) {
  const context = canvas.contextCache;
  context.clearRect(0, 0, canvas.width, canvas.height);  // キャンバスをクリア

  // グラデーション設定
  let gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(221,255,245, 1)');

  context.fillStyle = gradient;
  context.beginPath();
  drawSine(canvas, info);  // サイン波を描画
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();
}

// サイン波の描画
function drawSine(canvas, info) {
  const context = canvas.contextCache;
  const xAxis = Math.floor(canvas.height / 2);
  context.moveTo(-10, xAxis);

  // サイン波を描画
  for (let i = -10; i <= canvas.width + 10; i += 10) {
    const x = (info.t + i) * info.frequency + info.phase;
    const y = Math.sin(x) * info.amplitude * info.unit;
    context.lineTo(i, y + xAxis);
  }
}

// スクロールイベントの処理
function handleScroll() {
  updateCanvasPosition();  // キャンバス位置の更新
  updateContentOpacity();  // コンテンツの透明度更新
}

// キャンバスの位置更新: ヒーローセクションの表示状態に基づく
// function updateCanvasPosition() {
//   const scrollY = window.scrollY;
//   const heroSection = document.querySelector('.hero-section');
//   const screenWidth = window.innerWidth;

//   if (screenWidth >= 993) {
//     heroSection.style.position = 'relative';
//     heroSection.style.top = '0px';
//   } else {
//     if (scrollY > heroSection.offsetHeight) {
//       heroSection.style.position = 'fixed';
//       heroSection.style.top = `-${heroSection.offsetHeight}px`;
//     } else {
//       heroSection.style.position = 'relative';
//       heroSection.style.top = '0px';
//     }
//   }
// }

// コンテンツの透明度更新
function updateContentOpacity() {
  const scrollY = window.scrollY;
  const opacity = 1 - Math.min(1, (scrollY - 2) / (500 - 2));
  document.querySelector('.text-contents').style.opacity = opacity;
  document.querySelector('.img-contents').style.opacity = opacity;
}

// フェードイン要素の監視
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

// 折りたたみセクションのアイコン変更設定
function setupCollapseIconChanges() {
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
