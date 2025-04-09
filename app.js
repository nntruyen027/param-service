require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paramRoutes = require('./routes/param.route');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/params', paramRoutes);

module.exports = app;
