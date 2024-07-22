import React, { useState } from "react";
import styles from "./Dashboard.module.css"; // Import module CSS for styling
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

import { updateLocalStorage } from "../helpers/localStorageHelpers";

import AccountUpdateModal from "../components/AccountUpdateModal";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  // Sample data for the rectangles
  const rectangles = [
    { id: 1, color: "red" },
    { id: 2, color: "blue" },
    { id: 3, color: "green" },
    { id: 4, color: "yellow" },
    { id: 5, color: "purple" },
    { id: 6, color: "orange" },
    { id: 7, color: "teal" },
    { id: 8, color: "pink" },
    { id: 9, color: "cyan" },
    { id: 10, color: "lightblue" },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    updateLocalStorage("auth", "");
    navigate(0);
  };

  return (
    <>
      <Header
        HeaderText={"GrooveBrew"}
        isEdit={() => setIsModalOpen(true)}
        isLogout={handleLogout}
        user={user}
      />
      {user && user.roleId < 2 && (
        <div className={styles.dashboard}>
          {rectangles.map((rectangle) => (
            <div
              key={rectangle.id}
              className={styles.rectangle}
              style={{ backgroundColor: rectangle.color }}
            >
              {rectangle.id}
            </div>
          ))}
        </div>
      )}

      {user.username && (
        <AccountUpdateModal
          user={user}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default Dashboard;
