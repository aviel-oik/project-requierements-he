import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import crypto from "crypto"
import fs from "fs";
import multer from "multer";
// const upload = multer({ dest: "uploads/" });
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const router = Router();

// router.post("/", authMiddleware, async (req, res) => { // TODO: recevoir une image, erreur 413
//     const { category, urgency, message, imagePath} = req.body;
//     if (!category || !urgency || !message) 
//         return res.status(400).json({ message: "Missing required fields" });
//     const id = crypto.randomUUID();
//     const createdAt = new Date().toISOString(); 
//     const response = await fetch("http://localhost:3000/auth/me", {
//         headers: { Authorization: req.headers.authorization }
//     })
//     const user = await response.json();
//     const agentCode = user.user.agentCode;
//     const sourceType = "Manual";
//     const newReport = { id, category, urgency, message, createdAt, agentCode };
//     if(!fs.existsSync("../server/data/reports.csv")) {
//         await fs.promises.writeFile("../server/data/reports.csv", "ID,UserID,Category,Urgency,Message,imagePath,sourceType,CreatedAt\n");
//     }
//     await fs.promises.appendFile("../server/data/reports.csv", `${id},${agentCode},${category},${urgency},${message},${imagePath || ""},${sourceType || ""},${createdAt}\n`);
//     res.status(201).json({ message: "Report submitted", report: newReport });
// });
router.post(
  "/",
  authMiddleware,
  upload.single("image"), // 👈 AJOUT IMPORTANT
  async (req, res) => {

    const { category, urgency, message } = req.body;

    if (!category || !urgency || !message)
      return res.status(400).json({ message: "Missing required fields" });

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const response = await fetch("http://localhost:3000/auth/me", {
      headers: { Authorization: req.headers.authorization },
    });

    const user = await response.json();
    const agentCode = user.user.agentCode;

    const sourceType = "Manual";

    // ✅ récupérer path image si existe
    const imagePath = req.file ? req.file.path : "";

    if (!fs.existsSync("../server/data/reports.csv")) {
      await fs.promises.writeFile(
        "../server/data/reports.csv",
        "ID,UserID,Category,Urgency,Message,imagePath,sourceType,CreatedAt\n"
      );
    }

    await fs.promises.appendFile(
      "../server/data/reports.csv",
      `${id},${agentCode},${category},${urgency},${message},${imagePath},${sourceType},${createdAt}\n`
    );

    res.status(201).json({
      message: "Report submitted",
      imagePath,
    });
  }
);

router.post("/csv", upload.single("csv"), async (req, res) => { // TODO: erreur structure css, champ obligatoire
    if (!req.file) 
        return res.status(400).json({ message: "No file uploaded" });
    if(!fs.existsSync("../server/data/reports.csv")) 
        await fs.promises.writeFile("../server/data/reports.csv", "ID,UserID,Category,Urgency,Message,imagePath,sourceType,CreatedAt\n");
    const filePath = req.file.path;
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const lines = fileContent.split("\n").slice(0);
    const sourceType = "CSV";
    const createdAt = new Date().toISOString();
    const reports = lines.map(line => {
        const [id, agentCode, category, urgency, message, imagePath, createdAt] = line.split(",");
        return { id, agentCode, category, urgency, message, imagePath, sourceType, createdAt };
    });
    reports.pop();
    await fs.promises.appendFile("../server/data/reports.csv", reports.map(report => `${report.id},${report.agentCode},${report.category},${report.urgency},${report.message},${report.imagePath || ""},${sourceType},${createdAt}`).join("\n") + "\n");
    res.status(201).json({ message: "CSV file processed", reports });
})


router.get("/", authMiddleware, async (req, res) => { 
    const fileContent = await fs.promises.readFile("../server/data/reports.csv", "utf-8");
    const lines = fileContent.split("\n").slice(1);
    const reports = lines.map(line => {
        const [id, agentCode, category, urgency, message, imagePath, sourceType, createdAt] = line.split(",");
        return { id, agentCode, category, urgency, message, 
                      imageUrl: imagePath? `${req.protocol}://${req.get("host")}/images/${imagePath}`: null, sourceType, createdAt };
    });
    console.log("first imagePath:", reports[0]?.imagePath);
    console.log("first imageUrl:", reports[0]?.imageUrl);

    if (req.user.role === "agent"){
        const agentReports = reports.filter(report => report.agentCode === req.user.agentCode);
        return res.json(agentReports);
    }
    const { agentCode, category, urgency } = req.query;
    let filteredReports = reports;
    if (agentCode)
        filteredReports = filteredReports.filter(report => report.agentCode === agentCode);
    if (category)
        filteredReports = filteredReports.filter(report => report.category === category);
    if (urgency)
        filteredReports = filteredReports.filter(report => report.urgency === urgency);
    res.json(filteredReports);
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