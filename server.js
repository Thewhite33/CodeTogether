import Express from 'express';
import http from 'http'
import {Server} from 'socket.io'
import ACTIONS from './Actions.js';
import path from 'path';

const app = Express();
const server = http.createServer(app)
const io = new Server(server);
//app.use(Express.static('dist'))
// app.use((req,res,next)=>{ 
//     res.sendFile(path.join(__dirname,'dist','index.html'))
// })
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

    //Socket for User to Join
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

    //Socket for Code to share
    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    //Socket for Disconnecting
    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms]
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id]
        socket.leave();
    })
})

const PORT = 5000
server.listen(PORT,()=>console.log(`Listening on port ${PORT}`))
