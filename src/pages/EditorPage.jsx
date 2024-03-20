import { useEffect, useRef, useState } from "react"
import Client from "../Components/Client"
import Editor from "../Components/Editor"
import { initSocket } from "../socket"
import ACTIONS from "../../Actions"
import { Navigate, useLocation,useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

const EditorPage = () => {

    const handleError = (e) => {
        console.log('socket error',e);
        toast.error('Socket connection failed try again later')
        reactNavigator('/')
    }

    //Socket connection
    const reactNavigator = useNavigate();
    const socketRef = useRef(null)
    const codeRef = useRef(null)
    const location = useLocation()
    const {roomId} = useParams()
    const [clients,setClients] = useState([])
    useEffect(()=>{
        const init = async () => {
            try {
                socketRef.current = await initSocket()
                socketRef.current.on('connection_error',(err)=>handleError(err))
                socketRef.current.on('connection_failed',(err)=>handleError(err))
                socketRef.current.emit(ACTIONS.JOIN,{
                    roomId,
                    username:location.state?.username,
                })
                socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
                    if(username !== location.state?.username){
                        toast.success(`${username} joined the room`)
                    }
                    setClients(clients)
                    socketRef.current.emit(ACTIONS.SYNC_CODE,{
                        code:codeRef.current,
                        socketId
                    })
                })
                //Listening for disconnected
                socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
                    toast.success(`${username} left the room`)
                    setClients((prev) => {
                        return prev.filter(client => client.socketId !== socketId)
                    })
                })
            } catch (error) {
                console.error('Error initializing socket:', error);
            }
        }
        init();
        return () => {
            socketRef.current.disconnect()
            socketRef.current.off(ACTIONS.JOINED)
            socketRef.current.off(ACTIONS.DISCONNECTED)
        }
    },[])


    if(!location.state){
        return <Navigate to='/' />
    }
    const copyRoomId = async() => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied')
        } catch (error) {
            toast.error('Could not copy Room ID')
            console.log(error);
        }
    }
    const leaveBtn = () => {
        reactNavigator('/')
    }
    const copyBtn = async() => {
        try {
            await navigator.clipboard.writeText(codeRef.current)
            console.log(codeRef.current);
            toast.success('CODE copied Successfully')
        } catch (error) {
            toast.error('Could not copy the CODE')
        }
    }
  return (
    <div className="mainWrap h-[100vh]">
        <div className="aside bg-[#1c1e29] p-4 text-white flex flex-col">
            <div className="asideInner flex-1">
                <div className="logo">
                    <img src="/er.png" alt="" className="logoImage h-[60px] mb-3" />
                </div>
                <h3>Connected Members</h3>
                <div className="clientsList flex items-center flex-wrap gap-5 mt-5">
                    {
                        clients.map((client) => <Client key={client.scoketId} username={client.username}/>)
                    }
                </div>
            </div>
            <button
            ref={codeRef}
            onClick={copyBtn}
            className="btn leaveBtn mb-5 font-bold bg-green-100 text-black">Copy Code</button>
            <button
            onClick={copyRoomId}
            className="btn copyBtn font-bold bg-white text-black">Copy Room ID</button>
            <button
            onClick={leaveBtn}
            className="btn leaveBtn mt-5 font-bold bg-[#4aed88] text-black hover:bg-[#2b824c]">Leave</button>
        </div>
        <div className="editorWrap bg-white">
            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current = code}}/>
        </div>
    </div>
  )
}

export default EditorPage
