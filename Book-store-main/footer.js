// Динамически подгружает футер на все страницы
fetch('/footer.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
  }); 