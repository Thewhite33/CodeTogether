import { useState } from "react"
import { v4 as uuid } from "uuid"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"


const Home = () => {
    const navigate = useNavigate()
    const [id, setid] = useState("")
    const [username,setUsername] = useState("")
    const handleEnter = (e) => {
        if(e.code === 'Enter'){
            joinRoom()
        }
    }
    const createNewRoom = (e) => {
        e.preventDefault()
        const _id = uuid();
        setid(_id)
        toast.success('Created a new Room')
    }
    const joinRoom = () => {
        if(!id || !username){
            toast.error('ROOM ID & Username is required')
            return
        }
        navigate(`/editor/${id}`,{
            state:{
                username,
            }
        })
    }
  return (
    <div className="homePageWrapper flex items-center justify-center text-white min-h-screen">
        <div className="formWrapper bg-[#282a36] p-5 rounded-[10px] w-[400px] max-w-[90%]">
            <img src="/er.png" alt="logo" className="h-[80px] mb-[30px]"/>
            <h4 className="mainLabel mb-5 mt-0">Paste inviation ROOM ID</h4>
            <div className="inputGroup flex flex-col">
                <input 
                value={id}
                onChange={(e)=>setid(e.target.value)}
                onKeyUp={handleEnter}
                type="text"  className="inputBox p-[10px] rounded-[5px] mb-[40px] bg-[#eee] text-[16px] font-bold text-black" placeholder="ROOM ID"/>
                <input
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                onKeyUp={handleEnter}
                type="text"  className="inputBox p-[10px] rounded-[5px] mb-[40px] bg-[#eee] text-[16px] font-bold text-black" placeholder="USERNAME"/>
                <button
                onClick={joinRoom}
                className="btn joinBtn bg-[#4aed88] w-[100px] ml-auto hover:bg-[#2b824c] font-bold">Join</button>
                <span className="createInfo mt-5 my-auto font-bold">
                    If you dont't have an invite than create &nbsp;
                    <a href="" onClick={createNewRoom} className="createNewBtn text-[#4aed88] border-b border-[#4aed88] transition-all ease-in-out duration-300 hover:text-[#368654] hover:border-[#368654]">new room</a>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Home