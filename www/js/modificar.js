
//TAREAS.HTML
var boton_mod = document.getElementById("enviar_mod");

boton_mod.addEventListener("click", function()
{
  var id;
  var titulo;
  var descripcion;
  var autor;
  var fecha;
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      {
        var arrayTareas = JSON.parse(this.response); //DESERIALIZAR ARRAY
        console.log(arrayTareas);
        for (const iterator of arrayTareas) 
        {
          id = iterator.id;
          titulo = iterator.titulo;
          descripcion = iterator.descripcion;
          autor = iterator.autor;
          fecha = iterator.fecha; 
          ejecutor = iterator.ejecutor;
        }
        document.getElementById("contenido").innerHTML = `
        <form action='/modificar' method='POST'>
          <input type="hidden" name="id" id="id" value='` + id + `'>
          <label for='titulo'> Titulo: </label>
          <input type="text" name="titulo" id="titulo" value='` + titulo + `' required><br/>
          <label for='descripcion'> Descripcion: </label>
          <input type="text" name="descripcion" id="descripcion" value='` + descripcion + `' required><br/>
          <label for='autor'> Autor: </label>
          <input type="text" name="autor" id="autor" value=` + autor + ` required><br/>
          <label for='fecha'> Fecha: </label>
          <input type="text" name="fecha" id="fecha" value=` + fecha + ` required><br/>
          <label for='ejecutor'> ejecutor: </label>
          <input type="text" name="ejecutor" id="ejecutor" value=` + ejecutor + ` required><br/>
          <input type="submit" id="enviar_form">

        </form>
        `
      }
    };
    var select = document.getElementById('seleccion').value;
    xhttp.open("GET", "/ajax_mod?enviar_mod="+ select, true);
    xhttp.send();
    
});


