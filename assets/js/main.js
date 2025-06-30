const form = document.getElementById('contactForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new URLSearchParams();
    let name = form.name.value;
    let phone = form.phone.value;
    let service = form.service.value;
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("service", service);

    fetch("", {
        method: "POST",
        body: formData,
        mode: 'no-cors'
        // ❗️ headers не потрібні — прибрано!
    })
        .then(res => res.text())
        .then(data => {
            alert("Запит успішно відправлено!");
            form.reset();
        })
        .catch(err => {
            alert("Помилка відправки");
            console.error(err);
        });
});

function formatPhoneNumber(input) {
    // Видаляємо всі нецифрові символи, крім +
    let value = input.value.replace(/[^\d+]/g, '');

    // Якщо починається не з +380, автоматично додаємо +380
    if (!value.startsWith('+380') && value.length > 0) {
        value = '+380' + value.replace(/^\+/, '').replace(/^380/, '');
    }

    // Обмежуємо довжину (код країни + 9 цифр)
    if (value.length > 13) {
        value = value.substring(0, 13);
    }

    // Оновлюємо значення в полі
    input.value = value;
}
