import Express from 'express';
import http from 'http'
import {Server} from 'socket.io'
import ACTIONS from './Actions.js';

const app = Express();
const server = http.createServer(app)
const io = new Server(server);
const userSocketMap = {}
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId]
        }
    })
}

io.on('connection',(socket)=>{
    console.log('Socket connected',socket.id);
    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        userSocketMap[socket.id] = username
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId)
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id,
            })
        })
    })
})

const PORT = 5000
server.listen(PORT,()=>console.log(`Listening on port ${PORT}`))
