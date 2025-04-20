export default function verificationMiddleware(req, res, next) {
    if (!req.body.username) return res.sendStatus(400);
    if (!req.body.password) return res.sendStatus(400);

    //TODO: Verificar se o username e password são válidos

    next();
}