const express = require("express");
const routes = require("./routes");
const server = express();

//Template engine
server.set("view engine", "ejs");

//Habilita arquivos estáticos e cria rotas para eles
server.use(express.static("public"));

//Habilita o uso do req.body(corpo das requisições)
server.use(express.urlencoded({ extended: true }));

//Rotas
server.use(routes);

//Escuta a porta 3000
server.listen(3000);
