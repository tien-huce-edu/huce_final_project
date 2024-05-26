import { Socket, Server as SocketIOServer } from "socket.io"

export const initSocketServer = (server: any) => {
    const io = new SocketIOServer(server)

    io.on("connection", (socket) => {
        console.log(`A user ${socket.id} connected`)

        socket.on("notification", (data) => {
            io.emit("newNotification", data)
        })
        socket.on("disconnect", () => {
            console.log(`A user ${socket.id} disconnected`)
        })
    })
}
