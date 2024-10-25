//controllers/authController.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');

const secretPassword = "claveSuperSecreta";

//Registro de nuevo usuario (Sign-Up)
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    //Verificar si el email ya está registrado
    const userExistente = await User.findOne({ where: { email } });
    if (userExistente) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    //Crear nuevo usuario
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password //Sin encriptar la contraseña
    });

    //Generar token JWT
    const token = jwt.sign({ id: newUser.id }, secretPassword, { expiresIn: '1h' });

    //Enviar token en la cookie
    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({ message: 'Usuario creado correctamente', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

//Inicio de sesión (Login)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    //Comparar la contraseña sin encriptación
    if (user.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    //Generar token JWT
    const token = jwt.sign({ id: user.id }, secretPassword, { expiresIn: '1h' });

    //Enviar token en la cookie
    res.cookie('token', token, { 
      httpOnly: true,
      secure: false,  //Cambia a `true` si estás en producción con HTTPS
      sameSite: 'Lax'  //O 'None' si el cliente y servidor están en dominios distintos y usas HTTPS
  });

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
};

//Cerrar sesión (Opcional: Logout)
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Cierre de sesión exitoso' });
};
