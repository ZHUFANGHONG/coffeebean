import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { View, Text,Image,TextInput } from 'react-native';
import THNav from "../../../components/THNav";
import { ListItem,Overlay } from "react-native-elements";
import { pxToDp } from '../../../utils/stylesKits';
import { BASE_URI,ACCOUNT_CHECKHEADIMAGE,MY_SUBMITUSERINFO,MY_INFO } from '../../../utils/pathMap';
import ImagePicker from 'react-native-image-crop-picker';
import request from "../../../utils/request";
import moment from "moment";
import Toast from '../../../utils/Toast';
import DatePicker from "react-native-datepicker";
import Picker from 'react-native-picker';
import CityJson from "../../../res/citys.json";

@inject("UserStore")
@observer
class Index extends Component{
  state={
    showNickName: false,
    showGender:false
  }

  onPickerImage=async()=>{
    
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    });
    const res = await this.uploadHeadImg(image);
    const header = res.data.headImgShortPath;
    const res2 = await this.onSubmitUser({header});
    console.log(res2);
  }

  onSubmitUser=async(user)=>{
    const res = await request.privatePost(MY_SUBMITUSERINFO,user);
    Toast.smile("Modify successfully")
    const res2 = await request.privateGet(MY_INFO);
    this.props.UserStore.setUser(res2.data);
    return Promise.resolve(res);
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

  nickNameUpdate=async(e)=>{
    const nickname = e.nativeEvent.text;
    if(!nickname) return;
    await this.onSubmitUser({nickname});
    this.setState({ showNickName: false });
  }

  birthdayUpdate=async(birthday)=>{
    // console.log(birthday);
    this.onSubmitUser({birthday});
  }

  genderUpdate=async(gender)=>{
    this.onSubmitUser({gender});
    this.setState({ showGender: false });
  }

  showCityPicker=async()=>{
    Picker.init({
      pickerData: CityJson,
      selectedValue: ["北京", "北京"],
      wheelFlex: [1, 1, 0], // 显示省和市
      pickerConfirmBtnText: "Confirm",
      pickerCancelBtnText: "Cancel",
      pickerTitleText: "choose your city",
      onPickerConfirm: this.cityUpdate
    });
    Picker.show();
  }

  cityUpdate=async(arr)=>{
    const city = arr[1];
    await this.onSubmitUser({ city });
  }

  showXueliPicker=async()=>{
    Picker.init({
      pickerData: ["bachelor","master","doctor","others"],
      selectedValue: ["others"],
      wheelFlex: [1, 0, 0], 
      pickerConfirmBtnText: "Confirm",
      pickerCancelBtnText: "Cancel",
      pickerTitleText: "Education",
      onPickerConfirm: this.xueliUpdate
    });
    Picker.show();
  }

  xueliUpdate=async(arr)=>{
    const xueli = arr[0];
    await this.onSubmitUser({ xueli });
  }

  showMarryPicker=async()=>{
    Picker.init({
      pickerData: ["Single","Married"],
      selectedValue: ["Single"],
      wheelFlex: [1, 0, 0], 
      pickerConfirmBtnText: "Confirm",
      pickerCancelBtnText: "Cancel",
      pickerTitleText: "Marital status",
      onPickerConfirm: this.marryUpdate
    });
    Picker.show();
  }

  marryUpdate=async(arr)=>{
    const marry = arr[0];
    await this.onSubmitUser({ marry });
  }

  render(){
    const user = this.props.UserStore.user;
    const {showNickName,showGender} = this.state;
    return(
      <View>
        
        <Overlay visible={showNickName} onBackdropPress={()=>this.setState({ showNickName: false })}>
          <TextInput placeholder="modify your nickname"
          onSubmitEditing={this.nickNameUpdate}
          style={{width:pxToDp(200)}}
          />
        </Overlay>
        <Overlay visible={showGender} onBackdropPress={()=>this.setState({ showGender: false })}>
          <View style={{width:pxToDp(200),height:pxToDp(60),justifyContent:"space-evenly",alignItems:"center"}}>
            <Text style={{color:"#666"}} onPress={()=>this.genderUpdate("男")}>male</Text>
            <Text style={{color:"#666"}} onPress={()=>this.genderUpdate("女")}>female</Text>
          </View>
        </Overlay>
        <THNav title="Update your profile"/>
        {/* 用户信息 */}
        <ListItem 
        title="Avatar"
        rightElement={<Image style={{width:pxToDp(40),height:pxToDp(40),borderRadius:pxToDp(20)}}
        source={{uri:BASE_URI + user.header}}
        />}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        onPress={this.onPickerImage}
        />
        <ListItem 
        title="Nickname"
        rightTitle = {user.nick_name}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        onPress={()=>this.setState({ showNickName: true })}
        />
        
        <View style={{position:"relative"}}>
          <ListItem 
          title="Birthday"
          rightTitle = {moment(user.birthday).format("YYYY-MM-DD")}
          titleStyle={{color:"#666"}}
           chevron
          bottomDivider
          />
          <DatePicker
              androidMode="spinner"
              style={{ width:"100%",position:"absolute",top:0,left:0,height:"100%",opacity:0}} 
              date={moment(user.birthday).format("YYYY-MM-DD")}
              mode="date"
              placeholder="select birthday"
              format="YYYY-MM-DD"
              minDate="1900-01-01"
              maxDate={moment(user.birthday).format("YYYY-MM-DD")}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={this.birthdayUpdate}
          />
        </View>
        <ListItem 
        title="Gender"
        rightTitle = {user.gender}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        onPress={()=>this.setState({ showGender: true })}
        />
        <ListItem 
        title="Location"
        rightTitle = {user.city}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        onPress={this.showCityPicker}
        />
        <ListItem 
        title="Degree"
        rightTitle = {user.xueli}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        onPress={this.showXueliPicker}
        />
        <ListItem 
        title="Wages"
        rightTitle = {"15K-25K"}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        />
        <ListItem 
        title="Occupation"
        rightTitle = {"IT"}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        />
        <ListItem 
        title="Marital status"
        rightTitle = {"Single"}
        titleStyle={{color:"#666"}}
        chevron
        bottomDivider
        onPress={this.showMarryPicker}
        />
      </View>
    )
  }
}

export default Index;
