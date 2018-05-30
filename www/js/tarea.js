window.onload=function()
{ 
    

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            var currentUser = this.responseText;
            document.getElementById("currentUser").innerHTML = "El usuario actual es: " + currentUser;
        }
    };

    xhttp.open("GET", "/currentUser");
    xhttp.send();

    var datosUser = document.getElementById("datosUser");
    var cerrarSesion = document.getElementById("cerrarSesion");
    var botonVer = document.getElementById("verTareas");
    var botonAdd = document.getElementById("addTarea");

    botonVer.addEventListener("click", function(){
        botonAdd.setAttribute("class", "");
        botonAdd.setAttribute("class", "addTarea");
        verTablaTareas();
    });

    datosUser.addEventListener("click", function()
    {
  
        var loader = document.getElementById("loader");

        loader.setAttribute("class", "mostrar loader");
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                var arrayUsuarios = JSON.parse(this.response); //DESERIALIZAR ARRAY

                for (const iterator of arrayUsuarios) 
                {
                    var id = iterator.id;
                    var nombre = iterator.nombre;
                    var usuario = iterator.usuario;
                    var pwd = iterator.pass;

                }
                document.getElementById("contenido2").innerHTML = `
                <form action='/datosUser' method='POST'>
                <input type="hidden" name="id" id="id" value='` + id + `'> 
                <label for='nombre'> Nombre: </label>
                <input type="text" name="nombre" id="nombre" value='` + nombre + `' required><br/>
                <label for='pwd'> Contraseña: </label>
                <input type="password" name="pwd" id="pwd" value=` + pwd + ` required><br/>
                <label for='pwd2'> Repita la contraseña: </label>
                <input type="password" name="pwd2" id="pwd2" required><br/>
                <input type="submit" id="enviar">

                </form>
                `
            }
        };
    xhttp.open("GET", "/datosUser", true);
    xhttp.send();

    });

    cerrarSesion.addEventListener("click", function()
    {
        var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() 
            {
                location.href="/";
            };
        xhttp.open("GET", "/cerrarSesion", true);
        xhttp.send();
    });
}

function verTablaTareas()
{
    var req = new XMLHttpRequest();
    req.open('GET', '/verTareas', true);

    req.addEventListener("load", function()
    {
        llenarTablaTareas(JSON.parse(req.response));
    });
    req.addEventListener("error", function(err){

    });
    req.send(null);
}

function llenarTablaTareas(listaTareas)
{
    var text = "";
    var cols = "";
    for (const iterator of listaTareas) {
        let filas = 
        `
        <tr>
        <td>${iterator.titulo}</td>
        <td>${iterator.descripcion}</td>
        <td>${iterator.autor}</td>
        <td>${iterator.fecha}</td>
        <td>${iterator.ejecutor}</td>
        <td>${iterator.estado}</td>

        </tr>
        `
        cols+=filas;
    }
    text = `
    <table>
        <thead>
            <td> Titulo </td>
            <td> Descripción </td>
            <td> Autor </td>
            <td> Fecha </td>
            <td> Ejecutor </td>
            <td> Estado </td>
        </thead>
        <tbody>
        ${cols}
        </tbody>
    </table>
    `;
    document.getElementById("contenido").innerHTML = text;
}