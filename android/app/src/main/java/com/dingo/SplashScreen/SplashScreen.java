package com.dingo.SplashScreen;

import android.app.Activity;
import android.app.Dialog;
import android.os.Build;

import java.lang.ref.WeakReference;
import android.view.animation.*;
import android.view.animation.Animation.AnimationListener;
import com.dingo.R;

public class SplashScreen {
    private static Dialog mSplashDialog;
    private static WeakReference<Activity> mActivity;

    
    public static void show(final Activity activity, final int themeResId,final int iv) {
        if (activity == null) return;
        mActivity = new WeakReference<Activity>(activity);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!activity.isFinishing()) {
                    mSplashDialog = new Dialog(activity, themeResId);
                    mSplashDialog.setContentView(R.layout.launch_screen);
                    mSplashDialog.setCancelable(false);


                    if (!mSplashDialog.isShowing()) {
                        mSplashDialog.show();
                        if(iv >= 0){
                            Animation animation = new AlphaAnimation(1, 0);
                            animation.setDuration(1000);
                            animation.setInterpolator(new LinearInterpolator()); 
                            animation.setRepeatCount(Animation.INFINITE); 
                            animation.setRepeatMode(Animation.REVERSE); 
                            mSplashDialog.findViewById(iv).startAnimation(animation); 


                        }
       
                    }
                }
            }
        });
    }


    public static void show(final Activity activity, final boolean fullScreen) {
        int resourceId = fullScreen ? R.style.SplashScreen_Fullscreen : R.style.SplashScreen_SplashTheme;

        show(activity, resourceId,0);
    }

    
    public static void show(final Activity activity) {
        show(activity, 0,0);
    }

  
    public static void hide(Activity activity) {
        if (activity == null) {
            if (mActivity == null) {
                return;
            }
            activity = mActivity.get();
        }

        if (activity == null) return;

        final Activity _activity = activity;

        _activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mSplashDialog != null && mSplashDialog.isShowing()) {
                    boolean isDestroyed = false;

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                        isDestroyed = _activity.isDestroyed();
                    }

                    if (!_activity.isFinishing() && !isDestroyed) {
                        mSplashDialog.dismiss();
                    }
                    mSplashDialog = null;
                }
            }
        });
    }
}
