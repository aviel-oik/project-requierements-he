import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import crypto from "crypto"
import fs from "fs";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/", authMiddleware, async (req, res) => { // TODO: recevoir une image, erreur 413
    const { category, urgency, message, imagePath, sourceType} = req.body;
    if (!category || !urgency || !message) 
        return res.status(400).json({ message: "Missing required fields" });
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString(); 
    const response = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: req.headers.authorization }
    })
    const user = await response.json();
    const agentCode = user.user.agentCode;
    const newReport = { id, category, urgency, message, createdAt, agentCode };
    if(!fs.existsSync("../server/data/reports.csv")) {
        await fs.promises.writeFile("../server/data/reports.csv", "ID,UserID,Category,Urgency,Message,imagePath,sourceType,CreatedAt\n");
    }
    await fs.promises.appendFile("../server/data/reports.csv", `${id},${agentCode},${category},${urgency},${message},${imagePath || ""},${sourceType || ""},${createdAt}\n`);
    res.status(201).json({ message: "Report submitted", report: newReport });
});

router.post("/csv", upload.single("csv"), async (req, res) => { // TODO: erreur structure css, champ obligatoire
    if (!req.file) 
        return res.status(400).json({ message: "No file uploaded" });
    const filePath = req.file.path;
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const lines = fileContent.split("\n").slice(0   );
    const reports = lines.map(line => {
        const [id, agentCode, category, urgency, message, imagePath, sourceType, createdAt] = line.split(",");
        return { id, agentCode, category, urgency, message, imagePath, sourceType, createdAt };
    });
    await fs.promises.appendFile("../server/data/reports.csv", lines.join("\n"));
    res.status(201).json({ message: "CSV file processed", reports });
})

router.get("/", authMiddleware, async (req, res) => { // TODO: filter...
    const fileContent = await fs.promises.readFile("../server/data/reports.csv", "utf-8");
    const lines = fileContent.split("\n").slice(1);
    const reports = lines.map(line => {
        const [id, agentCode, category, urgency, message, imagePath, sourceType, createdAt] = line.split(",");
        return { id, agentCode, category, urgency, message, imagePath, sourceType, createdAt };
    });
    res.json(reports);
});

router.get("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const fileContent = await fs.promises.readFile("../server/data/reports.csv", "utf-8");
    const lines = fileContent.split("\n").slice(1);
    const report = lines.map(line => {
        const [reportId, agentCode, category, urgency, message, imagePath, sourceType, createdAt] = line.split(",");
        return { id: reportId, agentCode, category, urgency, message, imagePath, sourceType, createdAt };
    }).find(report => report.id === id);
    if (!report)
        return res.status(404).json({ message: "Report not found" });
    res.json(report);
});

export default router;