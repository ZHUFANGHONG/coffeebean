import React, { Component } from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import IconFont from "../../../../components/IconFont";
import { pxToDp } from '../../../../utils/stylesKits';
import SvgUri from "react-native-svg-uri";
import { male,female } from "../../../../res/fonts/iconSvg";
import Picker from 'react-native-picker';
import { Slider } from "react-native-elements";
import CityJson from "../../../../res/citys.json";
import THButton from "../../../../components/THButton";
class Index extends Component{

  constructor(props){
    super(props);
    this.state = JSON.parse(JSON.stringify(this.props.params));
  }

  chooseGender=(gender)=>{
    this.setState({ gender });
  }
  // 选择近期登录时间
  chooseLastLogin=()=>{
    Picker.init({
      pickerData: ["15 min","1 h","24 h","Timeless"],
      selectedValue: [this.state.lastLogin],
      wheelFlex: [1, 0, 0], // 显示省和市
      pickerConfirmBtnText: "Confirm",
      pickerCancelBtnText: "Cancel",
      pickerTitleText: "Latest time to login",
      onPickerConfirm: data => {
        // data =  [广东，广州，天河]
        this.setState(
          {
            lastLogin: data[0]
          }
        );
      }
    });
    Picker.show();
  }

  chooseCity=()=>{
    Picker.init({
      pickerData: CityJson,
      selectedValue: ["北京", "北京"],
      wheelFlex: [1, 1, 0], // 显示省和市
      pickerConfirmBtnText: "Confirm",
      pickerCancelBtnText: "Cancel",
      pickerTitleText: "Location",
      onPickerConfirm: data => {
        // data =  [广东，广州，天河]
        this.setState(
          {
            city: data[1]
          }
        );
      }
    });
    Picker.show();
  }

  chooseEducation=()=>{
    Picker.init({
      pickerData: [,"bachelor","master","doctor","others"],
      selectedValue: ["others"],
      wheelFlex: [1, 0, 0], // 显示省和市
      pickerConfirmBtnText: "Confirm",
      pickerCancelBtnText: "Cancel",
      pickerTitleText: "Education",
      onPickerConfirm: data => {
        // data =  [广东，广州，天河]
        this.setState(
          {
            education: data[0]
          }
        );
      }
    });
    Picker.show();
  }
  // 点击确定之后
  handleSubmitFilter=()=>{
    this.props.onSubmitFilter(this.state);
    this.props.onClose();
  }
  render(){
    const {gender,lastLogin,distance,city,education} = this.state;
    return(
      <View
        style={{position:"absolute", width:"100%",height:"80%",
          left:0,
          bottom:0,backgroundColor:"#fff",
          paddingRight:pxToDp(10),paddingLeft:pxToDp(10)
        }}
      >
        {/* 标题 */}
        <View style={{flexDirection:"row",justifyContent:"space-between",height:pxToDp(50),alignItems:"center"}}>
          <Text></Text>
          <Text style={{color:"#999",fontSize:pxToDp(25),fontWeight:"bold"}}>Filter</Text>
          <IconFont onPress={this.props.onClose} style={{fontSize:pxToDp(25)}} name="iconguanbi1"/>
        </View>
        {/* 性别 */}
        <View style={{flexDirection:"row",alignItems:"center",marginTop:pxToDp(10)}}>
        <Text style={{color:"#777",fontSize:pxToDp(18),width:pxToDp(80)}}>gender:</Text>
        <View style={{justifyContent:"space-around",width:"60%", flexDirection:"row",alignSelf:"center"}}>
            <TouchableOpacity onPress={this.chooseGender.bind(this,"男")} style={{width:pxToDp(60),height:pxToDp(60),borderRadius:pxToDp(30),
              backgroundColor:gender==="男"?"skyblue":"#eee",
              justifyContent:"center",
              alignItems:'center'}}>
            <SvgUri svgXmlData={male} width="40" height="40"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.chooseGender.bind(this,"女")} style={{width:pxToDp(60),height:pxToDp(60),borderRadius:pxToDp(30),
              backgroundColor:gender==="女"?"pink":"#eee",
              justifyContent:"center",
              alignItems:'center'}}>
            <SvgUri svgXmlData={female} width="40" height="40"/>
            </TouchableOpacity>
          </View>
        </View>

        {/* 近期登录时间 */}
        <View style={{flexDirection:"row",alignItems:"center",marginTop:pxToDp(15)}}>
          <Text style={{color:"#777",fontSize:pxToDp(18),width:pxToDp(250)}}>The latest time of log in: </Text>
          <Text onPress={this.chooseLastLogin} style={{color:"#777",fontSize:pxToDp(15),backgroundColor:"#eee"}}>{lastLogin||"Click to choose"}</Text>
        </View>
      
        {/* 距离 */}
        <View style={{marginTop:pxToDp(15)}}>
            <Text style={{color:"#777",fontSize:pxToDp(18)}}>Distance: {distance||0} km</Text>
            <Slider 
            value={distance}
            minimumValue={0}
            maximumValue={10}
            step={0.5}
            onValueChange={(distance)=>this.setState({distance})}
            />
        </View>
      
        {/* 居住地 */}
        <View style={{flexDirection:"row",alignItems:"center",marginTop:pxToDp(15)}}>
          <Text style={{color:"#777",fontSize:pxToDp(18),width:pxToDp(100)}}>Location: </Text>
          <Text onPress={this.chooseCity} style={{color:"#777",fontSize:pxToDp(15),backgroundColor:"#eee"}}>{city||"Click to choose"}</Text>
        </View>
        {/* 学历 */}
        <View style={{flexDirection:"row",alignItems:"center",marginTop:pxToDp(15)}}>
          <Text style={{color:"#777",fontSize:pxToDp(18),width:pxToDp(150)}}>Academic qualification: </Text>
          <Text onPress={this.chooseEducation} style={{color:"#777",fontSize:pxToDp(15),backgroundColor:"#eee"}}>{education||"Click to choose"}</Text>
        </View>
        <THButton 
        onPress={this.handleSubmitFilter}
        style={{width:"100%",height:pxToDp(40),marginTop:pxToDp(15)}}>Confrim</THButton>
      </View>
    )
  }
}

export default Index;