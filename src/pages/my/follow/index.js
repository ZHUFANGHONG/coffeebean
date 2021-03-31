import React, {Component} from 'react';
import {Text,View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustormerBar from "./components/CustormerBar";
import FollowEach from "./followEach";
import Ifollow from "./Ifollow";
import FollowMe from "./followMe";
import { MY_LIKELIST } from "../../../utils/pathMap";
import request from "../../../utils/request";

class index extends Component {
  state = { 
    ilikelist:[],
    likeeachlist:[],
    likemelist:[]
  }
  componentDidMount() {
    this.getList();
  }

  getList=async()=>{
    const res = await request.privateGet(MY_LIKELIST);
    // console.log(res);
    const likeeachlist = res.data.likeeachlist;
    const ilikelist = res.data.ilikelist;
    const likemelist = res.data.likemelist;
    this.setState({ likeeachlist,ilikelist,likemelist });
  }
  render() { 
    const {likeeachlist,ilikelist,likemelist} = this.state;
    const index = this.props.route.params || 0;
    return <ScrollableTabView
    initialPage={index}
    renderTabBar={() => <CustormerBar />}
  >

      <FollowEach getList={this.getList} likeeachlist={likeeachlist} tabLabel='Connect'></FollowEach>
      <Ifollow getList={this.getList} ilikelist={ilikelist} tabLabel='Like'></Ifollow>
      <FollowMe getList={this.getList} likemelist={likemelist} tabLabel='Fans'></FollowMe>
    </ScrollableTabView>
  }
}
 
export default index;