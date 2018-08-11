package com.golden;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.shimmer.RNShimmerPackage;
import com.rnfingerprint.FingerprintAuthPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.bitgo.randombytes.RandomBytesPackage;
import com.oblador.keychain.KeychainPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactlibrary.RNReactNativeHapticFeedbackPackage;
import com.rnfs.RNFSPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.rngoldenkeystore.RNGoldenKeystorePackage;
import com.rngoldenloading.RNGoldenLoadingPackage;
import com.smixx.fabric.FabricPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import org.reactnative.camera.RNCameraPackage;

import com.remobile.qrcodeLocalImage.RCTQRCodeLocalImagePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;

public class MainApplication extends NavigationApplication {
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNShimmerPackage(),
      new FingerprintAuthPackage(),
      new SplashScreenReactPackage(),
      new RandomBytesPackage(),
      new KeychainPackage(),
      new ImagePickerPackage(),
      new RNReactNativeHapticFeedbackPackage(),
      new RNFSPackage(),
      new FIRMessagingPackage(),
      new FabricPackage(),
      new RNDeviceInfo(),
      new RNCameraPackage(), 
      new RNGoldenKeystorePackage(),
      new RCTQRCodeLocalImagePackage(),
      new RNGoldenLoadingPackage()
    );
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
