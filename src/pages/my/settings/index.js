import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import THNav from "../../../components/THNav";
import  {ListItem}  from "react-native-elements";
import { inject, observer } from 'mobx-react';
import { pxToDp } from '../../../utils/stylesKits';
import { ActionSheet } from "teaset";
import JMessage from "../../../utils/JMessage";
import Toast from '../../../utils/Toast';
@inject("RootStore")
@inject("UserStore")
@observer

class Index extends Component{

  logout=async()=>{

    const tmplogout=async()=>{
      await AsyncStorage.removeItem("userinfo");
      this.props.UserStore.clearUser();
      this.props.RootStore.clearUserInfo();
      JMessage.logout();
      Toast.smile("Log out successfully",2000);

      setTimeout(()=>{
        this.props.navigation.navigate("Login");
      },2000);

    }

    const opts=[
      {title:"Log out", onPress:tmplogout}
    ]
    ActionSheet.show(opts,{title:"Cancel"})
  }
  render(){
    const user = this.props.UserStore.user;
    return(
      <View>
        <THNav title="Settings"/>
        <View>
          <ListItem 
            title="Setting problems of Stranger"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
          />
          <ListItem 
            title="Notification Setting"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
          />
          <ListItem 
            title="Blacklist"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
          />
          <ListItem 
            title="Phone Number"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
            rightTitle={user.mobile}
            rightTitleStyle={{fontSize:pxToDp(15)}}
          />
        </View>

        <View style={{marginTop:pxToDp(30)}}>
        <TouchableOpacity
        onPress={this.logout}
          style={{alignSelf:"center",width:"80%",height:pxToDp(50),borderRadius:pxToDp(25),
          backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}
          >
            <Text style={{color:"#666"}}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Index;