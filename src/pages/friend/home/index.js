import React, { Component } from 'react';
import { View, Text, StatusBar,Image,TouchableOpacity } from 'react-native';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import {pxToDp} from "../../../utils/stylesKits"
import FriendHead from "./components/FriendHead";
import Visitors from "./components/Visitors";
import IconFont from "../../../components/IconFont";
import PerfectGirl from "./components/PerfectGirl";
import request from "../../../utils/request";
import { BASE_URI, FRIENDS_RECOMMEND } from "../../../utils/pathMap";
import { Overlay } from "teaset";
import FilterPanel from "./components/FilterPanel";
import { NavigationContext } from "@react-navigation/native";
export default class Index extends Component{
  static contextType = NavigationContext;
  state={
    params:{
      page:1,
      pagesize:300,
      gender:"男",
      distance:2,
      lastLogin:"",
      city:"",
      education:""
    },
    recommends:[],
   
  } 
  componentDidMount(){
    this.getRecommends();
  }
  //获取推荐朋友
  getRecommends = async(filterParams={})=>{
    const res = await request.privateGet(FRIENDS_RECOMMEND,{...this.state.params,...filterParams});
    this.setState({recommends:res.data});
  }
  //删选人员
  recommendFilterShow = async()=>{
    const {page,pagesize,...others} = this.state.params;
    let overlayViewRef = null;
    let overlayView = (
      <Overlay.View
        modal={true}
        overlayOpacity={0.3}
        ref={v => overlayViewRef = v}
        >
        <FilterPanel onSubmitFilter={this.handleSubmitFilter} params={others} onClose={()=>overlayViewRef.close()}/>
      </Overlay.View>
    );
    Overlay.show(overlayView);
  }

  // 接受到组件传过来的数据
  handleSubmitFilter=(filterParams)=>{
    this.getRecommends(filterParams);
  }

  render() {
    const {recommends} = this.state;
    return ( 
      <HeaderImageScrollView
        onScroll={this.onScroll}
        maxHeight={pxToDp(130)}
        minHeight={pxToDp(44)}
        headerImage={require("../../../res/headfriend.png")}
        renderForeground={() => (
          <View style={{ height: pxToDp(130), justifyContent: "center", alignItems: "center" }} >
            <StatusBar backgroundColor={"transparent"} translucent={true} />
            <FriendHead/>
          </View>
        )}
      >
        <View>
          {/* 访客 */}
          <Visitors/>
          <View style={{height:pxToDp(3),backgroundColor:"#ccc"}}></View>
          <PerfectGirl/>
          {/* 推荐朋友 */}
          <View>
            <View style={{height:pxToDp(40),backgroundColor:"#eee",flexDirection:"row",
              justifyContent:"space-between",paddingLeft:pxToDp(10),paddingRight:pxToDp(10),
              alignItems:"center"
            }}>
              <Text style={{color:"#666"}}>Recommending</Text>
              <IconFont onPress={this.recommendFilterShow} style={{color:"purple",fontSize:pxToDp(25)}} name="icongerenzhongxin"/>
            </View>
          </View>
          {/* 列表 */}
          <View>
            {recommends.map((v,i)=><TouchableOpacity key={i} 
            onPress={()=>this.context.navigate("Detail",{id:v.id})}
            style={{flexDirection:"row",paddingTop:pxToDp(15),paddingBottom:pxToDp(15),
            borderBottomWidth:pxToDp(1),borderColor:"#ccc"}}>
              <View style={{paddingLeft:pxToDp(15),paddingRight:pxToDp(15)}}>
                <Image style={{width:pxToDp(50),height:pxToDp(50),
                borderRadius:pxToDp(25)
                }} source={{uri:BASE_URI+v.header}}/>
              </View>
              {/* 名称 */}
              <View style={{ flex: 2, justifyContent: "space-around" }} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#555" }} >{v.nick_name}</Text>
                  <IconFont style={{ fontSize: pxToDp(18), color: v.gender === "女" ? "pink" : "skyblue" }}
                  name="icongerenxinxi_zhixiguanxi" />
                  <Text style={{ color: "#555" }} >{v.age}岁</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#555" }} >{v.marry}</Text>
                  <Text style={{ color: "#555" }} >|</Text>
                  <Text style={{ color: "#555" }} >{v.xueli}</Text>
                  <Text style={{ color: "#555" }} >|</Text>
                  <Text style={{ color: "#555" }} >{v.agediff < 10 ? "年龄相仿" : "有点代沟"}</Text>
                </View>
              </View>
              <View style={{flexDirection:"row",alignItems:"center",width:pxToDp(100),justifyContent:"center"}}>
                <IconFont name="iconaixin3" style={{color:"red",fontSize:pxToDp(30)}}/>
                <Text style={{color:"#666"}}>{v.fateValue}</Text>
              </View>
            </TouchableOpacity>)}
          </View>
         
        </View>
      </HeaderImageScrollView>
    )
  }
}

// export default Index;
