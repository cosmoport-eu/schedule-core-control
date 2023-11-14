import React, { useState, useEffect } from 'react';

export default function ServerTime({ timestamp = 0 }) {
  const current = +new Date();
  const diff = current - (timestamp > 0 ? timestamp * 1000 : current);

  const [delta, setDelta] = useState(diff);
  const [x, setX] = useState(true);

  const date = new Date(current - delta);

  // timestamp prop change
  useEffect(() => setDelta(diff), [timestamp]);

  // on 1sec timer
  useEffect(() => {
    const interval = setInterval(() => setX((prev) => !prev), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {date.getHours()}
      <span style={{ opacity: x ? '.999' : '0' }}>:</span>
      {`${date.getMinutes()}`.padStart(2, '0')}
    </>
  );
}
