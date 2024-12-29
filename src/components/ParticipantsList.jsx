import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import axios from "axios";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { getParticipantsList } from "./../url";

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [filter, setFilter] = useState({ house: "", name: "", event: "", category: "" });
  const [totalPoints, setTotalPoints] = useState(0);

  // Fetch participants from API
  useEffect(() => {
    axios
      .get(getParticipantsList, {
        method: "GET",
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

  // Extract unique values for dropdowns
  const houses = [...new Set(participants.map((p) => p.house))];
  const events = [...new Set(participants.map((p) => p.event))];
  const categories = [...new Set(participants.map((p) => p.category))];

  return (
    <div>
      <div className="flex space-x-4">
        <Button onClick={logOut}>Log Out</Button>
      </div>
      <div className="my-4">
        <strong>Total Points:</strong> {totalPoints}
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Filter by Name */}
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          className="p-2 border border-gray-300 rounded"
          value={filter.name}
          onChange={handleFilterChange}
        />

        {/* Filter by House */}
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

        {/* Filter by Event */}
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

        {/* Filter by Category */}
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
            <Table.HeadCell className="text-left font-semibold">Name</Table.HeadCell>
            <Table.HeadCell className="text-left font-semibold">House</Table.HeadCell>
            <Table.HeadCell className="text-left font-semibold">Category</Table.HeadCell>
            <Table.HeadCell className="text-left font-semibold">Event</Table.HeadCell>
            <Table.HeadCell className="text-left font-semibold">Rank</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant, index) => (
                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {participant.name}
                  </Table.Cell>
                  <Table.Cell>{participant.house}</Table.Cell>
                  <Table.Cell>{participant.category}</Table.Cell>
                  <Table.Cell>{participant.event}</Table.Cell>
                  <Table.Cell>{participant.rank}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="5" className="text-center py-4">
                  No participants found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ParticipantsList;