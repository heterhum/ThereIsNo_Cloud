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
    const MenuBtn=document.getElementsByClassName("MenuBtn");
    const menu=document.getElementById("menu");

    document.getElementById("file").addEventListener("change", function() {
        document.getElementById("uploadForm").submit();
    });
    document.getElementsByClassName("userbutton")[0].addEventListener("click", function() {
        document.cookie="usercookie=;";
        window.location.href = "/";
    });
    document.addEventListener("click",function(e){
      if(!menu.contains(e.target) && !Array.from(MenuBtn).includes(e.target)){
        menu.style.display="none";
      }
    });
    
    window.spawnmenu=function(e){
      const place = e.getBoundingClientRect();
      var w=place.width;
      var h=place.height;
      //fuck it
      menu.style.left=place.x-200+"px";
      menu.style.top=place.y+h+"px";
      menu.style.display="block";
    };
  };
