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
    const novaCategoria = {
        //Aqui se faz uso do body-parser
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log("Categoria salva com sucesso");
    }).catch((err) => {
        console.log("Erro ao salvar categoria: " + err);
    })

})

module.exports = router;