//controllers/tiendaController.js
const { Tienda } = require('../models');

//Crear una tienda
exports.crearTienda = async (req, res) => {
  try {
    const tienda = await Tienda.create(req.body);
    res.status(201).json(tienda);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tienda' });
  }
};

//Obtener todas las tiendas
exports.obtenerTiendas = async (req, res) => {
  try {
    const tiendas = await Tienda.findAll();
    res.json(tiendas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tiendas' });
  }
};

//Obtener una tienda por ID
exports.obtenerTiendaPorId = async (req, res) => {
  try {
    const tienda = await Tienda.findByPk(req.params.id);
    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }
    res.json(tienda);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tienda' });
  }
};

//Actualizar una tienda por ID
exports.actualizarTienda = async (req, res) => {
  try {
    const tienda = await Tienda.findByPk(req.params.id);
    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }
    await tienda.update(req.body);
    res.json(tienda);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tienda' });
  }
};

//Eliminar una tienda por ID
exports.eliminarTienda = async (req, res) => {
  try {
    const tienda = await Tienda.findByPk(req.params.id);
    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }
    await tienda.destroy();
    res.json({ message: 'Tienda eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tienda' });
  }
};
