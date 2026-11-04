import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    club_name: '',
    date: '',
    venue: '',
    description: ''
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', club_name: '', date: '', venue: '', description: '' });
        setShowModal(false);
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to post event:', err);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>Campus Event Hub</h1>
          <p>Centralized Club Meetups, Workshops &amp; Gatherings</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Post New Event</button>
      </header>

      <main className="content">
        {loading ? (
          <p className="status-text">Loading campus events...</p>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming events listed yet.</p>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((evt) => (
              <div key={evt.id} className="event-card">
                <span className="club-badge">{evt.club_name}</span>
                <h2>{evt.title}</h2>
                <div className="meta-info">
                  <p><strong>📅 Date:</strong> {evt.date}</p>
                  <p><strong>📍 Venue:</strong> {evt.venue}</p>
                </div>
                {evt.description && <p className="description">{evt.description}</p>}
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Add Campus Event</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Event Title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Club Name (e.g., Coding Club, Literary Society)" 
                value={formData.club_name} 
                onChange={(e) => setFormData({...formData, club_name: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Date & Time (e.g., Nov 10, 4:00 PM)" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Venue (e.g., Seminar Hall 2)" 
                value={formData.venue} 
                onChange={(e) => setFormData({...formData, venue: e.target.value})} 
                required 
              />
              <textarea 
                placeholder="Event details or agenda..." 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Publish Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
