import React, { Component } from 'react';
import { View, Text,Image,TouchableOpacity } from 'react-native';
import THNav from "../../../components/THNav";
import { FRIENDS_VISITORS,BASE_URI } from "../../../utils/pathMap";
import request from "../../../utils/request";
import { pxToDp } from '../../../utils/stylesKits';
import IconFont from "../../../components/IconFont";
class Index extends Component{
  state={
    list:[]
  }
  componentDidMount(){
    this.getList();
  }
  getList=async()=>{
    const res = await request.privateGet(FRIENDS_VISITORS);
    // console.log(res);
    this.setState({ list: res.data });
  }
  render(){
    const {list} = this.state;
    return(
      <View style={{flex:1,backgroundColor:"#fff"}}>
        <THNav title="FIITPRINT"/>
        {/* 小圆圈 */}
        <View style={{padding:pxToDp(10),backgroundColor:"#eee",alignItems:"center"}}>
          <View style={{flexDirection:"row",marginBottom:pxToDp(10)}}>
            {list.map((v,i)=><Image key={i} style={{width:pxToDp(40),height:pxToDp(40),
            borderRadius:pxToDp(20),marginLeft:pxToDp(5),marginRight:pxToDp(5)}}
            source={{uri:BASE_URI+v.header}}
            />)}
          </View>
          <Text style={{color:"#666"}}>There are {list.length} People visited you Profile, go and check...</Text>
        </View>

        {/* 列表 */}
        <View>
            {list.map((v,i)=><TouchableOpacity key={i} 
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
    )
  }
}

export default Index;
