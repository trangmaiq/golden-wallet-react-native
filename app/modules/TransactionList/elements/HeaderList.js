import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
// import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import Helper from '../../../commons/Helper'
import ButtonSendReceive from '../../../components/elements/ButtonSendReceive'

const { width } = Dimensions.get('window')

export default class HeaderList extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    openSend: PropTypes.func,
    openReceive: PropTypes.func,
  }

  static defaultProps = {
    data: {},
    openSend: () => { },
    openReceive: () => { }
  }

  render() {
    const { balance, symbol, balanceInDollar } = this.props.data
    const { openSend, openReceive } = this.props

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.totalField,
            {
              marginTop: 15,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20
            }
          ]}
        >
          <Text style={styles.availableText}>Available Balance</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text style={styles.totalETH}>
              {`${Helper.formatETH(balance)} ${symbol}`}
            </Text>
            <Text style={[styles.totalUSD, { marginLeft: 10 }]}>
              {`$${Helper.formatUSD(balanceInDollar)}`}
            </Text>
          </View>
        </View>
        <ButtonSendReceive
          enable={true}
          style={{ marginTop: 10 }}
          openSend={openSend}
          openReceive={openReceive}
        />
        <Text style={styles.transactions}>Transactions</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  transactions: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: AppStyle.mainTextColor,
    width,
    paddingHorizontal: 20,
    marginTop: 20
  },
  totalField: {
    width: width - 40,
    borderRadius: 14
  },
  availableText: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 20,
    color: AppStyle.secondaryTextColor
  },
  totalETH: {
    fontSize: 30,
    fontFamily: 'OpenSans-Bold',
    color: AppStyle.mainColor
  },
  totalUSD: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: AppStyle.secondaryTextColor
  }
})