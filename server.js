const express = require('express');
const userRouter = require('./routes/users/userRoutes');
const postRouter = require('./routes/posts/postsRoutes');
const commentRouter = require('./routes/comments/commentsRoutes');
const categoryRouter = require('./routes/categories/categoriesRoutes');
const bodyParser = require('body-parser');
//hna installina (npm i dotenv) bech na9der n7ot les variables d'environnement fi fichier .env w na9der naccedilo mn fichier server.js
// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();  //hedo code how ikhtisar ll deux lines li fo9o

require('./config/dbConnect')
const app = express();

app.use(bodyParser.json());

//middlewares

//-------------------------------------------routes----------------------------------------------------------
//****************usersroutes****************
//POST /api/v1/users/register
app.use(process.env.USER_BASE_PATH, userRouter);

//POST /api/v1/users/login
app.use(process.env.USER_BASE_PATH, userRouter);

//GET /api/v1/users/profile/:id
app.use(process.env.USER_BASE_PATH, userRouter);

//GET /api/v1/users
app.use(process.env.USER_BASE_PATH, userRouter);

//DELETE /api/v1/users/:id
app.use(process.env.USER_BASE_PATH, userRouter);

//PUT /api/v1/users/:id
app.use(process.env.USER_BASE_PATH, userRouter);





//*****************postsroutes**************** 
//POST /api/v1/posts
app.use(process.env.POST_BASE_PATH, postRouter);

//GET /api/v1/posts/:id
app.use(process.env.POST_BASE_PATH, postRouter);

//GET /api/v1/posts
app.use(process.env.POST_BASE_PATH, postRouter);

//DELETE /api/v1/users/:id
app.use(process.env.POST_BASE_PATH, postRouter);

//PUT /api/v1/posts/:id
app.use(process.env.POST_BASE_PATH, postRouter);


//******************commentsroutes*****************
//POST /api/v1/comments
app.use(process.env.COMMENT_BASE_PATH, commentRouter);


//GET /api/v1/comments/:id
app.use(process.env.COMMENT_BASE_PATH, commentRouter);

//DELETE /api/v1/cmments/:id
app.use(process.env.COMMENT_BASE_PATH, commentRouter);

//PUT /api/v1/posts/:id
app.use(process.env.COMMENT_BASE_PATH, commentRouter);

//******************categoriesroutes******************
//POST /api/v1/categories
app.use(process.env.CATEGORY_BASE_PATH, categoryRouter);


//GET /api/v1/posts/:id
app.use(process.env.CATEGORY_BASE_PATH, categoryRouter);


//DELETE /api/v1/users/:id
app.use(process.env.CATEGORY_BASE_PATH, categoryRouter);

//PUT /api/v1/posts/:id
app.use(process.env.CATEGORY_BASE_PATH, categoryRouter);


//----------------------------------------------------------------------------------------------------------
//error handlers middleware

//start server
const port = process.env.PORT || 9000;
app.listen(port, () => { console.log(`Server listening on port ${port}`) });