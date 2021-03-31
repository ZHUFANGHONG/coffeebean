import React, { Component } from 'react';
import { View, Text,ImageBackground,Image,TouchableOpacity } from 'react-native';
import request from "../../../../utils/request";
import { BASE_URI, FRIENDS_QUESTIONSECTION,FRIENDS_QUESTIONANS } from "../../../../utils/pathMap";
import THNav from "../../../../components/THNav";
import { pxToDp } from '../../../../utils/stylesKits';
import { inject,observer } from "mobx-react";
import  LinearGradient  from "react-native-linear-gradient";
@inject("UserStore")
@observer
class Index extends Component{
  titles={
    "初级":require("../../../../res/leve1.png"),
    "中级":require("../../../../res/leve2.png"),
    "高级":require("../../../../res/leve3.png")
  }
  ansList=[];
  state={
    questionList:[],
    currentIndex:0
  }

  componentDidMount(){
    this.getList();
  }

  getList=async()=>{
    const url=FRIENDS_QUESTIONSECTION.replace(":id",this.props.route.params.qid);
    const res = await request.privateGet(url);
    this.setState({ questionList: res.data });
  }

  getFont=(number)=>{
    let numCn="";
    switch (number) {
      case 1:
        numCn="One"
        break;
      case 2:
        numCn="Two"
        break;
      case 3:
        numCn="Three"
        break;
      case 4:
        numCn="Four"
        break;
      default:
        numCn=number;
        break;
    }
    return numCn;
  }

  chooseAns=async(ans)=>{
    const {currentIndex,questionList} = this.state;
    this.ansList.push(ans);
    if(currentIndex>=questionList.length-1){
      const url=FRIENDS_QUESTIONANS.replace(":id",this.props.route.params.qid);
      const answers = this.ansList.join(",");
      const res = await request.privatePost(url,{answers});
      this.props.navigation.navigate("TestResult",res.data);
    }else{
      this.setState({ currentIndex: currentIndex+1 });
    }
  }
  render(){
    const {currentIndex,questionList} = this.state;
    const question = this.props.route.params;
    const user = this.props.UserStore.user;
    if(!questionList[currentIndex]) return <></>;
    return(
      <View style={{flex:1,backgroundColor:"#fff",position:"relative"}}>
        <THNav title={question.title}/>
        <ImageBackground
        source={require("../../../../res/qabg.png")}
        style={{width:"100%",height:"100%"}}
        >
          {/* 两次图标 */}
          <View style={{marginTop:pxToDp(60),flexDirection:"row",justifyContent:"space-between"}}>
            <ImageBackground
            style={{width:pxToDp(66),height:pxToDp(52),justifyContent:"center",alignItems:"flex-end"}}
            source={require("../../../../res/qatext.png")}>

              <Image source={{uri:BASE_URI+user.header}}
              style={{width:pxToDp(50),height:pxToDp(50),borderRadius:pxToDp(25)}}
              />
            </ImageBackground>
            <ImageBackground
            style={{width:pxToDp(66),height:pxToDp(52),justifyContent:"center",alignItems:"flex-end"}}
            source={this.titles[question.type]}>
            </ImageBackground>
          </View>

          {/* 测试题 */}
          <View style={{position:"absolute",width:"80%",top:pxToDp(60),
          alignSelf:"center",alignItems:"center"}}>
            <View>
              <Text style={{color:"#fff",fontSize:pxToDp(26),fontWeight:"bold"}}>{this.getFont(currentIndex+1)}</Text>
              <Text style={{color:"#ffffff9a",textAlign:"center"}}>({currentIndex+1}/{questionList.length})</Text>
            </View>
            <Text style={{
              marginTop:pxToDp(30),fontSize:pxToDp(20),color:"#fff",fontWeight:"bold",textAlign:"center"
            }}>{questionList[currentIndex].question_title}</Text>
            {/* 答案 */}
            <View style={{width:"100%"}}>
              {questionList[currentIndex].answers.map((v,i)=><TouchableOpacity 
              onPress={this.chooseAns.bind(this,v.ans_No)}
              key={i}
              style={{marginTop:pxToDp(10)}}>
                <LinearGradient
                style={{height:pxToDp(40),borderRadius:pxToDp(6),alignItems:"center",justifyContent:"center"}}
                colors={["#6f45f3","#6f45f31a"]}
                start={{x:0,y:0}}
                end={{x:1,y:0}}
                >
                  <Text style={{color:"#fff",fontSize:pxToDp(18)}}>{v.ans_title}</Text>
                </LinearGradient>
              </TouchableOpacity>)}
              
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

export default Index;
