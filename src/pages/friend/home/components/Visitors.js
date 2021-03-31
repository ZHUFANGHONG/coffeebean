import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import request from "../../../../utils/request";
import { FRIENDS_VISITORS,BASE_URI } from "../../../../utils/pathMap";
import { pxToDp } from '../../../../utils/stylesKits';
class Index extends Component{
  state={
    visitors:[

    ]
  }
  async componentDidMount() {
    const res = await request.privateGet(FRIENDS_VISITORS);
    this.setState({visitors:res.data})
  }
  render(){
    const {visitors} = this.state;
    return(
      <View style={{paddingLeft:pxToDp(10),paddingRight:pxToDp(5),flexDirection:"row",marginTop:pxToDp(20),alignItems:"center"}}>
        <Text style={{flex:1,color:"#777",fontSize:pxToDp(15)}}>{visitors.length} has see your profile </Text>
        <View style={{flexDirection:"row", flex:1,alignItems:"center",justifyContent:"space-around"}}>
          {
            visitors.map((v,i)=> <Image key={i} style={{width:pxToDp(30),height:pxToDp(30),
             borderRadius:pxToDp(15)
            }}
            source={{uri:BASE_URI+v.header}}
            />)
          }
          <Text style={{fontSize:pxToDp(15),color:"#777"}}>&gt;</Text>
        </View>
      </View>
    )
  }
}

export default Index;
