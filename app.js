//Carregando modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    //const mongoose = require('mongoose'); -> nao vou utilizar ainda

//configs
    //body-parser
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    //mongoose
//rotas

//outros
    const port = 8081;
    app.listen(port, () => {
        console.log("Servidor rodando! ")
    })