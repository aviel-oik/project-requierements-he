import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import reportsRoute from "./routes/reports.route.js";
import path from "path";

const app = express();

app.use("/images", express.static(path.join(process.cwd(), "uploads")));
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
    res.json({message: "ok!"})
})

app.use("/auth",authRoute);
app.use("/admin/users", adminRoute);
app.use("/reports", reportsRoute);


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})