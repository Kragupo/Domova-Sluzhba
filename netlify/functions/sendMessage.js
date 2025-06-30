
exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const name = data.name;
    const phone = data.phone;
    const service = data.service;

    const apiUrl = process.env.API_URL;

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("service", service);

    await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    console.error("Помилка:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Не вдалося надіслати запит" }),
    };
  }
};
