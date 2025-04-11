const jwt = require('jsonwebtoken');

function autenticaToken(req, res, next) {
    // console.log('Authorization Header:', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Você não está logado.' });
    }

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = usuario; // salva o usuário na req
        next(); // libera pra próxima função
    } catch (error) {
        return res.status(403).send({ message: 'Token inválido' });
    }
}

module.exports = autenticaToken;
