import React, { useState } from 'react';
import api from '../api/axiosClient';

export default function VideoForm({ onResult }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    onResult(null);
    try {
      setStatus('Transcribing & summarizing...');
      const { data } = await api.post('/video/process', { videoUrl: url });
      onResult(data);
      setStatus('Done');
    } catch (e) {
      setStatus('');
      alert('Processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <form onSubmit={submit} style={{ display: 'flex', gap: 10 }}>
        <input
          type="url"
          placeholder="YouTube URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
          style={{ flexGrow: 1, padding: '8px' }}
          disabled={loading}
        />
        <button disabled={loading || !url.trim()}>{loading ? 'Processing...' : 'Summarize & Quiz'}</button>
      </form>
      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  );
}
