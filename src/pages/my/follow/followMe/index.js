import React, { Component } from 'react';
import { View, Text,TouchableOpacity,Image } from 'react-native';
import { pxToDp } from '../../../../utils/stylesKits';
import SearchInput from "../components/SearchInput";
import IconFont from "../../../../components/IconFont";
import { BASE_URI,FRIENDS_LIKE } from "../../../../utils/pathMap";
import request from "../../../../utils/request";
import Toast from "../../../../utils/Toast";
class Index extends Component{
  state={
    txt:""
  }

  setLike=async(id)=>{
    const url = FRIENDS_LIKE.replace(":id",id).replace(":type","like")
    const res = await request.privateGet(url);

    Toast.smile("Follow successfully");
    this.props.getList();
  }
  render(){
    // console.log(this.props);
    const {txt} = this.state;
    const {likemelist} = this.props;
    const list = likemelist.filter(v=>v.nick_name.includes(txt));
    return(
      <View style={{flex:1,backgroundColor:"#fff"}}>
        <View style={{backgroundColor:"#eee",padding:pxToDp(10)}}>
          <SearchInput onChangeText={txt=>this.setState({txt})} value={this.state.txt} 
          style={{marginTop:pxToDp(5)}}/>
        </View>
    
        {list.map((user,i)=><View 
            key={i}
            style={{flexDirection:"row",paddingTop:pxToDp(15),
            paddingBottom:pxToDp(15),paddingRight:pxToDp(15),
            borderBottomColor:"#ccc",borderBottomWidth:pxToDp(1)
            }}>
              <View style={{paddingLeft:pxToDp(15),paddingRight:pxToDp(15)}}>
                <Image style={{width:pxToDp(50),height:pxToDp(50),
                borderRadius:pxToDp(25)
                }} source={{uri:BASE_URI+user.header}}/>
              </View>
              {/* 名称 */}
              <View style={{ flex: 2, justifyContent: "space-around"}} >
                <View style={{ flexDirection: "row", alignItems: "center"}}>
                  <Text style={{ color: "#666",fontWeight:"bold",fontSize:pxToDp(17) }} >{user.nick_name}</Text>
                  <View style={{flexDirection:"row",backgroundColor:"#fff",borderRadius:pxToDp(15),paddingLeft:pxToDp(4),paddingRight:pxToDp(4),marginLeft:pxToDp(10)}}>
                    <IconFont style={{ fontSize: pxToDp(18), color: user.gender === "女" ? "pink" : "skyblue" }}
                    name="icongerenxinxi_zhixiguanxi" />
                    <Text style={{ color: "#555" }} >{user.age}岁</Text>
                  </View>
                </View>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  <IconFont style={{color:"#666"}} name="iconlocation" />
                  <Text style={{color:"#666",marginLeft:pxToDp(5)}}>{user.city}</Text>
                </View>
              </View>

              {/* 按钮 */}
              <TouchableOpacity 
              onPress={()=>this.setLike(user.id)}
              style={{
                flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",
                width:pxToDp(80),height:pxToDp(40),alignSelf:"center",
                borderRadius:pxToDp(5),borderColor:"orange",borderWidth:pxToDp(1)}}>
                <IconFont style={{color:"orange",paddingRight:pxToDp(2),paddingLeft:pxToDp(2)}} name="iconaixin6"/>
                <Text style={{color:"orange"}}>Follow</Text>
              </TouchableOpacity>
        </View>)}
      </View>
    )
  }
}

export default Index;