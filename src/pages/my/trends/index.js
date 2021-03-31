import React, { Component } from 'react';
import { View, Text, FlatList,Image,TouchableOpacity,Modal } from 'react-native';
import request from "../../../utils/request";
import { BASE_URI,QZ_DT_DZ,QZ_DT_BGXQ,MY_TRENDS } from "../../../utils/pathMap";
import IconFont from "../../../components/IconFont";
import { pxToDp } from "../../../utils/stylesKits";
import SvgUri from "react-native-svg-uri";
import { wind,xinxi } from "../../../res/fonts/iconSvg";
// import date from "../../../../utils/date";
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import Toast from "../../../utils/Toast";
import ImageViewer from 'react-native-image-zoom-viewer';
import { NavigationContext } from "@react-navigation/native";
import Validator from "../../../utils/validator";
import { EMOTIONS_DATA } from "../../../components/Emotion/datasource";
import THNav from "../../../components/THNav";

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
    const res = await request.privateGet(MY_TRENDS, this.params);
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


  handleshowAlbum=(index,ii)=>{
    const imgUrls = this.state.list[index].images.map(v=>({url:BASE_URI+v.thum_img_path}));
    this.setState({ imgUrls,currentIndex:ii,showAlbum: true });
  }

  goComment=(item)=>{
    this.context.navigate("Comment",item);
  }

  render(){
    const {list,imgUrls,currentIndex,showAlbum} = this.state;
    const user = this.props.UserStore.user; 
    return(
      <>
      <THNav title="MY MOOMENT"/>
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
          source={{uri:BASE_URI+user.header}} /></View>

          <View style={{flex:2,justifyContent:"space-around"}}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <Text style={{color:"#555"}}>{user.nick_name}</Text>
                  <IconFont style={{ marginLeft:pxToDp(5), marginRight:pxToDp(5) ,fontSize: pxToDp(18), color: user.gender === "女" ? "pink" : "skyblue" }}
                  name="icongerenxinxi_zhixiguanxi" />
              <Text style={{color:"#555"}}>{user.age}</Text>
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{user.marry}</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}> |</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{user.xueli}</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>|</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{user.agediff<10 ? "age-match" : "no-match"}</Text>
            </View>
          </View>

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
          <TouchableOpacity>
           
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
      </>
    )
  }
}

export default Index;