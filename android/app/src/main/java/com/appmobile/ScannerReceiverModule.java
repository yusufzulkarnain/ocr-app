package com.ocrmikro;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ScannerReceiverModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public ScannerReceiverModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    public static void sendScanResultToJS(String scannedData) {
        WritableMap params = Arguments.createMap();
        params.putString("data", scannedData);

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onBarcodeScanned", params);
    }

    @Override
    public String getName() {
        return "ScannerReceiver";
    }
}
