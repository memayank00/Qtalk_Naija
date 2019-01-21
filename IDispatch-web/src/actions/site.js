import http from '../services/http';
import { getSettings } from "../utils/endpoints";

export function getSettingsCall(data) {
    return new Promise((resolve, reject) => {
        http.Request("get", getSettings, data.data)
        .then(response => resolve(response) )
        .catch(error => reject(error) );
    });
}

export const addMessage = (message, author) => (
    console.log("message",author)
  /* type: types.ADD_MESSAGE,
  id: nextMessageId++,
  message,
  author */
)

/* export const messageReceived = (message, author) => ({
  type: types.MESSAGE_RECEIVED,
  id: nextMessageId++,
  message,
  author
})

export const populateUsersList = users => ({
  type: types.USERS_LIST,
  users
}) */