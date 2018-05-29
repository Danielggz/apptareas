window.onload=function()
{
    document.getElementById("login").addEventListener("focus", function()
    {
        document.getElementById("mensajes").setAttribute("class","ocultar ");
    })
}