const socket = io();

function FileRemoveMenu(file){
  socket.emit("filedel",{"cookie":document.cookie,"id":file.closest("div").attributes["name"].value,"extention":file.closest("div").attributes["chemin"].value.split(".").at(-1)});
  document.getElementById(file.closest("div").attributes["name"].value).remove();
  file.closest("div").style.display="none"
}
function DownLoad(element) {
  const chemin=element.getAttribute("chemin");
  const link = document.createElement("a");
  link.href = chemin;
  link.download = element.querySelector(".ItemName p").textContent; 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function DownLoadMenu(element) {
  const chemin=element.getAttribute("chemin");
  const link = document.createElement("a");
  const id=element.closest("div").attributes["name"].value;
  link.href = chemin;
  link.download = document.getElementById(id).querySelector(`.ItemName p`).textContent; 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
        menu.setAttribute("name","");
        menu.setAttribute("chemin","");
        document.getElementById("zMenuDown").setAttribute("chemin","");
      }
    });
    
    window.spawnmenu=function(e){
      const place = e.getBoundingClientRect();
      var w=place.width;
      var h=place.height;
      menu.setAttribute("name",e.closest("li").attributes["id"].value);
      menu.setAttribute("chemin",e.closest("li").attributes["chemin"].value);
      document.getElementById("zMenuDown").setAttribute("chemin",e.closest("li").attributes["chemin"].value);
      //fuck it
      menu.style.left=place.x-200+"px";
      menu.style.top=place.y+h+"px";
      menu.style.display="block";
    };
  };
