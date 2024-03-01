// Importando as dependências necessárias
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Importando o modelo de Usuário
require('../models/Usuario')
const Usuario =  mongoose.model('usuarios')

// Exportando uma função que configura o Passport
module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"},(email,senha, done) => {
        Usuario.findOne({email: email}).lean().then((usuario) => {
            
            if(!usuario){
                return done(null, false, {message: "Esta conta não existe"})
            }
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                console.log(batem); // Verifica se as senhas estão sendo comparadas corretamente
                if (batem) {
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario)
    })
    
    passport.deserializeUser((id,done)=>{
        Usuario.findById(id).lean().then((usuario)=>{
            done(null,usuario)
        }).catch((err)=>{
             done (null,false,{message:'algo deu errado'})
        })
    })
}