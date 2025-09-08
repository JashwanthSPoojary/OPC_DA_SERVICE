import { useEffect, useState } from "react";
import "./App.css";
import Chart from "./components/features/Chart";
import { io, Socket } from "socket.io-client";
import type { OpcData } from "./types/basic";

const SOCKET_URL = "http://localhost:3000";

const App = () => {
  const [data, setData] = useState<OpcData[]>([]);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });
    socket.on("opc-data", (msg: OpcData) => {
      console.log("Received opc-data:", msg);
      setData((prev) => [...prev, msg]);
    });
    return () => {
      socket.disconnect();
    };

  }, []);

  return (
    <div className="app">
      <Chart data={data} />
    </div>
  );
};

export default App;
