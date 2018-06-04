window.onload=function()
{
    document.getElementById("pwd2").addEventListener("blur", function()
    {
        if(document.getElementById("pwd").value!=document.getElementById("pwd2").value)
        {
            document.getElementById("mensajes").setAttribute("style", "display: block");
            document.getElementById("mensajes").innerHTML="Las contraseñas deben ser iguales";
            document.getElementById("pwd").focus();
        }
        else
        {
            if(document.getElementById("avatar").value!=undefined)
            {
                document.getElementById('avatar').addEventListener('change', leerArchivo, false);
            }
            document.getElementById("enviar").disabled = false; 
        }
    });

    document.getElementById("pwd").addEventListener("blur", function()
    {
        document.getElementById("mensajes").setAttribute("style", "display: none");
    });


    function leerArchivo(evt)
    {
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.onload=function(f){
            document.getElementById('hiddenAvatar').value = f.target.result;
        }
        reader.readAsDataURL(file);
    }
   
    /*
    function handleFileSelect(evt)
    {
        var files = evt.target.files; // FileList object
        console.log(files);

        var output = [];
        var result;
        
        for(var i=0, f;f = files[i]; i++)
        {
            if(!f.type.match('image.*'))
            {
                continue
            }
            var reader = new FileReader();
            reader.onload = (function(theFile){
                return function(e)
                {
                    result = e.target.result
                    document.getElementById('list').innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name),'"/>'].join('');
                }
            })(f);

            reader.readAsDataURL(f);
        }

        var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() 
                {
                    location.href;
                };
            xhttp.open("POST", "/imagenesBD", true);
            xhttp.setRequestHeader("Content-type", "appplication/json");
            xhttp.addEventListener("load", function(){
            
            });
            xhttp.send();
    }
    */

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

  
}
