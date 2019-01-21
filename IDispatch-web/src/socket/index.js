import openSocket from "socket.io-client";
import { toast as toastifier } from "react-toastify";
import URLSearchParams from "url-search-params";
import { connect } from "react-redux";

/* window._env.uri.socket */
window.socket = openSocket(window._env.uri.socket);
/* const socket = {
    on: function() {},
    emit: function() {}
}; */

class Socket{


    static listenEvent(eventName, metadata = {}) {
        return new Promise((resolve, reject) => {
            window.socket.on("message.get", data => {
                resolve(data);
            });
        });
    }

    

    static callEvent(eventName,data){
        window.socket.emit(eventName, data);
    }
    
    /* Tracing live location on map */
    static TrackLiveLocation(eventName,metadata={}){
        return new Promise((resolve,reject)=>{
            window.socket.on("send.alert",data=>{
                resolve(data);
             })
        })
    }
    
    static OnlineUser(eventName,metadata={}){
        return new Promise((resolve,reject)=>{
            window.socket.on("friend.online",data=>{
                resolve(data);
            })
        })
    }

    static OnlineFrndStatus(eventName,metadata={}){
        return new Promise((resolve,reject)=>{
            window.socket.on("get.online.friends",data=>{
                console.log(data)
                resolve(data);
            })
        })
    }

    static getUpdatedLocation(eventName,metadata={}){
        return new Promise((resolve,reject)=>{
            window.socket.on("send.alert",data=>{
                resolve(data);
            })
        })
    }
    // static disconnect(eventName,metadata={}){
    //     window.socket.on("disconnect",data=>{
    //         window.socket.emit('disconnect')
    //     })  
    // }
}
export default Socket;