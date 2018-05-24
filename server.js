//<------------------DEPENDENCIAS-------------->

var express = require('express'); //LIBRERÍA EXPRESS
var bodyParser = require('body-parser')
var fs = require('fs');
var mysql = require('mysql'); //LIBRERÍA MYSQL
var app = express();

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);

//<---------------------------------------CONEXION CON BASE DE DATOS-------------------------------------------->

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apptareas',
    port: 3306 //Puerto por defecto
  });
  connection.connect(function(error){
    if(error)
    {
       throw error;
    }
    else
    {
       console.log('Conexion correcta. Conectado como root');
    }
  });

//<---------------------------------------ENDPOINTS (EXPRESS)-------------------------------------------->
app.get('/', function(req, res){
    fs.readFile('./www/index.html', 'utf-8', function(err, text){

        res.send(text);
      });
});

app.get('/login', function(req, res)
{
    fs.readFile('./www/login.html', 'utf-8', function(err, text){

        res.send(text);
      });
});

app.post('/login', function(req, res){

    var usuario = req.body.login;
    var pwd = req.body.pwd;

    connection.query("SELECT * FROM usuarios", function(error, resultado)
    {
        for(var i=0; i<resultado.length; i++)
        {
            if(resultado[i].usuario==usuario && resultado[i].pass==pwd)
            {
                console.log("LOGIN CORRECTO. HOLA + " + resultado[i].nombre);
                res.redirect("/"); //A PÁGINA DE TAREAS YA
            }
        }
        console.log("usuario o contraseña incorrectos. vuelva a intentarlo si eso");
    });

    

});

app.get('/nuevousu', function(req, res)
{
    fs.readFile('./www/nuevoUsuario.html', 'utf-8', function(err, text){

        res.send(text);
      });
});

app.post('/nuevousu', function(req, res){

    var nombre = req.body.nombre;
    var usuario = req.body.usuario;
    var pwd = req.body.pwd;

    
    connection.query("SELECT usuario from usuarios", function(error, resultado){
        if(error)
        {
            throw error;
        }
        else
        {
            if(usuario==resultado[0].usuario)
            {   
                console.log("Error. Usuario ya existe");
                res.redirect("/");
            }
            else{
                connection.query("INSERT INTO usuarios VALUES('', '" + nombre + "', '" + usuario + "', '" + pwd + "' )");
                console.log("NUEVO USUARIO " + usuario + " AGREGADO CON ÉXITO APLASTANTE");
                
                res.redirect("/");
            }
        }
    });
});



//INICIO EXPRESS
app.use(express.static('www'));


//INICIAR SERVIDOR
var server = app.listen(3000, function () {
    console.log('Servidor web APPTAREAS iniciado');
  });


//<---------------------------------------------MÉTODOS--------------------------------------------------------->
function connectBD(usuario, pass)
{
  var connection = mysql.createConnection({
    host: 'localhost',
    user: usuario,
    password: pass,
    database: 'apptareas',
    port: 3306 //Puerto por defecto
  });
  connection.connect(function(error){
    if(error)
    {
       throw error;
    }
    else
    {
       console.log('Conexion correcta. Conectado como' + usuario);
    }
  });
}