const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


//RETORNA TODOS OS pedidos
router.get('/',(req, res, next) => {
    mysql.getConnection(( error, conn) =>{
        if (error) {return res.status(500).send ({ error: error})}
        conn.query( `SELECT pedidos.id_pedidos,
                            pedidos.quantidade,
                            produtos.id_produtos,
                            produtos.nome,
                            produtos.preco
                       FROM pedidos
                 INNER JOIN produtos
                         ON produtos.id_produtos = pedidos.id_produtos`,
            (error, result, field) => {
                if (error) {return res.status(500).send ({ error: error})}
                const response = {
                    quantidadeTotal: result.length,
                    pedidos: result.map(pedidos => {
                        return {
                            id_pedidos: pedidos.id_pedidos,
                            quantidade: pedidos.quantidade,
                            id_produtos: {
                                id_produtos: pedidos.id_produtos,
                                nome: pedidos.nome,
                                preco: pedidos.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os pedidos ',
                                url: 'http://localhost:3000/pedidos' + pedidos.id_pedidos
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    })
 });



//INSERE PEDIDOS
router.post('/', (req, res, next)=> {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM produtos WHERE id_produtos = ?',
        [req.body.id_produtos], 
        (error, result, field) => {
            conn.release();
            if (error){ return res.status(500).send({ error: error}) }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado nenhum produto com este ID'
                })
            }
        })
    });
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?,?)',
            [req.body.id_produtos, req.body.quantidade],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Pedido inserido com sucesso',
                    pedidoCriado: {
                        id_pedidos: result.id_pedidos,
                        id_produtos: req.body.id_produtos,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos pedidos ',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
        })
    });





//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedidos', (req,res,next)=>{
    mysql.getConnection(( error, conn) =>{
        if (error) {return res.status(500).send ({ error: error}) }
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedidos],
            (error, result, field) => {
                if (error) {return res.status(500).send ({ error: error}) }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum pedido com este ID'
                    })
                }
                const response = {
                    pedido: {
                        id_pedidos: result[0].id_pedidos,
                        id_produtos: result[0].id_produtos,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna o pedido procurado',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    })
});


//Exclui um pedidos
router.delete('/', (req,res, next) => {
    mysql.getConnection(( error, conn) => {
        if (error) {return res.status(500).send ({ error: error}) }
        conn.query(
            `DELETE FROM pedidos WHERE id_pedidos = ?;`, [req.body.id_produtos],
            (error, result, field) => {
                conn.release();
                if (error) {return res.status(500).send ({ error: error}) }
                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request:{
                        tipo: 'POST',
                        descricao: 'Insere um pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            id_produtos: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

module.exports=router;