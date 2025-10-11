
package com.ocrmikro;

import android.content.Intent;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import android.content.pm.PackageInfo;
import android.content.pm.ApplicationInfo;
import android.app.ActivityManager;
import java.util.List;
import android.os.Build;

import java.lang.ProcessBuilder;
import com.facebook.react.bridge.Callback;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.InputStream;

import android.content.Context;
import android.content.pm.ProviderInfo;
import android.content.ContentResolver;
import android.net.Uri;

import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

import android.content.Intent;
import android.net.Uri;

public class ScanModule extends ReactContextBaseJavaModule {
    private static final String E_PACKAGE_NOT_FOUND = "E_PACKAGE_NOT_FOUND";
    private static final String E_ERR_ON_OPENING = "E_ERR_ON_OPENING";

    public ScanModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
 

    @ReactMethod
    public void callbackScan(Promise promise) {
        promise.resolve("testing");
    }

    @Override
    public String getName() {
        return "ScanModule";
    }
}