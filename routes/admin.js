const router = require('express').Router(); //Usamos o componente Router() para criar rotas em arquivos separados

//em vez de app.get usaremos router
router.get('/', (req, res) => {
    res.send('Pagina principal do painel adm');
});

router.get('/posts', (req, res) => {
    res.send('Pagina de posts');
});

router.get('/categorias', (req,res) => {
    res.send("pagina de categorias");
});

module.exports = router;