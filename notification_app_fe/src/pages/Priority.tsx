import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

function Priority() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/notifications")
      .then((res) => res.json())
      .then((data) => {
        const highPriority =
          data.notifications.filter(
            (n: any) => n.priority === "high"
          );

        setNotifications(highPriority);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Priority Notifications
      </Typography>

      {notifications.map((item, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">
              {item.title}
            </Typography>

            <Typography>
              Type: {item.type}
            </Typography>

            <Typography>
              Priority: {item.priority}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Priority;