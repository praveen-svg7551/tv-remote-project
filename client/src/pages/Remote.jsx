import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://YOUR-RENDER-URL.onrender.com");

function Remote() {

  const { roomId } = useParams();

  const [link, setLink] = useState("");

  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  const sendCommand = (command) => {

    socket.emit("remote-command", {
      roomId,
      command,
    });

  };

  const sendLink = () => {

    socket.emit("send-link", {
      roomId,
      link,
    });

    setLink("");

  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
      }}
    >
      <h1>Phone Remote</h1>

      <button
        onClick={() => sendCommand("PLAY")}
      >
        PLAY
      </button>

      <br /><br />

      <button
        onClick={() => sendCommand("PAUSE")}
      >
        PAUSE
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Paste Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br /><br />

      <button onClick={sendLink}>
        SEND LINK TO TV
      </button>

    </div>
  );
}

export default Remote;