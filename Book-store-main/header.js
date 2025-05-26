// Динамически подгружает шапку сайта на все страницы
fetch('/header.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    if (window.initHeaderFeatures) window.initHeaderFeatures();
  }); 