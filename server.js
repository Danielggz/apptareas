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
    name: 'Usuario',
    keys:['SIDuser'],
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
                req.session.idUser = resultado[0].id;

                res.redirect('/tareas');
            }
            else
            {
                fs.readFile('./www/login.html', 'utf-8', function(err, text)
                {
                    text = text.replace('class="ocultar">[mensaje]', 'class="mostrar">Usuario o contraseña incorrectos');
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
    var avatar = req.body.hiddenAvatar;
    
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
                connection.query("INSERT INTO usuarios VALUES('', '" + nombre + "', '" + usuario + "', '" + pwd + "', '" + avatar + "' )");
                
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

app.get('/verTareas', function(req, res){
    connection.query(`
    SELECT tareas.id, titulo, descripcion, usuarios1.nombre as autor, usuarios2.nombre as ejecutor, fecha, estado, usuarios1.id as autorid, usuarios2.id as ejecutorid
    FROM tareas
    INNER JOIN usuarios as usuarios1 ON tareas.autor = usuarios1.id
    INNER JOIN usuarios as usuarios2 ON tareas.ejecutor = usuarios2.id
    `, function(error, resultado){
        if(error)
        {
            throw error;
        }
        else{
            for(let i=0; i<resultado.length; i++)
            {
                var d=new Date(String(resultado[i].fecha));

                var formatFecha = [d.getDate(),d.getMonth(),d.getFullYear()].join('/');
                resultado[i].fecha = formatFecha;
            }
            resultado.forEach(element => {
                if(req.session.idUser==element.autorid&&req.session.idUser==element.ejecutorid)
                {
                    element.permiso = 0; //AUTOR Y EJECUTOR
                }
                if(req.session.idUser==element.autorid&&req.session.idUser!=element.ejecutorid)
                {
                    element.permiso = 1; //AUTOR
                }
                if(req.session.idUser!=element.autorid&&req.session.idUser==element.ejecutorid)
                {
                    element.permiso = 2; //EJECUTOR
                }
                if(req.session.idUser!=element.autorid&&req.session.idUser!=element.ejecutorid)
                {
                    element.permiso = 3; //NADA
                }
                    
            });
            res.send(JSON.stringify(resultado));
        }
    });

});

app.get('/crear', function(req, res)
{
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text){

        var options = "";
        var newtext = ""
        connection.query("SELECT * FROM usuarios", function(error, resultado)
        {
            for(var i=0; i<resultado.length;i++)
            {
                options += "<option value='" + resultado[i].id + "'>" + resultado[i].nombre  + "</option>";

                newtext = `
                <form action='/crear' method='POST' id='nuevatarea'>
                <input type="text" name="titulo" id="titulo" placeholder="Nombre de la tarea" required>
                <input type="text" name="descripcion" id="descripcion" placeholder="Descripción" required>
                <select name='autor' id='autor'>  <option value="" disabled selected> Autor de la tarea </option> ` + options + `<select/>
                <input type="text" name="fecha" id="fecha" value="0000-00-00 00:00:00" required>
                <select name='ejecutor' id='ejecutor'>  <option value="" disabled selected> ¿Quién hace la tarea? </option> ` + options + `<select/>
                <input type="submit" id="enviar_nuevo">
                </form>
                `;
            }

            text = text.replace("[contenido]", newtext);
            res.send(text);
        });  
      });
});

app.post('/crear', function(req, res)
{
    
    var titulo = req.body.titulo;
    var descripcion = req.body.descripcion;
    var autor = req.body.autor;
    var fecha = req.body.fecha;
    var ejecutor = req.body.ejecutor;

    connection.query("INSERT INTO tareas VALUES('', '" + titulo + "', '" + descripcion + "', " + autor + ", '" + fecha + "', " +  ejecutor + ", '')", function(error, resultado1)
    {
        if(error)
        {
            throw error;
        }
        else{
            console.log("TAREA CREADA CON ÉXITO");
            connection.query('SELECT * FROM tareas', function(error, resultado2){
                if(error)
                {
                    console.log('ERROR' + error);
                    throw error;
                }
                else
                {
                    fs.readFile('./www/tareas.html', 'utf-8', function(err, text){

                        var cols = "";
                        var rows = "";
                        var newtext = ""
                        connection.query("SELECT * FROM tareas", function(error, resultado)
                        {
                            for (const iterator of resultado) {
                                cols += "<tr id='" + iterator.id + "'>";
                                rows += "<td>" + iterator.titulo +"</td> <td>" + iterator.descripcion + "</td> <td>" + iterator.autor + "</td> <td>" + iterator.fecha + "</td> <td>" + iterator.ejecutor + "</td> <td>" + iterator.estado + "</td></tr>";
                            }
                
                            newtext=`
                                <table id='tareasTable'>
                                    <thead>
                                        <tr>
                                            <td> Titulo </td>
                                            <td> Descripción </td>
                                            <td> Autor </td>
                                            <td> Fecha </td>
                                            <td> Ejecutor </td>
                                            <td> Estado </td>
                                        </tr>
                                        
                                    </thead>
                                    <tbody>
                                        ${cols}${rows}
                                    </tbody>
                                </table>
                            `;
                
                            text = text.replace("[contenido]", newtext);
                            res.send(text);
                        });  
                      });
                }
            });
        }
    });
});

app.get('/modificar', function(req, res)
{

    var id_mod = req.query.id_mod;
    var titulo_mod = req.query.titulo_mod;
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        var options = "";
        var titulo_mod = ""
        connection.query("SELECT * FROM TAREAS", function(error, resultado)
        {
            for(var i=0; i<resultado.length;i++)
            {
                if(resultado[i].id == id_mod)
                {
                    titulo_mod = resultado[i].titulo;
                }
                options += "<option value='" + resultado[i].id + "'>" + resultado[i].titulo  + "</option>";

            }

            // for (const iterator of resultado) {
            //     options += "<option value='" + iterator.id + "'>" + iterator.titulo  + "</option>";
            //     console.log(options);
            // }
        if(id_mod != null && titulo_mod!=null)
        {
            var newtext = "Elige la tarea que quieres modificar </br> <select id='seleccion'><option value=" + id_mod + " selected> " + titulo_mod + " </option> <" + options + "</select> <input type='submit' value='enviar' id='enviar_mod'> <script src='js/modificar.js'></script>";
        }
        else
        {
            var newtext = "Elige la tarea que quieres modificar </br> <select id='seleccion'><" + options + "</select> <input type='submit' value='enviar' id='enviar_mod'> <script src='js/modificar.js'></script>";
        }
        
        text = text.replace("[contenido]", newtext);
        res.send(text);
        });  
    });  
});

app.get('/ajax_mod/:tarea_get?', function(req, res){

    var tarea_get = req.query.tarea_get;
    var datos ={
        usuarios:[]
    };
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        var formulario = "";
        connection.query(`
        SELECT tareas.id, titulo, descripcion, autor, ejecutor, fecha, estado, usuarios.id as usuarioid, usuarios.nombre as usuarionombre FROM tareas RIGHT JOIN usuarios on tareas.id=${tarea_get} and autor=usuarios.id
        `, function(error, resultado){
           if(error)
           {
               throw error;
           }
           else{
            for (const iterator of resultado) {
                if(iterator.id)
                {
                    datos.tarea = {
                        id: iterator.id,
                        titulo: iterator.titulo,
                        descripcion: iterator.descripcion,
                        autor: iterator.autor,
                        ejecutor: iterator.ejecutor,
                        fecha: iterator.fecha,
                        estado: iterator.estado
                    }
                }
                if(iterator.usuarioid)
                {
                    let user={
                        id: iterator.usuarioid,
                        nombre: iterator.usuarionombre
                    }
                    datos.usuarios.push(user);
                }
            }
            res.send(JSON.stringify(datos));
           }
        });
    }); 
});

app.post('/modificar', function(req, res)
{
    var id= req.body.id;
    var titulo = req.body.titulo;
    var descripcion = req.body.descripcion;
    var autor = req.body.autor;
    var fecha = req.body.fecha;
    var ejecutor = req.body.ejecutor;
    var estado = req.body.estado;

    
    connection.query("SELECT id from tareas", function(error, resultado){
        if(error)
        {
            throw error;
        }
        else
        {

            if(connection.query("UPDATE tareas SET titulo='" + titulo + "', descripcion='" + descripcion + "', autor='" + autor + "', fecha='" + fecha + "', ejecutor='" + ejecutor + "', estado=" + estado + " WHERE ID=" + id))
            {
                console.log("BASE DE DATOS ACTUALIZADA");
                console.log(ejecutor);
                fs.readFile('./www/tareas.html', 'utf-8', function(err, text){

                    var cols = "";
                    var rows = "";
                    var newtext = ""
                    connection.query(`
                    SELECT tareas.id, titulo, descripcion, usuarios1.nombre as autor, usuarios2.nombre as ejecutor, fecha, estado
                    FROM tareas
                    INNER JOIN usuarios as usuarios1 ON tareas.autor = usuarios1.id
                    INNER JOIN usuarios as usuarios2 ON tareas.ejecutor = usuarios2.id
                    `, function(error, resultado)
                    {
                        for (const iterator of resultado) {
                            cols += "<tr id='" + iterator.id + "'>";
                            rows += "<td>" + iterator.titulo +"</td> <td>" + iterator.descripcion + "</td> <td>" + iterator.autor + "</td> <td>" + iterator.fecha + "</td> <td>" + iterator.ejecutor + "</td> <td>" + iterator.estado + "</td></tr>";
                        }
            
                        newtext=`
                            <table id='tareasTable'>
                                <thead>
                                    <tr>
                                        <td> Titulo </td>
                                        <td> Descripción </td>
                                        <td> Autor </td>
                                        <td> Fecha </td>
                                        <td> Ejecutor </td>
                                        <td> Estado </td>
                                    </tr>
                                    
                                </thead>
                                <tbody>
                                    ${cols}${rows}
                                </tbody>
                            </table>
                        `;
            
                        text = text.replace("[contenido]", newtext);
                        res.send(text);
                    });  
                  });
            }
            
            else{
                console.log("NO SE HA ACTUALIZADO LA BASE DE DATOS POR ALGÚN MOTIVO");
                resultado.redirect("/tareas");
            }
        }
    });
});

app.get('/eliminar/:id_del?', function(req, res)
{
    var id_del = req.query.id_del;
    var titulo_del = "";
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        var options = "";
        connection.query("SELECT * FROM TAREAS", function(error, resultado)
        {
            for (const iterator of resultado)
            {
                if(iterator.id == id_del)
                {
                    titulo_del = iterator.titulo;
                }
                options += "<option value='" + iterator.id + "'>" + iterator.titulo  + "</option>";
            }

            if(id_del != null)
            {
                var newtext = "Elige la tarea que quieres eliminar </br> <select id='seleccion'><option value=" + id_del + " selected> " + titulo_del + " </option> <" + options + "</select> <input type='submit' value='enviar' id='enviar_mod'> <script src='js/modificar.js'></script>";
            }
            else
            {
                var newtext = "Elige la tarea que quieres eliminar </br> <select id='seleccion'><" + options + "</select> <input type='submit' value='enviar' id='enviar_mod'> <script src='js/modificar.js'></script>";
            }        
        text = text.replace("[contenido]", newtext);
        res.send(text);
        });  
    });  
});

app.post('/eliminar', function(req, res){

    var idtarea = req.body.tarea_del;
    connection.query("DELETE FROM tareas WHERE id=" + idtarea);
    console.log("TAREA ELIMINADA CON ÉXITO");
    res.redirect('/tareas');

});

app.get('/estado/:id_est?:estado?', function(req, res){
    var estado=req.query.estado;
    var id = req.query.id_est;

    connection.query("UPDATE tareas SET estado=" + estado + " WHERE id=" + id, function(error, resultado){
        if(error)
        {
            throw error;
        }
        else
        {
            console.log("ESTADO ACTUALIZADO");
            connection.query(`
            SELECT tareas.id, titulo, descripcion, usuarios1.nombre as autor, usuarios2.nombre as ejecutor, fecha, estado, usuarios1.id as autorid, usuarios2.id as ejecutorid
            FROM tareas
            INNER JOIN usuarios as usuarios1 ON tareas.autor = usuarios1.id
            INNER JOIN usuarios as usuarios2 ON tareas.ejecutor = usuarios2.id
            `, function(error, resultado)
            {
                if(error)
                {
                    throw error;
                }
                else
                {
                    for(let i=0; i<resultado.length; i++)
                    {
                        var d=new Date(String(resultado[i].fecha));

                        var formatFecha = [d.getDate(),d.getMonth(),d.getFullYear()].join('/');
                        resultado[i].fecha = formatFecha;
                    }
                    resultado.forEach(element => {
                        if(req.session.idUser==element.autorid&&req.session.idUser==element.ejecutorid)
                        {
                            element.permiso = 0; //AUTOR Y EJECUTOR
                        }
                        if(req.session.idUser==element.autorid&&req.session.idUser!=element.ejecutorid)
                        {
                            element.permiso = 1; //AUTOR
                        }
                        if(req.session.idUser!=element.autorid&&req.session.idUser==element.ejecutorid)
                        {
                            element.permiso = 2; //EJECUTOR
                        }
                        if(req.session.idUser!=element.autorid&&req.session.idUser!=element.ejecutorid)
                        {
                            element.permiso = 3; //NADA
                        }
                            
                    });
                    res.send(JSON.stringify(resultado));
                }
            });
        }   
    });

});

app.get('/currentUser', function(req, res)
{
    var usuario = req.session.user;
    connection.query("SELECT avatar FROM usuarios WHERE id=" + req.session.idUser, function(error, resultado)
    {
        if(error)
        {
            throw error;
        }
        else
        {
           var datos={
               usuario:usuario,
               avatar:resultado[0].avatar
           }
            
            res.send(JSON.stringify(datos));
            
        }
    });
    
});


app.get('/imgUser', function(req, res)
{
    connection.query("SELECT avatar FROM usuarios WHERE id=" + req.session.idUser, function(error, resultado)
        {
            if(error)
            {
                throw error;
            }
            else
            {
               var datos={
                   avatar:resultado[0].avatar
               }
                
                res.send(JSON.stringify(datos));
                
            }
        });
});


app.get("/datosUser", function(req, res)
{
    fs.readFile('./www/tareas.html', 'utf-8', function(err, text)
    {
        connection.query("SELECT * FROM usuarios WHERE id=" + req.session.idUser, function(error, resultado)
        {
            if(error)
            {
                throw error;
            }
            else
            {
                setTimeout(function(){
                    res.send(JSON.stringify(resultado));
                }, 500); //SIMULADOR DE LENTITUD
            }
        });
    }); 
    
});

app.post("/datosUser", function(req, res)
{
    var id= req.body.id;
    var nombre = req.body.nombre;
    var pwd = req.body.pwd;

    
    connection.query("SELECT id from usuarios", function(error, resultado){
        if(error)
        {
            throw error;
        }
        else
        {

            if(connection.query("UPDATE usuarios SET nombre='" + nombre + "', pass='" + pwd + "' WHERE ID=" + id))
            {
                console.log("BASE DE DATOS USUARIOS ACTUALIZADA");
                res.redirect("/tareas");
            }
            
            else{
                console.log("NO SE HA ACTUALIZADO LA BASE DE DATOS POR ALGÚN MOTIVO");
                res.redirect("/tareas");
            }
        }
    });
});

app.get("/cerrarSesion", function(req, res)
{
    req.session.user= null;
    req.session.idUser = null;

    res.send();
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

function tablaTareas(res)
{
    
}
