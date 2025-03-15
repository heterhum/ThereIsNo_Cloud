const socket = io();

function FileRemove(file){
    //console.log(file.closest("li").attributes["chemin"].value);
    socket.emit("filedel",{"cookie":document.cookie,"id":file.closest("li").id,"extention":file.closest("li").attributes["chemin"].value.split(".").at(-1)});
    document.getElementById(file.closest("li").id).remove();
}
socket.on("reussie",function(e){
    console.log("file delete ?",e)
});

window.onload = function() {
    document.getElementById("file").addEventListener("change", function() {
        document.getElementById("uploadForm").submit();
    });
    document.getElementsByClassName("userbutton")[0].addEventListener("click", function() {
        document.cookie="usercookie=;";
        window.location.href = "/";

    

});
};
