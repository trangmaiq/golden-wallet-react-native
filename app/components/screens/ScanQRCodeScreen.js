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
import QRCode from '../../../Libs/react-native-qrcode-local-image'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import constant from '../../commons/constant'
import AppStyle from '../../commons/AppStyle'
import HapticHandler from '../../Handler/HapticHandler'
import Permission from '../../Permission'
import NavigationStore from '../../navigation/NavigationStore'

const { width } = Dimensions.get('window')
const widthButton = (width - 60) / 2

export default class ScanQRCodeScreen extends PureComponent {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    returnData: PropsType.func,
    title: PropsType.string,
    marginTop: PropsType.number,
    marginBottom: PropsType.number
  }

  static defaultProps = {
    returnData: () => { },
    title: '',
    marginTop: 0,
    marginBottom: 0
  }

  constructor(props) {
    super(props)

    this.state = {
      showCamera: true
    }

    Permissions.check(Permission.camera).then((response) => {
      NavigationStore.backgroundByPermission = true
      if (response === Permission.Denied) {
        if (Platform.OS === 'android') return
        this.showPopupPermissionCamera()
      } else if (response === Permission.Undetermined) {
        Permissions.request(Permission.camera, {
          rationale: {
            title: 'Camera Permission',
            message: '"Golden" needs permission to access your device’s camera to scan QRCode'
          }
        }).then((res) => {
          if (res === Permission.Denied) {
            if (Platform.OS === 'android') return
            this.showPopupPermissionCamera()
          }
        }).catch(e => () => { })
      }
    })
  }

  onSuccess = (data) => {
    const { returnData } = this.props
    HapticHandler.NotificationSuccess()
    returnData(data)
    NavigationStore.popView()
  }

  onError = (data) => {
    NavigationStore.showPopup(data)
  }

  async onPasteAddress() {
    const { returnData } = this.props
    const address = await Clipboard.getString()
    if (address) {
      returnData(address)
      NavigationStore.popView()
    } else {
      NavigationStore.showPopup('No Address Copied')
    }
  }

  showPopupPermissionCamera() {
    NavigationStore.showBinaryPopup(
      'Camera Access',
      {
        firstAction: {
          title: 'Cancel',
          action: () => { }
        },
        secondAction: {
          title: 'Settings',
          action: () => {
            Permissions.openSettings()
          }
        }
      },
      '"Golden" needs permission to access your device’s camera to scan QRCode. Please go to Setting > Golden > Turn on Camera',
      'normal'
    )
  }

  showPopupPermissionPhoto() {
    NavigationStore.showBinaryPopup(
      'Photo Access',
      {
        firstAction: {
          title: 'Not Now',
          action: () => { }
        },
        secondAction: {
          title: 'Settings',
          action: () => {
            Permissions.openSettings()
          }
        }
      },
      '"Golden" needs permission to access your photo library to select a photo. Please go to Setting > Golden > Photo > choose Read and Write'
    )
  }

  _getQRCode(url) {
    const { returnData } = this.props
    if (url) {
      QRCode.decode(url, (error, result) => {
        if (error === null) {
          HapticHandler.NotificationSuccess()
          returnData(result.toLowerCase())
          this.setState({ showCamera: false })
          NavigationStore.popView()
        } else {
          NavigationStore.showPopup('Can’t detect this code')
        }
      })
    }
  }

  openImageLibrary() {
    Permissions.check(Permission.photo).then((response) => {
      NavigationStore.backgroundByPermission = true
      if (response === Permission.Denied) {
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
      const { returnData } = this.props
      HapticHandler.NotificationSuccess()
      NavigationStore.popView()
      returnData(e.data.toLowerCase())
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
    const { title, marginTop, marginBottom = 0 } = this.props
    return (
      <View style={{ flex: 1, paddingTop: 16 + marginTop }}>
        <NavigationHeader
          headerItem={{
            title,
            icon: null,
            button: images.backButton
          }}
          action={() => {
            NavigationStore.popView()
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
    alignItems: AppStyle.center,
    justifyContent: AppStyle.center,
    alignSelf: AppStyle.center,
    width: width - 40,
    flex: 1
  },
  buttonBlue: {
    width: widthButton,
    height: 34,
    alignItems: AppStyle.center,
    justifyContent: AppStyle.center,
    borderRadius: 5
  },
  imageButtonBlue: {
    width: widthButton,
    height: 34,
    borderRadius: 5,
    position: 'absolute'
  },
  textButtonBlue: {
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 14,
    color: AppStyle.mainColor
  }
})
