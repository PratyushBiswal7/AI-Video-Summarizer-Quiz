import React, { useState } from 'react';
import VideoForm from '../components/VideoForm';
import ResultView from '../components/ResultView';
import History from '../components/History';

export default function Home() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginTop: 30 }}>
      <div>
        <VideoForm onResult={setSelected} />
        <History onSelect={setSelected} />
      </div>
      <div>
        <ResultView item={selected} />
      </div>
    </div>
  );
}
