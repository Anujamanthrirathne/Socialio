import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import './Notification.css'; // Import custom CSS

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user info from Redux store
  const { auth } = useSelector((store) => store); // Assuming 'auth' contains user data
  const userId = auth?.user.id; // Access the userId from the auth state

  useEffect(() => {
    if (!userId) {
      // If userId is not available, return early or handle the error
      console.log('User is not logged in');
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/notifications/${userId}`);
        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]); // Re-run the effect when userId changes

  // Function to mark a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      // Send PUT request to mark notification as read
      await fetch(`http://localhost:8080/api/notifications/read/${notificationId}`, {
        method: 'PUT',
      });

      // Update the UI by removing the notification from the list
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="notification-panel">
      <h2 className="header">Your Notifications</h2>
      {notifications.length === 0 ? (
        <div className="no-notifications">No notifications yet!</div>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="notification-item"
              onClick={() => handleMarkAsRead(notification.id)} // Mark as read when clicked
            >
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
