const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');


const app = express();
dotenv.config()
const port = process.env.PORT || 1337;
const db = process.env.MONGO_LOCALHOST;

// Routes required
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

// DB
mongoose.connect(db, {
  useNewUrlParser : true,
  useUnifiedTopology: true,
  useCreateIndex : true,
  useFindAndModify: false
  })
  .then(() => console.log("Database connection successful"))

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// Routes tunred into middleware!
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => {
  console.log("The server running on port", port);
})
