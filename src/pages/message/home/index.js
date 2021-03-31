import React, { Component } from 'react';
import { View, Text,StatusBar,ImageBackground,TouchableOpacity,Image } from 'react-native';
import { pxToDp } from "../../../utils/stylesKits";
import Svg from "react-native-svg-uri";
import { renyuan,quanbu,More,xinxi,xihuan } from "../../../res/fonts/iconSvg";
import JMessage from "../../../utils/JMessage";
import { FRIENDS_PERSONALINFO_GUID,BASE_URI } from "../../../utils/pathMap";
import request from "../../../utils/request";
import moment from 'moment';
import { NavigationContext } from "@react-navigation/native";
class Index extends Component{
  static contextType = NavigationContext
  state = {
    list: [],
    chatName:{}
  }
  chatName = "Nancy";
  // componentDidMount(){
  //   this.getConversations();
  // }
  // getConversations=async()=>{
  //   const res = await JMessage.getConversations();
  //   if(res.length){
  //     const idArr = res.map(v=>v.target.username);
  //     const url = FRIENDS_PERSONALINFO_GUID.replace(":id",idArr.join(","));
  //     const users = await request.privateGet(url);
  //     console.log(users);
  //     this.setState({ list: res.map((v,i)=>({...v,user:users.data[i]})) });
  //   }
  // }

  render(){
    const {list} = this.state;
    return(
      <View>
        <StatusBar
        backgroundColor="transparent"
        translucent={true}
        />
        <ImageBackground source={require("../../../res/headbg.png")}
        style={{height:pxToDp(60),paddingTop:pxToDp(22),flexDirection:'row',
        paddingRight:pxToDp(10),paddingLeft:pxToDp(10),
        alignItems:"center",justifyContent:"space-between"
        }}
        >
          <TouchableOpacity></TouchableOpacity>

          <Text style={{color:"#fff",fontSize:pxToDp(20),fontWeight:"bold"}}>Message</Text>
          <TouchableOpacity>
            <Svg width="30" height="30" svgXmlData={renyuan}/>
          </TouchableOpacity>
        </ImageBackground>

        <View style={{flexDirection:"row",justifyContent:"space-between",
        paddingTop:pxToDp(10),paddingBottom:pxToDp(10),paddingLeft:pxToDp(30),
        paddingRight:pxToDp(30),borderBottomWidth:pxToDp(3),borderBottomColor:"#dce2e5"
        }}>
          <TouchableOpacity  style={{marginTop:pxToDp(10),alignItems:"center"}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <Svg width="50" height="50" svgXmlData={quanbu}/>
              <Text style={{color:"#666"}}>All</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  style={{marginTop:pxToDp(10),alignItems:"center"}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <Svg width="50" height="50" svgXmlData={More}/>
              <Text style={{color:"#666"}}>Like</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  style={{marginTop:pxToDp(10),alignItems:"center"}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <Svg width="50" height="50" svgXmlData={xinxi}/>
              <Text style={{color:"#666"}}>Comment</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  style={{marginTop:pxToDp(10),alignItems:"center"}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <Svg width="50" height="50" svgXmlData={xihuan}/>
              <Text style={{color:"#666"}}>Follow</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* 极光消息渲染 */}
        {/* <View>
          {list.map((v,i)=><TouchableOpacity
            onPress={()=>this.context.navigate("Chat",v.user)}
            key={i} style={{padding:pxToDp(15),flexDirection:"row",borderBottomWidth:pxToDp(1),borderBottomColor:"#ccc"}}
            >
            <View><Image 
            source={{uri:BASE_URI + v.user.header}}
            style={{width:pxToDp(54),height:pxToDp(54),borderRadius:pxToDp(27)}}/></View>
            <View style={{justifyContent:"space-evenly",paddingLeft:pxToDp(15)}}>
              <Text style={{color:"#666"}}>{v.user.nick_name}</Text>
              <Text style={{color:"#666"}}>{v.latestMessage.text}</Text>
            </View>
            <View style={{justifyContent:"space-evenly",flex:1,alignItems:"flex-end"}}>
              <Text style={{color:"#666"}}>{moment(v.latestMessage.createTime).fromNow()}</Text>
              <View style={{width:pxToDp(20),height:pxToDp(20),borderRadius:pxToDp(10),
              backgroundColor:"red",alignItems:"center",justifyContent:"center"}}>
                <Text style={{color:"#fff"}}>{v.unreadCount}</Text></View>
            </View>
          </TouchableOpacity>)}
        </View> */}
        {/* 自己特定的人员 */}
        <View>
          <TouchableOpacity
          style={{padding:pxToDp(15),flexDirection:"row",borderBottomWidth:pxToDp(1),borderBottomColor:"#ccc"}}
          >
            <View><Image 
            source={require("../../../res/goodpople.png")}
            style={{width:pxToDp(54),height:pxToDp(54),borderRadius:pxToDp(27)}}/></View>
            <View style={{justifyContent:"space-evenly",paddingLeft:pxToDp(15)}}>
              <Text style={{color:"#666", fontWeight:"bold"}}>Nancy</Text>
              <Text style={{color:"#666"}}>What are you doing?</Text>
            </View>
            <View style={{justifyContent:"space-evenly",flex:1,alignItems:"flex-end"}}>
              <Text style={{color:"#666"}}>two days ago</Text>
              <View style={{width:pxToDp(20),height:pxToDp(20),borderRadius:pxToDp(10),
              backgroundColor:"red",alignItems:"center",justifyContent:"center"}}>
                <Text style={{color:"#fff"}}>0</Text></View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Index;