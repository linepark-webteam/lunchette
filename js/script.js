let animation;

// 初期化関数: ページロード時に実行され、初期設定を行います。
function init() {
  setupCanvas();  // キャンバス設定
  window.addEventListener('resize', setupCanvas);  // リサイズ時のキャンバス再設定
  window.addEventListener('scroll', handleScroll);  // スクロールイベントの処理
  observeFadeInElements();  // フェードイン要素の監視
  setupCollapseIconChanges();  // 折りたたみアイコンの動作設定
  addEventListeners();  // 追加のイベントリスナーを設定
  positionMobileSocialIconsAboveFooterAndBottomButton();  // フッターの高さに基づくSNSアイコンの位置調整
}

// ヘッダーの高さに基づく余白の調整（余白無し）
function updateHeaderSpacing() {
  const heroSection = document.querySelector('.hero-section');
  // 常に余白なし
  heroSection.style.marginTop = '0px';
}

// キャンバス設定と波のアニメーションの初期化
function setupCanvas() {
  const canvas = document.getElementById("waveCanvas");
  canvas.width = document.documentElement.clientWidth;  // キャンバス幅設定
  canvas.height = document.documentElement.clientHeight * 2;  // キャンバス高さを2倍に設定
  canvas.contextCache = canvas.getContext("2d");  // コンテキストキャッシング

  // アニメーションパラメータ
  const info = { t: 0, unit: 30, amplitude: 1, frequency: 0.0035, phase: 1 };

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
  gradient.addColorStop(0, 'rgba(221,255,245, 1)'); // 上部の色（不透明）
  gradient.addColorStop(0.8, 'rgba(221,255,245, 1)'); // 中部の色（不透明）
  gradient.addColorStop(1, 'rgba(221,255,245, 0)'); // 下部の透明度設定

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
  for (let i = -10; i <= canvas.width + 10; i += 1) {  // サンプル間隔を小さくして滑らかに描画
    const x = (info.t + i) * info.frequency + info.phase;
    const y = Math.sin(x) * info.amplitude * info.unit;
    context.lineTo(i, y + xAxis);
  }
}

// スクロールイベントの処理
function handleScroll() {
  updateCanvasPosition();  // キャンバス位置の更新
  updateContentOpacity();  // コンテンツの透明度更新
  toggleNavbarBrandVisibility(); // .navbar-brandの表示切替
}

// キャンバスの位置更新: ヒーローセクションの表示状態に基づく
function updateCanvasPosition() {
  const scrollY = window.scrollY;
  const heroSection = document.querySelector('.hero-section');

  // ヒーローセクションを常に固定
  if (scrollY > heroSection.offsetHeight) {
    heroSection.style.position = 'fixed';
    heroSection.style.top = `-${heroSection.offsetHeight}px`;
  } else {
    heroSection.style.position = 'fixed';
    heroSection.style.top = '0px';
  }
}

// SNSアイコンの制御
document.addEventListener('DOMContentLoaded', function () {
  const socialIcons = document.querySelector('.fixed-social-icons');
  const heroSection = document.querySelector('.hero-section');

  // 初期状態で隠す
  socialIcons.style.opacity = 0;
  socialIcons.style.transition = 'opacity 1s ease';

  // IntersectionObserverの設定
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        socialIcons.style.opacity = 0; // フェードアウト
      } else {
        socialIcons.style.opacity = 1; // フェードイン
      }
    });
  }, { threshold: 0 });

  observer.observe(heroSection);

  // 初期ロード時にスクロールイベントの設定
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const targetScrollY = window.innerHeight; // 100svhに対応
    socialIcons.style.opacity = scrollY > targetScrollY ? 1 : 0;
  });

  // リサイズ時にスクロールイベントの設定を更新
  window.addEventListener('resize', () => {
    const scrollY = window.scrollY;
    const targetScrollY = window.innerHeight; // 100svhに対応
    socialIcons.style.opacity = scrollY > targetScrollY ? 1 : 0;
  });
});

// フッターおよび固定ボタンの高さに基づいてSNSアイコンの位置を調整する
function positionMobileSocialIconsAboveFooterAndBottomButton() {
  const socialIcons = document.querySelector('.fixed-social-icons');
  const footer = document.querySelector('.footer');
  const fixedBottom = document.querySelector('.container-fluid.fixed-bottom');

  // スクロールまたはリサイズ時にフッターや固定ボタンとの位置を確認して調整
  function updateSocialIconPosition() {
    const footerRect = footer.getBoundingClientRect();
    const fixedBottomRect = fixedBottom.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // アイコンを配置する最小の高さ（フッターと固定ボタンのどちらも考慮）
    const overlapHeight = windowHeight - Math.min(footerRect.top, fixedBottomRect.top);

    // アイコンの位置を調整（15px のマージンを追加）
    if (overlapHeight > 0) {
      socialIcons.style.bottom = `${overlapHeight + 15}px`;
    } else {
      // 通常の位置に戻す
      socialIcons.style.bottom = '18svh';
    }
  }

  window.addEventListener('scroll', updateSocialIconPosition);
  window.addEventListener('resize', updateSocialIconPosition);
  updateSocialIconPosition(); // 初期ロード時にも位置を更新
}

// ヒーローセクションの透明度更新
function updateContentOpacity() {
  const scrollY = window.scrollY;
  const opacity = 1 - Math.min(1, (scrollY - 2) / (500 - 2));
  document.querySelector('.text-contents').style.opacity = opacity;
  document.querySelector('.img-contents').style.opacity = opacity;
}

// .navbar-brandの表示切替
function toggleNavbarBrandVisibility() {
  const heroSection = document.querySelector('.hero-section');
  const navbarBrand = document.querySelector('.brand-logo');
  const scrollY = window.scrollY;
  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

  // ヒーローセクションを通過したら.navbar-brandを表示
  if (scrollY > heroBottom) {
    navbarBrand.classList.add('visible');
  } else {
    navbarBrand.classList.remove('visible');
  }
}

// フェードイン要素の監視 ビューポートに入る度にアニメーションを実行
function observeFadeInElements() {
  const fadeElements = document.querySelectorAll(".fd");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 要素がビューポートに入るときにクラスを追加
        entry.target.classList.add("fd-in");
      } else {
        // 要素がビューポートから出るときにクラスを削除
        entry.target.classList.remove("fd-in");
      }
    });
  }, { threshold: 0.1 }); // しきい値を調整して観察の感度を変更可能

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

// ハンバーガーメニューのトグル機能とフッターの追従ボタン設定
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

// 初期化関数の呼び出し
init();
