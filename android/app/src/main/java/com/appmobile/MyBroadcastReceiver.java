package com.ocrmikro;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class MyBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String scannedData = intent.getStringExtra("data"); // sesuaikan dengan key dari scanner kamu
        Log.d("MyBroadcastReceiver", "Scanned Data: " + scannedData);

        if (scannedData != null && !scannedData.isEmpty()) {
            ScannerReceiverModule.sendScanResultToJS(scannedData);
        }
    }
}
