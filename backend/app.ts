import express, { Request, Response } from "express";
import { getMachineHealth } from "./machineHealth";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const serviceAccount = require("./engineering-challenge-409002-98ed1d4b8489.json");

const app = express();
const port = 3001;

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const machineDb = db.collection("machineScores");

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to get machine health score
app.post("/machine-health", (req: Request, res: Response) => {
  const result = getMachineHealth(req);
  if (result.error) {
    res.status(400).json(result);
  } else {
    res.json(result);
    machineDb
      .doc(Date.now().toString())
      .set({ ...result, user: req.body.user });
  }
});

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
