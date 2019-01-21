import React, { Component,Fragment } from "react";
import { connect } from "react-redux";
import MessageListComponent from "./messageList";
import URLSearchParams from "url-search-params";
import HTTP from "../../services/http";
import { UserChatList,initialChatData} from "../../actionCreator/ActionCreators";
import * as ApiUrl from "../../utils/endpoints";
import { push } from "react-router-redux";
import InfiniteScroll from 'react-infinite-scroller';
import Socket from '../../socket';
import { getConversationId } from "../../actionCreator/ActionCreators";
import DefaultImage from "../../assets/images/img_avatar_default.png";
import { AddMessage } from "./AddMessageContainer.js";
import { Sidebar } from "./sidebarContainer";
const RenderProfile = props => {
  const {users,user:{user}}=props;
 
  if(users){
    const usersIds=Object.keys(users);
    let cliendId=usersIds.filter((val)=> val!=user._id)[0];
    return (
      <div className="chat-user-detail">
        <div className="chat-user-img">
          <img src={users[cliendId].image ?users[cliendId].image:DefaultImage}
          onError={(e)=>{e.target.src = DefaultImage}} alt="" />
        </div>
        <div className="chat-user-name">
          <h5>{users[cliendId].name}</h5>
        </div>
      </div>
    )
  }else{
    return(
      <div></div>
    )
  }

}
const mapStateToProps = state => {
  return {
    user: state.user,
    users: state.sidebarUser.users,
    routing: state.routing,
    message: state.userChat.data,
    isLoading:state.userChat.isLoading,
    
  };
};
const mapDispatchToProps = dispatch => ({
  getConversationId: (userId) =>
    dispatch(getConversationId(userId)),
  loadUserList: () => dispatch({ type: "SIDEBAR_USERS_REQUEST" }),
  loadUserContent: (id,page) => dispatch(UserChatList(id,page)),
  loadMoreChat:(id,page)=>dispatch(initialChatData(id,page)),
  socketMessage:(data)=>dispatch({type:"RECIEVED_SOCKET_MESSAGE",data:data}),
  firstUserContent: response => dispatch(push(`/message?id=${response}`)),
  messageStatusRead: response => dispatch({type:"MESSAGE_READ_NOTIFY",payload:response})
});

class MessageListContainer extends Component {
  didMount = false;
  constructor(props){
    super(props);
    this.state={
      isLoading:false,
      initialLoad: false,
      page:1,
      per:10,
      totalPages:null,
      scrolling:false,
      hasMore: true,
      converSationId:"",
      oldScrollHeight:0
    }
    this.getMessageTotal=this.getMessageTotal.bind(this);
    this.listClickedSide = this.listClickedSide.bind(this);
  }
  componentDidMount() {
    this.didMount = true;
    let {location} =this.props.routing;
    window.socket.on("message.get",(response=>{
      const {history} =this.props;
      let newId= [];
      if( history.location.search && history.location.search.indexOf('id')>0){
         newId=history.location.search.split("=");
      }
      const {converSationId} = this.state;
            if(response && response.data){
              let conversationIdSocket=response.data.conversationId;
              if(conversationIdSocket==converSationId && newId.length>0 && response.data.sender==newId[1]){
                 this.props.socketMessage(response.data);
              }
            }
      }));

      window.socket.on("message.read",(response=>{
    
        if(location.search){
          if(location.search.indexOf('id')>0){
            let newId=location.search.split("=");
            if(newId[1]==response.data.receiver || newId[1]!=response.data.to ){
                this.props.messageStatusRead(response)
            }
            // else{
            //   this.props.messageStatusRead(response)
            // }
          }
        }
      }));
      if (location) {
          let userId = new URLSearchParams(location.search).get("id");
      if (userId) {
          this.converSation({ userId });
      } 
      }
      
  }

  componentWillUnmount() {
    this.didMount = false;
    let element=document.querySelector(".allChats");
    // element.removeEventListener('scroll', this.onScroll, false);
  }

  scrollToBottom () {
    let element=document.querySelector(".allChats");
    setTimeout(() => {
      if(element){
        element.scrollTop = element.scrollHeight + 100;
        setTimeout(() => this.setState({initialLoad : false}), 100);
      }
    }, 1000);
  }


  getMessageTotal(params={}){
    params.conversationId=this.state.converSationId;
    HTTP.Request("post", ApiUrl.messageTrails, params)
    .then(({ data }) => {
      if(this.didMount){
        this.setState({totalPages:data.total})
        setTimeout(()=>{
          this.setState({initialLoad : true});
        this.scrollToBottom();
        },100)
        
      }
    })
    .catch(error => {
      console.log("error-->",error)
    });
  }
  componentWillReceiveProps(nextProps) {
    this.scrollToBottom();
    if (this.props !== nextProps && this.state.page==1) {
      
     }
   }

  handleScroll=(e)=>{
    const { scrolling,totalPages,per,page }=this.state;
    if(Math.ceil(totalPages/10)<=page && this.didMount) {
        this.setState({hasMore:false});
        return;
    }else{
      if(this.didMount){
        this.loadMore();
      }
    }
  }

  goToPrevScroll = () => {
    const {oldScrollHeight}=this.state;
    let list=document.querySelector(".allChats");
    list.scrollTop = list.scrollHeight - oldScrollHeight + list.scrollTop;
  }

  loadUsers=()=>{
    const {per,page,converSationId}=this.state;
    const {users,total}=this.props;
    this.props.loadMoreChat(converSationId,page);
    this.setState({scrolling:false});
  }

  loadMore=(oldScrollHeight)=>{
    this.setState(prevState=>({
      page:prevState.page+1,
      scrolling:true,
    }),this.loadUsers)
  }

  

  converSation(params = {}) {
    this.setState({ isLoading: true });
    //this.props.getConversationId(params);
    HTTP.Request("get", ApiUrl.getConversationId, params)
      .then(response => {
        if (response.type === "success") {
          if(this.didMount){
            this.setState({ isLoading: false,converSationId:response.data,page:1,hasMore:true },this.getMessageTotal);
            this.props.loadUserContent(response.data,this.state.page);
          }
        }
      })
      .catch(error => {
        if(this.didMount){
        this.setState({ isLoading: false });
        }
      });
  }

  /**
   *React Life cycle hook
   *Render on componentupdate
   * @param {*} prevProps
   * @param {*} prevState
   * @param {*} snapshot
   * @memberof MessageListContainer
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location: { search } } = this.props.routing;
    const { location } = prevProps.routing;
    let userId = new URLSearchParams(search).get("id");
    let isToogleold = new URLSearchParams(location.search).get("id");
    if (userId !=isToogleold ) {
      this.converSation({userId});
    }
  }


  listClickedSide(params = {}) {
    this.setState({isLoading:true});
    const { history, dispatch } = this.props;
    history.push(`/message?id=${params.userId}`);
    this.setState({page:1});
    let message = {to:params.userId};
    Socket.callEvent("message.read",message);
    this.props.messageStatusRead(message)
    // Socket.lis(response.data.receiver)
    this.converSation({userId:params.userId})
  }

  render() {
    const { user, message } = this.props;
    const {isLoading,converSationId,scrolling,page, initialLoad}=this.state;
    return (
    <Fragment>
       <div className="user-list-sec">
              <div className="message-heading">
                    <h4>Messaging </h4>
              </div>

              <div className="chatting-list-tabs">
                  <ul>
                    <li>Inbox</li>
                  </ul>
              </div>
           
              <Sidebar 
                message={message}  
                listClickedSide={this.listClickedSide}
                history={this.props.history} 
              />
            </div>
      <div className="chat-sec">
        {initialLoad && <div className="initial-loader"> Loading.. </div>}
        {message && <RenderProfile users={message.users} user={user} />}
        
        <div className="allChats">
       
          <InfiniteScroll
              pageStart={0}
              initialLoad={false}
              loadMore={this.handleScroll}
              hasMore={this.state.hasMore}
              loader={scrolling?<div className="loader" key={0}>Loading ...</div>:""}
              useWindow={false}
              isReverse={true}
              threshold={10}
          >
            <MessageListComponent
              page={page}
              user={user} isLoading={isLoading}
              message={message} 
              initialLoad={initialLoad}
              converSationId={converSationId}
            />
          </InfiniteScroll>
        </div>
      
        {converSationId&&<AddMessage ConversationId={converSationId}/>}
        </div>
        </Fragment>);
  }
}

export const MessageList = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageListContainer);
