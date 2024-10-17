const { Sequelize, DataTypes } = require('sequelize');
const db = require("../db/connection");

const User = db.define("user", {
    name: Sequelize.STRING,
    age: Sequelize.NUMBER
})

module.exports = User;