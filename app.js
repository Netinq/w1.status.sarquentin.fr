const sequelize = require("./database/connexion");
const express = require('express');
const { Resolver } = require('./app/core/Resolver');

const app = express();
sequelize.sync()

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(express.json());

new Resolver(60 * 60 * 1000)

module.exports = app;