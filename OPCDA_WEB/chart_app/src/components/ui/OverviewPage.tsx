import { useEffect, useState } from "react";
import Chart from "../features/chart/Chart";
import { io, Socket } from "socket.io-client";
import { OpcData } from "../../types/basic";

const SOCKET_URL = "http://localhost:3000";

const OverviewPage = () => {
  const [data, setData] = useState<OpcData[]>([]);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.on("opc-data", (msg: OpcData) => setData((prev) => [...prev, msg]));
    return () => {
      socket.disconnect();
    };
  }, []);

  return <Chart data={data} />;
};

export default OverviewPage;
