import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { pxToDp } from "../../../../utils/stylesKits";
class Index extends Component{
  render(){
    // console.log(this.props);
    const {goToPage, tabs, activeTab} = this.props;
    return(
      <ImageBackground
      style={{height:pxToDp(60),flexDirection:"row",paddingLeft:pxToDp(20),paddingRight:pxToDp(20),justifyContent:"space-evenly"}}
      source={require("../../../../res/rectanglecopy.png")}
      >
        {tabs.map((v,i)=><TouchableOpacity 
        key={i}
        onPress={()=>goToPage(i)}
        style={{justifyContent:"center",borderBottomColor:"#fff",
        borderBottomWidth:activeTab===i?pxToDp(3):0
      }}
        >
          <Text
          style={{color:"#fff",fontSize:activeTab===i?pxToDp(21):pxToDp(15)}}
          >{v}</Text>
        </TouchableOpacity>)}
      </ImageBackground>
    )
  }
}

export default Index;