import React, { useState } from 'react';
import { Button, Alert } from 'reactstrap';
import { auth } from './FirebaseCredentials'

export default function Logout() {
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (logoutError) {
      setError('Error occurred while logging out');
    }
  };

  return (
    <div>
      {error && <Alert color="danger">{error}</Alert>}
      <Button color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}