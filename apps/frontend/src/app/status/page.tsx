'use client';
import { useEffect, useState } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    fetch('http://localhost:3001/api/status')
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus('Error connecting to backend'));
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>System Status</h1>
      <p>{status}</p>
    </div>
  );
}
