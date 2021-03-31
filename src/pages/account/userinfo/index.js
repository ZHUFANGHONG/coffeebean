import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Image } from 'react-native';
import { pxToDp } from "../../../utils/stylesKits";
import SvgUri from "react-native-svg-uri";
import { male, female } from "../../../res/fonts/iconSvg";
import { Input } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import Geo from "../../../utils/Geo";
import Picker from 'react-native-picker';
import CityJson from "../../../res/citys.json";
import THButton from "../../../components/THButton";
import Toast from "../../../utils/Toast";
import ImagePicker from 'react-native-image-crop-picker';
import { Overlay } from "teaset";
import { inject,observer } from "mobx-react";
import request from '../../../utils/request';
import { ACCOUNT_CHECKHEADIMAGE, ACCOUNT_REGINFO} from '../../../utils/pathMap';
import JMessage from "../../../utils/JMessage";
@inject("RootStore")
@observer

// import DateTimePicker from '@react-native-community/datetimepicker';
class Index extends Component{
  state={
    nickname: "",
    gender: "男",
    birthday: "",
    city: "",
    header: "",
    lng: "",
    lat: "",
    address: ""
  }

  async componentDidMount(){
    
    const res = await Geo.getCityByLocation();
    console.log(res);
    const address = res.regeocode.formatted_address;
    const city = res.regeocode.addressComponent.city.replace("市","");
    const lng = res.regeocode.addressComponent.streetNumber.location.split(",")[0];
    const lat = res.regeocode.addressComponent.streetNumber.location.split(",")[1];
    this.setState({address,city,lng,lat});
  }

  chooseGender=(gender)=>{
    this.setState({gender});
  }

  showCityPicker=()=>{
    Picker.init({
      pickerData: CityJson,
      selectedValue: ["北京", "北京"],
      wheelFlex: [1, 1, 0], // 显示省和市
      pickerConfirmBtnText: "Confirm",
      pickerCancelBtnText: "Cancel",
      pickerTitleText: "choose your city",
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

  chooseHeadImg=async()=>{
    const {nickname,birthday,city}=this.state;
    if(!nickname||!birthday||!city){
      Toast.sad("Whoops, that was a mistake!",2000,"center");
      return;
    }

    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    });

    let overlayViewRef = null;

    let overlayView = (
      <Overlay.View
        style={{flex:1, backgroundColor:"#000"}}
        modal={true}
        overlayOpacity={0}
        ref={v => overlayViewRef = v}
        >
        <View style={{
          marginTop:pxToDp(60),
          alignSelf:"center",
          width:pxToDp(334),
          height:pxToDp(334),
          position:"relative",
          justifyContent:'center',
          alignItems:"center"
        }}>
          <Image style={{width:"100%", height:"100%",position:'absolute',left:0,top:0,zIndex:100}} source={require("../../../res/scan.gif")}/>
          <Image source={{uri:image.path}} style={{width:"60%",height:"60%"}}/>
        </View>
      </Overlay.View>
    );
    Overlay.show(overlayView);

    const res0 = await this.uploadHeadImg(image);

    console.log(res0);
    if(res0.code !== "10000"){
      return;
    }
      
    let params = this.state;
    params.header = res0.data.headImgPath;
    console.log(params);

    const res1 = await request.privatePost(ACCOUNT_REGINFO, params);
    if(res1.code !== "10000"){
      console.log(res1);
      return;
    }
    const res2 = await this.jgBusiness(this.props.RootStore.userId, this.props.RootStore.mobile)
    overlayViewRef.close();
    Toast.smile("Welcome to coffeebean!")
    setTimeout(()=>{
      // this.props.navigation.navigate("Tabbar");
      this.props.navigation.reset({
        routes:[{name:"Tabbar"}]
      })
    },2000);
  }

  uploadHeadImg=(image)=>{
    let formData = new FormData();
    formData.append("headPhoto",{
      uri:image.path,
      type:image.mime,
      name:image.path.split("/").pop()
    });

    return request.privatePost(ACCOUNT_CHECKHEADIMAGE, formData,{
      headers:{
        "Content-Type": "multipart/form-data"
      }
    })
  }

  jgBusiness=async(username, password)=>{
    return JMessage.register(username, password)
  }

  render(){
    
    const {gender,nickname,birthday,city}=this.state;
    const dateNow = new Date();
    const currentDate = `${dateNow.getFullYear()}-${dateNow.getMonth()+1}-${dateNow.getDate()}`;
    return(
      <View style={{backgroundColor:"#fff",flex:1,padding:pxToDp(30)}}>
        <Text style={{fontSize:pxToDp(20),color:"#666",fontWeight:"bold"}}>Finish your profile</Text>
        <Text style={{fontSize:pxToDp(20),color:"#666",fontWeight:"bold"}}>Increase your charisma</Text>
      
        <View style={{marginTop:pxToDp(20)}}>
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
        <View>
          <Input
            value={nickname}
            placeholder="set your name"
              onChangeText={(nickname)=>this.setState({nickname})}
          />
        </View>

        {/* 日期 */}
        <View>
        <DatePicker
              androidMode="spinner"
              style={{ width:"100%"}} 
              date={birthday}
              mode="date"
              placeholder="select birthday"
              format="YYYY-MM-DD"
              minDate="1900-01-01"
              maxDate={currentDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              
              customStyles={{
                dataIcon:{
                  display:"none"
                },
                dateInput: {
                  marginLeft:pxToDp(10),
                  borderWidth: 0,
                  borderBottomWidth: pxToDp(1.1),
                  alignItems:"flex-start",
                  paddingLeft:pxToDp(4),
                  textAlign:"left"
                },
                placeholderText:{
                  fontSize:pxToDp(18),
                  color:"#afafaf"
                }
              }}
              onDateChange={(birthday) => { this.setState({ birthday }) }}
      />
        </View>
        {/* 地址 */}
        <View style={{marginTop:pxToDp(20)}}>
          <TouchableOpacity onPress={this.showCityPicker}>
            <Input 
              value={"location: "+city}
              inputStyle={{color:"#666"}}
              disabled={true}
            />
          </TouchableOpacity>
        </View>
        {/* 选择头像 */}
        <View>
          <THButton
          onPress={this.chooseHeadImg}
            style={{
              height:pxToDp(40),
              borderRadius:pxToDp(20),
              alignSelf:'center'
            }}
          >Picture settings</THButton>
        </View>
      </View>
    )
  }
}

export default Index;