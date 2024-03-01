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
    require("./models/Categoria")
    const Categoria = mongoose.model('categorias')
    const passport = require('passport')
    require("./config/auth")(passport)
    

    //Ao conectarmos um grupo de rotas ao app.js, criamos um prefixo, nesse caso 'admin' e 'usuarios', portanto, para acessar as rotas utilizamos: http://localhost:8081/admin/ ou /usuarios
        const admin = require('./routes/admin')
        const usuarios = require('./routes/usuario');
    

//configs
    //session, passport e flash:
            app.use(session({
                secret: "senha",
                resave: true,
                saveUninitialized: true
            }));

            app.use(passport.initialize())
            app.use(passport.session())

            app.use(flash());
    
    //middleware 
            app.use((req, res, next) => {
                //res.locals cria uma   varivel global
                res.locals.success_msg = req.flash("success_msg");
                res.locals.error_msg = req.flash("error_msg");
                res.locals.error = req.flash("error");
                res.locals.user = req.user || null;
                res.locals.eAdmin = req.eAdmin || null;
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
    //rotas com prefixo usuarios
        app.use('/usuarios', usuarios)

    app.get('/', (req,res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/404")
        })
        
    })

    app.get("/postagem/:slug", (req,res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }
            else{
                req.flash("error_msg", "Essa postagem não existe")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
            console.log("Houve um erro interno: ", err)
        })
    })

    app.get("/categorias", (req,res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((err) => {
            req.flash("eror_msg", "Houve um erro interno ao listar as categorias")
            res.redirect("/")
            console.log("Houve um erro interno ao listar as categorias: " + err)
        })
    })

    app.get("/categorias/:slug", (req,res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                }).catch((err) => {
                    req.flash("error_msg","Houve um erro ao listar os posts")
                    res.redirect("/")
                    console.log("Houve um erro interno ao listar os posts: " + err)
                })
            }
            else{
                req.flash("error_msg", "Essa categoria nao existe!")
                req.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a pagina dessa categoria")
            res.redirect("/")
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