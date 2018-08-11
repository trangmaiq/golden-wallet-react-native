import React, { Component } from 'react'
import { } from 'react-native'
import PropTypes from 'prop-types'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import AppStyle from '../../commons/AppStyle'
import TabComponent from '../elements/TabComponent'
import TabScreen from '../elements/TabScreen'

export default class FirstScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  static defaultProps = {
  }
  componentDidMount() {
  }
  render() {
    const { navigation } = this.props

    return (
      <ScrollableTabView
        style={{ marginTop: 20 }}
        initialPage={0}
        tabBarUnderlineStyle={{ backgroundColor: AppStyle.mainColor }}
        renderTabBar={() =>
          <DefaultTabBar tabStyle={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10 }} />
        }
      >
        <TabComponent tabLabel="Component" navigation={navigation} />
        <TabScreen tabLabel="Screen" navigation={navigation} />

      </ScrollableTabView>
    )
  }
}
