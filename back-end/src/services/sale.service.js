const moment = require('moment');
// const jwtService = require('../utils/jwt');

const { Sale } = require('../database/models');

const saleService = {
  create: async (data) => {
    const { userId, totalPrice, deliveryAddress, delineryNumber } = data;
    const status = 'Pendente';
    const saleDate = moment().format('L, LTS');
    const newSale = await Sale.create({
    userId, sellerId: 2, totalPrice, deliveryAddress, delineryNumber, saleDate, status,
    });
    return { id: newSale.id };
  },
};

module.exports = saleService;