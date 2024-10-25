document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : "*" },
        body: JSON.stringify({ firstName, lastName, email, password })
    });

    const data = await response.json();
    const messageDiv = document.getElementById('message');

    if (response.ok) {
        window.location.href = 'login.html'; //Redirigir al login
        messageDiv.textContent = 'Registro exitoso.';
    } else {
        messageDiv.textContent = `Error: ${data.message}`;
    }
});
