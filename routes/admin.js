const router = require('express').Router(); //Usamos o componente Router() para criar rotas em arquivos separados

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

module.exports = router;