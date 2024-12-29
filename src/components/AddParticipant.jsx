import { useState } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { addParticipantUrl } from "./../url";

const AddParticipant = () => {
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
    isAdmin = JSON.parse(atob(token.split(".")[1])).isAdmin;
  }

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
    "Javelin",
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
      const response = await axios.post(addParticipantUrl, participant, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-6 flex justify-between">
        {isAdmin && (
          <Link to="/admin">
            <Button color="purple">Admin Panel</Button>
          </Link>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="name" value="Name" />
        <TextInput
          id="name"
          name="name"
          value={participant.name}
          onChange={handleChange}
          placeholder="Enter participant's name"
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="house" value="House" />
        <Select
          id="house"
          name="house"
          value={participant.house}
          onChange={handleChange}
          required
        >
          <option value="Udaigiri">Udaigiri</option>
          <option value="Nilgiri">Nilgiri</option>
          <option value="Shiwalik">Shiwalik</option>
          <option value="Arawalli">Arawalli</option>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="category" value="Category" />
        <Select
          id="category"
          name="category"
          value={participant.category}
          onChange={handleChange}
          required
        >
          <option value="Under 14 Boys">Under 14 Boys</option>
          <option value="Under 17 Boys">Under 17 Boys</option>
          <option value="Under 19 Boys">Under 19 Boys</option>
          <option value="Junior Girls">Junior Girls</option>
          <option value="Senior Girls">Senior Girls</option>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="event" value="Event" />
        <Select
          id="event"
          name="event"
          value={participant.event}
          onChange={handleChange}
          required
        >
          {events.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="rank" value="Rank" />
        <Select
          id="rank"
          name="rank"
          value={participant.rank}
          onChange={handleChange}
          required
        >
          {[...Array(8)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6 text-center">
        <Button type="submit" color="success" size="lg">
          Add Participant
        </Button>
      </div>
    </form>
  );
};

export default AddParticipant;