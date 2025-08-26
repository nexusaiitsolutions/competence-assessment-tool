import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <div style={{ fontWeight: 700 }}>Nexus Competence Assessment Tool</div>
      <div style={{ marginLeft: '600px', display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            <span className="badge">
              {user.first_name} {user.last_name} — {user.role_type}
            </span>
            <button
              className="btn"
              onClick={logout}
              style={{ marginLeft: '20px' }} // 👈 pushes logout button a bit away from the badge
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
