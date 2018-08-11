import React, { Component } from 'react'
import { FlatList } from 'react-native'
import TokenItem from '../elements/TokenItem'

export default class TokenItemExam extends Component {
  render() {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={dumpData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => {
          return (
            <TokenItem
              style={{ paddingTop: index === 0 ? 33 : 20 }}
              styleUp={{ justifyContent: item.numberEther ? 'center' : 'flex-start', marginHorizontal: 20 }}
              title={item.title}
              subtitle={item.subtitle}
              numberEther={item.numberEther}
              dollaEther={item.dollaEther}
              percent={item.percent}
              iconEther={item.iconEther}
            />)
        }}
      />
    )
  }
}

const dumpData = [
  {
    title: 'ETH',
    subtitle: 'Ethereum',
    numberEther: '0.1124222',
    dollaEther: '1214',
    percent: 0.8,
    iconEther: 'https://peername.com/theme/img/nxt.png'
  },
  {
    title: 'TRX',
    subtitle: 'Tronix',
    numberEther: '2.2124',
    dollaEther: '14',
    percent: 0.3,
    iconEther: 'https://peername.com/theme/img/namecoin.png'
  },
  {
    title: 'ZRX',
    subtitle: 'ZRX Token',
    numberEther: '5.2124',
    dollaEther: '1214',
    percent: 0.5,
    iconEther: 'https://peername.com/theme/img/emercoin.png'
  },
  {
    title: 'EOS',
    subtitle: 'EOS Token',
    numberEther: '124',
    dollaEther: '1214',
    percent: 0.4,
    iconEther: 'https://peername.com/theme/img/ethereum.png'
  },
  {
    title: 'ZRX',
    subtitle: 'ZRX Token',
    iconEther: 'https://peername.com/theme/img/emercoin.png'
  },
  {
    title: 'EOS',
    subtitle: 'EOS Token',
    iconEther: 'https://peername.com/theme/img/ethereum.png'
  }
]
