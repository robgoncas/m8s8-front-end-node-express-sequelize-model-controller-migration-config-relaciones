document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); //Evita la recarga de la página

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : "*"},
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        const messageDiv = document.getElementById('message');

        if (response.ok) {
            messageDiv.textContent = 'Inicio de sesión exitoso.';
            document.cookie = `token=${data.token}; path=/`;
            //Redireccionar a la página de productos o dashboard
            window.location.href = 'index.html';
        } else {
            messageDiv.textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        console.error('Error al realizar el inicio de sesión:', error);
    }
});
