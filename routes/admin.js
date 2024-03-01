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
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias: " +err)
        res.redirect("/admin")
    })
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

router.get("/categorias/edit/:id", (req,res) => {
        Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render("./admin/editcategorias", {nome: categoria.nome, slug: categoria.slug, _id: categoria._id});
    }).catch((err) => {
        req.flash("error_msg", 'Essa categoria não existe')
        res.redirect("/admin/categorias")
    })
    
})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        let erros = []

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Nome invalido" })
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ texto: "Slug invalido" })
        }
        if (req.body.nome.length < 2) {
            erros.push({ texto: "Nome da categoria muito pequeno" })
        }
        if (erros.length > 0) {
            Categoria.findOne({ _id: req.body.id }).lean().then((categoria) => {
                res.render("admin/editcategorias", {nome: categoria.nome, slug: categoria.slug, _id: categoria._id, erros:erros})

            }).catch((err) => {
                req.flash("error_msg", "Erro ao pegar os dados")
                res.redirect("admin/categorias")
            })
            
        } else {


            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar a edição da categoria")
                res.redirect("admin/categorias")
            })

        }
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar a categoria")
        req.redirect("/admin/categorias")
    })
})



module.exports = router;