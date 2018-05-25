
//TAREAS.HTML
var boton_mod = document.getElementById("enviar_mod");

boton_mod.addEventListener("click", function()
{
    var datosTarea = datosTarea();
    
});

function datosTarea() 
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      {
        document.getElementById("contenido").innerHTML =
        this.responseText;
      }
    };
    var select = document.getElementById('seleccion').value;
    xhttp.open("GET", "/ajax_mod?enviar_mod="+ select, true);
    xhttp.send();
}