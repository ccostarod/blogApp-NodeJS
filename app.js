//Carregando modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    //Ao conectarmos um grupo de rotas ao app.js, criamos um prefixo, nesse caso 'admin', portanto, para acessar as rotas utilizamos: http://localhost:8081/admin/
        const admin = require('./routes/admin')

//configs
    //session e flash:
            app.use(session({
                secret: "senha",
                resave: true,
                saveUninitialized: true
            }));

            app.use(flash());
    
    //middleware 
            app.use((req, res, next) => {
                //res.locals cria uma   varivel global
                res.locals.success_msg = req.flash("success_msg");
                res.locals.error_msg = req.flash("error_msg");
                next();
            })
            
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
    app.get('/', (req,res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/404")
        })
        
    })

    app.get("/404", (req,res) => {
        res.send('Erro 404!')
    })
//outros
    const port = 8081;
    app.listen(port, () => {
        console.log("Servidor rodando! ")
    })