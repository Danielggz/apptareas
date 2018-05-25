//<------------------DEPENDENCIAS-------------->

var express = require('express'); //LIBRERÍA EXPRESS
var bodyParser = require('body-parser')
var fs = require('fs');
var mysql = require('mysql'); //LIBRERÍA MYSQL
var app = express();
var cookieSession = require('cookie-session'); //LIBRERÍA COOKIES cookie-session

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);

//COOKIES
app.use(cookieSession({
    name: 'prueba',
    keys:['SIDprueba'],
    maxAge: 24*60*60*1000 //24h
}));

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
    
    //cookies
    req.session.views = (req.session.views || 0) + 1;
    console.log("Visitas a la página: " + req.session.views);

    fs.readFile('./www/index.html', 'utf-8', function(err, text){

        res.send(text);
      });
});

app.get('/login', function(req, res)
{
    if(req.session.user != undefined)
    {
        res.redirect('/tareas');
    }
    else
    {
        fs.readFile('./www/login.html', 'utf-8', function(err, text){
            res.send(text);
          });
    }
    
});

app.post('/login', function(req, res){

    var usuario = req.body.login;
    var pwd = req.body.pwd;

    connection.query("SELECT * FROM usuarios where usuario='" + usuario + "' and pass='" + pwd + "'", function(error, resultado)
    {
        if(error)
        {
            throw error;
        }
        else
        {
            if(resultado.length>0)
            {
                console.log("LOGIN CORRECTO. HOLA " + resultado[0].nombre);
                //cookie
                req.session.user = usuario;
                console.log(req.session.user);
                res.redirect('/tareas');
            }
            else
            {
                fs.readFile('./www/login.html', 'utf-8', function(err, text)
                {
                    text = text.replace("[mensaje]", "El usuario o la contraseña es incorrecto. Por favor vuelva a introducirlo");
                    res.send(text);
                });    
            }
        }
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

app.get('/tareas', function(req, res)
{
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text){

        res.send(text);
      });
});

app.get('/crear', function(req, res)
{
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text){

        var newtext = `
        <form action='/crear' method='POST' id='nuevatarea'>
            <input type="text" name="titulo" id="titulo" placeholder="Nombre de la tarea" required>
            <input type="text" name="descripcion" id="descripcion" placeholder="Descripción" required>
            <input type="text" name="autor" id="autor" placeholder="Autor" required>
            <input type="text" name="fecha" id="fecha" placeholder="Fecha(dd/m/y)" required>
            <input type="text" name="hora" id="hora" placeholder="Hora" required>
            <input type="text" name="ejecutor" id="ejecutor" placeholder="Quien hace la tarea" required>
            <input type="submit" id="enviar">
        </form>
        `;
        
        text = text.replace("[contenido]", newtext);
        res.send(text);
      });
});

app.get('/modificar', function(req, res)
{
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        var options = "";
        connection.query("SELECT * FROM TAREAS", function(error, resultado)
        {
            for(var i=0; i<resultado.length;i++)
            {
                options += "<option value='" + resultado[i].id + "'>" + resultado[i].titulo  + "</option>";
            }

            // for (const iterator of resultado) {
            //     options += "<option value='" + iterator.id + "'>" + iterator.titulo  + "</option>";
            //     console.log(options);
            // }
        var newtext = "Elige la tarea que quieres modificar </br> <select id='seleccion'>" + options + "</select> <input type='submit' value='enviar' id='enviar_mod'> <script src='js/script2.js'></script>";
        
        text = text.replace("[contenido]", newtext);
        res.send(text);
        });  
    });  
});

app.get('/ajax_mod/:enviar_mod?', function(req, res){
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        var formulario = "";
        var id = req.query.enviar_mod;
        connection.query("SELECT * FROM TAREAS WHERE tareas.id=" + id, function(error, resultado){
           if(error)
           {
               throw error;
           }
           else{
            res.send(resultado);
           }
        });
    }); 
});


/*
app.post('/modificar', function(req, res)
{

    var opcion = req.query;
    console.log(opcion);
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        connection.query("SELECT * FROM TAREAS", function(error, resultado)
        {
            for(var i=0; i<resultado.length;i++)   
        });  
    });  
});
*/

app.get('/eliminar', function(req, res)
{
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        var options = "";
        connection.query("SELECT * FROM TAREAS", function(error, resultado)
        {
            for (const iterator of resultado)
            {
                options += "<option value='" + iterator.id + "'>" + iterator.titulo  + "</option>";
            }

        var newtext = "<form action='/eliminar' method='POST' id='edit1'> Elige la tarea que quieres eliminar </br> <select>" + options + "</select> <input type='submit' id='enviar'> </form>";
        
        text = text.replace("[contenido]", newtext);
        res.send(text);
        });  
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