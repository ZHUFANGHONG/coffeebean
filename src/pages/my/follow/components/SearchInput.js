import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import IconFont from "../../../../components/IconFont";
import { pxToDp } from "../../../../utils/stylesKits";
class Index extends Component{
  render(){
    return(
      <View style={{height:pxToDp(50),borderRadius:pxToDp(20),backgroundColor:"#fff",
      position:"relative",...this.props.style
      }}>
        <TextInput
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        placeholder="Search Users" style={{paddingLeft:pxToDp(60)}}/>
        <IconFont name="iconmen" style={{fontSize:pxToDp(25),position:"absolute",left:pxToDp(10),top:pxToDp(5),color:"pink"}}/>
      </View>
    )
  }
}

export default Index;