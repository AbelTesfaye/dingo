package com.dingo.PIPVideoPlayer;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import androidx.core.content.ContextCompat;

public class PIPVideoPlayer {
    public static void open(Context context, Uri url){
        final Intent serviceStarterIntent = new Intent(context, PIPVideoPlayerService.class);
        serviceStarterIntent.setData(url);
        ContextCompat.startForegroundService(context, serviceStarterIntent);

    }


    public static void open(Context context, String idOrUrl){
        open(context,Uri.parse(idOrUrl));
    }
}
