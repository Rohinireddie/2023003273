import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Notifications from "./pages/Notifications";
import Priority from "./pages/Priority";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/">
          Notifications
        </Link>

        <Link to="/priority">
          Priority Notifications
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={<Notifications />}
        />

        <Route
          path="/priority"
          element={<Priority />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;