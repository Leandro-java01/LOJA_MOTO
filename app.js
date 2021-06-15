//var createError = require('http-errors');
var path = require('path');
const cookieParser = require('cookie-parser');
var logger = require('morgan');

var express = require ('express');
var app = express();
const morgan = require('morgan');
//const bodyParser = require('body-parser'); descontinuado

var rotaIndex = require('./routes/index');
var rotaUsers = require('./routes/users');
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/Arq_recebido', express.static('Arq_recebido'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.use('/', rotaIndex);
app.use('/users', rotaUsers);
app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

app.use((req,res,next) => {
    res.header('Acess-Control-Allow-Origin','*');
    res.header(
        'Acess-Control-Allow-Header',
        'Origin, X-Request-Whith, Content-type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});


//Quando não encontra rota
app.use((req,res,next)=>{
    const erro =new Error('Não encontrado');
    erro.status=404;
    next(erro);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    return res.send({
        erro: {
        mensagem: error.message
        }
    });
});

module.exports = app;