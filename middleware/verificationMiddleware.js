export default function verificationMiddleware(req, res, next) {
    let username = req.body?.username;
    let password = req.body?.password
    if (!username) return res.sendStatus(400);
    if (!password) return res.sendStatus(400);

    next();
}