'use strict';
module.exports = (sequelize, DataTypes) => {
  const suretybond = sequelize.define('suretybond', {
    kode_bank: 
    {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    timestamps: false,
    tableName: 't_penjaminan',
    ids: false
  });
  suretybond.associate = function(models) {
    // associations can be defined here
  };
  return suretybond;
};