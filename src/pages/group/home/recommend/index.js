import React, { Component } from 'react';
import { View, Text, FlatList,Image,TouchableOpacity,Modal } from 'react-native';
import request from "../../../../utils/request";
import { QZ_TJDT,BASE_URI,QZ_DT_DZ,QZ_DT_XH,QZ_DT_BGXQ } from "../../../../utils/pathMap";
import IconFont from "../../../../components/IconFont";
import { pxToDp } from "../../../../utils/stylesKits";
import SvgUri from "react-native-svg-uri";
import { More,wind,xinxi,aixin3 } from "../../../../res/fonts/iconSvg";
import JMessage from "../../../../utils/JMessage";
// import date from "../../../../utils/date";
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import Toast from "../../../../utils/Toast";
import { ActionSheet } from "teaset";
import ImageViewer from 'react-native-image-zoom-viewer';
import { NavigationContext } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Validator from "../../../../utils/validator";
import { EMOTIONS_DATA } from "../../../../components/Emotion/datasource";
@inject("UserStore")
@observer
class Index extends Component{
  static contextType=NavigationContext;
  params={
    page:1,
    pagesize:10
  }
  totalPages=2;
  isLoading = false;
  state={
    list:[],
    showAlbum:false,
    imgUrls:[],
    currentIndex:0
  }
  componentDidMount() {
    this.getList();
  }

  renderRichText=(text)=>{
    const list = Validator.renderRichText(text);
    return list.map((v,i)=>{
      if(v.text){
        return <Text style={{color:"#666"}} key={i}>{v.text}</Text>
      }else if(v.image){
        return <Image style={{width:pxToDp(25),height:pxToDp(25)}} key={i} source={EMOTIONS_DATA[v.image]}/>
      }else{
        return <></>;
      }
    })
  }

  getList=async(isNew=false)=>{
    const res = await request.privateGet(QZ_TJDT, this.params);
    // console.log(res);
    if(isNew){
      this.setState({ list: res.data });
    }else{
        this.setState({ list: [...this.state.list, ...res.data] });
    }
   
    this.totalPages = res.pages;
    this.isLoading=false;
  }

  onEndReached=()=>{
    if((this.params.page>=this.totalPages)||this.isLoading){
      return;
    }else{
      this.isLoading=true;
      this.params.page++;
      this.getList();
    }
    // console.log("onEndReached");
  }

  handleStar=async(item)=>{
    const url = QZ_DT_DZ.replace(":id",item.tid);
    const res = await request.privateGet(url);
    // console.log(res);
    if(res.data.iscancelstar){
      Toast.smile("Cancel successfully");
    }else{
      Toast.smile("Like successfully");
      // const text=`${this.props.UserStore.user.nick_name}  like you Moment`;
      // const extras={user:JSON.stringify(this.props.UserStore.user)};
      // JMessage.sendTextMessage(item.guid,text,extras);
    }
    this.params.page=1;
    this.getList(true);
  }

  handleLike=async(item)=>{
    const url = QZ_DT_XH.replace(":id",item.tid);
    const res = await request.privateGet(url);
    if(res.data.iscancelstar){
      Toast.smile("Cancel successfully");
    }else{
      Toast.smile("Like successfully");
    }
    this.params.page=1;
    this.getList(true);
  }

  handleMore=async(item)=>{
    const opts=[
      {title:"Tip-off",onPress:()=>alert("Tip-off")},
      {title:"Uninterested",onPress:()=>this.noInterest(item)}
    ]
    ActionSheet.show(opts,{title:"Cancel"});
  }

  noInterest=async(item)=>{
    const url = QZ_DT_BGXQ.replace(":id",item.tid);
    const res = await request.privateGet(url);
    Toast.smile("Operation successfully");
    this.params.page=1;
    this.getList(true);
  }

  handleshowAlbum=(index,ii)=>{
    const imgUrls = this.state.list[index].images.map(v=>({url:BASE_URI+v.thum_img_path}));
    this.setState({ imgUrls,currentIndex:ii,showAlbum: true });
  }

  goComment=(item)=>{
    this.context.navigate("Comment",item);
  }

  render(){
    const {list,imgUrls,currentIndex,showAlbum} = this.state;
    return(
      <>
      <FlatList
      onEndReached={this.onEndReached}
      onEndReachedThreshold={0.1}
      data={list}
      keyExtractor={v=>v.tid+""}
      renderItem={({item,index}) => <><View
      key={index}
      style={{ padding:pxToDp(10),borderBottomColor:"#ccc",borderBottomWidth:pxToDp(1)}}
      >
        {/* 用户信息 */}
        <View style={{flexDirection:"row",alignItems:"center"}}>
          <View
          style={{paddingRight:pxToDp(10)}}
          ><Image 
          style={{width:pxToDp(40),height:pxToDp(40),borderRadius:pxToDp(20)}}
          source={{uri:BASE_URI+item.header}} /></View>

          <View style={{flex:2,justifyContent:"space-around"}}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <Text style={{color:"#555"}}>{item.nick_name}</Text>
                  <IconFont style={{ marginLeft:pxToDp(5), marginRight:pxToDp(5) ,fontSize: pxToDp(18), color: item.gender === "女" ? "pink" : "skyblue" }}
                  name="icongerenxinxi_zhixiguanxi" />
              <Text style={{color:"#555"}}>{item.age}</Text>
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{item.marry}</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}> |</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{item.xueli}</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>|</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{item.agediff<10 ? "age-match" : "no-match"}</Text>
            </View>
          </View>

          <TouchableOpacity
          onPress={this.handleMore.bind(this,item)}
          >
            {/* <IconFont name=""/> */}
            <SvgUri svgXmlData={More} width="30" height="30"/>
          </TouchableOpacity>
        </View>

        {/* 动态内容 */}
        <View style={{marginTop:pxToDp(8),flexDirection:"row",flexWrap:"wrap",alignItems:"center"}}>
          {this.renderRichText(item.content)}
        </View>

        {/* 相册 */}
        <View style={{flexWrap:"wrap",flexDirection:"row",paddingTop:pxToDp(5),paddingBottom:pxToDp(5)}}>
          {item.images.map((vv,ii) => <TouchableOpacity
          onPress={()=>this.handleshowAlbum(index, ii)}
          key={ii}><Image 
          style={{width:pxToDp(70),height:pxToDp(70),marginRight:pxToDp(5)}}
          source={{uri:BASE_URI+vv.thum_img_path}}/>
          </TouchableOpacity>
          )}
        </View>

        {/* 距离时间 */}
        <View style={{paddingTop:pxToDp(5),paddingBottom:pxToDp(5)}}>
          <View><Text style={{color:"#666"}}>Distance: {item.dist} m</Text></View>
          <View><Text style={{color:"#666"}}>{moment(item.create_time).fromNow()}</Text></View>
        </View>
        {/* 三个小图标结构 */}
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}}
          onPress={this.handleStar.bind(this,item)}
          >
            {/* <IconFont style={{color:"#666"}} name="icon024wind"/> */}
            <SvgUri svgXmlData={wind} width="25" height="25"/><Text style={{color:"#666", marginLeft:pxToDp(8)}}>{item.star_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}}
          onPress={this.goComment.bind(this,item)}
          >
            {/* <IconFont style={{color:"#666"}} name="iconxinxi"/> */}
            <SvgUri svgXmlData={xinxi} width="25" height="25"/><Text style={{color:"#666", marginLeft:pxToDp(8)}}>{item.comment_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}}
          onPress={this.handleLike.bind(this,item)}
          >
            {/* <IconFont style={{color:"#666",fontSize:pxToDp(23)}} name="iconaixin3"/> */}
            <SvgUri svgXmlData={aixin3} width="25" height="25"/><Text style={{color:"#666", marginLeft:pxToDp(8)}}>{item.like_count}</Text>
          </TouchableOpacity>
        </View>

      </View>
      {(this.params.page>=this.totalPages)&&(index===list.length-1) ? <View 
      style={{height:pxToDp(30),alignItems:"center",
      justifyContent:"center"}}
      ><Text style={{color:"#666"}}>No More Data</Text></View> : <></>}
      </>}
      />
        <Modal visible={showAlbum} transparent={true}>
                <ImageViewer 
                onClick={()=>this.setState({ showAlbum: false })}
                imageUrls={imgUrls} index={currentIndex}/>
        </Modal>
        <TouchableOpacity
        style={{position:"absolute",right:"10%",bottom:"10%"}}
        onPress={()=>this.context.navigate("Publish")}
        >
          <LinearGradient
          colors={["#da6c8b","#9b65cc"]}
          start={{x:0,y:0}}
          end={{x:1,y:1}}
          style={{
            width:pxToDp(80),height:pxToDp(80),borderRadius:pxToDp(40),
            alignItems:"center",justifyContent:"center"
          }}
          ><Text style={{color:"#fff",fontSize:pxToDp(22)}}>POST</Text></LinearGradient>
        </TouchableOpacity>
      </>
    )
  }
}

export default Index;