
package com.rngoldenloading;

import android.net.Uri;
import android.util.Log;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;

import com.facebook.common.util.UriUtil;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class RNGoldenLoadingViewManager extends SimpleViewManager<RNGoldenLoadingView> {

    private final ReactApplicationContext reactContext;

    private ResourceDrawableIdHelper mResourceDrawableIdHelper;

    RNGoldenLoadingViewManager(ReactApplicationContext context) {
        mResourceDrawableIdHelper = new ResourceDrawableIdHelper();
        reactContext = context;
    }

    @Override
    public String getName() {
        return "RNGoldenViewLoading";
    }

    @Override
    protected RNGoldenLoadingView createViewInstance(ThemedReactContext reactContext) {
        return new RNGoldenLoadingView(reactContext);
    }

    @ReactProp(name = "image")
    public void setImageUri(RNGoldenLoadingView view, ReadableMap source) {
        view.setImageDrawable(reactContext.getDrawable(R.drawable.loading_logo));
        RotateAnimation rotate = new RotateAnimation(
                0, 360,
                Animation.RELATIVE_TO_SELF, 0.5f,
                Animation.RELATIVE_TO_SELF, 0.5f
        );
        rotate.setDuration(2500);
        rotate.setInterpolator(new LinearInterpolator());
        rotate.setRepeatCount(Animation.INFINITE);
        view.startAnimation(rotate);
    }

}