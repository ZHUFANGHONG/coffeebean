import React, { Component } from 'react';
import { View, Text,Image } from 'react-native';
import request from "../../../../utils/request";
import { pxToDp } from "../../../../utils/stylesKits";
import { FRIENDS_TODAYBEST,BASE_URI } from "../../../../utils/pathMap";
import Svg from "react-native-svg-uri";
import { flower,love } from "../../../../res/fonts/iconSvg";
import IconFont from "../../../../components/IconFont";
// import GoodPople from "../../../../res/goodpople.png";
class Index extends Component{
  state={
    perfectGirl:{
      // id:16,
      // header:"/upload/13828459788.jpg",
      // nick_name:"若只如初见",
      // gender:"女",
      // age:23,
      // marry:"单身",
      // xueli:"大专",
      // dist:246.1,
      // agediff:0,
      // fateValue:78
    }
  }
  async componentDidMount() {
    const res = await request.privateGet(FRIENDS_TODAYBEST,this.state.perfectGirl);
    // this.setState({perfectGirl:res.data[0]});
    // console.log(res);
  }

  render(){
    const {perfectGirl} = this.state;
    return(
      <View style={{flexDirection:"row"}}>
        <View  style={{position:"relative"}}>
          <Image 
          style={{width:pxToDp(120),height:pxToDp(120)}}
          source={require( '../../../../res/goodpople.png' )} />
          <View 
          style={{
            width:pxToDp(88),height:pxToDp(30),backgroundColor:"#b564bf",
            justifyContent:"center",alignItems:"center",borderRadius:pxToDp(10),
            position:"absolute",left:0,bottom:pxToDp(10)
          }}
          >
            <Text style={{color:"#fff",fontSize:pxToDp(13)}}>social queen</Text>
          </View>
        </View>
      
        <View style={{flex:1,flexDirection:"row"}}>
          <View style={{flex:2,justifyContent:"space-around"}}>
            <View style={{flexDirection:"row"}}>
              <Text style={{color:"#555"}}>Nancy</Text>
              <Svg width="20" height="20" svgXmlData={flower}/>
              <Text style={{color:"#555"}}>age:23</Text>
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
              <Text style={{color:"#555"}}>single</Text>
              <Text style={{color:"#555"}}> | </Text>
              <Text style={{color:"#555"}}>colleage school{"\n"}</Text>
              {/* <Text style={{color:"#555"}}>|</Text> */}
            </View>
            <Text>Age-matched</Text>
          </View>
          <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <IconFont name="iconaixin3" style={{fontSize:pxToDp(50),color:"red"}}/>
              <Text style={{position:"absolute",color:"#fff",fontSize:pxToDp(13),fontWeight:"bold"}}>92</Text>
            </View>
            <Text style={{color:"red",fontSize:pxToDp(13)}}>fateValue</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Index;