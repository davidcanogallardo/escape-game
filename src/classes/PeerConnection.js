class PeerConection{
    constructor(peerHost){
        this.peerHost = peerHost;
        socket.on("matchFound", () => {
            socket.emit("getGuestID", peerHost);
        });
        this.peerGuest = {
            initiator: false,
            trickle: false
        };
        socket.on("sendHostID", (peerHostID) => {
            this.peerGuest.signal(peerHostID);
            this.peerGuest.on("signal", (peerGuestID) => {
                if(peerGuestID.type == "answer"){
                    socket.emit("sendGuestID", peerGuestID);
                }
            })
        });

        socket.on("guestResponse", (peerGuestID) => {
            this.peerHost.signal(peerGuestID);
            
        })
        
        // this.peerHost.on("signal", (data) => {

        // })
    }



}