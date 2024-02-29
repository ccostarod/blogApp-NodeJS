//Carregando modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    //Ao conectarmos um grupo de rotas ao app.js, criamos um prefixo, nesse caso 'admin', portanto, para acessar as rotas utilizamos: http://localhost:8081/admin/
        const admin = require('./routes/admin')
    //const mongoose = require('mongoose'); -> nao vou utilizar ainda

//configs
    //body-parser
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())
    //handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    //mongoose
//rotas
    //rotas com prefixo admin
        app.use('/admin', admin);
//outros
    const port = 8081;
    app.listen(port, () => {
        console.log("Servidor rodando! ")
    })