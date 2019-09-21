package com.dingo.PIPVideoPlayer;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.app.AlertDialog;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.ContextCompat;

public class PIPVideoPlayer {
    public static void open(Context context, Uri url){
                // Check if Android M or higher
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {


                new AlertDialog.Builder(context)
                        .setTitle("Need Permissions")
                        .setMessage("dingo needs \"Draw over other apps\" permission to play videos")
                        .setCancelable(false)
                        .setPositiveButton("Settings", (dialog, which) -> ContextCompat.startActivity(
                                                                                            context,
                                                                                            new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + context.getPackageName()))
                                                                                            ,null))
                        .show();

            }else{

                if(isMyServiceRunning(context, PIPVideoPlayerService.class)){
                    PIPVideoPlayerService.load(url.toString());
                }else{
                    final Intent serviceStarterIntent = new Intent(context, PIPVideoPlayerService.class);
                    serviceStarterIntent.setData(url);
                    ContextCompat.startForegroundService(context, serviceStarterIntent);
                }
            }
    }


    public static void open(Context context, String idOrUrl){
        open(context,Uri.parse(idOrUrl));
    }

    public static void play(){
        PIPVideoPlayerService.performYoutubePlayerAction("PLAY");
    }

    public static void pause(){
        PIPVideoPlayerService.performYoutubePlayerAction("PAUSE");
    }


    static private boolean isMyServiceRunning(Context context,Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}
