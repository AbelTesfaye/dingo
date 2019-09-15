package com.dingo.PIPVideoPlayer;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class PIPVideoPlayerModule extends ReactContextBaseJavaModule{
    public PIPVideoPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PIPVideoPlayer";
    }

    @ReactMethod
    public void play(String idOrUrl){
        PIPVideoPlayer.open(getReactApplicationContext(),idOrUrl);
    }


}