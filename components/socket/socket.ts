
import { io, Socket } from "socket.io-client";

export const socket: Socket = io("https://askdoubt-backend.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
  query: {
    video_id: "waves",
    user_id: "user_1",
    session_id: "session_1",
  },
});

export const updateSocketParams = (videoId: string, userId: string = "user_1", sessionId: string = "session_1") => {
    socket.io.opts.query = {
        video_id: videoId,
        user_id: userId,
        session_id: sessionId
    };
    if (socket.connected) {
        socket.disconnect().connect();
    } else {
        socket.connect();
    }
};
