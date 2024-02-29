const router = require('express').Router(); //Usamos o componente Router() para criar rotas em arquivos separados
//Eh dessa forma que se usa um model vinculado ao mongodb que está externo ao arquivo principal:
    const mongoose = require('mongoose');
    require('../models/Categoria');
    const Categoria = mongoose.model('categorias');
//em vez de app.get usaremos router
router.get('/', (req, res) => {
    res.render('admin/index')
});

router.get('/posts', (req, res) => {
    res.send('Pagina de posts');
});

router.get('/categorias', (req,res) => {
    res.render("admin/categorias")
});

router.get('/categorias/add', (req,res) =>{
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req,res) => {

    var erros = []

    if(!req.body.nome){
        erros.push({texto: 'Nome inválido'})
    }
    if(!req.body.slug){ 
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2 ){
        erros.push({texto: 'Nome da categoria muito pequeno'})
    }

    if(erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            //Aqui se faz uso do body-parser
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", 'Categoria criada com sucesso')
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", 'Houve um erro ao salvar a categoria, tente novamente')
            res.redirect('/admin')
        })
    }   

})

module.exports = router;