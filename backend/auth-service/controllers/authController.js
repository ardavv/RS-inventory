const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
        return res.status(400).json({ error: "User already exists" });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
    return res.status(400).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token });
};

exports.googleCallback = (req, res) => {
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET);
    res.redirect(`/api/auth/redirect?token=${token}`);
};

exports.googleRedirect = (req, res) => {
    res.send(`Token: ${req.query.token}`);
};
