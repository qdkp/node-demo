var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('app');

var app = express();

// 获取端口号
var port = (function(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // 命名管道
    return val;
  }

  if (port >= 0) {
    // 端口号
    return port;
  }

  return false;
})(process.env.PORT || '3000');
// 设置程序的端口号
app.set('port', port);

// 设置模板路径
app.set('views', path.join(__dirname, 'views'));
// 使用jade模板引擎
// 语法参考: http://jade-lang.com/reference/
app.set('view engine', 'jade');

// 设置日志
app.use(logger('dev'));
// 分析请求body
app.use(bodyParser.json());
// 分析cookie
app.use(cookieParser());
// 设置静态文件路径
app.use(express.static(path.join(__dirname, 'public')));

// 设置路由
var router_index = require('./routes/index');
app.use('/', router_index);

// 404错误设置
// TODO 设置404错误页面
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发设置
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 产品错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// 程序启动
var server = http.createServer(app);
server.listen(port);

server.on('error', function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', function() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

    debug('Listening on ' + bind);
});
