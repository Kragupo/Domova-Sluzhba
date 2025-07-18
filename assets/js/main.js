
window.addEventListener('load', function() {
	document.getElementById('preloader').classList.add('hide');

	setTimeout(function() {
		document.getElementById('preloader').style.display = 'none';
	}, 500);
});

const form = document.getElementById('contactForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        name: form.name.value,
        phone: form.phone.value,
        service: form.service.value
    };
    grecaptcha.ready(function () {
        grecaptcha.execute('6Ldz24crAAAAAHTTX_2-YQG3hgKHXEVxFJzWH9pN', { action: 'submit' }).then(function (recaptchaToken) {
            fetch('/.netlify/functions/sendMessage', {
                method: 'POST',
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(response => {
                    alert("Запит успішно відправлено!");
                    form.reset();
                })
                .catch(err => {
                    alert("Помилка відправки");
                    console.error(err);
                });
        });
    });
});

function formatPhoneNumber(input) {
    let value = input.value.replace(/[^\d+]/g, '');
    if (!value.startsWith('+380') && value.length > 0) {
        value = '+380' + value.replace(/^\+/, '').replace(/^380/, '');
    }
    if (value.length > 13) {
        value = value.substring(0, 13);
    }
    input.value = value;
}

const scriptURL = "https://script.google.com/macros/s/AKfycbzoPUxmFLvbT2Mb7e-UW0eHJ7GxuHIXJTZ4UDs52yjve8yyhk14wWFIjmCuWMaGqQ99/exec";

function openModal() {
    setRating(5);
    document.getElementById('feedbackModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('feedbackModal').style.display = 'none';
}
let currentRating = 5;

function setRating(rating) {
    currentRating = rating;
    document.querySelectorAll('.star-select .star').forEach((star, i) => {
        star.style.color = i < rating ? '#FFD700' : '#ccc';
    });
}

const status = document.getElementById("status");
const submitButton = document.querySelector(".feedback-form button");
let isSending = false;
let loadingIndicator;

function showLoading(text = "Завантаження...") {
    status.textContent = text;
    status.style.color = "#f5c167";
    submitButton.disabled = true;
    submitButton.style.opacity = "0.6";
    isSending = true;
}

function hideLoading(message = "", success = true) {
    status.textContent = message;
    status.style.color = success ? "#55A685" : "#ff5555";
    submitButton.disabled = false;
    submitButton.style.opacity = "1";
    isSending = false;
}

function getDeviceId() {
    let id = localStorage.getItem("device_id");
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("device_id", id);
    }
    return id;
}

function submitFeedback() {
    if (isSending) return;

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || name.length < 2) {
        hideLoading("Введіть коректне ім’я!", false);
        return;
    }

    if (!message || message.length < 5) {
        hideLoading("Введіть коректний відгук! (Більше 5 символів)", false);
        return;
    }

    showLoading("Надсилання...");
    isSending = true;

    grecaptcha.ready(function () {
        grecaptcha.execute('6Ldz24crAAAAAHTTX_2-YQG3hgKHXEVxFJzWH9pN', { action: 'submit' }).then(function (recaptchaToken) {
            fetch(scriptURL, {
                method: "POST",
                body: JSON.stringify({
                    name,
                    message,
                    rating: currentRating,
                    recaptcha: recaptchaToken,
                    deviceId: getDeviceId()
                })
            })
                .then(response => response.text())
                .then(text => {
                    if (text === "OK") {
                        hideLoading("Відгук надіслано!");
                        document.getElementById("name").value = "";
                        document.getElementById("message").value = "";
                        setRating(5);
                        loadFeedbacks();
                    } else {
                        hideLoading(text, false);
                    }
                    isSending = false;
                })
                .catch(() => {
                    hideLoading("Помилка сервера!", false);
                    isSending = false;
                });
        });
    });
}

function loadFeedbacks() {
    const container = document.getElementById("review");
    container.innerHTML = "<p style='color:#fff;'>Завантаження відгуків...</p>";

    fetch(scriptURL)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                container.innerHTML = `
                    <p style="color: #fff; font-size: 16px; text-align: center;">
                        Ще немає відгуків. Ви можете бути першим!
                    </p>`;
                return;
            }

            container.innerHTML = data.map(f => `
                <div class="review-card">
                  <div class="card-left">
                    <span class="review-name">${f.name}</span>
                    <div class="star-rating">${'★'.repeat(f.rating || 5)}${'☆'.repeat(5 - (f.rating || 5))}</div>
                  </div>
                  <div class="card-right">
                    <p class="review-text">${f.message}</p>
                  </div>
                </div>`).join('');
        })
        .catch(() => {
            container.innerHTML = `
                <p style="color: #ff7b00; text-align: center;">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>`;
        });
}
loadFeedbacks();