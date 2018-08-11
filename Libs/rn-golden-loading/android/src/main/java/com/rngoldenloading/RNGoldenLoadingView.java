package com.rngoldenloading;

import android.content.Context;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.v7.widget.AppCompatImageView;
import android.view.animation.Animation;

/**
 * Created by skylab on 7/30/18.
 */

public class RNGoldenLoadingView extends AppCompatImageView {
    public RNGoldenLoadingView(Context context) {
        super(context);
    }

    @Override
    public void setImageURI(@Nullable Uri uri) {
        super.setImageURI(uri);
    }

    @Override
    public void startAnimation(Animation animation) {
        super.startAnimation(animation);
    }
}
