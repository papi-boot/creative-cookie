import { Socket } from "socket.io";
export class SocketListener {
  public socketListen(method: string, socket: Socket, io: Socket): void {
    socket.on(method, (value) => {
      io.emit(method, value);
    });
  }
}
