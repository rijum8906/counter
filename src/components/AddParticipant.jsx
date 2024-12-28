import { useState } from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { addParticipantUrl } from "./../url";

const AddParticipant = () => {
  const [participant, setParticipant] = useState({
    name: "",
    house: "Udaigiri",
    category: "Under 14 Boys",
    event: "100m",
    rank: "1",
  });

  const events = [
    "100m",
    "200m",
    "400m",
    "800m",
    "1500m",
    "3000m",
    "Javeline",
    "Shotput",
    "Discus",
    "High Jump",
    "Long Jump",
    "Triple Jump",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        addParticipantUrl,
        participant,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Participant added successfully!");
      setParticipant({
        name: "",
        house: "Udaigiri",
        category: "Under 14 Boys",
        event: "100m",
        rank: "1",
      });
    } catch (error) {
      console.error("Error adding participant:", error);
      alert("Failed to add participant.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-md max-w-md mx-auto"
    >
      <div className="mb-4">
        <Link to="/">
          <Button>See Participants</Button>
        </Link>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={participant.name}
          onChange={handleChange}
          placeholder="Enter name"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2" htmlFor="house">
          House
        </label>
        <select
          id="house"
          name="house"
          value={participant.house}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Udaigiri">Udaigiri</option>
          <option value="Nilgiri">Nilgiri</option>
          <option value="Shiwalik">Shiwalik</option>
          <option value="Arawalli">Arawalli</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={participant.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Under 14 Boys">Under 14 Boys</option>
          <option value="Under 17 Boys">Under 17 Boys</option>
          <option value="Under 19 Boys">Under 19 Boys</option>
          <option value="Junior Girls">Junior Girls</option>
          <option value="Senior Girls">Senior Girls</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2" htmlFor="event">
          Event
        </label>
        <select
          id="event"
          name="event"
          value={participant.event}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          {events.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2" htmlFor="rank">
          Rank
        </label>
        <select
          id="rank"
          name="rank"
          value={participant.rank}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          {[...Array(8)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Button type="submit" color="success">
          Add Participant
        </Button>
      </div>
    </form>
  );
};

export default AddParticipant;