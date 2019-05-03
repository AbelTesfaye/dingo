package com.dingo.database;

import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.os.Build;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by BrookMG on 5/2/2019 in com.dingo.database
 * inside the project Dingo .
 */
public class DbHelper extends SQLiteOpenHelper {

    private final String SETTINGS_TABLE_NAME = "settings";
    private final String SETTINGS_COLUMN_SETTINGS = "settings";

    private static String DB_PATH = "";
    private static String DB_NAME = "sqlite.db";
    private static final int DATABASE_VERSION = 1;

    private final Context mContext;

    public DbHelper(Context context){
        super(context , DB_NAME , null , DATABASE_VERSION);
        this.mContext = context;

        try {
            if (!isDbCopied()) this.copyDB();

            openDataBase(); 
        } catch (Exception ignored) {
            ignored.printStackTrace();
        }

    }

    private void createDatabase() throws IOException {
        try {
            copyDB();
        }catch (IOException mIoException){  
            mIoException.printStackTrace();
        }
    }

    /**
     * Function to check if the database exists inside the phone
     * @return boolean true : it exists , false : if it doesn't
     */
    private boolean isDbCopied(){
        DB_PATH = mContext.getDatabasePath(DB_NAME).getPath();
        File dbFile = new File(DB_PATH);
        return dbFile.exists();
    }

    /**
     * Function to copy the database framework from assets
     * folder to internal folder of the app
     * @throws IOException -> If copying fails
     */
    private void copyDB() throws IOException{

        OutputStream out = null;
        InputStream assetFileInputStream = mContext.getAssets().open(DB_NAME);

        try {
            String dbPath = DB_PATH;
            dbPath = dbPath.substring(0, dbPath.lastIndexOf("/") + 1);

            File dbPathFile = new File(dbPath);
            if (!dbPathFile.exists())
                dbPathFile.mkdirs();

            File newDbFile = new File(dbPath + DB_NAME);
            out = new FileOutputStream(newDbFile);

            byte[] buf = new byte[1024];
            int len;
            while ((len = assetFileInputStream.read(buf)) > 0)
                out.write(buf, 0, len);

        } finally {
            out.close();
        }


    }

    /**
     * Function to open the database
     * @return the nullablility of the database
     * @throws SQLException if opening fails
     */
    private boolean openDataBase() throws SQLException {
        String mPath = DB_PATH;
        return SQLiteDatabase.openDatabase(mPath , null , SQLiteDatabase.CREATE_IF_NECESSARY) != null;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {}

    public JSONObject getShowSplashSetting() {
        try {
            JSONArray contentsArray = getAllSettings().getJSONArray("settings");
            return getMenuItemGivenAKey(contentsArray, "show_splash");
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    public JSONObject getMenuItemGivenAKey(JSONArray itemsArray, String settingKey) {
        try {
            for (int i = 0; i < itemsArray.length(); i++) {
                if (itemsArray.getJSONObject(i).getString("type").equals("menu") || itemsArray.getJSONObject(i).getString("type").equals("submenu")) {
                    //This is a container... Therefore it must have contents array object
                    JSONObject temp = getMenuItemGivenAKey(itemsArray.getJSONObject(i).getJSONArray("contents") , settingKey);
                    if (temp != null) return temp;
                } else {
                    //This is a menu item... let's check if it's actually the setting we want
                    if (itemsArray.getJSONObject(i).getString("setting_key").equals(settingKey)) {
                        return itemsArray.getJSONObject(i);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public JSONObject getAllSettings() {
        try {
            SQLiteDatabase database = getReadableDatabase();
            Cursor resultSet = database.rawQuery("SELECT * FROM " + SETTINGS_TABLE_NAME + ";", null);
            if (resultSet.getCount() > 0 && resultSet.moveToFirst()) {
                int columnIndex = resultSet.getColumnIndex(SETTINGS_COLUMN_SETTINGS);
                String settings = resultSet.getString(columnIndex);
                return new JSONObject(settings);
            }

            resultSet.close();
            database.close();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}