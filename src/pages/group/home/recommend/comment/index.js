import React, { Component } from 'react';
import { View, TextInput, Text,Image,TouchableOpacity,Modal,ScrollView } from 'react-native';
import THNav from "../../../../../components/THNav";
import IconFont from "../../../../../components/IconFont";
import { BASE_URI,QZ_DT_PL,QZ_DT_PL_DZ,QZ_DT_PL_TJ } from "../../../../../utils/pathMap";
import { pxToDp } from "../../../../../utils/stylesKits";
import moment from 'moment';
import THButton from "../../../../../components/THButton";
import request from "../../../../../utils/request";
import SvgUri from "react-native-svg-uri";
import { wind } from "../../../../../res/fonts/iconSvg";
import Toast from "../../../../../utils/Toast";
class Index extends Component{
  params={
    page:1,
    pagesize:5
  }
  totalPages=2;
  isLoading=false;
  state={
    list:[],
    counts:0,
    showInput:true,
    text:""
  }

  componentDidMount(){
    this.getList();
  }

  getList=async(isNew=false)=>{
    const url = QZ_DT_PL.replace(":id",this.props.route.params.tid);
    const res = await request.privateGet(url,this.params);
    this.totalPages = res.pages;
    this.isLoading = false;
    // console.log(res);
    if(isNew){
      this.setState({ list: res.data, counts:res.counts });
    }else{
      this.setState({ list: [...this.state.list,...res.data], counts:res.counts });
    }
    
  }

  handleSetStar=async(id)=>{
    const url = QZ_DT_PL_DZ.replace(":id",id);
    const res = await request.privateGet(url);
    console.log(res);
    Toast.smile("Like successfully")
    this.params.page=1;
    this.getList(true);
  }

  handleEditingEnd=()=>{
    this.setState({ showInput: false, text:"" });
  }

  handleSubmit=async()=>{
    const {text} = this.state;
    if(!text.trim()){
      Toast.smile("Comment cannot be empty ");
      return;
    }
    const url = QZ_DT_PL_TJ.replace(":id",this.props.route.params.tid);
    const res = await request.privatePost(url,{comment:text});
    this.handleEditingEnd();

    this.params.page = 1;
    this.getList(true);
    Toast.smile("Send Comment Successfully!")
  }

  onScroll=({nativeEvent})=>{
    const isReachBottom = nativeEvent.contentSize.height-nativeEvent.layoutMeasurement.height-nativeEvent.contentOffset.y <10;
    const hasMore = this.params.page<this.totalPages;
    if(isReachBottom && hasMore && !this.isLoading){
      this.isLoading = true;
      this.params.page++;
      this.getList();
    }
  }

  render(){
    
    const item = this.props.route.params;
    const {list,counts,showInput,text} = this.state;
    return(
      <ScrollView 
      onScroll={this.onScroll}
      style={{flex:1,backgroundColor:"#fff"}}>
        <THNav title="Latest News"/>
        <View style={{padding:pxToDp(10)}}> 
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
        </View>

        {/* 动态内容 */}
        <View style={{marginTop:pxToDp(8)}}>
          <Text style={{color:"#666"}}>{item.content}</Text>
        </View>

        {/* 相册 */}
        <View style={{flexWrap:"wrap",flexDirection:"row",paddingTop:pxToDp(5),paddingBottom:pxToDp(5)}}>
          {item.images.map((vv,ii) => <TouchableOpacity
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

        {/* 最新评论 */}
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <View style={{flexDirection:"row"}}>
            <Text style={{color:"#666"}}>Lastest Comments</Text>
            <View style={{backgroundColor:"red",height:pxToDp(20),width:pxToDp(20),
            borderRadius:pxToDp(10),marginLeft:pxToDp(5),alignItems:"center",justifyContent:"center"
            }}><Text style={{color:"#fff"}}>{counts}</Text></View>
          </View>
          <View>
            <THButton
            onPress={()=>this.setState({ showInput: true })}
            textStyle={{fontSize:pxToDp(10)}}
            style={{width:pxToDp(80),height:pxToDp(20),borderRadius:pxToDp(10)}}
            >Comment</THButton>
          </View>
        </View>
        {/* 评论列表 */}
        <View>
          {list.map((v,i)=><View
          key={i}
          style={{flexDirection:"row",paddingTop:pxToDp(5),paddingBottom:pxToDp(5),
          borderBottomColor:"#ccc",borderBottomWidth:pxToDp(1),alignItems:"center"
          }}
          >
            <View style={{paddingRight:pxToDp(10)}}>
              <Image style={{width:pxToDp(40),height:pxToDp(40),borderRadius:pxToDp(20)}} source={{uri:BASE_URI+v.header}}/>
            </View>
            <View>
              <Text style={{color:"#666"}}>{v.nick_name}</Text>
              <Text style={{color:"#666",fontSize:pxToDp(13),marginTop:pxToDp(5),marginBottom:pxToDp(5)}}>{moment(v.create_time).format("YYYY-MM-DD HH:mm:ss")}</Text>
              <Text style={{color:"#666"}}>{v.content}</Text>
            </View>
            <TouchableOpacity style={{flexDirection:"row",flex:1,justifyContent:"flex-end",alignItems:"center"}}
              onPress={this.handleSetStar.bind(this,v.cid)}
            >
                {/* <IconFont style={{color:"#666"}} name="icon024wind"/> */}
              <SvgUri svgXmlData={wind} width="25" height="25"/><Text style={{color:"#666", marginLeft:pxToDp(8)}}>{v.star}</Text>
            </TouchableOpacity>
          </View>)}
        </View>

        <Modal
        visible={showInput}
        transparent={true}
        animationType="slide"
        onRequestClose={this.handleEditingEnd}
        >
          <TouchableOpacity 
          onPress={this.handleEditingEnd}
          style={{flex:1,backgroundColor:"rgba(0,0,0,0.5)",position:"relative"}}>
            <View style={{
              backgroundColor:"#eee",flexDirection:"row",
              position:"absolute",width:"100%",left:0,bottom:0,
              padding:pxToDp(5),alignItems:"center"
              }}>
              <TextInput 
              autoFocus
              value={text}
              onChangeText={t => this.setState({ text: t })}
              onSubmitEditing={this.handleSubmit}
              placeholder="Send your comment"
              style={{backgroundColor:"#fff",flex:5,borderRadius:pxToDp(18),height:pxToDp(45)}}/>
              <Text 
              onPress={this.handleSubmit}
              style={{flex:1,textAlign:"center",color:"#666"}}>Send</Text>
            </View>
          </TouchableOpacity>
        </Modal>
        </View>
        {this.params.page>=this.totalPages ? <View style={{height:pxToDp(40),alignItems:"center",justifyContent:"center",backgroundColor:"#ccc"}}><Text style={{color:"#666"}}>No More Data</Text></View> : <></>}
      </ScrollView>
    )
  }
}

export default Index;