const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Carpeta para archivos estáticos (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para registrar usuarios
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Faltan datos');
    }
    // Verificar si el usuario ya está registrado
    const users = fs.readFileSync('users.txt', 'utf-8').split('\n');
    const userExists = users.some(user => user.startsWith(username + ','));
    if (userExists) {
        return res.status(400).send('Usuario ya registrado');
    }
    // Guardar el usuario y la contraseña en el archivo
    fs.appendFileSync('users.txt', `${username},${password}\n`);
    res.send('Usuario registrado exitosamente');
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Faltan datos');
    }
    // Leer usuarios del archivo
    const users = fs.readFileSync('users.txt', 'utf-8').split('\n');
    const userFound = users.some(user => {
        const [storedUsername, storedPassword] = user.split(',');
        return storedUsername === username && storedPassword === password;
    });

    if (userFound) {
        res.send({ success: true, message: 'Login exitoso' });
    } else {
        res.status(401).send({ success: false, message: 'Login fallido' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});


