import React from 'react';

const PlayButton = ({ visitorName, onSuccess }) => { 
    
    console.log(visitorName);

    const addToQueue = async () => {
        if (!visitorName) return alert("Player name not found.");
        
        const url = "https://slot-machine-ff297-default-rtdb.asia-southeast1.firebasedatabase.app/customerQueue.json"; 

        try {
            console.log("กำลังส่งชื่อ:", visitorName); 
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: visitorName, 
                    status: 'waiting',
                    timestamp: Date.now()
                })
            });

            if (response.ok) {
                const result = await response.json();
                //console.log("Firebase ID:", result.name); 
            
                if (onSuccess) {
                    onSuccess(); 
                }
            } else {
                const errorData = await response.text();
                console.error("Firebase Response Error:", errorData);            
               
            }

        } catch (error) {
            console.error("REST API Error:", error);
            alert(error);
        }
    };


    return (
        <button
            type="button"
            className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={addToQueue}
        >
            Play Game
        </button>
    );
};

export default PlayButton;