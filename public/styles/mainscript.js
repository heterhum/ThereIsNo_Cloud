const socket = io();

window.onload = function() {
    const btna=document.getElementById("checkbox-41");
    const state1=`<div class="typewriter"><h1><span>ThereIsNo Cloud</span></h1></div><br><!-- From Uiverse.io by bociKond --><form class="form" action="/login" method="post"><span class="input-span"><label for="text" class="label">Username</label><input type="text" name="connectusername" id="username"/></span><span class="input-span"><label for="password" class="label">Password</label><input type="password" name="connectpassword" id="password"/></span><span class="span"><a href="youtube.com">Forgot password?</a></span><input class="submit" type="submit" value="Send"/></form><div id="back"></div>`;
    const state2=`<div class="typewriter"><h1><span>ThereIsNo Cloud</span></h1></div><br><!-- From Uiverse.io by bociKond --><form class="form" action="/create" method="post"><span class="input-span"><label for="text" class="label">Username</label><input type="text" name="createname" id="username"/></span><span class="input-span"><label for="password" class="label">Password</label><input type="password" name="createmdp" id="password"/></span><input class="submit" type="submit" value="Send"/></form><div id="back"></div>
    `;
    const btnno=document.getElementById("no");
    const btnyes=document.getElementById("yes");
    let login=true;
    btna.addEventListener("change",(e)=>{
      if (e.target.checked){
        document.getElementById("connect1").innerHTML=state2
      }else{
        document.getElementById("connect1").innerHTML=state1
      }
      login=!login;
    });
    btnno.addEventListener("click",()=>{
      var rep=prompt("Afin de refuser les cookies vous allez devoir répondre a cette énigme: Sachant que le nom du pere de phillipe le coiffeur du coins est jean, que le dernier obus tombé a noves est tombé a 3h du matin, que le chien de la voisine est mort et que j'ai beaucoup trop de temps libre, quelle est l'age du capitaine?");
      if (rep=="oui"){
        alert("Bravo, vous avez refusé les cookies, maintenant parté, le site fonctionne pas sans cookies")
        window.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      }
    });
    btnyes.addEventListener("click",()=>{
      document.getElementById("cookie").style.display="none";
      
    });
    socket.on("creation",function(e){
        if (!e){ console.log("creation failed")}
    });
    
    }