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