const socket = io();

window.onload = function() {
    const btna=document.getElementById("checkbox-41");
    const state1=`<div class="typewriter"><h1><span>ThereIsNo Cloud</span></h1></div><br><!-- From Uiverse.io by bociKond --><form class="form" action="/login" method="post"><span class="input-span"><label for="text" class="label">Username</label><input type="text" name="connectusername" id="username"/></span><span class="input-span"><label for="password" class="label">Password</label><input type="password" name="connectpassword" id="password"/></span><span class="span"><a href="youtube.com">Forgot password?</a></span><input class="submit" type="submit" value="Send"/></form><div id="back"></div>`;
    const state2=`<div class="typewriter"><h1><span>ThereIsNo Cloud</span></h1></div><br><!-- From Uiverse.io by bociKond --><form class="form" action="/create" method="post"><span class="input-span"><label for="text" class="label">Username</label><input type="text" name="createname" id="username"/></span><span class="input-span"><label for="password" class="label">Password</label><input type="password" name="createmdp" id="password"/></span><input class="submit" type="submit" value="Send"/></form><div id="back"></div>
    `;
    let login=true;
    btna.addEventListener("change",(e)=>{
      if (e.target.checked){
        document.getElementById("connect1").innerHTML=state2
      }else{
        document.getElementById("connect1").innerHTML=state1
      }
      login=!login;
    });
    socket.on("creation",function(e){
        if (!e){ console.log("creation failed")}
    });
    
    }