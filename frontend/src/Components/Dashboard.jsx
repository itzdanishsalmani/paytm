import { useEffect, useState } from "react";
import axios from "axios";

export function Dashboard() {
    const [allUsers, setAllUsers] = useState([]); 
    const [balance,setBalance] = useState("");
    const [currentUser,setCurrentUser] = useState("")

    useEffect(() => {
        axios.get(`http://localhost:7000/api/v1/user/bulk`)
            .then(res => {
                // Ensure that the response contains the 'user' array
                    setAllUsers(res.data.user);
            })
            .catch(err => {
                console.error(err); // Handle the error
            });

            const userId=localStorage.getItem("userId")
            axios.get(`http://localhost:7000/api/v1/account/balance/${userId}`)
            .then(res=>{
                setBalance(res.data.balance);
            })
            .catch(err=>{
                console.log(err)
            })

            axios.get(`http://localhost:7000/api/v1/user/current/${userId}`)
            .then(res => {
                    console.log(res.data.firstName)
                    setCurrentUser(res.data.firstName);
            })
            .catch(err => {
                console.error(err); // Handle the error
            });
    }, [setBalance,setAllUsers,setCurrentUser]);

    return (
        <div>
            <Title balance={balance} allUsers={allUsers} currentUser={currentUser} />
        </div>
    );
}

const Title = ({ balance, allUsers , currentUser}) => {
    return (
        <div>
            <div className="p-4 flex justify-between items-center border">
                <div className="font-bold text-green-500 text-2xl">Easy Pay</div>
                <div>Hello, {currentUser} <button>Logout</button></div>
            </div>
            <div className="p-4 font-bold flex justify-between">
                <div>Your Balance</div>
                <div>{balance}</div> 
                </div>
            <div className="p-4 font-bold">Users</div>
            <div className="pt-2 ml-4 mr-4 border rounded">
                <input type="text" placeholder="search users..." />
            </div>
            <div className="p-4 flex flex-col text-lg">
                {allUsers.map((user, index) => (
                    <div className="flex justify-between" key={index}>
                        <div >{user.firstName}</div> 
                    <div className="p-2 bg-green-500 text-white cursor-pointer border rounded-lg" onClick={() => {  }}>send money</div> </div>
                ))}  

            </div>
        </div>
    );
}
