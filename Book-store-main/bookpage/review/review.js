// Load book details from localStorage
window.onload = function () {
    var img = document.getElementById("bookImage");
    img.src = localStorage.getItem("bookImage");
    img.onerror = function() {
        if (this.src.indexOf('placeholder.jpg') === -1) {
            this.src = '../placeholder.jpg';
        } else {
            this.onerror = null;
        }
    };
    document.getElementById("bookTitle").innerText = localStorage.getItem("bookTitle");
    document.getElementById("bookAuthor").innerText = "By " + localStorage.getItem("bookAuthor");
    loadReviews();
};

// Получить bookId из localStorage или URL (зависит от вашей логики)
const bookId = localStorage.getItem('bookId');
const userId = localStorage.getItem('userId'); // предполагается, что userId есть в localStorage после авторизации

// Загрузка отзывов с сервера
async function loadReviews() {
    let reviewsContainer = document.getElementById("reviews");
    reviewsContainer.innerHTML = "";
    try {
        const res = await fetch(`/api/reviews/${bookId}`);
        const data = await res.json();
        if (!data.reviews || data.reviews.length === 0) {
            reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
            return;
        }
        // Показать средний рейтинг
        reviewsContainer.innerHTML = `<h4>Средний рейтинг: ${data.avg_rating ? data.avg_rating.toFixed(1) : 0} / 5 (${data.review_count})</h4>`;
        data.reviews.forEach(review => {
            let div = document.createElement("div");
            div.classList.add("review-item");
            div.innerHTML = `
                <p><strong>${review.username || 'User'}</strong> <span>${getColoredStars(review.rating)}</span> <em>${new Date(review.created_at).toLocaleString()}</em></p>
                <p>${review.review_text}</p>
            `;
            reviewsContainer.appendChild(div);
        });
    } catch (e) {
        reviewsContainer.innerHTML = "<p>Ошибка загрузки отзывов.</p>";
    }
}

// Добавить отзыв через сервер
async function addReview() {
    let reviewText = document.getElementById("reviewText").value.trim();
    let rating = parseInt(document.getElementById("selectedRating").value);
    if (reviewText === "" || rating === 0) {
        alert("Please write a review and select a rating before submitting.");
        return;
    }
    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                book_id: bookId,
                user_id: userId,
                rating: rating,
                review_text: reviewText
            })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById("reviewText").value = "";
            document.getElementById("selectedRating").value = "0";
            loadReviews();
        } else {
            alert("Ошибка при добавлении отзыва");
        }
    } catch (e) {
        alert("Ошибка при добавлении отзыва");
    }
}

// Function to generate stars with colors
function getColoredStars(rating) {
    let colors = ["red", "orange", "yellow", "gold", "green"];
    let stars = "";

    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += `<span style="color:${colors[rating - 1]}; font-size:20px;">★</span>`;
        } else {
            stars += `<span style="color:gray; font-size:20px;">★</span>`;
        }
    }

    return stars;
}

// Function to update rating selection
function rate(n) {
    remove();
    let colors = ["red", "orange", "yellow", "gold", "green"];
    for (let i = 0; i < n; i++) {
        stars[i].style.color = colors[n - 1];
    }
    document.getElementById("output").innerText = "Rating is: " + n + "/5";
    document.getElementById("selectedRating").value = n;
}

// To remove previous styles
function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].style.color = "gray";
        i++;
    }
}

// Initialize stars
let stars = document.getElementsByClassName("star");
