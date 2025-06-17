const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try{
        const { email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ error: "User already exists" });
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { email, password: hashed } });
        // const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ message: "User registered successfully", user: { id: user.id, email: user.email } });
    }
    catch (error) {
        // Jika terjadi error apa pun (DB down, dll), log dan kirim respons error
        console.error("[AuthService] Registration Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password)
        return res.status(400).json({ error: "Invalid credentials" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, JWT_SECRET);

      console.log(`[AuthService] User ${user.email} logged in.`);
      res.json({ token });
    } catch (error) {
      // Jika terjadi error apa pun (DB down, dll), log dan kirim respons error
      console.error("[AuthService] Login Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

exports.googleCallback = (req, res) => {
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET);
    res.redirect(`/api/auth/redirect?token=${token}`);
};

exports.googleRedirect = (req, res) => {
    res.send(`Token: ${req.query.token}`);
};
