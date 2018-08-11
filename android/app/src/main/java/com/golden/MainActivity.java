package com.golden;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.widget.ImageView;

import com.crashlytics.android.Crashlytics;

import org.devio.rn.splashscreen.SplashScreen;

import io.fabric.sdk.android.Fabric;

import com.reactnativenavigation.controllers.SplashActivity;
public class MainActivity extends SplashActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    // @Override
    // protected String getMainComponentName() {
    //     return "golden";
    // }

    // @Override
    // public void onCreate(@Nullable Bundle savedInstanceState) {
    //     SplashScreen.show(this, true);
    //     super.onCreate(savedInstanceState);
    //     Fabric.with(this, new Crashlytics());
    // }

    // @Override
    // public void onNewIntent(Intent intent) {
    //     super.onNewIntent(intent);
    //     setIntent(intent);
    // }

    // @Override
    // protected void onPause() {
    //     SplashScreen.hide(this);
    //     super.onPause();
    // }
}
