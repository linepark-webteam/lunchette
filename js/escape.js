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
