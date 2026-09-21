"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourDeg = h * 30 + m * 0.5;
  const minDeg = m * 6 + s * 0.1;

  return (
    <div className="clock-card">
      <div className="kicker">The room clock</div>
      <div className="clock-face" aria-hidden="true">
        <div className="hand hour" style={{ transform: `rotate(${hourDeg}deg)` }} />
        <div className="hand minute" style={{ transform: `rotate(${minDeg}deg)` }} />
        <div className="hand second" />
        <div className="pivot" />
      </div>
      <div className="meta">{now.toLocaleString()}</div>
    </div>
  );
}
