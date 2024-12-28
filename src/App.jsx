import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Components
import AddParticipant from "./components/AddParticipant";
import Private from "./components/Private";
import ParticipantsList from "./components/ParticipantList";
import Signin from "./components/Signin";

function App() {
  return (
    <Router>
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Private><ParticipantsList /></Private>} />
        <Route path="/add" element={<Private><AddParticipant /></Private>} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;