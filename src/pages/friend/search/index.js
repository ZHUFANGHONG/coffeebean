import React, { Component } from 'react';
import { Image,View, Text,StatusBar,ImageBackground,TouchableOpacity } from 'react-native';
import request from "../../../utils/request";
import { FRIENDS_SEARCH,BASE_URI } from "../../../utils/pathMap";
import { pxToDp, screenHeight, screenWidth } from "../../../utils/stylesKits";
import IconFont from "../../../components/IconFont";
import { Overlay } from "teaset";
import FilterPanel from "./components/FilterPanel";
class Index extends Component{
  params={
    gender:"男",
    distance:10000
  }
  state={
    list:[

    ]
  }
  componentDidMount(){
    this.getList();
  }

  WHMap={
    "wh1":{width:pxToDp(70),height:pxToDp(100)},
    "wh2":{width:pxToDp(60),height:pxToDp(90)},
    "wh3":{width:pxToDp(50),height:pxToDp(80)},
    "wh4":{width:pxToDp(40),height:pxToDp(70)},
    "wh5":{width:pxToDp(30),height:pxToDp(60)},
    "wh6":{width:pxToDp(20),height:pxToDp(50)}
  }

  //根据distance来返回宽高的档次
  getWidthHeight=(dist)=>{
    if(dist<200){
      return "wh1";
    }
    if(dist<400){
      return "wh2";
    }
    if(dist<600){
      return "wh3";
    }
    if(dist<1000){
      return "wh4";
    }
    if(dist<1500){
      return "wh5";
    }
    return "wh6";
  }

  getList=async()=>{
    const res = await request.privateGet(FRIENDS_SEARCH, this.params);
    console.log(res);
    this.setState({list : res.data})
  }

  handleFilterShow=()=>{
    
    let overlayViewRef = null;
    let overlayView = (
      <Overlay.View
        modal={true}
        overlayOpacity={0.3}
        ref={v => overlayViewRef = v}
        >
        <FilterPanel onSubmitFilter={this.handleSubmitFilter} params={this.params} onClose={()=>overlayViewRef.close()}/>
      </Overlay.View>
    );
    Overlay.show(overlayView);
  }

  handleSubmitFilter=(filterParams)=>{
    this.params=filterParams;
    this.getList();
  }
  render(){
    const {list} = this.state;
    return(
      <ImageBackground
      style={{flex:1,position:"relative"}}
      source={require("../../../res/search.gif")}
      >
        <StatusBar backgroundColor={"transparent"} translucent={true}/>
        <TouchableOpacity
        style={{backgroundColor:"#fff",position:"absolute",right:"10%",top:"10%",width:pxToDp(55),
          height:pxToDp(55),borderRadius:pxToDp(27.5),alignItems:"center",justifyContent:"center",
          zIndex:1000}}
        onPress={this.handleFilterShow}
        >
          <IconFont style={{color:"#912375",fontSize:pxToDp(30)}} name="icongerenzhongxin"/>
        </TouchableOpacity>
        {
          list.map((v,i)=>{
            const whMap=this.WHMap[this.getWidthHeight(v.dist)]
            const tx=Math.random()*(screenWidth-whMap.width);
            const ty=Math.random()*(screenHeight-whMap.height);
            return <TouchableOpacity
              key={i}
              style={{position:"absolute",left:tx,top:ty}}
          >
            <ImageBackground
            source={require("../../../res/showfriend.png")}
            resizeMode="stretch"
            style={{...whMap,position:"relative",alignItems:"center"}}
            >
              <Text
              numberOfLines={1}
              style={{color:"#ffffff9a",position:"absolute",top:-pxToDp(20)}}
              >{v.nick_name}</Text>
              <Image style={{width:whMap.width,height:whMap.width,
              borderRadius:whMap.width/2}} source={{uri:BASE_URI+v.header}}/>
            </ImageBackground>
          </TouchableOpacity>

          })
        }

        <View style={{position:"absolute",bottom:pxToDp(50),width:"100%",alignItems:"center"}}>
          <Text style={{color:"#fff"}}>You have <Text style={{color:"red",fontSize:pxToDp(20)}}>{list.length}</Text> friend nearby</Text>
          <Text style={{color:"#fff"}}>Say hi to him</Text>
        </View>
      </ImageBackground>
    )
  }
}

export default Index;