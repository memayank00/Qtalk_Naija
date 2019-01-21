import {
  USER_MESSAGE_LIST_FAILURE,
  MESSAGE_RECEIVED,
  USER_MESSAGE_LIST_SUCCESS,
  UPDATE_MESSAGE_READ_STATUS,
  MESSAGE_SCROLL_LIST_SUCCESS
} from "./ActionTypes";
import _ from "lodash";
const initialState = {
  data: {},
};
export const userChat = (state = initialState, { type, payload }) => {
  switch (type) {
    case MESSAGE_SCROLL_LIST_SUCCESS:{
      if(state.data && state.data.messages &&  payload.data && payload.data.messages){
        let objCopy = JSON.parse(JSON.stringify(state));
        const {
          data: { messages }
        } = objCopy;
        Promise.resolve(checkAndMerge(messages, payload.data.messages));
        return {...state,...objCopy}
      }else return { ...state,...payload };
    }
    case USER_MESSAGE_LIST_SUCCESS: {
      return { ...state,...payload };
    }
    case USER_MESSAGE_LIST_FAILURE: {
      return { ...state,error: payload };
    }
    case UPDATE_MESSAGE_READ_STATUS:{
      let objCopy=JSON.parse(JSON.stringify(state));
      const { data: { messages }} = objCopy;
      Promise.resolve(markAsReadMsg(messages,payload));
      return {...state,...objCopy}
    }
    case MESSAGE_RECEIVED: {
      let objCopy = JSON.parse(JSON.stringify(state));
      const {
        data: { messages }
      } = objCopy;
      Promise.resolve(checkAndAdd(messages, payload));

      return { ...state, ...objCopy };

    }
    default:
      return state;
  }
};

function checkAndAdd(array = [], obj = {}) {
  let today = getDate();
  var found = array.some(function(el) {
    if (el._id === today) {
      let foundObject = _.find(el.messages, function(e) {
        return e._id === obj._id;
      });
      if(!foundObject) {
        el.messages.push(obj);
      }
      return true;
    }
  });
  if (!found) {
    array.push({ _id: today, messages: [obj] });
  }
}

function checkAndMerge(stateArray=[],payloadArray=[]){
  _.map(stateArray,function(val1,index){
    _.map(payloadArray,function(val2,j){
      if(val1._id==val2._id){
        _.map(val2.messages,function(val3,index3){
          var found = val2.messages.some(function(el) {
            if (el._id == val3._id) {
              return true;
            }
          });
          if (!found) {
            val1.messages.unshift(val3)
          }
        })
      }else{
        var found = stateArray.some(function(el) {
          if (el._id == val2._id) {
            return true;
          }
        });
        if (!found) {
          stateArray.unshift(val2);
        }
      }
    })
    
  })  
}


function getDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;

  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today;
}

function markAsReadMsg(messages = [] ,payload = {}) {
  if(payload.data && Array.isArray(messages)){
    _.map(messages,function(val1,index){
      _.map(val1.messages,function(val2,j){
        if(val2.read.length <2){
          val2.read.push(val2.receiver)
        }
        return val2
      })
    }) 
  }
}