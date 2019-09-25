package com.dingo.PIPVideoPlayer;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;


public class PIPVideoPlayerModule extends ReactContextBaseJavaModule{
    static ReactContext reactContext;
    public PIPVideoPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "PIPVideoPlayer";
    }

    @ReactMethod
    public void open(String idOrUrl){
        PIPVideoPlayer.open(getCurrentActivity(),idOrUrl);
    }

    @ReactMethod
    public void play(){
        PIPVideoPlayer.play();
    }

    @ReactMethod
    public void pause(){
        PIPVideoPlayer.pause();
    }

    public static void publishState(String state){

        WritableMap params = Arguments.createMap();
        params.putString("state", state);

        sendEvent(reactContext, "PIPVideoPlayer", params);
    }

    private static void sendEvent(ReactContext reactContext,
                            String eventName,
                            WritableMap params) {

        reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
    }


}