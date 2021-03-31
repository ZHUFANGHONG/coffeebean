import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg from "react-native-svg-uri";
import { tanhua, near, testSoul } from "../../../../res/fonts/iconSvg";
import { pxToDp } from "../../../../utils/stylesKits";
import { NavigationContext } from "@react-navigation/native";
class Index extends Component{
  static contextType = NavigationContext;
  goPage=(page)=>{
    this.context.navigate(page);
  }
  render(){
    return(
      <View style={{flexDirection:"row",width:"80%",justifyContent:"space-around"}}>
        <TouchableOpacity
          onPress={()=>this.goPage("TanHua")}
          style={{alignItems:"center",marginTop:pxToDp(8)}}
        >
          <View style={{width:pxToDp(50),height:pxToDp(50),borderRadius:pxToDp(25),
            backgroundColor:"#eee", justifyContent:"center",alignItems:"center"}}>
            <Svg width="35" height="40" svgXmlData={tanhua}/>
          </View>
          <Text style={{fontSize:pxToDp(13), marginTop:pxToDp(4),color:"#ffffff9a"}}>Tanhua</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>this.goPage("Search")}
          style={{alignItems:"center",marginTop:pxToDp(8)}}
        >
          <View style={{width:pxToDp(50),height:pxToDp(50),borderRadius:pxToDp(25),
            backgroundColor:"#eee", justifyContent:"center",alignItems:"center"}}>
            <Svg width="50" height="50" svgXmlData={near}/>
          </View>
          <Text style={{fontSize:pxToDp(13), marginTop:pxToDp(4),color:"#ffffff9a"}}>Neignborhood</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>this.goPage("TestSoul")}
          style={{alignItems:"center",marginTop:pxToDp(8)}}
        >
          <View style={{width:pxToDp(50),height:pxToDp(50),borderRadius:pxToDp(25),
            backgroundColor:"#eee", justifyContent:"center",alignItems:"center"}}>
            <Svg width="40" height="40" svgXmlData={testSoul}/>
          </View>
          <Text style={{fontSize:pxToDp(13), marginTop:pxToDp(4),color:"#ffffff9a"}}>TestSoul</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Index;