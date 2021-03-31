import React, { Component } from 'react';
import { View, Text,Image,TouchableOpacity,Modal } from 'react-native';
import request from "../../../utils/request";
import { FRIENDS_PERSONALINFO,BASE_URI } from "../../../utils/pathMap";
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import { Carousel } from "teaset";
import { pxToDp } from "../../../utils/stylesKits";
import IconFont from "../../../components/IconFont";
import LinearGradient from "react-native-linear-gradient";
import ImageViewer from 'react-native-image-zoom-viewer';
import JMessage from '../../../utils/JMessage';
import { inject,observer } from 'mobx-react';
import Toast from '../../../utils/Toast';

@inject("UserStore")
@observer
 
// Inside of a component's render() method:

class Index extends Component{
  state={
    userDetail:{},
    trends:[],
    showAlbum:false,
    currentIndex:0,
    imgUrls:[]
  }
  params={
    page:1,
    pagesize:10
  }
  totalPages = 1;
  isLoading = false;
  iconColor = false;
  componentDidMount(){
    this.getDetail();
  }

  getDetail=async()=>{
    const url = FRIENDS_PERSONALINFO.replace(":id",this.props.route.params.id);
    const res = await request.privateGet(url,this.params);
    // console.log(JSON.stringify(res));
    this.totalPages = res.pages;
    this.isLoading = false;
    this.setState({ userDetail: res.data,trends:[...this.state.trends,...res.data.trends] });
  }

  handleshowAlbum=(i,ii)=>{
    const imgUrls = this.state.userDetail.trends[i].album.map(v=>({url:BASE_URI+v.thum_img_path}));
    const currentIndex = ii;
    const showAlbum=true;
    this.setState({imgUrls,currentIndex,showAlbum});

  }

  onScroll=({nativeEvent})=>{
    const isReachBottom = nativeEvent.contentSize.height-nativeEvent.layoutMeasurement.height-nativeEvent.contentOffset.y <10;
    const hasMore = this.params.page<this.totalPages;
    if(isReachBottom && hasMore && !this.isLoading){
      this.isLoading = true;
      this.params.page++;
      this.getDetail();
    }
  }

  sendLike=async()=>{
    // const guid = this.state.userDetail.guid;
    // const username = this.state.userDetail.guid;
    // const text = this.props.UserStore.user.nick_name + " like you";
    // const extras = {user:JSON.stringify(this.state.userDetail)};
    // const res = await JMessage.sendTextMessage(username,text,extras);
    // console.log(res);
    this.iconColor = true;
    Toast.smile("Send your love successfully",1000,"center");
  }

  goChat=()=>{
    const {userDetail} = this.state;
    this.props.navigation.navigate("Chat",userDetail);
  }

  render(){
    // console.log(this.props.route.params);
    const {userDetail,imgUrls,currentIndex,showAlbum,trends} = this.state;
    if(!userDetail.silder) return <></>
    return(
    <HeaderImageScrollView
      onScroll={this.onScroll}
      maxHeight={pxToDp(220)}
      minHeight={pxToDp(40)}
      renderForeground={() => (
        <Carousel control style={{height:pxToDp(220)}}>
          {userDetail.silder.map((v,i) => <Image key={i}
            source={{ uri:BASE_URI + v.thum_img_path }}
            style={{width:"100%",height:pxToDp(220)}}
          />)}
        </Carousel>
        )}
    >
      <View style={{backgroundColor:"#fff"}}>
        {/* 用户个人信息 */}
      <View style={{flexDirection:"row",padding:pxToDp(5),borderBottomWidth:pxToDp(1),borderColor:"#ccc"}}>
          <View style={{flex:2,justifyContent:"space-around"}}>
            <View style={{flexDirection:"row",alignItems:"center",top:"6%"}}>
              <Text style={{color:"#555"}}>{userDetail.nick_name}</Text>
              <IconFont style={{ marginLeft:pxToDp(5), marginRight:pxToDp(5) ,fontSize: pxToDp(18), color: userDetail.gender === "女" ? "pink" : "skyblue" }}
                  name="icongerenxinxi_zhixiguanxi" />
              <Text style={{color:"#555"}}>{userDetail.age}</Text>
            </View>
            <View style={{flex:1,flexDirection:"row",top:"12%"}}>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{userDetail.marry}</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}> |</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{userDetail.xueli}</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>|</Text>
              <Text style={{color:"#555",marginRight:pxToDp(5)}}>{userDetail.agediff<10 ? "age-match" : "no-match"}</Text>
            </View>
          </View>
          <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <IconFont name="iconaixin3" style={{fontSize:pxToDp(50),color:"red"}}/>
              <Text style={{position:"absolute",color:"#fff",fontSize:pxToDp(13),fontWeight:"bold"}}>{userDetail.fateValue}</Text>
            </View>
            <Text style={{color:"red",fontSize:pxToDp(13)}}>fateValue</Text>
          </View>
        </View>
      
      {/* 动态 */}
      <View>
        {/* 标题 */}
        <View style={{padding:pxToDp(10),flexDirection:"row",justifyContent:"space-between",borderBottomWidth:pxToDp(1),borderColor:"#ccc"}}>
          <View style={{flexDirection:"row",alignItems:"center"}}>
            <Text style={{color:"#666"}}>Moment</Text>
            <View style={{backgroundColor:"red",width:pxToDp(16),height:pxToDp(16),
            borderRadius:pxToDp(8),alignItems:"center",justifyContent:"center",
            marginLeft:pxToDp(5)}}>
              <Text style={{color:"#fff"}}>{trends.length}</Text>
            </View>
          </View>
        
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity 
            onPress={this.goChat}
            style={{marginRight:pxToDp(8)}}>
              <LinearGradient
              colors={["#f2ab5a","#ec7c50"]}
              start={{x:0,y:0}}
              end={{x:1,y:0}}
              style={{
                width:pxToDp(100),height:pxToDp(30),borderRadius:pxToDp(15),
                flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"
              }}
              >
                <IconFont style={{color:"#fff"}} name="iconxinxi"></IconFont>
                <Text style={{color:"#fff"}}>Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{marginRight:pxToDp(8)}}
              onPress={this.sendLike}
            >
              <LinearGradient
              colors={["#6d47f8","#e56b7f"]}
              start={{x:0,y:0}}
              end={{x:1,y:0}}
              style={{
                width:pxToDp(100),height:pxToDp(30),borderRadius:pxToDp(15),
                flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"
              }}
              >
                <IconFont style={{color:this.iconColor ? "red" : "#fff"}} name="iconaixin4"></IconFont>
                <Text style={{color:"#fff"}}>Like</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
        {/* 列表 */}
        <View>
          {
            trends.map((v,i) => <View
            key={i}
            style={{ padding:pxToDp(10),borderBottomColor:"#ccc",borderBottomWidth:pxToDp(1)}}
            >
              {/* 用户信息 */}
              <View style={{flexDirection:"row"}}>
                <View
                style={{paddingRight:pxToDp(10)}}
                ><Image 
                style={{width:pxToDp(40),height:pxToDp(40),borderRadius:pxToDp(20)}}
                source={{uri:BASE_URI+userDetail.header}} /></View>

                <View style={{flex:2,justifyContent:"space-around"}}>
                  <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{color:"#555"}}>{userDetail.nick_name}</Text>
                        <IconFont style={{ marginLeft:pxToDp(5), marginRight:pxToDp(5) ,fontSize: pxToDp(18), color: userDetail.gender === "女" ? "pink" : "skyblue" }}
                        name="icongerenxinxi_zhixiguanxi" />
                    <Text style={{color:"#555"}}>{userDetail.age}</Text>
                  </View>
                  <View style={{flex:1,flexDirection:"row"}}>
                    <Text style={{color:"#555",marginRight:pxToDp(5)}}>{userDetail.marry}</Text>
                    <Text style={{color:"#555",marginRight:pxToDp(5)}}> |</Text>
                    <Text style={{color:"#555",marginRight:pxToDp(5)}}>{userDetail.xueli}</Text>
                    <Text style={{color:"#555",marginRight:pxToDp(5)}}>|</Text>
                    <Text style={{color:"#555",marginRight:pxToDp(5)}}>{userDetail.agediff<10 ? "age-match" : "no-match"}</Text>
                  </View>
                </View>

              </View>

              {/* 动态内容 */}
              <View style={{marginTop:pxToDp(8)}}>
                <Text style={{color:"#666"}}>{v.content}</Text>
              </View>

              {/* 相册 */}
              <View style={{flexWrap:"wrap",flexDirection:"row",paddingTop:pxToDp(5),paddingBottom:pxToDp(5)}}>
                {v.album.map((vv,ii) => <TouchableOpacity
                onPress={()=>this.handleshowAlbum(i,ii)}
                key={ii}><Image 
                style={{width:pxToDp(70),height:pxToDp(70),marginRight:pxToDp(5)}}
                source={{uri:BASE_URI+vv.thum_img_path}}/>
                </TouchableOpacity>
                )}
              </View>

            </View>)
          }
        </View>
        
        {this.params.page>=this.totalPages ? <View style={{height:pxToDp(80),alignItems:"center",justifyContent:"center"}}><Text style={{color:"#666"}}>No More Data</Text></View> : <></>}
      </View>
        <Modal visible={showAlbum} transparent={true}>
                <ImageViewer 
                onClick={()=>this.setState({ showAlbum: false })}
                imageUrls={imgUrls} index={currentIndex}/>
        </Modal>
      </View>
    </HeaderImageScrollView>
    // <View><Text>用户</Text></View>
    );
  }
}

export default Index;