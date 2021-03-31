import React, { Component } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Nav from "./src/nav";
import Geo from "./src/utils/Geo";
import RootStore from "./src/mobx";
import { Provider } from "mobx-react";
import JMessage from "./src/utils/JMessage";
import UserStore from "./src/mobx/userStore";
class App extends Component{
  state={
    isInitGeo:false
  }
  async componentDidMount() {
    const strUserInfo = await AsyncStorage.getItem("userinfo");
    const userinfo = strUserInfo ? JSON.parse(strUserInfo) : {};
    if(userinfo.token){
      RootStore.setUserInfo(userinfo.mobile, userinfo.token, userinfo.userId);
      JMessage.init();
    }
    await Geo.initGeo();
    this.setState({isInitGeo:true});
  }
  render(){
    return(
      <View style={{flex:1}}>
        <Provider RootStore={RootStore} UserStore={UserStore}>
          {this.state.isInitGeo ? <Nav></Nav> : <></>}
        </Provider>
      </View>
    )
  }
}

export default App;