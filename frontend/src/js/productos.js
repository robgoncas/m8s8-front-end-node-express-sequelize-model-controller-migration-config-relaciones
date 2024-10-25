//Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log({value, parts})
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('products-container');

    try {
        //Obtener el token de la cookie
        const token = getCookie('token');

        //Petición al backend para obtener todos los productos
        const response = await fetch('http://localhost:3000/productos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` //Añade el token como encabezado de autorización
            },
            credentials: 'include' //Esto envía las cookies junto con la solicitud
        });

        const products = await response.json();

        //Comprobamos si la respuesta fue exitosa
        if (response.ok) {
            //Iterar sobre los productos y agregarlos al contenedor
            products.forEach(product => {
                const productCard = `
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <img src="${product.imagen || 'https://definicion.de/wp-content/uploads/2009/06/producto.png'}" class="card-img-top" alt="${product.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${product.nombre}</h5>
                                <p class="card-text">${product.descripcion}</p>
                                <p class="card-text"><strong>Precio:</strong> $${product.precio}</p>
                                <a href="#" class="btn btn-primary">Ver Detalles</a>
                            </div>
                        </div>
                    </div>
                `;
                //Insertar la tarjeta de producto en el contenedor
                productsContainer.insertAdjacentHTML('beforeend', productCard);
            });
        } else {
            productsContainer.innerHTML = '<p>No se pudieron cargar los productos en este momento.</p>';
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        productsContainer.innerHTML = '<p>Error al cargar los productos.</p>';
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include' //Incluir cookies en la solicitud
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); //Muestra el mensaje de cierre de sesión exitoso
            
            //Intentar eliminar manualmente la cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

            //Redireccionar a la página de inicio de sesión o a otra página
            window.location.href = 'login.html'; 
        } else {
            alert('Error al cerrar sesión.');
        }
    } catch (error) {
        console.error('Error al intentar cerrar sesión:', error);
    }
});