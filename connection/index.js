const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
});

module.exports = sequelize;