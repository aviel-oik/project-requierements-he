import { Router } from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { agentCode, password } = req.body;
    if (!agentCode || !password) 
        return res.status(400).json({ message: "agentCode and password are required" });
    const agentsData = await fs.readFile("../server/data/agents.json", "utf-8");
    const agents = JSON.parse(agentsData);
    const agent = agents.find(agent => agent.agentCode === agentCode && agent.password === password);
    if (!agent) 
        return res.status(401).json({ message: "no agent found" });
    const token = jwt.sign({ agentCode: agent.agentCode, role: agent.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: agent });
});

router.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) 
        return res.status(401).json({ message: "token required" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const agentsData = await fs.readFile("../server/data/agents.json", "utf-8");
        const agents = JSON.parse(agentsData);
        const agent = agents.find(agent => agent.agentCode === decoded.agentCode);
        if (!agent)
            return res.status(404).json({ message: "agent not found" });
        res.json({ user: agent });
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

export default router;