import React from 'react';
import {
  Text,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustormerBar from "./component/CustormerBar";
import Recommend from "./recommend";
import Latest from "./latest";

export default () => {
  return <ScrollableTabView
    initialPage={0}
    renderTabBar={() => <CustormerBar />}
  >
    <Recommend tabLabel='Recommendation'/>
    <Latest tabLabel='Lastest News'/>
  </ScrollableTabView>;
}