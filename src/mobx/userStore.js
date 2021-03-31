import { observable, action } from "mobx";

class UserStore {
  @observable user = {};

  // action行为 表示 changeName是个可以修改全局共享数据的方法
  @action setUser(user) {
    this.user = user;
  }

  @action clearUser(){
    this.user={};
  }
}

export default new UserStore();