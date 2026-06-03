import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { router } from './routes/user.js';
import { checkForAuthenticationCookie } from './middlewares/authentication.js';

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/weblog').then(e => {
  console.log("MongoDB Connected!!!");
});

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get('/', (req, res) => {
  res.render('home', {
    user: req.user,
  });
});

app.use('/user', router);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});