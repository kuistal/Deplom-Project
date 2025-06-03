// Динамически подгружает шапку сайта на все страницы
fetch('/header.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    if (window.initHeaderFeatures) window.initHeaderFeatures();
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