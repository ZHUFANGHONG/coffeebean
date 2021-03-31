import React, { Component } from 'react';
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { pxToDp } from "../../../utils/stylesKits";
import { Input } from "react-native-elements";
import validator from "../../../utils/validator";
import request from "../../../utils/request";
import { ACCOUNT_LOGIN } from "../../../utils/pathMap";
import THButton from "../../../components/THButton";
import {CodeField,Cursor,} from 'react-native-confirmation-code-field';
import Toast from "../../../utils/Toast";
import { ACCOUNT_VALIDATEVCODE } from "../../../utils/pathMap";
import { inject,observer } from "mobx-react";
@inject("RootStore")
@observer
 
// import Toast from "../../../utils/Toast";
class Index extends Component{
  state={
    phoneNumber:"18665711978",
    phoneValid:true,
    showLogin: true,
    vcodeTxt:"",
    btnText:"resned",
    isCountDowning:false
  }

  // constructor() {
  //   super(); 
  //   Toast.showLoading("requesting");

  //   setTimeout(() => {
  //     Toast.hideLoading();
  //   }, 2000);
  // }

  phoneNumberChangeText=(phoneNumber)=>{
    this.setState({phoneNumber});
    console.log(phoneNumber)
  }
  phoneNumberSubmitEditing=async()=>{
    
      const {phoneNumber} = this.state
      const phoneValid = validator.validatePhone(phoneNumber);
      if(!phoneValid){
        this.setState({phoneValid});
        return;
      }
      const res = await request.post(ACCOUNT_LOGIN, {phone:phoneNumber})
      console.log(res);
      if(res.code=="10000"){
        this.setState({ showLogin:false });
        this.countDown();
      }else{

      }
  }
  //开启获取验证码的定时器
  countDown=()=>{
    console.log("开启倒计时")
    if(this.state.isCountDowning){
      return;
    }
    
    this.setState({ isCountDowning: true });
    let seconds = 5;
    this.setState({ btnText: `resend(${seconds}s)` });
    let timeId = setInterval(()=>{
      seconds--;
      this.setState({ btnText: `resend(${seconds}s)` });
      if(seconds===0){
        clearInterval(timeId);
        this.setState({ btnText: "resend",isCountDowning:false });
      }
    }, 1000);
  }

  //验证码输入完毕事件
  onVcodeSubmitEditing=async()=>{
    const{vcodeTxt,phoneNumber}=this.state;
    if(vcodeTxt.length != 6){
      Toast.message("sorry, you enter the code is not correct!", 2000, "center");
      return;
    }

    const res = await request.post(ACCOUNT_VALIDATEVCODE,{
      phone:phoneNumber,
      vcode:vcodeTxt
    });
    if(res.code!="10000"){
      console.log(res);
      return;
    }
    //存储数据到mobx中
    this.props.RootStore.setUserInfo(phoneNumber, res.data.token, res.data.id);
    //存储数据到本地缓存中
    AsyncStorage.setItem("userinfo",JSON.stringify({
      mobile:phoneNumber,
      token:res.data.token,
      userId:res.data.id
    }))
    if(res.data.isNew){
      // this.props.navigation.navigate("UserInfo");
      this.props.navigation.reset({
        routes:[{name:"Tabbar",params:{pagename:"group"}}]
      })
    }else{
      this.props.navigation.reset({
        routes:[{name:"Tabbar"}]
      })
    }
  }

  //渲染登录页面
  renderLogin=()=>{
    const {phoneNumber,phoneValid} = this.state;
    return <View>
    <View><Text style={{fontSize:pxToDp(25), color:"#888",fontWeight:"bold",alignSelf:"center"}}>Phone Number</Text></View>
    <View style={{marginTop:pxToDp(15)}}>
    <Input 
       placeholder='phone number' 
       maxLength={11} 
       keyboardType="phone-pad" 
       value={phoneNumber}
       inputStyle={{color:"#333"}}
       onChangeText={this.phoneNumberChangeText}
       errorMessage={phoneValid ? "" : "Phonenumber is wrong"}
       onSubmitEditing={this.phoneNumberSubmitEditing}
       leftIcon={{type: 'font-awesome', name:'phone', color:"#ccc", size:pxToDp(20)}}
    />
    </View>
    {/* 渐变按钮 */}
    <View>
      
        <THButton onPress={this.phoneNumberSubmitEditing} style={{width:"85%", height:pxToDp(40), alignSelf:"center",borderRadius:pxToDp(20)}}>Get Verification Code</THButton>
  
    </View>
  </View>
  }

  //点击重新获取按钮
  repGetVcode=()=>{
    this.countDown();
  }
  //渲染填写验证码
  renderVcode=()=>{
    const {phoneNumber,vcodeTxt,btnText,isCountDowning} = this.state;
    return <View>
      <View><Text style={{fontSize:pxToDp(22), color:"#888",fontWeight:"bold",alignSelf:"center"}}>Fill in the verification code</Text></View>
      <View style={{marginTop:pxToDp(10)}}><Text style={{color:"#888",alignSelf:"center"}}>The verification code has benn sent to {phoneNumber}</Text></View>
      <View><CodeField
          value={vcodeTxt}
          onSubmitEditing={this.onVcodeSubmitEditing}
          onChangeText={this.onVcodeChangeText}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          renderCell={({index, symbol, isFocused}) => (
            <Text key={index} style={[styles.cell, isFocused && styles.focusCell]}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
          )}
        /></View>
      <View style={{marginTop:pxToDp(10)}}><THButton disabled={isCountDowning} onPress={this.repGetVcode} style={{width:"85%", height:pxToDp(40), alignSelf:"center",borderRadius:pxToDp(20)}}>{btnText}</THButton></View>
    </View>
  }
 
  onVcodeChangeText=(vcodeTxt)=>{
    this.setState({ vcodeTxt });
  }

  render(){
    const {phoneNumber,phoneValid,showLogin} = this.state;
    
    return(
      <View>
        {/* 状态栏 开始 */}
        <StatusBar backgroundColor="transparent" translucent={true}/>
        {/* 背景图片 开始 */}
        <Image style={{width:"100%", height:pxToDp(180)}} source={require("../../../res/profileBackground.jpg")}></Image>
        {/* 背景图片 结束 */}
        {/* 内容 开始 */}
        <View style={{padding:pxToDp(20)}}>
          {/* 登陆 开始 */}
          {showLogin ? this.renderLogin() : this.renderVcode()}
        </View>
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 5},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderBottomWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#7d53ea',
  },
});
 

export default Index;
