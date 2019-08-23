const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bodyParser = require('body-parser');

require('dotenv').config();

const indexRouter = require('./routes');
const usersRouter = require('./routes/users');


const { sequelize } = require('./models');

const app = express();
sequelize.sync({ force: true });


// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);
app.set('port',process.env.PORT || 3000);


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use('/gltf', express.static(path.join(__dirname,'uploads','gltf')));
app.use('/previewImg', express.static(path.join(__dirname,'uploads','previewImg')));

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave : false,
  secret : process.env.COOKIE_SECRET,
  cookie : {
    httpOnly : true,
    secure : false,
  },
}));
app.use(flash());
app.use(passport.initialize()); //req객체에 passport 설정 심음
app.use(passport.session()); // req.session 객체에 passport 정보를 저장 => req.session 객체는 express-session에서 생성하므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 함.

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'),() => {
  console.log(app.get('port'),'번 포트에서 대기중');
});
