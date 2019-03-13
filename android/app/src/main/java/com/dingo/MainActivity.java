package com.dingo;

import android.os.Bundle; 
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,R.style.SplashScreen_Fullscreen ,R.id.launch_img);  // here

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
}
