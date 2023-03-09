const express = require('express'); //se indica que se requiere express
const app = express(); // se inicia express y se instancia en una constante de nombre app.
const morgan = require('morgan'); //se indica que se requiere morgan
const mysql = require('mysql2/promise');
// settings
app.set('port', 3000); //se define el puerto en el cual va a funcionar el servidor
// Utilities
app.use(morgan('dev')); //se indica que se va a usar morgan en modo dev
app.use(express.json()); //se indica que se va a usar la funcionalidad para manejo de json de express
// Conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'almacen'
});
// Rutas para productos
app.get('/productos', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM productos');
    conn.release();
    res.json(rows);
});
app.get('/productos/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM productos WHERE id = ?',
        [req.params.id]);
    conn.release();
    if (rows.length === 0) return res.status(404).send('Producto no encontrado');
    res.json(rows[0]);
});
app.post('/productos', async (req, res) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query('INSERT INTO productos VALUES (null, ?, ?, ?, ?)', [req.body.nombre, req.body.descripcion, req.body.precio, req.body.inventario]);
    const [rows] = await conn.query('SELECT * FROM productos WHERE id = ?',
        [result.insertId]);
    conn.release();
    res.json(rows[0]);
});
app.put('/productos/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query('UPDATE productos SET nombre=?, descripcion =?, precio =?, inventario = ? WHERE id =? ', [req.body.nombre, req.body.descripcion, req.body.precio, req.body.inventario, req.params.id]);
    const [rows] = await conn.query('SELECT * FROM productos WHERE id = ?',
        [req.params.id]);
    conn.release();
    res.json(rows[0]);
});
app.delete('/productos/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('DELETE FROM productos WHERE id = ?',
        [req.params.id]);
    conn.release();
    res.send("producto borrado");
});

//! Rutas para user
app.get('/user', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM user');
    conn.release();
    res.json(rows);
});
app.get('/user/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM user WHERE id = ?',
        [req.params.id]);
    conn.release();
    if (rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.json(rows[0]);
});
app.get('/user/:usuario/:password', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM user WHERE usuario = ? AND password = ?',
        [req.params.usuario, req.params.password]);
    conn.release();
    if (rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.json(rows[0]);
});
app.post('/user', async (req, res) => {
    const conn = await pool.getConnection();
    console.log(req.body)
    const [result] = await conn.query('INSERT INTO user VALUES (null, ?, ?, ?, ?, ?, ?, 0)', [req.body.nombre, req.body.apellido, req.body.usuario, req.body.password, req.body.telefono, req.body.email]);
    const [rows] = await conn.query('SELECT * FROM user WHERE id = ?',
        [result.insertId]);
    conn.release();
    res.json(rows[0]);
});
app.put('/user/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query('UPDATE user SET nombre=?, apellido =?, usuario =?, password =?, telefono =?, email = ? WHERE id =? ', [req.body.nombre, req.body.apellido, req.body.usuario, req.body.password, req.body.telefono, req.body.email, req.body.id]);
    const [rows] = await conn.query('SELECT * FROM user WHERE id = ?',
        [req.params.id]);
    conn.release();
    res.json(rows[0]);
});
app.delete('/user/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('DELETE FROM user WHERE id = ?',
        [req.params.id]);
    conn.release();
    res.send("¡usuario borrado!");
});
// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log("Servidor funcionando");
}); //se inicia el servidor en el puerto definido y se pone un mensaje en la consola