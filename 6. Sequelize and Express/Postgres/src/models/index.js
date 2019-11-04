const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD);

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
    },
);
const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
};
Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

module.exports.sequelize = sequelize;
module.exports.models = models;
