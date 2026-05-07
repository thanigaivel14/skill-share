// src/socket.js
import { io } from "socket.io-client";

const socket = io(
  (import.meta.VITE_SOCKET_URL),
  {
    transports: ['websocket'],
    withCredentials: true,
  }
);


export default socket;
