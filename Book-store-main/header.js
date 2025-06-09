// Динамически подгружает шапку сайта на все страницы
// Удаляем все старые nav (если вдруг их несколько)
document.querySelectorAll('nav').forEach(nav => nav.remove());
fetch('/header.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    if (window.initHeaderFeatures) window.initHeaderFeatures();
    // Мобильное меню
    const burger = document.querySelector('.burger-menu');
    const rightNav = document.querySelector('.right-nav');
    function closeMenu() {
      rightNav.classList.remove('open');
      burger.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
    function openMenu() {
      rightNav.classList.add('open');
      burger.classList.add('open');
      document.body.classList.add('menu-open');
    }
    if (burger && rightNav) {
      burger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (rightNav.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
      rightNav.querySelectorAll('a,button').forEach(el => {
        el.addEventListener('click', closeMenu);
      });
    }
    // Добавляю обработчик для кнопки профиля
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
          window.location.href = '/profile/profile.html';
        } else {
          window.location.href = '/loginform/loginform/index.html';
        }
      });
    }
  }); 