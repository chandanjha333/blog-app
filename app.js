import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { router } from './routes/user.js';
import { checkForAuthenticationCookie } from './middlewares/authentication.js';
import { blogRoute } from './routes/blog.js';
import { Blog } from './models/blog.js';

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then(e => {
  console.log("MongoDB Connected!!!");
});

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({}); 
  res.render('home', {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use('/user', router);
app.use('/blog', blogRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});