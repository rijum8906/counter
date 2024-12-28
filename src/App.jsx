import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { lazy } from "react";

// Components
const AddParticipant = lazy(() => import("./components/AddParticipant"));
const Private = lazy(() => import("./components/Private"));
const AdminPrivate = lazy(() => import("./components/AdminPrivate"));
const AdminParticipantsList = lazy(() => import("./components/AdminParticipantList"));
const ParticipantsList = lazy(() => import("./components/ParticipantsList"));
const Signin = lazy(() => import("./components/Signin"));

function App() {
  
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/admin" element={<AdminPrivate><AdminParticipantsList /></AdminPrivate>} />
        <Route path="/" element={<Private><ParticipantsList /></Private>} />
        <Route path="/add" element={<Private><AddParticipant /></Private>} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;