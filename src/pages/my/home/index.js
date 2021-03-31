import React, { Component } from 'react';
import { View, Text,StatusBar,TouchableOpacity,Image,ScrollView,RefreshControl} from 'react-native';
import { pxToDp } from '../../../utils/stylesKits';
import IconFont from "../../../components/IconFont";
import { BASE_URI,MY_COUNTS } from "../../../utils/pathMap";
import { inject, observer } from 'mobx-react';
import  {ListItem}  from "react-native-elements";
import Svg from "react-native-svg-uri";
import { moment,Footprint,Setting,kefu } from "../../../res/fonts/iconSvg";
import Geo from "../../../utils/Geo";
import request from "../../../utils/request";
import { NavigationContext } from "@react-navigation/native";
@inject("UserStore")
@observer

class Index extends Component{
  static contextType = NavigationContext;
  state={
    city:"",
    fanCount: 0,
    loveCount: 0,
    eachLoveCount: 0,
    refreshing:false
  }

  componentDidMount(){
    this.getCityByLocation();
    this.getList()
  }
  getCityByLocation=async()=>{
    const res = await Geo.getCityByLocation();
    this.setState({ city: res.regeocode.addressComponent.city });
  }
  getList = async()=>{
    const res = await request.privateGet(MY_COUNTS);
    console.log(res);
    const fanCount = res.data[0].cout;
    const loveCount = res.data[1].cout;
    const eachLoveCount = res.data[2].cout;
    this.setState({ fanCount,loveCount,eachLoveCount });
    return Promise.resolve();
  }

  onRefresh=async()=>{
    this.setState({ refreshing: true });
    await this.getList();
    this.setState({ refreshing: false });
  }

  render(){
    const {city,fanCount,loveCount,eachLoveCount,refreshing} = this.state;
    const user = this.props.UserStore.user;
    return(
      <ScrollView 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh}/>}
      contentContainerStyle={{flex:1,backgroundColor:"#f6fcfe"}}>
        <View style={{height:pxToDp(150),backgroundColor:"#c7689f",position:"relative"}}>
          <StatusBar backgroundColor="transparent" translucent />
          <IconFont onPress={()=>this.context.navigate("UserUpdate")} name="icongerenzhongxin" style={{position:"absolute",top:pxToDp(30),right:pxToDp(20),
          color:"#fff",fontSize:pxToDp(22)}} />

          <TouchableOpacity 
            style={{flexDirection:"row",paddingTop:pxToDp(15),
            paddingBottom:pxToDp(15),marginTop:pxToDp(50)}}>
              <View style={{paddingLeft:pxToDp(15),paddingRight:pxToDp(15)}}>
                <Image style={{width:pxToDp(50),height:pxToDp(50),
                borderRadius:pxToDp(25)
                }} source={{uri:BASE_URI+user.header}}/>
              </View>
              {/* 名称 */}
              <View style={{ flex: 2, justifyContent: "space-around" }} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#fff",fontWeight:"bold",fontSize:pxToDp(17) }} >{user.nick_name}</Text>
                  <View style={{flexDirection:"row",backgroundColor:"#fff",borderRadius:pxToDp(15),paddingLeft:pxToDp(4),paddingRight:pxToDp(4),marginLeft:pxToDp(10)}}>
                    <IconFont style={{ fontSize: pxToDp(18), color: user.gender === "女" ? "pink" : "skyblue" }}
                    name="icongerenxinxi_zhixiguanxi" />
                    <Text style={{ color: "#555" }} >{user.age}岁</Text>
                  </View>
                </View>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  <IconFont style={{color:"#fff"}} name="iconlocation" />
                  <Text style={{color:"#fff",marginLeft:pxToDp(8)}}>{city}</Text>
                </View>
              </View>
          </TouchableOpacity>
        
        </View>
        <View style={{height:pxToDp(120),backgroundColor:"#fff", width:"90%",alignSelf:"center",
            marginTop:pxToDp(-10),borderRadius:pxToDp(8),flexDirection:"row"}}>
            <TouchableOpacity 
            onPress={()=>this.context.navigate("Follow",0)}
            style={{flex:1,alignItems:"center",justifyContent:"center"}}>
              <Text style={{color:"#666",fontSize:pxToDp(20)}}>{eachLoveCount}</Text>
              <Text style={{color:"#666",fontSize:pxToDp(16)}}>Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>this.context.navigate("Follow",1)}
            style={{flex:1,alignItems:"center",justifyContent:"center"}}>
              <Text style={{color:"#666",fontSize:pxToDp(20)}}>{loveCount}</Text>
              <Text style={{color:"#666",fontSize:pxToDp(16)}}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>this.context.navigate("Follow",2)}
            style={{flex:1,alignItems:"center",justifyContent:"center"}}>
              <Text style={{color:"#666",fontSize:pxToDp(20)}}>{fanCount}</Text>
              <Text style={{color:"#666",fontSize:pxToDp(16)}}>Fans</Text>
            </TouchableOpacity>
          </View>
        
          <View style={{marginTop:pxToDp(10)}}>
            <ListItem 
            leftIcon={<Svg width="30" height="30" svgXmlData={moment}/>}
            // { <IconFont name="icon005sakura"/>}
            title="MY MOMENT"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
            onPress={()=>this.context.navigate("Trends")}
            />
            <ListItem 
            leftIcon={ <Svg width="30" height="30" svgXmlData={Footprint}/>}
            title="FOOTPRINT"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
            onPress={()=>this.context.navigate("Visitors")}
            />
            <ListItem 
            leftIcon={ <Svg width="30" height="30" svgXmlData={Setting}/>}
            title="SETTING"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
            onPress={()=>this.context.navigate("Settings")}
            />
            <ListItem 
            leftIcon={ <Svg width="30" height="30" svgXmlData={kefu}/>}
            title="HELP"
            titleStyle={{color:"#666"}}
            bottomDivider
            chevron
            />
          </View>
      </ScrollView>
    )
  }
}

export default Index;