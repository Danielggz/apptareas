window.onload=function()
{
    //NUEVOUSUARIO.HTML
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
            document.getElementById("enviar").disabled = false; 
        }
    });

    document.getElementById("pwd").addEventListener("blur", function()
    {
        document.getElementById("mensajes").setAttribute("style", "display: none");
    });

    
}
