import express from "express";
import cors from "cors";
import { Log } from "./logger";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/notifications", async (req, res) => {
  await Log(
    "backend",
    "info",
    "controller",
    "Fetching notifications"
  );

  res.json({
    notifications: [
      {
        id: 1,
        type: "event",
        title: "Hackathon Registration",
        priority: "high",
        read: false
      },
      {
        id: 2,
        type: "result",
        title: "Assessment Result",
        priority: "medium",
        read: true
      },
      {
        id: 3,
        type: "placement",
        title: "Interview Scheduled",
        priority: "high",
        read: false
      }
    ]
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});