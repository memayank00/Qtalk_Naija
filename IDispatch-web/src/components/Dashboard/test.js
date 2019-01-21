import React from 'react';
import { ListGroupItem, Collapse,Button } from 'reactstrap';

class ListGroupCollapse extends React.Component {
  constructor(props) {
    super(props);
    
    // this.toggle = this.toggle.bind(this);
    this.state = {collapse: false};
  }
  
  // toggle() {
  //   this.props.currentIndexFunc()
  //   //this.setState({ collapse: !this.state.collapse });
  // }
  
  render() {
      const {list,listItemClicked,sendMessage,currentIndex,index,currentIndexFunc} = this.props;
      console.log({index,currentIndex})
    return (
        <li key={list._id}
        >
         
         <i><img src={list.profilePicture}/>
          {list.isOnline && <small></small>}
         </i>
         <Button className="addtrackLink" /*onClick={this.toggle}*/ onClick={()=>currentIndexFunc(index)}>
          <span></span>
          <span></span>
          <span></span>
         </Button>
         <Collapse /*isOpen={this.state.collapse}*/ isOpen={index === currentIndex}>
         <div className="mapmsgList" isOpen={this.state.collapse}>
          <span><Button className="frdMsgBtn" onClick={()=>sendMessage({userId:list._id})}>Message</Button></span>
          <span onClick={()=>listItemClicked(list._id)}><Button className="frdMsgBtn">Track</Button></span>
         </div>
         </Collapse>
         {/* <span  onClick={()=>listItemClicked(list._id)}>{list.name}</span> */}
         <span><Button className="frdMsgBtnHover" onClick={()=>listItemClicked(list._id)}>{list.name}</Button></span>
        
         </li>
    );
  }
}

export default ListGroupCollapse