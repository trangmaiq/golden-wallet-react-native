import React, { Component } from 'react'
import { ScrollView, Dimensions } from 'react-native'
import SmallCardItem from './../elements/SmallCardItem'
import images from './../../commons/images'
import Apstyle from './../../commons/AppStyle'

const { width } = Dimensions.get('window')

export default class SmallCardItemExam extends Component {
  render() {
    return (
      <ScrollView style={{ flex: 1, marginHorizontal: 20 }}>
        <SmallCardItem
          style={{ height: 181 }}
          backgroundStyle={{ height: 181, width: width - 40 }}
          nameEther="Total balance"
          numberEther={132.28312121242}
          dollaEther={302.87}
          name="Jasson Nguyen"
          token="0x929…7aB656276f2718789jkhdksl4jkh2"
          iconStyle={{ width: 50, height: 82, tintColor: Apstyle.alphaColorImage }}
          icon={images.iconEther}
          background={images.backgroundBlue}
        />
        <SmallCardItem
          style={{ height: 181, marginTop: 10 }}
          backgroundStyle={{ height: 181, width: width - 40 }}
          nameEther="Total balance"
          numberEther={132.2831211242}
          dollaEther={302.87}
          name="Jasson Nguyen"
          token="0x92121412a7aB656276f2718789jkhdksl4jkh2"
          iconStyle={{ width: 50, height: 82, tintColor: Apstyle.alphaColorImage }}
          icon={images.iconEther}
          background={images.backgroundOrange}
        />
        <SmallCardItem
          style={{ height: 181, marginTop: 10 }}
          backgroundStyle={{ height: 181, width: width - 40 }}
          nameEther="Total balance"
          numberEther={132.2831441242}
          dollaEther={302.87}
          name="Jasson Nguyen"
          token="0x929as12411241l2k4n1241k2n4lk12nd121241247aB656276f2718789jkhdksl4jkh2"
          iconStyle={{ width: 50, height: 82, tintColor: Apstyle.alphaColorImage }}
          icon={images.iconEther}
          background={images.backgroundBlack}
        />
        {/* wallet Type */}
        <SmallCardItem
          style={{ height: 174, marginTop: 10 }}
          backgroundStyle={{ height: 174, width: width - 40 }}
          title="Mnemonic"
          subTitle="Starfish will randomly pick a list of English words to generate the private key and create your wallet. To back up the wallet, you just need to record these mnemonics."
          iconStyle={{
            width: 70,
            height: 71,
            marginTop: 10,
            tintColor: Apstyle.backgroundWhite
          }}
          icon={images.iconMnemonic}
          background={images.backgroundBlue}
        />
        <SmallCardItem
          style={{ height: 174, marginTop: 10 }}
          backgroundStyle={{ height: 174, width: width - 40 }}
          title="Private Key"
          subTitle="Starfish will generate a new private key to create your wallet. We recomened that you back up the private key and save it in safe place for later recovery of your wallet."
          iconStyle={{ width: 70, height: 80, marginTop: 10 }}
          icon={images.iconPrivateKey}
          background={images.backgroundGrey}
          styleTitle={{ color: Apstyle.cardTitleColor }}
          subStyle={{ color: Apstyle.cartSubtitleColor }}
        />
        <SmallCardItem
          style={{ height: 174, marginTop: 10 }}
          backgroundStyle={{ height: 174, width: width - 40 }}
          title="Address"
          subTitle="Only enter wallet address. You can check the balance and receive tokens, but cannot send token out. Therefore, your assetss will be absolutely safe."
          iconStyle={{ width: 50, height: 86, marginTop: 10 }}
          icon={images.iconAddress}
          background={images.backgroundGrey}
          subStyle={{ maxWidth: width - 170, color: Apstyle.cartSubtitleColor }}
          styleTitle={{ color: Apstyle.cardTitleColor }}
        />
        <SmallCardItem
          style={{ height: 110, marginTop: 10 }}
          backgroundStyle={{ width: width - 40, height: 110 }}
          styleLeft={{ alignSelf: 'center', width: width - 210, alignItems: 'center' }}
          numberEther={132.2244}
          dollaEther={302.87}
          iconStyle={{ width: 30, height: 50, marginTop: 10 }}
          icon={images.iconEther}
          background={images.backgroundBlack}
          styleViewIn={{ paddingLeft: 30 }}
        />
        <SmallCardItem
          style={{ height: 110, marginTop: 10 }}
          backgroundStyle={{ width: width - 40, height: 110 }}
          styleLeft={{ alignSelf: 'center', width: width - 210, alignItems: 'center' }}
          numberEther={132.1244}
          dollaEther={102.87}
          iconStyle={{ width: 30, height: 50, marginTop: 8 }}
          icon={images.iconEther}
          background={images.backgroundBlack}
          styleViewIn={{ paddingLeft: 30 }}
        />

        <SmallCardItem
          style={{ height: 214, marginTop: 10, width: width - 40 }}
          backgroundStyle={{ height: 214, width: width - 40 }}
          title="Create"
          subTitle="a new wallet"
          iconStyle={{ width: 160, height: 154 }}
          icon={images.imgCardCreate}
          background={images.backgroundBlue}
          styleLeft={{ justifyContent: 'space-between' }}
          subStyle={{ color: Apstyle.backgroundWhite, marginTop: 4, fontSize: 16 }}
        />
        <SmallCardItem
          style={{ height: 214, marginTop: 10, width: width - 40 }}
          backgroundStyle={{ height: 214, width: width - 40 }}
          title="Import"
          subTitle="existing wallet"
          iconStyle={{ width: 162, height: 154 }}
          icon={images.imgCardImport}
          background={images.backgroundGrey}
          styleTitle={{ color: Apstyle.cardTitleColor }}
          subStyle={{ color: Apstyle.cartSubtitleColor, marginTop: 4, fontSize: 16 }}
          styleLeft={{ justifyContent: 'space-between' }}
        />
        <SmallCardItem
          style={{ height: 181, marginTop: 10 }}
          backgroundStyle={{ height: 181, width: width - 40 }}
          numberEther={132.28312121242}
          dollaEther={302.87}
          name="Jasson Nguyen"
          token="0x92912h2d217aB656276f2718789jkhdksl4jkh2"
          iconStyle={{ width: 50, height: 82, tintColor: Apstyle.alphaColorImage }}
          icon={images.iconEther}
          background={images.backgroundBlue}
        />
        <SmallCardItem
          style={{ height: 181, marginTop: 10 }}
          backgroundStyle={{ height: 181, width: width - 40 }}
          numberEther={132.28312121242}
          dollaEther={302.87}
          name="Jasson Nguyen"
          token="0x9212n12njk7aB656276f2718789jkhdksl4jkh2"
          iconStyle={{ width: 50, height: 82, tintColor: Apstyle.alphaColorImage }}
          icon={images.iconEther}
          background={images.backgroundBlack}
        />
      </ScrollView>
    )
  }
}
