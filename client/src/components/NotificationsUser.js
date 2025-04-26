import React, { useEffect } from 'react';
import axios from 'axios';

const NotificationsUser = ({ notificationsUser, setNotificationsUser }) => {
  useEffect(() => {
    const hasUnread = notificationsUser.some(notif => !notif.read);
    const notif = document.querySelector('.notif span');
    if (hasUnread) {
      notif.classList.add('active');
    }
  }, [notificationsUser])

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotificationsUser(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1 className="notifications-title">Your Notifications</h1>
        <div className="notifications-count">{notificationsUser.length} {notificationsUser.length === 1 ? 'notification' : 'notifications'}</div>
      </div>

      {notificationsUser.length > 0 ? (
        <ul className="notifications-list">
          {notificationsUser.map((notif) => (
            <li key={notif._id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
              <div className="notification-content">
                <p className="notification-message">{notif.message}</p>
                <time className="notification-date">{new Date(notif.date).toLocaleString()}</time>
              </div>
              <div className="notification-actions">
                {notif.read ? (
                  <span className="read-badge">Read</span>
                ) : (
                  <button
                    className="mark-read-button"
                    onClick={() => markAsRead(notif._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2 className="empty-title">No notifications yet</h2>
          <p className="empty-message">When you get notifications, they'll appear here.</p>
        </div>
      )}
    </div>
  );
}

export default NotificationsUser;