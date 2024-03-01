const router = require('express').Router(); //Usamos o componente Router() para criar rotas em arquivos separados
//Eh dessa forma que se usa um model vinculado ao mongodb que está externo ao arquivo principal:
    const mongoose = require('mongoose');
    require('../models/Categoria');
    const Categoria = mongoose.model('categorias');
    require('../models/Postagem')
    const Postagem = mongoose.model('postagens');
    const {eAdmin} = require("../helpers/eAdmin")
    require('../models/Usuario')
    const Usuario = mongoose.model('usuarios')

//em vez de app.get usaremos router
router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
});

router.get('/posts', eAdmin,(req, res) => {
    res.send('Pagina de posts');
});

router.get('/categorias', eAdmin, (req,res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias: " +err)
        res.redirect("/admin")
        console.log("Houve um erro ao listar as categorias: " + err)
    })
});

router.get('/categorias/add', eAdmin, (req,res) =>{
    res.render("admin/addcategorias")
})


router.post('/categorias/nova', eAdmin, (req,res) => {

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
            res.redirect('/admin/categorias')
            console.log("Houve um erro ao salvar a categoria: " + err)
        })
    }   

})



router.get("/categorias/edit/:id", eAdmin, (req,res) => {
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
                console.log("Erro ao pegar dados de edicao: ", err)
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
                console.log("Erro ao salvar a edição da categoria: ", err)
            })

        }
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar a categoria")
        req.redirect("/admin/categorias")
        console.log("Erro ao editar categoria: ", err)
    })
})

router.post("/categorias/deletar", eAdmin, (req,res) => {
    Postagem.findOne({categoria: req.body.id}).then((postagem) => {
        if(postagem) {
            req.flash("error_msg", "Categoria sendo usada por uma postagem, primeiro exclua a postagem.")
            res.redirect("/admin/categorias")
        } else {
            Categoria.deleteOne({_id: req.body.id}).then(() => {
                req.flash("success_msg", "Categoria deletada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao deletar a categoria!")
                res.redirect("/admin/categorias")
                console.log("Erro ao deletar categoria: ", err)
            })
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao verificar a categoria!")
        res.redirect("/admin/categorias")
        console.log("Erro ao verificar categoria: ", err)
    })
})

router.get("/postagens", eAdmin, (req,res) => {
    Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect("/admin")
        console.log("Erro ao carregar postagens: ", err)
    })
    
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias : categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulario!")
        res.redirect("/admin")
        console.log("Erro ao carregar formulario de postagens: ", err)
    })
})

router.post('/postagens/nova', eAdmin, (req, res) => {
    var erros = []
    if (req.body.categoria == 0){
        erros.push({texto: "Categoria invalida, registre uma categoria!"})
    }

    if (!req.body.titulo || !req.body.slug || !req.body.descricao || !req.body.conteudo){
        erros.push({texto: "Informação(ões) inválida(s)"})
    }
    if (req.body.descricao.length < 2) {
        erros.push({texto: "Essa descrição é muito curta, tente novamente com uma descrição maior!"})
    }
    if (req.body.conteudo.length < 2) {
        erros.push({texto: "Esse conteúdo é muito curto, tente novamente com um conteúdo maior!"})
    }
    if (erros.length > 0) {
        res.render("admin/addpostagens", {erros : erros})
    }
    else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", 'Postagem criada com sucesso!')
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar postagem, tente novamente")
            res.redirect('/admin/postagens')
            console.log("Erro ao salvar nova postagem: ", err)
        })
    }
    
})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {postagem: postagem, categorias: categorias});
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin/postagens");
        });
    }).catch((err) => {
        req.flash("error_msg", 'Esta postagem não existe');
        res.redirect("/admin/postagens");
    });
});


// Define uma rota POST para "/postagens/edit"
router.post("/postagens/edit", eAdmin, (req, res) => {
    // Cria um array vazio para armazenar possíveis erros
    var erros = []

    // Verifica se a categoria é inválida (0) e, se for, adiciona um erro ao array
    if (req.body.categoria == 0){
        erros.push({texto: "Categoria invalida, registre uma categoria!"})
    }

    // Verifica se algum dos campos obrigatórios está vazio e, se estiver, adiciona um erro ao array
    if (!req.body.titulo || !req.body.slug || !req.body.descricao || !req.body.conteudo){
        erros.push({texto: "Informação(ões) inválida(s)"})
    }

    // Verifica se a descrição é muito curta e, se for, adiciona um erro ao array
    if (req.body.descricao.length < 2) {
        erros.push({texto: "Essa descrição é muito curta, tente novamente com uma descrição maior!"})
    }

    // Verifica se o conteúdo é muito curto e, se for, adiciona um erro ao array
    if (req.body.conteudo.length < 2) {
        erros.push({texto: "Esse conteúdo é muito curto, tente novamente com um conteúdo maior!"})
    }

    // Se houver algum erro, busca as categorias e renderiza a página de edição de postagens com os erros e os dados do formulário
    if (erros.length > 0) {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {erros : erros, postagem: req.body, categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar categorias");
            res.redirect("/admin/postagens");
        });
    }
    // Se não houver erros, busca a postagem pelo ID e atualiza os dados
    else{
        Postagem.findOne({_id: req.body.id}).then((postagem) => {
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;

            // Salva a postagem e redireciona para a página de postagens com uma mensagem de sucesso
            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso!");
                res.redirect("/admin/postagens");
            // Se houver um erro ao salvar a postagem, redireciona para a página de postagens com uma mensagem de erro
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar a edição da postagem");
                res.redirect("/admin/postagens");
            });
        // Se houver um erro ao buscar a postagem, redireciona para a página de postagens com uma mensagem de erro
        }).catch((err) => {
            req.flash("error_msg", "Erro ao editar a postagem");
            res.redirect("/admin/postagens");
        });
    }
});

router.get("/postagens/deletar/:id", eAdmin, (req,res) => {
    Postagem.findByIdAndDelete({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno!")
        console.log("Houve um erro interno: ", err);
    })
})


router.get("/usuarios", eAdmin, (req,res) => {
    Usuario.find().sort({date: 'desc'}).lean().then((usuarios) => {
        res.render("admin/usuarios", {usuarios: usuarios})
    }).catch((err) => {
        res.flash("error_msg", "Erro ao listar usuarios")
        res.redirect('/')
    })
})

router.get("/usuarios/tornarAdmin/:id", eAdmin, (req, res) => {
    Usuario.findByIdAndUpdate(req.params.id, { eAdmin: 1 }, { new: true })
    .then((usuario) => {
        req.flash("success_msg", "Usuário agora é um administrador");
        res.redirect("/admin/usuarios");
    })
    .catch((err) => {
        req.flash("error_msg", "Erro ao tornar usuário administrador");
        res.redirect("/admin/usuarios");
    });
});

module.exports = router;