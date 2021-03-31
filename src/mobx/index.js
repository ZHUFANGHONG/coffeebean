import { observable, action } from "mobx";

class RootStore {
  // observable 表示数据可监控 表示是全局数据
  // @observable mobile = "15915912398";
  // @observable token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMxOCwibmFtZSI6IjE1OTE1OTEyMzk4IiwiaWF0IjoxNjE0ODY1MjQ5LCJleHAiOjE2NDA3ODUyNDl9.A0wmuDe21ul0j9iY4C26DIxWGX4IZW25VJJzdwcRXAU";
  // @observable userId = "159159123981614865244848";

  @observable mobile = "";
  @observable token = "";
  @observable userId = "";
  // action行为 表示 changeName是个可以修改全局共享数据的方法
  @action setUserInfo(mobile, token, userId) {
    this.mobile = mobile;
    this.token = token;
    this.userId = userId;
  }
  @action clearUserInfo() {
    this.mobile = "";
    this.token = "";
    this.userId = "";
  }
}

export default new RootStore();