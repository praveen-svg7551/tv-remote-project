import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://tv-remote-project.onrender.com");

function Remote() {

  const { roomId } = useParams();

  const [link, setLink] = useState("");

  const touchpadRef = useRef(null);

  useEffect(() => {

    socket.emit("join-room", roomId);

  }, [roomId]);

  // Send Link
  const sendLink = () => {

    socket.emit("send-link", {
      roomId,
      link,
    });

  };

  // Touchpad Move
  const handleTouchMove = (e) => {

    const touch = e.touches[0];

    const rect =
      touchpadRef.current.getBoundingClientRect();

    const x =
      (touch.clientX - rect.left) * 4;

    const y =
      (touch.clientY - rect.top) * 2;

    socket.emit("mouse-move", {
      roomId,
      x,
      y,
    });

  };

  // Mouse Click
  const handleClick = () => {

    socket.emit("mouse-click", {
      roomId,
    });

  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>📱 Phone Remote</h1>

      {/* Send Link */}
      <input
        type="text"
        placeholder="Enter website link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br /><br />

      <button
        onClick={sendLink}
        style={{
          padding: "10px 20px",
        }}
      >
        SEND TO TV
      </button>

      <br /><br />

      {/* Touchpad */}
      <div
        ref={touchpadRef}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
        style={{
          width: "320px",
          height: "420px",
          background: "#ddd",
          margin: "auto",
          borderRadius: "20px",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <h2 style={{ paddingTop: "180px" }}>
          TOUCHPAD
        </h2>
      </div>

      <br />

      <button
        onClick={handleClick}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
        }}
      >
        CLICK
      </button>

    </div>
  );
}

export default Remote;