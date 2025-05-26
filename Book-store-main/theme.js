function initThemeToggle() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");
    const body = document.body;

    function setDarkMode(enabled) {
        if (enabled) {
            body.classList.add("dark");
            if (darkModeIcon) {
                darkModeIcon.classList.remove("bi-brightness-high");
                darkModeIcon.classList.add("bi-moon");
            }
            localStorage.setItem("darkMode", "enabled");
        } else {
            body.classList.remove("dark");
            if (darkModeIcon) {
                darkModeIcon.classList.remove("bi-moon");
                darkModeIcon.classList.add("bi-brightness-high");
            }
            localStorage.setItem("darkMode", "disabled");
        }
    }

    // Установить тему при загрузке
    setDarkMode(localStorage.getItem("darkMode") === "enabled");

    if (darkModeToggle) {
        darkModeToggle.onclick = () => {
            setDarkMode(!body.classList.contains("dark"));
        };
    }
}

// Если хэдэр подгружается динамически, ждать его появления
function waitForHeaderAndInitTheme() {
    if (document.getElementById("darkModeToggle")) {
        initThemeToggle();
    } else {
        setTimeout(waitForHeaderAndInitTheme, 100);
    }
}

waitForHeaderAndInitTheme(); 