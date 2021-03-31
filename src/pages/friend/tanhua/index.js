import React, { Component } from 'react';
import { View, Text, ImageBackground,StyleSheet,Image,TouchableOpacity} from 'react-native';
import THNav from "../../../components/THNav";
import Swiper from "react-native-deck-swiper";
import request from "../../../utils/request";
import { BASE_URI, FRIENDS_CARDS,FRIENDS_LIKE } from "../../../utils/pathMap";
import IconFont from "../../../components/IconFont";
import { pxToDp } from "../../../utils/stylesKits";
import { Toast } from "teaset";
class Index extends Component{
  params={
    page:1,
    pagesize:5
  }
  totalPages=5;
  state={
    currentIndex:0,
    cards:[]
  }

  constructor(){
    super();
    this.swiperRef=React.createRef();
  }
  componentDidMount(){
    this.getFriendsCards();
  }
  //获取渲染数据
  getFriendsCards=async()=>{
    const res = await request.privateGet(FRIENDS_CARDS,this.params);
    console.log(res);
    this.totalPages=res.pages;
   this.setState({ cards: [...this.state.cards,...res.data]  });
  }

  //设置用户的喜好
  setLike=async(type)=>{

    this.sendLike(type);
    if(type==="dislike"){
      this.swiperRef.swipeLeft();
    }else{
      this.swiperRef.swipeRight();
    }
  }

  //发送喜欢或者不喜欢
  sendLike=async(type)=>{
    const id = this.state.cards[this.state.currentIndex].id;
    const url = FRIENDS_LIKE.replace(":id",id).replace(":type",type);
    const res = await request.privateGet(url);
    Toast.message(res.data,1000,"center");
  }

  //图片划定完毕就会触发
  onSwipedAll=()=>{
    if(this.params.page >= this.totalPages){
      Toast.message("There's no more data",1000,"center")
      return;
    }else{
      this.params.page++;
      this.getFriendsCards();
    }
  }
  render(){
    const {cards,currentIndex} = this.state;
    // if(!cards[currentIndex]){
    //   return <></>
    // }
    return(
      <View style={{flex:1,backgroundColor:"#fff"}}>
        <THNav title="TanHua" />
        <ImageBackground
        style={{height:"60%"}}
        imageStyle={{height:"100%"}}
        source={require("../../../res/testsoul_bg.png")}
        >
       
       {cards[currentIndex]?<Swiper
            key={Date.now()}
            ref={ref => this.swiperRef = ref}
            cards={cards}
            renderCard={(card) => {
                return (
                    <View style={styles.card}>
                      <Image source={{uri:BASE_URI+card.header}}
                      style={{width:"100%",height:"80%"}}
                      />
                      {/* 网友信息 */}
                      <View style={{ flex: 1,alignItems:"center", justifyContent: "space-around" }} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ color: "#555" }} >{card.nick_name}</Text>
                          <IconFont style={{ fontSize: pxToDp(18), color: card.gender === "女" ? "pink" : "skyblue" }}
                          name="icongerenxinxi_zhixiguanxi" />
                          <Text style={{ color: "#555" }} >{card.age}岁</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ color: "#555" }} >{card.marry}</Text>
                          <Text style={{ color: "#555" }} >|</Text>
                          <Text style={{ color: "#555" }} >{card.xueli}</Text>
                          <Text style={{ color: "#555" }} >|</Text>
                          <Text style={{ color: "#555" }} >{card.agediff < 10 ? "年龄相仿" : "有点代沟"}</Text>
                        </View>
                      </View>
                    </View>
                )
            }}
            onSwiped={() => {this.setState({ currentIndex: this.state.currentIndex+1 });}}
            onSwipedAll={this.onSwipedAll}
            onSwipedLeft={this.sendLike.bind(this,"dislike")}
            onSwipedRight={this.sendLike.bind(this,"like")}
            cardIndex={currentIndex}
            backgroundColor={'#transparent'}
            cardVerticalMargin={0}
            stackSize={3}>
          </Swiper>:<></>}

        </ImageBackground>
        {/* 两个小图标 */}
        <View 
        style={{flexDirection:"row",
        justifyContent:"space-between",
        width:"60%",
        alignSelf:"center",
        marginTop:pxToDp(40)
      }}
        >
          <TouchableOpacity
          onPress={this.setLike.bind(this,"dislike")}
          style={{backgroundColor:"#ebc869",width:pxToDp(60),height:pxToDp(60),
          borderRadius:pxToDp(30),alignItems:"center",justifyContent:"center"}}
          >
            <IconFont style={{fontSize:pxToDp(30),color:"black"}} name="iconaixin7"/>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={this.setLike.bind(this,"like")}
          style={{backgroundColor:"#fd5213",width:pxToDp(60),height:pxToDp(60),
          borderRadius:pxToDp(30),alignItems:"center",justifyContent:"center"}}
          >
            <IconFont style={{fontSize:pxToDp(30),color:"#fff"}} name="iconaixin7"/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
  card: {
    height:"60%",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  }
});

export default Index;