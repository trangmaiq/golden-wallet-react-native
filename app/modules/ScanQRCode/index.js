import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Clipboard,
  Platform
} from 'react-native'
import PropsType from 'prop-types'
import Permissions from 'react-native-permissions'
import Camera from 'react-native-camera'
import ImagePicker from 'react-native-image-picker'
import QRCode from './../../../Libs/react-native-qrcode-local-image'
import NavigationHeader from '../../components/elements/NavigationHeader'
import images from './../../commons/images'
import constant from './../../commons/constant'
import AppStyle from '../../commons/AppStyle'
import NavStore from '../../stores/NavStore'
import HapticHandler from '../../Handler/HapticHandler'

const { width } = Dimensions.get('window')
const widthButton = (width - 60) / 2

export default class ScanQRCodeScreen extends PureComponent {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  state = {
    showCamera: true
  }

  componentWillMount() {
    this.state.showCamera = true
    Permissions.check('camera').then((response) => {
      if (response === 'denied') {
        if (Platform.OS === 'android') return
        this.showPopupPermissionCamera()
      } else if (response === 'undetermined') {
        Permissions.request('camera', {
          rationale: {
            title: 'Camera Permission',
            message: '"Golden" needs permission to access your device’s camera to scan QRCode'
          }
        }).then((res) => {
          if (res === 'denied') {
            if (Platform.OS === 'android') return
            this.showPopupPermissionCamera()
          }
        })
      }
    })
  }

  onSuccess = (data) => {
    HapticHandler.NotificationSuccess()
    this.props.navigation.state.params.returnData(data)
    this.props.navigation.goBack()
  }

  onError = (data) => {
    NavStore.popupCustom.show(data)
  }

  async onPasteAddress() {
    const address = await Clipboard.getString()
    if (address) {
      this.props.navigation.state.params.returnData(address)
      this.props.navigation.goBack()
    } else {
      NavStore.popupCustom.show('No Address Copied')
    }
  }

  showPopupPermissionCamera() {
    NavStore.popupCustom.show(
      'Camera Access',
      [
        {
          text: 'Cancel',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Settings',
          onClick: () => {
            Permissions.openSettings()
            NavStore.popupCustom.hide()
          }
        }
      ],
      '"Golden" needs permission to access your device’s camera to scan QRCode. Please go to Setting > Golden > Turn on Camera'
    )
  }

  showPopupPermissionPhoto() {
    NavStore.popupCustom.show(
      'Photo Access',
      [
        {
          text: 'Not Now',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Settings',
          onClick: () => {
            Permissions.openSettings()
            NavStore.popupCustom.hide()
          }
        }
      ],
      '"Golden" needs permission to access your photo library to select a photo. Please go to Setting > Golden > Photo > choose Read and Write'
    )
  }

  _getQRCode(url) {
    if (url) {
      QRCode.decode(url, (error, result) => {
        if (error === null) {
          HapticHandler.NotificationSuccess()
          this.props.navigation.state.params.returnData(result.toLowerCase())
          this.setState({ showCamera: false })
          this.props.navigation.goBack()
        } else {
          NavStore.popupCustom.show('Can’t detect this code')
        }
      })
    }
  }

  openImageLibrary() {
    Permissions.check('photo').then((response) => {
      if (response === 'denied') {
        this.showPopupPermissionPhoto()
      } else {
        const options = {
          title: 'QRCode Image',
          storageOptions: {
            skipBackup: true,
            path: 'images'
          }
        }
        ImagePicker.launchImageLibrary(options, (res) => {
          if (res.error) {
            this.showPopupPermissionPhoto()
          } else {
            const url = Platform.OS === 'ios' ? res.uri : res.path
            this._getQRCode(url)
          }
        })
      }
    })
  }

  _handleBarCodeRead(e) {
    if (this.state.showCamera) {
      HapticHandler.NotificationSuccess()
      this.props.navigation.goBack()
      this.props.navigation.state.params.returnData(e.data.toLowerCase())
      this.setState({ showCamera: false })
    }
  }

  _renderNotAuthorizedView = () => {
    return (
      <View
        style={{
          width,
          height: width,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: AppStyle.colorBlack
        }}
      >
        <Text
          style={{
            color: AppStyle.mainTextColor,
            fontFamily: 'OpenSans-Semibold',
            fontSize: 20
          }}
        >
          Camera not authorized
        </Text>
      </View>
    )
  }

  render() {
    const { title, marginTop, marginBottom = 0 } = this.props.navigation.state.params
    return (
      <View style={{ flex: 1, paddingTop: 16 + marginTop }}>
        <NavigationHeader
          headerItem={{
            title,
            icon: null,
            button: images.backButton
          }}
          action={() => {
            this.props.navigation.goBack()
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {this.state.showCamera && (
            <Camera
              style={styles.camera}
              onBarCodeRead={(e) => { this._handleBarCodeRead(e) }}
              permissionDialogTitle="Permission to use camera"
              permissionDialogMessage="We need your permission to use your camera phone "
              notAuthorizedView={
                this._renderNotAuthorizedView()
              }
            />
          )}
          <View style={[styles.viewButtonBottom, { marginBottom }]}>
            <TouchableOpacity
              style={styles.buttonBlue}
              onPress={() => {
                this.openImageLibrary()
              }}
            >
              <Image
                style={styles.imageButtonBlue}
                source={images.backgroundLargeButton}
              />
              <Text style={styles.textButtonBlue}>
                {constant.IMPORT}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonBlue, { marginLeft: 20 }]}
              onPress={() => this.onPasteAddress()}
            >
              <Image
                style={styles.imageButtonBlue}
                source={images.backgroundLargeButton}
              />
              <Text style={styles.textButtonBlue}>
                {constant.PASTE_ADDRESS}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  camera: {
    width,
    height: width
  },
  viewButtonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: width - 40,
    flex: 1
  },
  buttonBlue: {
    width: widthButton,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  imageButtonBlue: {
    width: widthButton,
    height: 34,
    borderRadius: 5,
    position: 'absolute'
  },
  textButtonBlue: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    color: AppStyle.mainColor
  }
})
