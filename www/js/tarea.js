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
 
    datosUser.addEventListener("click", function()
    {
        var req = new XMLHttpRequest();
        req.open("GET", "/datosUser", true);


        if(req.status>=200 && req.status<400)
        {
            var arrayDatos = JSON.parse(this.response); //DESERIALIZAR ARRAY
            console.log(arrayDatos);
        }
        else
        {
            console.log(req.status + " " + req.statusText);
        }

    });

    cerrarSesion.addEventListener("click", function()
    {
        alert("HEHE");
    });
}