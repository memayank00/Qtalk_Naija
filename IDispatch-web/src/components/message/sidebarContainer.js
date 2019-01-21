import React, { Component,Fragment} from "react";
import { connect } from "react-redux";
import HTTP from "../../services/http";
import * as ApiUrl from "../../utils/endpoints";
import _ from "lodash";
import { push } from "react-router-redux";
import URLSearchParams from "url-search-params";
import SidebarComponent from "./sidebar";
import InfiniteScroll from "react-infinite-scroller";
import loader from "../../assets/images/wait.gif";
import { UserChatList } from "../../actionCreator/ActionCreators";
import { getConversationId ,getSideBarUser,addMoreUsersToList} from "../../actionCreator/ActionCreators";
import searchIcon from "../../assets/images/search-icon.png";
import { ValidateOnlyAlpha } from "../common/fieldValidations";
var timer;
const mapStateToProps = state => ({
  users: state.sidebarUser.users,
  total:state.sidebarUser.total,
  routing: state.routing,
  userChat: state.userChat,
  message: state.userChat.data,
  converSationId: state.getConversationId.data
});
const mapDispatchToProps = dispatch => ({
	loadUserList: (page={}) => (dispatch(getSideBarUser(page))),
	addUsertoList:(page={})=>(dispatch(addMoreUsersToList(page))),
  getConversationId: (userId) =>
    dispatch(getConversationId(userId)),
  loadUserContent: id => dispatch(UserChatList(id))
});
class SidebarContainer extends Component {
  didMount=false;
  constructor(props) {
    super(props);
    this.state={
      isLoading:false,
      page:1,
      per:10,
      totalPages:null,
      scrolling:false,
      hasMore: true,
      selectedID:"",
      searchQuery:""
    }
    this.listClicked = this.listClicked.bind(this);
    this.fetchSidebarUser=this.fetchSidebarUser.bind(this);
    this.search = this.search.bind(this);
  }

  listClicked(params = {}) {
    this.props.listClickedSide(params)
    // this.setState({isLoading:true});
    // const { history, dispatch } = this.props;
    // this.props.getConversationId(params.userId);
    // history.push(`/message?id=${params.userId}`);
    this.setState({selectedID:params.userId,isLoading:true})
    // HTTP.Request("get", ApiUrl.getConversationId, params)
    //   .then(response => {
    //     this.setState({isLoading:false});
    //     if (response.type === "success") {
    //       this.props.loadUserContent(response.data);
    //       history.push(`/message?id=${params.userId}`);
    //       this.props.loadUserList();
    //     } else {
    //       dispatch(push("/dashboard"));
    //     }
    //   })
    //   .catch(error => {
    //     this.setState({ isLoading: false });
    //   });
  }
  
  componentWillReceiveProps(nextProps,nextState){
    if (this.props.message !== nextProps.message) {
        this.fetchSidebarUser();
        this.props.loadUserList({page:1});
    }
  }

  componentDidMount() {
    this.didMount=true;
    this.fetchSidebarUser();
    this.props.loadUserList({page:this.state.page});
  }

  handleScroll=(e)=>{
		const {scrolling,totalPages,per,page}=this.state;
    if(Math.ceil(totalPages/10)<=page && this.didMount) {
      this.setState({hasMore:false});
      return;
    }else{
      if(this.didMount){
        this.loadMore();
      }
    }
  }

  loadUsers=()=>{
    const {per,page}=this.state;
    const {users,total}=this.props;
    this.props.addUsertoList({"page":page});
    this.setState({scrolling:false})
  }

  loadMore=()=>{
    this.setState(prevState=>({
      page:prevState.page+1,
      scrolling:true,
    }),this.loadUsers)
  }

   /**SEARCH */
   search(e) {
    /**to remove Event Pooling  */
    e.persist();
    let seracherror = ValidateOnlyAlpha(e.target.value)
    if (seracherror) {
        this.setState({ seracherror: seracherror });
        return;
    }
    this.setState({ searchQuery: e.target.value, seracherror: seracherror,page:1 });
    clearTimeout(timer);
    timer = setTimeout(() => {
        // this.fetchSidebarUser({
        //     q: e.target.value ? e.target.value : '',
        // });
        this.props.loadUserList({
          q: e.target.value ? e.target.value : '',
        })
    }, 1000);
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location: { search } } = this.props.routing;
    const { location } = prevProps.routing;
    let userId = new URLSearchParams(search).get("id");
    if (!userId && this.state.totalPages>0) {
          this.fetchSidebarUser();
    }
  }
  
	fetchSidebarUser(page = {}) {
		HTTP.Request("get", ApiUrl.getAllChatList, page)
			.then(response => {
				let { data } = response;
				const { history, dispatch } = this.props;
				if (data) {
          if(this.didMount){
            this.setState({totalPages: data.total ,page:1});
          }
					const { location: { search } } = this.props.routing;
					let userId = new URLSearchParams(search).get("id");
					if ( data.users && data.users.length > 0 && !userId) {
            if(this.didMount){
              this.setState({ selectedID: data.users[0].chattingWith._id,page:1 })
              history.push(`/message?id=${data.users[0].chattingWith._id}`);
            }
					}
				}
			})
			.catch(error => {
				console.log("inside error")
			});
	}

  componentWillUnmount() {
    this.didMount = false;
  }
 
  render() {
    const { users } = this.props;
    const {selectedID,scrolling,totalPages}=this.state;
    return ( 
      <Fragment>
      <div className="chatting-user-search">
                  <input 
                  onChange={this.search}
                  type="text" 
                  placeholder="Search" />
                  <img src={searchIcon} />
      </div>
    <div className="chatting-user-list-section"  ref={(ref) => this.scrollParentRef = ref}>
		<InfiniteScroll
                   pageStart={0}
                   initialLoad={false}
                   loadMore={this.handleScroll}
                   hasMore={this.state.hasMore}
                   useWindow={false}
                   getScrollParent={() => this.scrollParentRef}
                   loader={scrolling?<div className="loader" key={0}>Loading ...</div>:""}
               >  
       <SidebarComponent 
        users={users}
        selectedID={selectedID} 
        history={this.props.history}
        listClicked={this.listClicked} />
			 </InfiniteScroll>
    </div>
    </Fragment>
    ) 

  }
}

export const Sidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarContainer);
