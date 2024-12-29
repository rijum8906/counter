import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { lazy, useState, useEffect } from "react";
import axios from "axios";
import { getParticipantsListUrl } from "./url";

// Components
const AddParticipant = lazy(() => import("./components/AddParticipant"));
const Private = lazy(() => import("./components/Private"));
const AdminPrivate = lazy(() => import("./components/AdminPrivate"));
const AdminParticipantsList = lazy(() => import("./components/AdminParticipantList"));
const ParticipantsList = lazy(() => import("./components/ParticipantsList"));
const Signin = lazy(() => import("./components/Signin"));

function App() {
  const [participants, setParticipants] = useState([]);
  
  // Fetch participants from API
  useEffect(() => {
    axios
      .get(getParticipantsListUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setParticipants(response.data.participants);
      })
      .catch((error) => console.error("Error fetching participants:", error));
  }, []);
  
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/admin" element={<AdminPrivate><AdminParticipantsList  participants={participants}/></AdminPrivate>} />
        <Route path="/" element={<Private><ParticipantsList participants={participants} /></Private>} />
        <Route path="/add" element={<AdminPrivate><AddParticipant /></AdminPrivate>} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;