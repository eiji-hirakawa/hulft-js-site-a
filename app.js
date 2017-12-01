var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// authorization
var session = require("express-session");
var authorization = require("./app_modules/session-authorization");

var index = require('./routes/index');
var users = require('./routes/users');
var login = require("./routes/login");
var admin = require("./routes/admin");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// authorization
app.use(session({
  // Cookieの暗号化キー
  secret: "loginapp-chiperkey",
  // true:セッションストアにアクセスするたびにセッションを作り直す、基本false
  resave: false,
  // true:未初期化状態のセッションも保存されるようになる、基本false
  saveUninitialized: false,
  // Cookieの有効期限をミリ秒で設定。指定なし、もしくはnullだとブラウザデフォルトの挙動（一般的にはブラウザを閉じたらCookie削除）
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1day
}));

app.use("/login", login);
app.use("/", authorization.sessionCheck, index);
app.use("/admin", admin);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// =========== socket.io server =========== 
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3100;
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', {
          date: Date.now().toString(),
          message: msg
        });
        console.log(`message: ${msg}`);
    });
});
http.listen(PORT, () => console.log(`listening on *:${PORT}`));
// ================================= 

module.exports = app;
