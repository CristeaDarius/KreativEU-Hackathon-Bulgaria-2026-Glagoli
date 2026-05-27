import React, { useState, useEffect } from 'react';

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/places')
      .then(r => r.json())
      .then(setPlaces);
  }, []);

  const handleSelectPlace = async (id) => {
    const res = await fetch(`/api/places/${id}`);
    const data = await res.json();
    setSelectedPlace(data);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedPlace) return;

    const systemMessage = {
      role: 'system',
    content: `You are a guide for "${selectedPlace.name}". You may ONLY answer using the information in the description below. Do not use any outside knowledge, do not make assumptions, and do not invent details. If the answer is not in the description, say "I don't have that information."\n\nDescription:\n${selectedPlace.description}`,
    };

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_MISTRAL_MODEL || 'ministral-8b-latest',
          messages: [systemMessage, ...updatedMessages],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message;
      if (reply) setMessages([...updatedMessages, reply]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Chat</h1>

      <select
        onChange={e => handleSelectPlace(e.target.value)}
        defaultValue=""
        style={{ width: '100%', marginBottom: '1.5rem', padding: '0.5rem' }}
      >
        <option value="" disabled>Select a place...</option>
        {places.map(p => (
          <option key={p.id} value={p.id}>{p.name || p.id}</option>
        ))}
      </select>

      {selectedPlace && (
        <>
          <div style={{ minHeight: '300px', marginBottom: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
              </div>
            ))}
            {loading && <div><em>Thinking...</em></div>}
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${selectedPlace.name || selectedPlace.id}...`}
            rows={3}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <button onClick={sendMessage} disabled={loading}>Send</button>
        </>
      )}
    </div>
  );
};

export default Home;
