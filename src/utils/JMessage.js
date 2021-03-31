import JMessage from "jmessage-react-plugin";
import Toast from "./Toast";

export default{
  init(){
    JMessage.init({
      'appkey': 'd418c6d127091b1e460d939a',
      'isOpenMessageRoaming': true,
      'isProduction': false,
      'channel': '' 
    })
  },
  register(username,password){
    return new Promise((resolve,reject)=>{
      JMessage.register({
        username,
        password
      },resolve,reject)
    })
  },
  login(username,password){
    return new Promise((resolve,reject)=>{
      JMessage.register({
        username,
        password
      },resolve,reject)
    })
  },
  // 发送文本
  sendTextMessage(username,text,extras={}){
    return new Promise((resolve,reject)=>{
      JMessage.sendTextMessage({ 
        type: 'single', username,
        text,extras
      },resolve, reject)
    })
    
  },

  getHistoryMessages(username,from,limit){
    return new Promise((resolve,reject)=>{
      JMessage.getHistoryMessages({ 
      type: 'single', 
      username, from, limit
      },resolve, reject)
    })
  },

  sendImageMessage(username,path,extras={}){
    return new Promise((resolve,reject)=>{
      JMessage.sendImageMessage({
      type: 'single', username,
      path, extras
    },resolve,reject)
    })
  },
  
  getConversations(){
    Toast.showLoading("requesting");
    return new Promise((resolve,reject)=>{
      JMessage.getConversations(res=>{
        Toast.hideLoading();
        resolve(res);
      },reject);
    })
  },

  logout:JMessage.logout
  


}

// Attempt to invoke virtual method 'cn.jpush.im.android.api.model.Message cn.jpush.im.android.api.model.Conversation.createSendMessage(cn.jpush.im.android.api.content.MessageContent)'on a null object reference

// 
// "jcore-react-native": "1.8.0",
// "jmessage-react-plugin": "3.1.8"