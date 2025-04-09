import { create } from "domain";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;
const path = require('path');
const bcrypt = require('bcrypt');
const __dirname = path.resolve();
const datafile = path.join(__dirname,"data");
var fs = require('fs');
import multer from 'multer';
app.use(cookieParser());
app.set("views", path.join(__dirname, "/server/views"));
app.set("view engine", "ejs");
require('dotenv').config();

const saltRounds = 12;

const numbergen=17;
const stringselec = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const templateuser = {
    "username": "no",
    "password": "no",
    "pp": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
    "cookie": {
      "date": null,
      "usercookie": "no"
    },
    "file": {}
};
const templatefile = {
    "date": null,
    "name": null,
    "size": null,
    "mime-type": null,
    "extention": null
};

function cookiegenerator(max) {
  var l = ""
  for (var i = 0; i < max; i++) {
    l += stringselec[Math.floor(Math.random() * max)];
  }
  return l;
}

function dategenerator() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  return today.toISOString();
}

// Database
const mongodb = require('mongodb'); 
//const uri = process.env.URI;
const client = new mongodb.MongoClient('mongodb://127.0.0.1:27017');
async function see_user_data(client,name){ 
  try {
      await client.connect();
      var userdata =await client.db("myDB").collection("users").findOne({"username":name});
      await client.close();
      if (userdata){
        return userdata
      } else {
        return null
      }
  } catch (e) {
      console.error(e);
      await client.close();}
};

async function see_user_cookie(client,cookie){ 
  try {
      await client.connect();
      var userdata =await client.db("myDB").collection("users").findOne({"cookie.usercookie":cookie});
      await client.close();
      if (userdata){
        return userdata.username
      } else {
        return null
      }
  } catch (e) {
      console.error(e);
      await client.close();}
};

async function modifie_user_data(client,name,modifplace,modif){ 
  const modification={[modifplace]:modif}
  try {
      await client.connect();
      try {
        await client.db("myDB").collection("users").updateOne({"username":name},{$set:modification});
        await client.close();
        return true
      } catch (e) {
        console.error(e);
        await client.close();
        return false
      }
  } catch (e) {
      console.error(e);
      await client.close();}
};

async function create_new_user(client,name,password,pp=null){ 
  var newuser=templateuser;
  newuser["username"]=name;
  newuser["password"]=password;
  if (pp){
    newuser["pp"]=pp;
  } 
  try {
      await client.connect();
      try {
        await client.db("myDB").collection("users").insertOne(newuser);
        await client.close();
        return true
      } catch (e) {
        console.error(e);
        await client.close();
        return false
      }
  } catch (e) {
      console.error(e);
      await client.close();}
};

async function add_user_file(client,name,filename,date,fakename,size,extention){ 
  var newfile=templatefile;
  var ext=path.extname(fakename);

  newfile["date"]=date;
  newfile["name"]=fakename;
  newfile["size"]=size;
  newfile["mime-type"]=extention;
  newfile["extention"]=ext;
  var place = "file."+filename
  try {
      await client.connect();
      try {
        await client.db("myDB").collection("users").updateOne({"username":name},{$set:{[place]:newfile}});
        await client.close();
        return true
      } catch (e) {
        console.error(e);
        await client.close();
        return false
      }
  } catch (e) {
      console.error(e);
      await client.close();}
};

async function delete_user(client,name){ 
  const query = { "username": name };
  try {
      await client.connect();
      try {
        await client.db("myDB").collection("users").deleteOne(query);
        await client.close();
        return true
      } catch (e) {
        console.error(e);
        await client.close();
        return false
      }
  } catch (e) {
      console.error(e);
      await client.close();}
};

async function delete_file(client,name,modiffilename){ 
  const modification={[`file.${modiffilename}`]: ""}
  try {
      await client.connect();
      try {
        await client.db("myDB").collection("users").updateOne({"username":name},{$unset:modification});
        await client.close();
        return true
      } catch (e) {
        console.error(e);
        await client.close();
        return false
      }
  } catch (e) {
      console.error(e);
      await client.close();}
};
//! Database

// Upload file
function permulter(userID){
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      const pathtemp=path.join(__dirname,"data",userID)
      callback(null, pathtemp); 
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = cookiegenerator(10);
      callback(null, file.originalname.split('.')[0] +"-"+ uniqueSuffix + path.extname(file.originalname));
    }
  });
  var upload = multer({ storage: storage });
  return upload
};


// Genere page html de l'acceuil + css + js +img ect ...
app.get('/', async function(req, res) { // main page
  var filepath=path.join(__dirname,"public","main.html")
  const puser =await see_user_cookie(client,req.cookies.usercookie) 
  if (puser != null){
    res.redirect('/'+puser)
  } else {
  res.sendFile(filepath);
  console.log("someone is on the main page")
  }
});
app.use('/static',express.static(__dirname+'/public'));

//--------------------------------------------------------------

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.post("/login", async function (req, res) { 
    const password = req.body.connectpassword;
    const username = req.body.connectusername;
    var data = await see_user_data(client,username).catch(console.error)
    const result =await bcrypt.compare(password, data.password);
    if ( password!=(null || "") && data!=null && result==true){
      const usercookie = cookiegenerator(numbergen)
      await modifie_user_data(client,username,"cookie.usercookie",usercookie) 
      res.cookie("usercookie",usercookie)
      res.redirect('/'+username)
      console.log(username, " connected successfully")
    } else {
      res.status(204).send()
      console.log("someone try to connect but fail")
  }
});
app.post("/create", async function (req, res) { 
    const password = req.body.createmdp ;
    const username = req.body.createname;
    var data = await see_user_data(client,username).catch(console.error)
  if ( data==null && password!=(null || "") && username!=(null||"") ){

    const salt=await bcrypt.genSalt(saltRounds).then();
    const hashpassword= await bcrypt.hash(password, salt);
    await create_new_user(client,username,hashpassword)

    fs.mkdirSync(datafile+"/"+username);

    const usercookie = cookiegenerator(numbergen)
    await modifie_user_data(client,username,"cookie.usercookie",usercookie) 
    res.cookie("usercookie",usercookie)
    res.redirect('/'+username)
  } else {
    res.status(204).send()
    io.emit("creation",false);
    console.log("someone try to create an account but fail")
  }
});
//--------------------------------------------------------------

app.get('/:uid', async function(req, res,next) { 
  var uid = req.params.uid;
  var data= await see_user_data(client,uid).catch(console.error);
  if (data!=null && req.cookies.usercookie==data.cookie.usercookie){
    console.log(uid," is now on his own cloud")
    req.uide=uid;  
    res.render('HPuser',
      {"pp":data["pp"],
       "name":uid,
       "datafile":data["file"]
      }); 
    next();
  } else{
    res.redirect('/');
    console.log("connection with ",uid," failed")
  };
});
app.use('/static',express.static(__dirname+'/server/views'),(req,res,next)=>{next()});
app.use('/:uid/file', (req, res, next) => { 
  var uid=req.params.uid;
  var userpath=path.resolve("data",uid)
  if (userpath.startsWith(path.resolve("data"))){
    express.static(__dirname+'/data/'+uid)(req,res,next); 
  }
  else{
    res.status(404).send()
  }
});

//--------------------------------------------------------------

app.post('/upload/:uid', async(req, res) => {
  var uid = req.params.uid;
  console.log(uid, " try to upload a file")
  var data= await see_user_data(client,uid).catch(console.error); 

  if (data!=null && req.cookies.usercookie==data.cookie.usercookie){

    var userpath=path.resolve("data",uid)
    if (userpath.startsWith(path.resolve("data"))){
      permulter(uid).single('file')(req, res, function (err) {
        try {
          const name =uid
          const filename = req.file.filename.split('.')[0]
          const date = dategenerator()
          const fakename = req.file.originalname
          const size = req.file.size
          const type = req.file.mimetype
        
          add_user_file(client,name,filename,date,fakename,size,type)
          console.log(uid, " successfully uploaded a file")
          res.status(204).send()
        } catch (err) {
          console.log(uid, " fail to uploaded a file")
          res.status(400).send({ error: err.message });
        }
      });
    }
  } else {
    res.status(204).send()
    console.log("someone try to upload a file but fail")
  };
});

//--------------------------------------------------------------

io.on ('connection', (socket) => {
  socket.on("filedel",async (msg) =>{
    console.log("someone try to delete a file")
    const usercookie=msg.cookie.split("=")[1]
    const name = await see_user_cookie(client,usercookie).catch(console.error)

    const userpath=path.resolve("data",name,msg.id)
    if (fs.existsSync(path.resolve("data",name,msg.id+"."+msg.extention)) && userpath.startsWith(path.resolve("data"))){
    const filepath=path.resolve("data",name,msg.id+"."+msg.extention)
    fs.unlinkSync(filepath);
    await delete_file(client,name,msg.id)
    io.to(socket.id).emit("reussie",true);
    } else {
      io.to(socket.id).emit("reussie",false);
    }
  });
});

//démmarage !
server.listen(PORT, () => {
  console.log(`Serveur démarré : http://localhost:${PORT}`)
});