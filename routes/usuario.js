const router = require('express').Router();
const mongoose = require('mongoose');
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro', (req, res) => {
    res.render("usuarios/registro")
}).catch

router.use(passport.initialize())
router.use(passport.session())

router.post('/registro', (req, res) => {
    var erros = []

    if (!req.body.nome){
        erros.push({texto: "Nome inválido, tente novamente!"})
    }
    if (!req.body.email){
        erros.push({texto: "E-mail inválido, tente novamente!"})
    }
    if (!req.body.senha){
        erros.push({texto: "Senha inválida, tente novamente!"})
    }

    if (req.body.senha.length < 8) {
        erros.push({texto: "Senha muito curta, tente novamente!"})
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }

    if (erros.length > 0) {
        res.render("usuarios/registro", {erros: erros})
    }
    else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario) {
                req.flash("error_msg", "Já existe uma conta com esse E-mail no sistema")
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                })
                //salt é um valor aleatorio que se mistura com o hash para fazer uma criptografia melhor
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect('/')
                            console.log("Houve um erro durante o salvamento do usuario: " + erro)
                        }

                        novoUsuario.senha = hash // a senha vai ser igual ao hash que foi gerado

                        novoUsuario.save().then(() => {
                            req.flash("success_msg","Usuario Registrado com sucesso!")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar o usuario, tente novamente!")
                            res.redirect('/usuarios/registro')
                            console.log("Houve um erro ao criar o usuario: " + err)
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect('/')
            console.log("Houve um erro interno: " + err)
        })
    }
})

router.get("/login", (req, res) =>{
    res.render('usuarios/login')
})

router.post("/login", (req, res, next) => {
    console.log("Login route hit"); // Verifica se a rota está sendo atingida
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req,res,next)=>{
    req.logOut((err)=>{
        if(err){return next(err)}    
    req.flash('success_msg', "Deslogado com sucesso!")
    res.redirect("/")
    })
})

module.exports = router;