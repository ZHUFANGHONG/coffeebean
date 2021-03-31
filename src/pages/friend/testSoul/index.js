import React, { Component } from 'react';
import { View, Text,ImageBackground,Image,StyleSheet } from 'react-native';
import THNav from "../../../components/THNav";
import request from "../../../utils/request";
import { FRIENDS_QUESTIONS,BASE_URI } from "../../../utils/pathMap";
import Swiper from "react-native-deck-swiper";
import THButton from "../../../components/THButton";
import { pxToDp } from '../../../utils/stylesKits';
class Index extends Component{
  state={
    questions:[],
    currentIndex:0
  }
  componentDidMount(){
    this.getList();
  }

  getList=async()=>{
    const res = await request.privateGet(FRIENDS_QUESTIONS);
    this.setState({ questions: res.data });
  }
  //跳转到测试页面
  goAskPage=()=>{
    const {questions,currentIndex}=this.state;
    this.props.navigation.navigate("TestQA",questions[currentIndex]);
  }
  render(){
    const {questions,currentIndex} = this.state
    return(
      <View style={{flex:1,backgroundColor:"#fff"}}>
        <THNav title="TestSoul"/>
        <ImageBackground
        source={require("../../../res/testsoul_bg.png")}
        style={{width:"100%",height:"60%"}}
        imageStyle={{height:"100%"}}
        >
          {questions.length?<Swiper
            cards={questions}
            renderCard={(card) => {
                return (
                    <View style={styles.card}>
                        <Image style={{width:"100%",height:"100%"}} source={{uri:BASE_URI+card.imgpath}}/>
                    </View>
                )
            }}
            onSwiped={(cardIndex) => this.setState({ currentIndex: currentIndex+1 })}
            onSwipedAll={() => {console.log('onSwipedAll')}}
            cardIndex={0}
            cardVerticalMargin={0}
            backgroundColor={'transparent'}
            stackSize= {1}>
          </Swiper>:<></>}

        </ImageBackground>

        <THButton 
        onPress={this.goAskPage}
        style={{position:"absolute",
        width:"80%",height:pxToDp(40),bottom:pxToDp(20),alignSelf:"center"}}>BEGIN</THButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    height:"80%",
    borderRadius: 4,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  }
});

export default Index;