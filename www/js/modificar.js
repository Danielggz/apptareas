
//TAREAS.HTML
var boton_mod = document.getElementById("enviar_mod");

boton_mod.addEventListener("click", function()
{
  var select = document.getElementById('seleccion').value
  var options= "";
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      {
        var datos = JSON.parse(this.response); //DESERIALIZAR ARRAY
        var ObjTarea = datos.tarea;
        var arrayUsuarios = datos.usuarios;
        var nombreAutor;
        var nombreEjecutor;

        console.log(ObjTarea);
        console.log(arrayUsuarios);

        for (const iterator of arrayUsuarios) 
        {
          options+="<option value=" + iterator.id + "> " + iterator.nombre + " </option>";

          if(iterator.id == ObjTarea.autor)
          {
            nombreAutor = iterator.nombre;
          }
          if(iterator.id == ObjTarea.ejecutor)
          {
            nombreEjecutor = iterator.nombre;
          }
        }

        document.getElementById("contenido").innerHTML = `
        <form action='/modificar' method='POST'>
          <input type="hidden" name="id" id="id" value='` + ObjTarea.id + `'>
          <label for='titulo'> Titulo: </label>
          <input type="text" name="titulo" id="titulo" value='` + ObjTarea.titulo + `' required><br/>
          <label for='descripcion'> Descripcion: </label>
          <input type="text" name="descripcion" id="descripcion" value='` + ObjTarea.descripcion + `' required><br/>
          <label for='autor'> Autor: </label>
          <select name='autor'>
            <option value='${ObjTarea.autor}'selected> ${nombreAutor} </option>
            ${options}
          </select><br/>
          <label for='fecha'> Fecha: </label>
          <input type="text" name="fecha" id="fecha" value=` + ObjTarea.fecha + ` required><br/>
          <label for='ejecutor'> ejecutor: </label>
          <select name='ejecutor'>
            <option value='${ObjTarea.ejecutor}'selected> ${nombreEjecutor} </option>
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
    xhttp.open("GET", "/ajax_mod?tarea_get=" + select, true);
    xhttp.send();
    
});



