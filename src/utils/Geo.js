import { PermissionsAndroid, Platform } from "react-native"; 
import { init, Geolocation } from "react-native-amap-geolocation"; 
import axios from "axios"; 
import Toast from "./Toast";
class Geo { 
  async initGeo() {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    }
    await init({
      ios: "487110931e2c16b2072ce1a073080db9",
      android: "487110931e2c16b2072ce1a073080db9"
    });
    return Promise.resolve();
    } 
  async getCurrentPosition() {

    return new Promise((resolve, reject) => {
      console.log("开始定位");
      Geolocation.getCurrentPosition(({ coords }) => {
        resolve(coords);
      }, reject);
    })
  } 
  async getCityByLocation() {
    Toast.showLoading("Tring to locate...")
    const { longitude, latitude } = await this.getCurrentPosition();
    const res = await axios.get("https://restapi.amap.com/v3/geocode/regeo", {
      params: { location: `${longitude},${latitude}`, key: "7981b1b53f8e27785dbcdb2d745ba944" }
    });
    Toast.hideLoading();
    return Promise.resolve(res.data);
    } }
  

    export default new Geo();