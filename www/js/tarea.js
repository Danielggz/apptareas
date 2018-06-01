window.onload=function()
{ 
    var contenido = document.getElementById("contenido");
    var contenido2 = document.getElementById("contenido2");
    console.log(contenido);
    if(contenido.innerText ==  "[contenido]")
    {
        verTablaTareas();
    }




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
    var filas = "";
    for (const iterator of listaTareas) {
        let permisos = '';
        let newestado ='';

        switch(iterator.permiso){
            case 0:
                permisos = `
                <a id='botonMod${iterator.id}' onclick='modificar(${iterator.id});'> <i class="fas fa-pen-square"> </i> </a>
                <a id='botonDel${iterator.id}' onclick='eliminar(${iterator.id});'> <i class="fas fa-trash"></i></a>
                <a id='botonEst${iterator.id}' onclick='cambioEstado(${iterator.id}, ${iterator.estado});'> <i class="fas fa-check-square"></i> </a>
                `
            break;

            case 1:
                permisos = `
                <a id='botonMod${iterator.id}' onclick='modificar(${iterator.id});'> <i class="fas fa-pen-square"> </i> </a>
                <a id='botonDel${iterator.id}' onclick='eliminar(${iterator.id});'> <i class="fas fa-trash"></i> </a>`
            break;

            case 2:
                permisos = `
                <a id='botonEst${iterator.id}' onclick='cambioEstado(${iterator.id}, ${iterator.estado});'> <i class="fas fa-check-square"></i> </a>
                `
            break;

            case 3:
            break;
        }

        if(iterator.estado==0)
        {
            newestado = 'En proceso';
        }
        else{
            newestado = 'Finalizada';
        }

        filas = `
            <tr>
            <td>${iterator.titulo}</td>
            <td>${iterator.descripcion}</td>
            <td>${iterator.autor}</td>
            <td>${iterator.fecha}</td>
            <td>${iterator.ejecutor}</td>
            <td>${newestado}</td>
            <td>
            ${permisos}
            </td>
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
            <td> Acciones </td>
        </thead>
        <tbody>
        ${cols}
        </tbody>
    </table>
    `;
    document.getElementById("contenido").innerHTML = text;
}

function modificar(id)
{
    var botonMod = document.getElementById("botonMod" + id);
    botonMod.setAttribute("href", "/modificar?id_mod=" + id);
}

function eliminar(id)
{
    var botonDel= document.getElementById("botonDel" + id);
    botonDel.setAttribute('href', '/eliminar?id_del=' + id);
}

function cambioEstado(id, estado)
{
    if(confirm('Cambiar el estado?'))
    {
        if(estado==0)
        {
            estado = 1;
        }
        else
        {
            estado = 0
        }
    }
    else{
        return -1;
    }

    var req = new XMLHttpRequest();
    req.open('GET', "/estado?id_est=" + id + "&estado= " + estado, true);

    req.addEventListener("load", function()
    {
        llenarTablaTareas(JSON.parse(req.response));
    });
    req.addEventListener("error", function(err){

    });
    req.send(null);
}