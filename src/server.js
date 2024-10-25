//server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const { Tienda, Producto } = require('../models');
const authController = require('../controllers/authController');
const tiendaController = require('../controllers/tiendaController');
const productoController = require('../controllers/productoController');

const app = express();
app.use(express.json());
app.use(cookieParser());

//app.use(cors());
app.use(cors({
  origin: 'http://127.0.0.1:5500', //Cambia esto al origen del frontend
  credentials: true //Permitir el envío de cookies o credenciales
}));

const secretPassword = "claveSuperSecreta";
//Middleware de autenticación
const verificarToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretPassword);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

//Endpoints de autenticación
app.post('/signup', authController.signup); //Registro de nuevo usuario
app.post('/login', authController.login);   //Inicio de sesión
app.post('/logout', authController.logout); //Cerrar sesión (opcional)

//Rutas CRUD de Tiendas (con verificación de token)
app.post('/tiendas', verificarToken, tiendaController.crearTienda);
app.get('/tiendas', verificarToken, tiendaController.obtenerTiendas);
app.get('/tiendas/:id', verificarToken, tiendaController.obtenerTiendaPorId);
app.put('/tiendas/:id', verificarToken, tiendaController.actualizarTienda);
app.delete('/tiendas/:id', verificarToken, tiendaController.eliminarTienda);

//Rutas CRUD de Productos (con verificación de token)
app.post('/productos', verificarToken, productoController.crearProducto);
app.get('/productos', verificarToken, productoController.obtenerProductos);
app.get('/productos/:id', verificarToken, productoController.obtenerProductoPorId);
app.put('/productos/:id', verificarToken, productoController.actualizarProducto);
app.delete('/productos/:id', verificarToken, productoController.eliminarProducto);

const cargaInicial = async () => {
  try {
    //Array Tiendas
    const tiendasChilenas = [
      { nombre: 'Minera del Norte', direccion: 'Av. Prat 100, Antofagasta', ciudad: 'Antofagasta', sector: 'Minería' },
      { nombre: 'Pesca del Pacífico', direccion: 'Calle Baquedano 123, Iquique', ciudad: 'Iquique', sector: 'Pesca' },
      { nombre: 'Agroindustrias Sur', direccion: 'Plaza de Armas 200, Concepción', ciudad: 'Concepción', sector: 'Agroindustria' },
      { nombre: 'Turismo Patagónico', direccion: 'Av. Colón 505, Punta Arenas', ciudad: 'Punta Arenas', sector: 'Turismo' },
      { nombre: 'Comercio Capital', direccion: 'Av. Libertador 123, Santiago', ciudad: 'Santiago', sector: 'Comercio' },
      { nombre: 'Viñas del Valle', direccion: 'Av. del Mar 101, La Serena', ciudad: 'La Serena', sector: 'Viticultura' },
      { nombre: 'Tecnología Central', direccion: 'Calle Condell 456, Valparaíso', ciudad: 'Valparaíso', sector: 'Tecnología' },
      { nombre: 'Pesquería del Sur', direccion: 'Calle Urmeneta 707, Puerto Montt', ciudad: 'Puerto Montt', sector: 'Pesca' },
      { nombre: 'Maderas del Sur', direccion: 'Av. Alemania 606, Temuco', ciudad: 'Temuco', sector: 'Maderera' },
      { nombre: 'Comercio y Servicios Viña', direccion: 'Calle 15 Norte 202, Viña del Mar', ciudad: 'Viña del Mar', sector: 'Comercio' }
    ];

    //Crear las tiendas en la base de datos
    const tiendasCreadas = await Tienda.bulkCreate(tiendasChilenas);
    console.log('Tiendas chilenas creadas con éxito.');

    //Productos específicos para cada sector de las tiendas
    const productosPorSector = {
      'Minería': [
        { nombre: 'Taladro Industrial', precio: 500000, descripcion: 'Taladro especializado para la minería' },
        { nombre: 'Casco de Seguridad', precio: 75000, descripcion: 'Casco certificado para trabajadores de minería' },
        { nombre: 'Detector de Metales', precio: 150000, descripcion: 'Equipo avanzado para detección en minas' }
      ],
      'Pesca': [
        { nombre: 'Red de Pesca', precio: 50000, descripcion: 'Red de alta resistencia para pesca industrial' },
        { nombre: 'Caña de Pescar', precio: 30000, descripcion: 'Caña profesional para pesca deportiva' },
        { nombre: 'Bote Inflable', precio: 200000, descripcion: 'Bote inflable resistente para uso en mar' }
      ],
      'Agroindustria': [
        { nombre: 'Tractor Agrícola', precio: 800000, descripcion: 'Tractor multiuso para trabajos agrícolas' },
        { nombre: 'Sacos de Fertilizante', precio: 40000, descripcion: 'Sacos de fertilizante orgánico' },
        { nombre: 'Sistema de Riego', precio: 120000, descripcion: 'Sistema automatizado de riego' }
      ],
      'Turismo': [
        { nombre: 'Paquete Turístico', precio: 250000, descripcion: 'Paquete turístico completo para la Patagonia' },
        { nombre: 'Ropa Térmica', precio: 100000, descripcion: 'Ropa térmica especial para climas fríos' },
        { nombre: 'Guía de Turismo', precio: 30000, descripcion: 'Guía profesional para excursiones' }
      ],
      'Comercio': [
        { nombre: 'Línea de Caja', precio: 180000, descripcion: 'Sistema automatizado de cobros en caja' },
        { nombre: 'Computadora POS', precio: 250000, descripcion: 'Computadora para gestión de punto de venta' },
        { nombre: 'Escáner de Códigos', precio: 50000, descripcion: 'Escáner de códigos de barra para comercios' }
      ],
      'Viticultura': [
        { nombre: 'Cepas de Uva', precio: 30000, descripcion: 'Cepas certificadas para viticultura' },
        { nombre: 'Tanque de Fermentación', precio: 450000, descripcion: 'Tanque de acero inoxidable para fermentación' },
        { nombre: 'Barril de Roble', precio: 150000, descripcion: 'Barril tradicional de roble para envejecer vino' }
      ],
      'Tecnología': [
        { nombre: 'Laptop', precio: 600000, descripcion: 'Laptop de alto rendimiento para profesionales' },
        { nombre: 'Router de Alta Velocidad', precio: 120000, descripcion: 'Router para conexiones de alta velocidad' },
        { nombre: 'Cámara de Seguridad', precio: 80000, descripcion: 'Cámara de seguridad inteligente' }
      ],
      'Maderera': [
        { nombre: 'Sierra Eléctrica', precio: 220000, descripcion: 'Sierra de precisión para trabajos en madera' },
        { nombre: 'Tablones de Pino', precio: 15000, descripcion: 'Tablones de pino tratados para construcción' },
        { nombre: 'Aceite Protector para Madera', precio: 30000, descripcion: 'Aceite especial para protección de madera' }
      ]
    };

    //Agregar productos para cada tienda creada según su sector
    for (const tienda of tiendasCreadas) {
      const productosConTiendaId = productosPorSector[tienda.sector].map(producto => ({
        ...producto,
        tiendaId: tienda.id //Asignar el ID de la tienda correspondiente
      }));

      //Crear los productos para cada tienda
      await Producto.bulkCreate(productosConTiendaId);
    }

    console.log('Productos creados para cada tienda.');
  } catch (error) {
    console.error('Error al realizar la carga inicial:', error);
  }
};

//cargaInicial();
//Puerto y servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

