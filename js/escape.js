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

// ヘッダーの高さに基づく余白の調整
// function updateHeaderSpacing() {
//   const header = document.querySelector('.fixed-top');
//   const heroSection = document.querySelector('.hero-section');

//   if (window.innerWidth < 993) {
//     const headerHeight = header ? header.offsetHeight : 0;
//     heroSection.style.marginTop = `${headerHeight}px`;
//   } else {
//     heroSection.style.marginTop = '0px';
//   }
// }

  //updateHeaderSpacing();  // 初期ロード時にも実行

// SNSアイコンのフェードイン
document.addEventListener('DOMContentLoaded', function () {
  // ヒーローセクションとSNSアイコンの要素を取得
  const heroSection = document.querySelector('.hero-section');
  const socialIcons = document.querySelector('.fixed-social-icons');

  // 初期状態で隠す
  socialIcons.style.opacity = 0;
  socialIcons.style.transition = 'opacity 1s ease';

  // IntersectionObserverを使用してヒーローセクションが画面から消えたときにSNSアイコンをフェードイン
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        socialIcons.style.opacity = 1; // フェードイン
      } else {
        socialIcons.style.opacity = 0; // フェードアウト
      }
    });
  }, { threshold: 0 });

  // 監視する要素を設定
  observer.observe(heroSection);
});

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