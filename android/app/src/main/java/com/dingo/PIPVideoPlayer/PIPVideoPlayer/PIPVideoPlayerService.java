package com.dingo.PIPVideoPlayer;

import android.app.Notification;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Rect;
import android.net.Uri;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.dingo.R;
import com.dingo.floatingview.FloatingViewListener;
import com.dingo.floatingview.FloatingViewManager;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.YouTubePlayer;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.listeners.AbstractYouTubePlayerListener;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.views.YouTubePlayerView;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.PlayerConstants;


/**
 * ChatHead Service
 */
public class PIPVideoPlayerService extends Service implements FloatingViewListener {


    /**
     * デバッグログ用のタグ
     */
    private static final String TAG = "PIPVideoPlayerService";

    /**
     * Intent key (Cutout safe area)
     */
    public static final String EXTRA_CUTOUT_SAFE_AREA = "cutout_safe_area";

    /**
     * 通知ID
     */
    private static final int NOTIFICATION_ID = 9083150;

    /**
     * FloatingViewManager
     */
    private FloatingViewManager mFloatingViewManager;

    /**
     * {@inheritDoc}
     */

    String vId = ""; //YouTube VideoId

    static YouTubePlayerView youTubePlayerView;

    private final BroadcastReceiver myReceiver = new myReceiver();

    public static void performYoutubePlayerAction(String action){
        if(youTubePlayerView == null){
            Log.e("PIPVideoPlayerService", "youTubePlayerView is null");
            return;
        }
        youTubePlayerView.getYouTubePlayerWhenReady(youTubePlayer -> { 
            if(action.equals("PAUSE")){
                youTubePlayer.pause();
            }
            else if(action.equals("PLAY")){
                youTubePlayer.play();
            }
            
        });
    }

    public static void load(String url){
        if(youTubePlayerView == null){
            Log.e("PIPVideoPlayerService", "youTubePlayerView is null");
            return;
        }
        youTubePlayerView.getYouTubePlayerWhenReady(youTubePlayer -> { 
                youTubePlayer.loadVideo(url,0);
        });
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // 既にManagerが存在していたら何もしない
        if (mFloatingViewManager != null) {
            return START_STICKY;
        }


        final IntentFilter filter = new IntentFilter(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        registerReceiver(myReceiver, filter);

        final DisplayMetrics metrics = new DisplayMetrics();
        final WindowManager windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        windowManager.getDefaultDisplay().getMetrics(metrics);
        final LayoutInflater inflater = LayoutInflater.from(this);
        final FrameLayout frameLayout = (FrameLayout) inflater.inflate(R.layout.floating_view, null, false);
        youTubePlayerView = frameLayout.findViewById(R.id.youtube_player_view);

        Uri receivedUri = intent.getData();

        if(receivedUri.getHost() != null) {
            if (receivedUri.getHost().equals("youtu.be"))
                vId = receivedUri.getLastPathSegment();
            else
                vId = receivedUri.getQueryParameter("v");
        }

        if(vId == null || vId.equals(""))
            vId = receivedUri.toString();


        if(vId == null || vId.equals("")) {
            Toast.makeText(this, "Video id is null. Exiting...", Toast.LENGTH_LONG).show();
            onFinishFloatingView();
        }

        youTubePlayerView.initialize(new AbstractYouTubePlayerListener() {
            @Override
            public void onReady(@NonNull YouTubePlayer youTubePlayer) {
                Log.e("XXXX","player of yt ready!");
                youTubePlayer.loadVideo(vId, 0);
            }
            @Override
            public void onStateChange(YouTubePlayer youTubePlayer, PlayerConstants.PlayerState state) {
                super.onStateChange(youTubePlayer, state);

                PIPVideoPlayerModule.publishState(state.toString());

                Log.e("XXXX","current state: "+state);
            }
            
        });
        mFloatingViewManager = new FloatingViewManager(this, this);
        mFloatingViewManager.setSafeInsetRect((Rect) intent.getParcelableExtra(EXTRA_CUTOUT_SAFE_AREA));
        mFloatingViewManager.setTrashViewEnabled(false);
        final FloatingViewManager.Options options = new FloatingViewManager.Options();
        options.usePhysics = true;
        options.shape = FloatingViewManager.SHAPE_RECTANGLE;
        options.moveDirection = FloatingViewManager.MOVE_DIRECTION_NONE;

        mFloatingViewManager.addViewToWindow(frameLayout, options);

        // 常駐起動
        //startForeground(NOTIFICATION_ID, createNotification(this));

        return START_REDELIVER_INTENT;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onDestroy() {
        if(youTubePlayerView != null)
            youTubePlayerView.release();

        unregisterReceiver(myReceiver);
        PIPVideoPlayerModule.publishState("DESTROYED");

        destroy();
        super.onDestroy();
    }

    public class myReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                performYoutubePlayerAction("PAUSE");
            } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                //Do something when it's back on
            }
        }
    }
    /**
     * {@inheritDoc}
     */
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onFinishFloatingView() {
        youTubePlayerView.release();
        stopSelf();
        Log.d(TAG, "finish_deleted");
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onTouchFinished(boolean isFinishing, int x, int y) {
        if (isFinishing) {
            Log.d(TAG, "deleted_soon");
        } else {
            Log.d(TAG, "touch_finished_position"+x+","+y);
        }
    }

    /**
     * Viewを破棄します。
     */
    private void destroy() {
        if (mFloatingViewManager != null) {
            mFloatingViewManager.removeAllViewToWindow();
            mFloatingViewManager = null;
        }
    }

    /**
     * 通知を表示します。
     * クリック時のアクションはありません。
     */
    private static Notification createNotification(Context context) {
        final NotificationCompat.Builder builder = new NotificationCompat.Builder(context, "default_floatingview_channel_id");
        builder.setWhen(System.currentTimeMillis());
        builder.setSmallIcon(R.mipmap.ic_launcher);
        builder.setContentTitle("Playing in mini player");
        builder.setContentText("Tap to close.");
        builder.setOngoing(true);
        builder.setPriority(NotificationCompat.PRIORITY_MIN);
        builder.setCategory(NotificationCompat.CATEGORY_SERVICE);

        return builder.build();
    }
}
