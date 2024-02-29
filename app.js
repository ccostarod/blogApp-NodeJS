//Carregando modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    //Ao conectarmos um grupo de rotas ao app.js, criamos um prefixo, nesse caso 'admin', portanto, para acessar as rotas utilizamos: http://localhost:8081/admin/
        const admin = require('./routes/admin')
    const mongoose = require('mongoose');
    const path = require('path')
//configs
    //body-parser
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())
    //handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(() => {
            console.log("Conectado ao MongoDB");
        }).catch((err) => {
            console.log("Erro ao se conectar: " + err);
        })
    //public
        //Estamos falando pro express que a pasta que esta guardando todos os arquivos estaticos eh a 'public'
            app.use(express.static(path.join(__dirname + "/public")))
//rotas
    //rotas com prefixo admin
        app.use('/admin', admin);
//outros
    const port = 8081;
    app.listen(port, () => {
        console.log("Servidor rodando! ")
    })