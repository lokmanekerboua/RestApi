const express = require('express');
const userRouter = require('./routes/users/userRoutes');
const postRouter = require('./routes/posts/postsRoutes');
const commentRouter = require('./routes/comments/commentsRoutes');
const categoryRouter = require('./routes/categories/categoriesRoutes');
const bodyParser = require('body-parser');
const globalErrHandler = require('./middlewares/globalErrHandler');

require('dotenv').config();
require('./config/dbConnect')
const app = express();
app.use(bodyParser.json());

//-------------------------------------------routes----------------------------------------------------------
//****************usersroutes****************
app.use(process.env.USER_BASE_PATH, userRouter);

//*****************postsroutes****************
app.use(process.env.POST_BASE_PATH, postRouter);

//******************commentsroutes*****************
app.use(process.env.COMMENT_BASE_PATH, commentRouter);


//******************categoriesroutes******************

app.use(process.env.CATEGORY_BASE_PATH, categoryRouter);


//----------------------------------------------------------------------------------------------------------
//error handlers middleware
app.use(globalErrHandler);

//404 error handler
app.use('*', (req, res) => {
    console.log(req.originalUrl);
    res.status(404).json({
        message: 'Route not found'
    });
});

//start server
const port = process.env.PORT || 9000;
app.listen(port, () => { console.log(`Server listening on port ${port}`) });