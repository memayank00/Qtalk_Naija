import openSocket from "socket.io-client";
import { toast as toastifier } from "react-toastify";

/**
 * @argument window._env.socketUrl is the url of socket port
 *
 */
//const socket = openSocket(window._env.socketUrl);
const socket = {
    on: function() {},
    emit: function() {}
};

class Socket {
    /**we are using static methods so taht we can access
     * these method without any instance of class socket */
    static listenEvent(eventName, metadata = {}) {
        const { toast, loginCall } = metadata;
        socket.on(eventName, data => {
            if (toast) {
                /**show some toaster message */
                toastifier(data.message, { type: "info" });
            }

            if (loginCall) {
                Socket.callEvent("login", { userId: metadata.userId });
            }
        });
    }

    static logoutCall() {
        return new Promise((resolve, reject) => {
            socket.on("logout", data => {
                resolve(data);
            });
        });
    }

    static callEvent(eventName, data) {
        socket.emit(eventName, data);
    }
}

export default Socket;
