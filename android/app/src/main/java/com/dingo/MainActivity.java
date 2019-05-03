package com.dingo;

import android.os.Bundle;
import android.util.Log;

import com.dingo.SplashScreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.util.Scanner;

import com.dingo.database.DbHelper;
import org.json.JSONObject;

public class MainActivity extends ReactActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        
        try {
            DbHelper dbHelper = new DbHelper(this);
            JSONObject splashObject = dbHelper.getShowSplashSetting();
            boolean showSplash = splashObject.getBoolean("currentValue");

            Log.e("DINGO_JAVA" , "show_splash = " + showSplash);
            if (showSplash) {
                SplashScreen.show(this, R.style.SplashScreen_Fullscreen, R.id.launch_img);
            } 
        
            dbHelper.close();
        } catch(Exception e) {
            e.printStackTrace();
            SplashScreen.show(this, R.style.SplashScreen_Fullscreen, R.id.launch_img);  // show the splash screen because default value is true
        }

        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "dingo";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
