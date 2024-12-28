import React, { useState, useEffect } from "react";
import { Table, Modal, Button, TextInput, Select } from "flowbite-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getParticipantsList, editParticipantUrl } from "./../url";

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [filter, setFilter] = useState({ house: "", name: "", event: "", category: "" });
  const [totalPoints, setTotalPoints] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);

  // Fetch participants from API
  useEffect(() => {
    axios
      .get(getParticipantsList, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setParticipants(response.data.participants);
        setFilteredParticipants(response.data.participants);
      })
      .catch((error) => console.error("Error fetching participants:", error));
  }, []);

  // Update filtered participants whenever filters or data change
  useEffect(() => {
  const filtered = participants.filter((participant) => {
    return (
      (filter.house === "" || participant.house === filter.house) &&
      (filter.event === "" || participant.event === filter.event) &&
      (filter.category === "" || participant.category === filter.category) &&
      (filter.name === "" || participant.name.toLowerCase().includes(filter.name.toLowerCase()))
    );
  });

  setFilteredParticipants(filtered);
  calculateTotalPoints(filtered);
}, [filter, participants]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalPoints = (participants) => {
    let points = 0;
    participants.forEach((participant) => {
      const rank = parseInt(participant.rank, 10); // Convert rank to a number
      if (rank === 1) points += 10;
      else if (rank === 2) points += 7;
      else if (rank === 3) points += 5;
    });
    setTotalPoints(points);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleEditClick = (participant) => {
    setCurrentParticipant(participant);
    setEditModalOpen(true);
  };
  
  const handleEditSubmit = () => {
  axios
    .put(`${editParticipantUrl}/${currentParticipant._id}`, currentParticipant, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      const updatedParticipant = response.data.data.updatedParticipant;

      // Update participants array
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant._id === updatedParticipant._id ? updatedParticipant : participant
        )
      );

      // Update filteredParticipants array
      setFilteredParticipants((prevFiltered) =>
        prevFiltered.map((participant) =>
          participant._id === updatedParticipant._id ? updatedParticipant : participant
        )
      );

      setEditModalOpen(false);
    })
    .catch((error) => console.error("Error updating participant:", error));
};
  

  // Extract unique values for dropdowns
  const houses = [...new Set(participants.map((p) => p.house))];
  const events = [...new Set(participants.map((p) => p.event))];
  const categories = [...new Set(participants.map((p) => p.category))];

  return (
    <div>
      <div className="flex space-x-4">
        <Link to="/add">
          <Button>Add Participant</Button>
        </Link>
        <Button onClick={logOut}>Log Out</Button>
      </div>
      <div className="my-4">
        <strong>Total Points:</strong> {totalPoints}
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Filter Inputs */}
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          className="p-2 border border-gray-300 rounded"
          value={filter.name}
          onChange={handleFilterChange}
        />
        <select
          name="house"
          className="p-2 border border-gray-300 rounded"
          value={filter.house}
          onChange={handleFilterChange}
        >
          <option value="">Filter by House</option>
          {houses.map((house, index) => (
            <option key={index} value={house}>
              {house}
            </option>
          ))}
        </select>
        <select
          name="event"
          className="p-2 border border-gray-300 rounded"
          value={filter.event}
          onChange={handleFilterChange}
        >
          <option value="">Filter by Event</option>
          {events.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </select>
        <select
          name="category"
          className="p-2 border border-gray-300 rounded"
          value={filter.category}
          onChange={handleFilterChange}
        >
          <option value="">Filter by Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Participants Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white rounded shadow-md">
          <Table.Head className="bg-gray-100">
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>House</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Event</Table.HeadCell>
            <Table.HeadCell>Rank</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant, index) => (
                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{participant.name}</Table.Cell>
                  <Table.Cell>{participant.house}</Table.Cell>
                  <Table.Cell>{participant.category}</Table.Cell>
                  <Table.Cell>{participant.event}</Table.Cell>
                  <Table.Cell>{participant.rank}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => handleEditClick(participant)}>Edit</Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center py-4">
                  No participants found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <Modal.Header>Edit Participant</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <TextInput
                name="name"
                placeholder="Name"
                value={currentParticipant.name}
                onChange={(e) =>
                  setCurrentParticipant((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Select
                name="house"
                value={currentParticipant.house}
                onChange={(e) =>
                  setCurrentParticipant((prev) => ({ ...prev, house: e.target.value }))
                }
              >
                <option value="">Select House</option>
                {houses.map((house, index) => (
                  <option key={index} value={house}>
                    {house}
                  </option>
                ))}
              </Select>
              <Select
                name="category"
                value={currentParticipant.category}
                onChange={(e) =>
                  setCurrentParticipant((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <TextInput
                name="event"
                placeholder="Event"
                value={currentParticipant.event}
                onChange={(e) =>
                  setCurrentParticipant((prev) => ({ ...prev, event: e.target.value }))
                }
              />
              <TextInput
                name="rank"
                placeholder="Rank"
                type="number"
                value={currentParticipant.rank}
                onChange={(e) =>
                  setCurrentParticipant((prev) => ({ ...prev, rank: e.target.value }))
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
            <Button color="gray" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ParticipantsList;