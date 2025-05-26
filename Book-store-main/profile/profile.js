document.getElementById('editProfile').addEventListener('click', function() {
    let newUsername = prompt('Enter new username:', document.getElementById('username').innerText);
    let newEmail = prompt('Enter new email:', document.getElementById('email').innerText);
    let newBio = prompt('Enter new bio:', document.getElementById('bio').innerText);
    
    if (newUsername) document.getElementById('username').innerText = newUsername;
    if (newEmail) document.getElementById('email').innerText = newEmail;
    if (newBio) document.getElementById('bio').innerText = newBio;
});

document.getElementById('logout').addEventListener('click', function() {
    alert('You have been logged out!');
    window.location.href = '../loginform/loginform/index.html';
});

document.getElementById('avatarInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

window.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
        const adminBtn = document.getElementById('adminPanelBtn');
        adminBtn.style.display = 'inline-block';
        adminBtn.addEventListener('click', function() {
            // Дополнительная проверка на всякий случай
            const userCheck = JSON.parse(localStorage.getItem('user'));
            if (userCheck && userCheck.role === 'admin') {
                window.location.href = '../admin/admin.html';
            } else {
                alert('У вас нет прав администратора!');
            }
        });
    }
});