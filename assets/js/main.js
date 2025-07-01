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
