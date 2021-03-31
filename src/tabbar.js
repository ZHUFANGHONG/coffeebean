import React, { Component } from 'react';
import { View, Text } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Svg from "react-native-svg-uri";
import { makefriend,circle,news,me } from "./res/fonts/iconSvg";
import Friend from "./pages/friend/home";
import Group from "./pages/group/home";
import Message from "./pages/message/home";
import My from "./pages/my/home";
import request from "./utils/request";
import { MY_INFO } from "./utils/pathMap";
import { inject,observer } from "mobx-react";
import JMessage from "./utils/JMessage";
import Toast from "./utils/Toast";
@inject("UserStore")
@observer
class Index extends Component{
  async componentDidMount(){
    const res = await request.privateGet(MY_INFO);
    // console.log(res);
    this.props.UserStore.setUser(res.data);
    await JMessage.login(res.data.guid,res.data.mobile)
  }

  state={
    
    pages:[
      {
        selected: "friend",
        title:"friend",
        renderIcon:() => <Svg width="20" height="20" svgXmlData={makefriend}/>,
        renderSelectedIcon:() => <Svg width="25" height="25" svgXmlData={makefriend}/>,
        onPress:() => this.setState({ selectedTab: 'friend' }),
        component:<Friend/>
      },
      {
        selected: "group",
        title:"group",
        renderIcon:() => <Svg width="20" height="20" svgXmlData={circle}/>,
        renderSelectedIcon:() => <Svg width="25" height="25" svgXmlData={circle}/>,
        onPress:() => this.setState({ selectedTab: 'group' }),
        component:<Group/>
      },
      {
        selected: "message",
        title:"message",
        renderIcon:() => <Svg width="20" height="20" svgXmlData={news}/>,
        renderSelectedIcon:() => <Svg width="25" height="25" svgXmlData={news}/>,
        onPress:() => this.setState({ selectedTab: 'message' }),
        component:<Message/>
      },
      {
        selected: "my",
        title:"my",
        renderIcon:() => <Svg width="20" height="20" svgXmlData={me}/>,
        renderSelectedIcon:() => <Svg width="25" height="25" svgXmlData={me}/>,
        onPress:() => this.setState({ selectedTab: 'my' }),
        component:<My/>
      }
    ]
  }

  constructor(props){
    super(props);
    let selectedTab = "friend";
    if(this.props.route.params&&this.props.route.params.pagename){
      selectedTab = this.props.route.params.pagename
    }
    this.state.selectedTab = selectedTab;
  }
  render(){
    const {selectedTab,pages} = this.state;
    return(
      <View style={{flex:1, backgroundColor:"#fff"}}>
      <TabNavigator>
        {pages.map((v,i)=><TabNavigator.Item key={i}
        selected={selectedTab===v.selected}
        title={v.title}
        renderIcon={v.renderIcon}
        renderSelectedIcon={v.renderSelectedIcon}
        onPress={v.onPress}
        selectedTitleStyle={{color:"#c863b5"}}
        tabStyle={{
          backgroundColor:"#eee", justifyContent:"center"
        }}
        >
          {v.component}
        </TabNavigator.Item>)}
      </TabNavigator>
      </View>
    )
  }
}

export default Index;