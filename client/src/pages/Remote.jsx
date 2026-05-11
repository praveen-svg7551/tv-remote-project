import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://tv-remote-project.onrender.com");

function Remote() {

  const { roomId } = useParams();

  const [link, setLink] = useState("");

  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  const sendLink = () => {

    console.log("Sending:", link);

    socket.emit("send-link", {
      roomId,
      link,
    });

  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
      }}
    >
      <h1>Phone Remote</h1>

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