import fs from "fs/promises";

export async function postNewUser(req, res){
    let {agentCode, fullName, role, password } = req.body;
    if (!agentCode || !fullName || (role !== "admin" && role !== "agent"))
        return res.status(400).json({message: "Required field missing or false"})
    if (!password)
        password = fullName.split("").reverse().join("");
    const id = Date.now();
    const createdAt = new Date().toLocaleString();
    const newUser = { id, agentCode, fullName, role, password ,createdAt};
    const agentsData = await fs.readFile("../server/data/agents.json", "utf-8");
    const agents = JSON.parse(agentsData);
    if (agents.find(agent => agent.agentCode === agentCode))
        return res.status(409).json({ message: "agentCode already exists" });
    agents.push(newUser);
    await fs.writeFile("../server/data/agents.json", JSON.stringify(agents, null, 2));
    res.status(201).json({ message: "User created", user: newUser });
}

export async function getUsers(req, res){
    const agentsData = await fs.readFile("../server/data/agents.json", "utf-8");
    const agents = JSON.parse(agentsData);
    res.json(agents);
}