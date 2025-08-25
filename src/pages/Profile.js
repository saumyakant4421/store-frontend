import React from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();

  if (!user) return <div className="profile-not-logged">Not logged in.</div>;

  return (
    <div className="profile-outer">
      <div className="profile-box">
        <h2 className="profile-title">Profile</h2>
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
        {user.address && <div><strong>Address:</strong> {user.address}</div>}
      </div>
    </div>
  );
}

export default Profile;
