const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');


const app = express();
dotenv.config()
const port = process.env.PORT || 1337;
const db = process.env.MONGO_LOCALHOST;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// DB
mongoose.connect(db, {
  useNewUrlParser : true,
  useUnifiedTopology: true,
  useCreateIndex : true
  })
  .then(() => console.log("Database connection successful"))

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator())

// Routes tunred into middleware!
app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
  console.log("The server running on port", port);
})
