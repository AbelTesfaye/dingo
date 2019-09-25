package com.dingo.PIPVideoPlayer;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.Nullable;

public class DingoMiniPlayer extends Activity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        Intent intent = getIntent();
        Uri data = intent.getData();

        if(data == null) //if shared content
            data = Uri.parse(intent.getStringExtra(Intent.EXTRA_TEXT));


        PIPVideoPlayer.open(DingoMiniPlayer.this,data);
        finish();
    }
}
