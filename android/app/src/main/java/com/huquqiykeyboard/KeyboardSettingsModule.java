package com.huquqiykeyboard;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.provider.Settings;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class KeyboardSettingsModule extends ReactContextBaseJavaModule {

    public KeyboardSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "KeyboardSettingsModule";
    }

    @ReactMethod
    public void openInputMethodSettings() {
        Intent intent = new Intent(Settings.ACTION_INPUT_METHOD_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(intent);
    }

    @ReactMethod
    public void saveTheme(String themeId) {
        SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("HuquqiyKeyboardPrefs", Context.MODE_PRIVATE);
        prefs.edit().putString("selected_theme", themeId).apply();
    }

    @ReactMethod
    public void getTheme(Promise promise) {
        SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("HuquqiyKeyboardPrefs", Context.MODE_PRIVATE);
        String themeId = prefs.getString("selected_theme", "dark");
        promise.resolve(themeId);
    }
}
