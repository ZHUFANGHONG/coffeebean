import React, { Component } from 'react';
import { View, Text, TextInput,TouchableOpacity,Image,ScrollView } from 'react-native';
import THNav from "../../../../../components/THNav";
import { pxToDp } from "../../../../../utils/stylesKits";
import IconFont from "../../../../../components/IconFont";
import SvgUri from "react-native-svg-uri";
import { pitch,picture,biaoqing } from "../../../../../res/fonts/iconSvg";
import Geo from "../../../../../utils/Geo";
import ImagePicker from 'react-native-image-picker';
import { ActionSheet } from "teaset";
import Emotion from "../../../../../components/Emotion";
import Toast from "../../../../../utils/Toast";
import { QZ_IMG_UPLOAD,QZ_DT_PUBLISH } from "../../../../../utils/pathMap";
import request from "../../../../../utils/request";

class Index extends Component{
  state={
    textContent: "",
    longitude: "",
    latitude: "",
    location: "",
    // imageContent: [
    //   {
    //     "headImgShortPath": "/upload/album/18665711978/1576633170560_0.9746430185850421.jpg"
    //   }
    // ],
    tmpImgList:[],
    showEmotion:false
  }
  constructor(){
    super();
    this.refInput = React.createRef();
  }

  handleSetInputFocus=()=>{
    if(!this.refInput.isFocused()){
      this.refInput.focus();
    }
  }

  onChangeText=(textContent)=>{
    this.setState({textContent});
  }

  getCurrentPosition=async()=>{
    const res = await Geo.getCityByLocation();
    const {province,city,district,township,streetNumber} = res.regeocode.addressComponent;
    this.setState({ 
      location: province+city+district+township,
      longitude: streetNumber.location.split(",")[0],
      latitude: streetNumber.location.split(",")[1]
    });
  }

  handleSelectImage=()=>{
      const options = {
        title: 'Select Avatar',
        takePhoneButtonTitle:"Take Photo ",
        chooseFromLibraryButtonTitle:"Choose from Library",
        storageOptions: {
        skipBackup: true,
        path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, (response) => {
        // console.log("===============");
        // console.log(response);
        // console.log("===============");
          if (response.didCancel) {
          console.log('User cancelled image picker');
          } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          } else {
            const {tmpImgList} = this.state;
            if(tmpImgList.length>=9){
              Toast.message("No more than 9 pictures");
            }
            tmpImgList.push(response)
            this.setState({ tmpImgList });
          }
        });
  }

  handleImageRemove=(i)=>{
    const imgDelete=()=>{
      const {tmpImgList} = this.state;
      tmpImgList.splice(i,1);
      this.setState({ tmpImgList });
      Toast.smile("Delete successfully")
    }
    const opts=[
      {title:"Delete",onPress:imgDelete}
    ]
    ActionSheet.show(opts,{title:"Cancel"})
  }

  handleEmotionSelect=(value)=>{
    this.setState({ textContent: this.state.textContent+value.key });
  }

  toggleEmotion=()=>{
    this.setState({ showEmotion: !this.state.showEmotion });
  }

  submitTrend=async()=>{
    const {textContent,location,longitude,latitude,tmpImgList} = this.state;
    if(!textContent||!location||!longitude||!latitude||!tmpImgList.length){
      Toast.message("Invalid Input");
      return;
    }
    const imageContent = await this.uploadImage();
    const params={textContent,location,longitude,latitude,imageContent};
    const res = await request.privatePost(QZ_DT_PUBLISH,params);
    // console.log(res);
    Toast.smile("Publish successfully");
    setTimeout(()=>{
      this.props.navigation.reset({
        routes:[{name:"Tabbar",params:{pagename:"group"}}]
      })
    },2000)
  }

  uploadImage=async()=>{
    const {tmpImgList} = this.state;
    if(tmpImgList.length){
      const params = new FormData();
      tmpImgList.forEach(v=>{
        const imgObj={
          uri: "file://"+v.path,
          name: v.fileName,
          type: "application/octet-stream"
        }
        params.append("images",imgObj);
      });

      const res = await request.privatePost(QZ_IMG_UPLOAD,params,{
        headers:{'Content-type': 'multipart/form-data;charset=utf-8'}
      })
      return Promise.resolve([res.data.map(v=>({headImgShortPath:v.headImgShortPath}))]);
    }else{
      return Promise.resolve([])
    }
    
    
  }

  render(){
    const {textContent,location,tmpImgList,showEmotion} = this.state;
    return(
      <View style={{flex:1,backgroundColor:"#fff"}}>
        <THNav title="State Your Mind" rightText="Publish"
        onRightPress={this.submitTrend}
        />

        <TouchableOpacity
         style={{height:"40%"}}
         onPress={this.handleSetInputFocus}
        >
            <TextInput
            ref={ref => this.refInput = ref}
            placeholder="Express your mind(less than 140 words)"
            multiline
            value={textContent}
            onChangeText={this.onChangeText}
            />
        </TouchableOpacity>
        {/* 定位 */}
        <View style={{alignItems:"flex-end",height:pxToDp(40),justifyContent:"center"}}>
          <TouchableOpacity
            onPress={this.getCurrentPosition}
            style={{flexDirection:"row",alignItems:"center"}}
          >
          <SvgUri svgXmlData={pitch} width="35" height="35"/>
          <Text style={{color:"#aaa", marginLeft:pxToDp(8),marginRight:pxToDp(8),fontSize:pxToDp(16)}}>{location||"location"}</Text>
          </TouchableOpacity>
        </View>

        {/* 相册 */}
        <View style={{paddingTop:pxToDp(5),paddingBottom:pxToDp(5)}}>
          <ScrollView horizontal>
            {tmpImgList.map((v,i)=><TouchableOpacity
            key={i}
            style={{marginLeft:pxToDp(5),marginRight:pxToDp(5)}}
            onPress={this.handleImageRemove.bind(this, i)}
            >
              <Image 
              source={{uri: v.uri}}
              style={{width:pxToDp(50),height:pxToDp(50)}}
              />
            </TouchableOpacity>)}
          </ScrollView>
        </View>
        {/* 工具栏 */}
        <View style={{height:pxToDp(50),flexDirection:"row",alignItems:"center",backgroundColor:"#eee"}}>
          <TouchableOpacity
          onPress={this.handleSelectImage}
          style={{marginLeft:pxToDp(40),marginRight:pxToDp(30)}}
          >
            <SvgUri svgXmlData={picture} width="35" height="35"/>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={this.toggleEmotion}
          >
            <SvgUri svgXmlData={biaoqing} width="35" height="35"/>
          </TouchableOpacity>
        </View>

        {/* 表情 */}
        {showEmotion ? <Emotion onPress={this.handleEmotionSelect}/> : <></>}
      </View>
    )
  }
}

export default Index;