package com.dingo.AndroidYouTubePlayer;

import androidx.annotation.Nullable;

import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.content.Context;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.PlayerConstants;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.YouTubePlayer;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.listeners.AbstractYouTubePlayerListener;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.views.YouTubePlayerView;

import javax.annotation.Nonnull;

public class ReactAndroidYouTubePlayerViewManager extends SimpleViewManager<YouTubePlayerView> {

    public static final String REACT_CLASS = "AndroidYouTubePlayer";
    static YouTubePlayerView mYouTubePlayerView;
    ReactApplicationContext mCallerContext;
    private final BroadcastReceiver myReceiver = new myReceiver();
    String mInitialVideoId = "";
    static boolean mIsPlayerReady = false;
    static boolean mIsPausedInitially = false;

    public ReactAndroidYouTubePlayerViewManager(ReactApplicationContext reactContext) {
        mCallerContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public YouTubePlayerView createViewInstance(ThemedReactContext context) {
        mYouTubePlayerView = new YouTubePlayerView(context);

        final IntentFilter filter = new IntentFilter(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        mCallerContext.registerReceiver(myReceiver, filter);

        mYouTubePlayerView.addYouTubePlayerListener(new AbstractYouTubePlayerListener() {
            @Override
            public void onReady(@Nonnull YouTubePlayer youTubePlayer) {
                mIsPlayerReady = true;

                if(mIsPausedInitially)
                    youTubePlayer.cueVideo(mInitialVideoId, 0);
                else
                    youTubePlayer.loadVideo(mInitialVideoId, 0);

                mIsPausedInitially = false;
            }
            @Override
            public void onStateChange(YouTubePlayer youTubePlayer, PlayerConstants.PlayerState state) {
                super.onStateChange(youTubePlayer, state);
                publishState(context,state);
            }

        });
        return mYouTubePlayerView;
    }

   public static void pause(){
        if(mYouTubePlayerView == null)
            return;

        if (mIsPlayerReady)
            mYouTubePlayerView.getYouTubePlayerWhenReady(youTubePlayer -> youTubePlayer.pause());
        else        
            mIsPausedInitially = true;
    }

    @Override
    public void onDropViewInstance(@Nonnull YouTubePlayerView view) {
        super.onDropViewInstance(view);

        if(mYouTubePlayerView != null)
            mYouTubePlayerView.release();

        mIsPlayerReady = false;
        
        mCallerContext.unregisterReceiver(myReceiver);
    }

    public class myReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                pause();
            } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                //Do something when it's back on
            }
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void publishState(ReactContext reactContext, PlayerConstants.PlayerState state){

        WritableMap params = Arguments.createMap();
        params.putString("state", state.toString());

        sendEvent(reactContext, REACT_CLASS, params);
    }


    @ReactProp(name = "videoId")
    public void setVideoId(YouTubePlayerView view, @Nullable String videoId) {
        if (mIsPlayerReady)
            view.getYouTubePlayerWhenReady(youTubePlayer -> youTubePlayer.loadVideo(videoId, 0));
        else        
        mInitialVideoId = videoId;

    }

    @ReactProp(name = "showYouTubeButton", defaultBoolean = false)
    public void setShowYouTubeButton(YouTubePlayerView view, @Nullable boolean showYouTubeButton) {
        view.getPlayerUiController().showYouTubeButton(showYouTubeButton);
    }

    @ReactProp(name = "showFullScreenButton", defaultBoolean = true)
    public void setShowFullScreenButton(YouTubePlayerView view, @Nullable boolean showFullScreenButton) {
        view.getPlayerUiController().showFullscreenButton(showFullScreenButton);
    }

 
}