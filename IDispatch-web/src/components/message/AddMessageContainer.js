import { connect } from 'react-redux'
import AddMessageComponent from './addMessage';
import { addMessage, getConversationId,getSideBarUser } from '../../actionCreator/ActionCreators';
const mapStateToProps = state => ({
  user: state.user,
  routing: state.routing,
  message: state.userChat.data,
  
});

const mapDispatchToProps = dispatch => ({
  loadUserList: (page={}) => (dispatch(getSideBarUser(page))),
  addMessage: (ConversationId, Receiver, Body,Attachment) => dispatch(addMessage(ConversationId, Receiver, Body,Attachment)),
  getConversationId: (userId) =>
    dispatch(getConversationId(userId)),
});


export const AddMessage = connect(mapStateToProps, mapDispatchToProps)(AddMessageComponent)