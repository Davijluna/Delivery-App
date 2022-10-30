const crypto = require('crypto');

const { User } = require('../database/models');

const userService = {
  login: async (data) => {
    const passCryptor = crypto.createHash('md5').update(data.password).digest('hex');
    const user = await User.findOne({
      where: { email: data.email, password: passCryptor },
    });
    if (!user) return { status: 404, message: 'Not Found' };
    return user;
  },

  create: async (data) => {
    const passCryptor = crypto.createHash('md5').update(data.password).digest('hex');
    const user = await User.findOne({
      where: { email: data.email },
    });
    if (user) return { status: 409, message: 'User already registered' };
    const newUser = await User.create({ 
      name: data.name, email: data.email, password: passCryptor, role: 'customer',
    });
    return newUser;
  },
};

module.exports = userService;