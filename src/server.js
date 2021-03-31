const express = require("express");
const routes = require("./routes");
const server = express();

//Template engine
server.set("view engine", "ejs");

//Habilita arquivos estáticos e cria rotas para eles.
server.use(express.static("public"));

//Rotas
server.use(routes);

//Escuta a porta 3000
server.listen(3000);
