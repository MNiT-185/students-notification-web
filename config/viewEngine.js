const express = require('express')
var path = require('path');

// Config view engine for app

let configViewEngine = (app) =>{
    app.use(express.static('./public')); 
    //app.use( express.static("./public"))
    //app.use(express.static('public'));
    app.set("view engine", "ejs");
    app.set("views", "./views");

}
module.exports = configViewEngine;