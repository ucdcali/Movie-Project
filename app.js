import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv'; 

dotenv.config({ path: 'process.env' });

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Express-session setup
app.use(session({
    secret: 'your_secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: false
}));

// Connect-flash setup
app.use(flash());

// Middleware to make flash messages available to all views
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
import routes from './routes/routes.js';
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
