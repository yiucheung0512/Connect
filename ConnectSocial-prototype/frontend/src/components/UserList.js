import React from 'react';
import './UserList.css';

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="user-list">
        <div className="user-list-header">
          <h2>Nearby Users</h2>
        </div>
        <div className="no-users">
          No users nearby
        </div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Nearby Users</h2>
        <span className="user-count">{users.length} found</span>
      </div>
      <div className="user-list-content">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-avatar">
              {user.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user.username || `User ${user.id}`}</div>
              <div className="user-distance">
                {user.distance < 1
                  ? `${(user.distance * 1000).toFixed(0)}m away`
                  : `${user.distance.toFixed(1)}km away`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
