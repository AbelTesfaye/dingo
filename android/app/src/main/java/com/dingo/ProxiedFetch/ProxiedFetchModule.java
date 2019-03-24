package com.dingo.ProxiedFetch;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.util.Scanner;

public class ProxiedFetchModule extends ReactContextBaseJavaModule{
    public ProxiedFetchModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ProxiedFetch";
    }

    @ReactMethod
    public void proxiedFetch(String url, String proxyIp, int proxyPort,Promise p){


        Runnable r = () -> {
            HttpURLConnection urlConnection = null;
            try {
                Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyIp, proxyPort));

                urlConnection = (HttpURLConnection) new URL(url).openConnection(proxy);

                InputStream in = urlConnection.getInputStream();

                Scanner scanner = new Scanner(in);
                scanner.useDelimiter("\\A");

                boolean hasInput = scanner.hasNext();
                if (hasInput) {
                    p.resolve( scanner.next());
                } else {
                    p.resolve("");
                }

            } catch (Exception e) {
                p.reject(e.toString());

            } finally {
                if ((urlConnection != null)) {
                    urlConnection.disconnect();
                }
            }
        };

        new Thread(r).start();



    }


}