
//TAREAS.HTML
var boton_mod = document.getElementById("enviar_mod");

boton_mod.addEventListener("click", function()
{
  var select = document.getElementById('seleccion').value
  var options = "";
  var id;
  var titulo;
  var descripcion;
  var autor;
  var fecha;
  var estado;
  var idUsu;
  var nombreUsu;

  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      {
        var arrayTareas = JSON.parse(this.response); //DESERIALIZAR ARRAY
        for (const iterator of arrayTareas) 
        {
          if(iterator.id == select)
          {
            id = iterator.id;
            titulo = iterator.titulo;
            descripcion = iterator.descripcion;
            autor = iterator.autor;
            fecha = iterator.fecha; 
            ejecutor = iterator.ejecutor;
            estado = iterator.estado;
          }
          else{
            idUsu = iterator.idUsu;
            nombreUsu = iterator.nombreUsu;
            optionsAutor+="<option value=" + idUsu + "> " + nombreUsu + " </option>";
          }
          
          
        }
        document.getElementById("contenido").innerHTML = `
        <form action='/modificar' method='POST'>
          <input type="hidden" name="id" id="id" value='` + id + `'>
          <label for='titulo'> Titulo: </label>
          <input type="text" name="titulo" id="titulo" value='` + titulo + `' required><br/>
          <label for='descripcion'> Descripcion: </label>
          <input type="text" name="descripcion" id="descripcion" value='` + descripcion + `' required><br/>
          <label for='autor'> Autor: </label>
          <select name='autor'>
            <option selected> ${autor} </option>
            ${options}
          </select><br/>
          <label for='fecha'> Fecha: </label>
          <input type="text" name="fecha" id="fecha" value=` + fecha + ` required><br/>
          <label for='ejecutor'> ejecutor: </label>
          <select name='autor'>
            <option selected> ${ejecutor} </option>
            ${options}
          </select><br/>
          <label for='estado'> Estado: </label>
          <select name='estado' id='estado'>
            <option value='0'> En proceso </option>
            <option value='1'> Finalizada </option> 
          </select>
          <input type="submit" id="enviar_form">

        </form>
        `
      }
    };
    ;
    xhttp.open("GET", "/ajax_mod", true);
    xhttp.send();
    
});

/*
this.document.getElementById("ejemplo").onclick = function(event)
{
  event.prevenDefault();
  var req = new XMLHttpRequest();
  req.open("POST", "/ejemplopost", true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function(){
    if(req.response=="ok")
    {
      alert("datos actualizados");
    }
    else
    {
      alert("error al actualizar")
    }
  });

  req.addEventListener("error", function()
  {
    console.log(req.response);
  });

  var datos = {
    valor1: document.getElementById("valor1").value,
    valor2: document.getElementById("valor2").value
  }
  req.send(JSON.stringify(datos));
}

*/ 


