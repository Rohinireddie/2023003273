import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(10);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredNotifications = notifications
    .filter((item) => {
      if (filter === "all") return true;
      return item.type === filter;
    })
    .slice(0, limit);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Notifications
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filter}
          label="Type"
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="event">Event</MenuItem>
          <MenuItem value="result">Result</MenuItem>
          <MenuItem value="placement">Placement</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Top N Notifications"
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        sx={{ mb: 3 }}
      />

      {filteredNotifications.map((item, index) => (
        <Card
          key={index}
          sx={{
            mb: 2,
            cursor: "pointer",
            backgroundColor: readNotifications.includes(index)
              ? "#f5f5f5"
              : "#fff8dc",
          }}
          onClick={() => {
            if (!readNotifications.includes(index)) {
              setReadNotifications([
                ...readNotifications,
                index,
              ]);
            }
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight={
                readNotifications.includes(index)
                  ? "normal"
                  : "bold"
              }
            >
              {item.title}
            </Typography>

            <Typography>
              Type: {item.type}
            </Typography>

            <Typography>
              Priority: {item.priority}
            </Typography>

            <Typography>
              Status:{" "}
              {readNotifications.includes(index)
                ? "Read"
                : "Unread"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Notifications;