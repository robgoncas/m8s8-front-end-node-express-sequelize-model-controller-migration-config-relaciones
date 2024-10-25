
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tienda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //define association here
      Tienda.hasMany(models.Producto, {
        foreignKey: 'tiendaId',
        as: 'productos'
      });
    }
  }
  Tienda.init({
    nombre: DataTypes.STRING,
    direccion: DataTypes.STRING,
    ciudad: DataTypes.STRING,
    sector: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tienda',
  });
  return Tienda;
};