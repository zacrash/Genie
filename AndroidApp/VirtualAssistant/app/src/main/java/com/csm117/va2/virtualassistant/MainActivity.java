package com.csm117.va2.virtualassistant;

import android.content.Intent;
import android.media.MediaPlayer;
import android.media.MediaRecorder;

import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;

import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.util.Random;

import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
import static android.provider.AlarmClock.EXTRA_MESSAGE;

import android.support.v4.app.ActivityCompat;
import android.content.pm.PackageManager;
import android.support.v4.content.ContextCompat;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.NetworkResponse;
import com.android.volley.ParseError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    Button buttonStart, buttonStop;
//            buttonPlayLastRecordAudio, buttonStopPlayingRecording ;
    String AudioSavePathInDevice = null;
    MediaRecorder mediaRecorder ;
    Random random ;
    String RandomAudioFileName = "ABCDEFGHIJKLMNOP";
    public static final int RequestPermissionCode = 1;
    MediaPlayer mediaPlayer ;
    public static final String EXTRA_MESSAGE = "com.csm117.va2.virtualassistant.MESSAGE";
//    private static final String TAG = "MainActivity";
//    final TextView mTextView = (TextView) findViewById(R.id.text);
    RequestQueue MyRequestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        MyRequestQueue = Volley.newRequestQueue(this);


        buttonStart = (Button) findViewById(R.id.button);
        buttonStop = (Button) findViewById(R.id.button2);
//        buttonPlayLastRecordAudio = (Button) findViewById(R.id.button3);
//        buttonStopPlayingRecording = (Button)findViewById(R.id.button4);

        buttonStop.setEnabled(false);
//        buttonPlayLastRecordAudio.setEnabled(false);
//        buttonStopPlayingRecording.setEnabled(false);

        random = new Random();

        buttonStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(checkPermission()) {

                    AudioSavePathInDevice =
                            Environment.getExternalStorageDirectory().getAbsolutePath() + "/" +
                                    CreateRandomAudioFileName(5) + "AudioRecording.3gp";

                    MediaRecorderReady();

                    try {
                        mediaRecorder.prepare();
                        mediaRecorder.start();
                    } catch (IllegalStateException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }

                    buttonStart.setEnabled(false);
                    buttonStop.setEnabled(true);

                    Toast.makeText(MainActivity.this, "Recording started",
                            Toast.LENGTH_LONG).show();
                } else {
                    requestPermission();
                }

            }
        });

 //       buttonStop.setOnClickListener(new View.OnClickListener() {
           // @Override
//            public void onClick(View view) {
//                mediaRecorder.stop();
//                buttonStop.setEnabled(false);
//                buttonPlayLastRecordAudio.setEnabled(true);
//                buttonStart.setEnabled(true);
//                buttonStopPlayingRecording.setEnabled(false);
//
//                Toast.makeText(MainActivity.this, "Recording Completed",
//                        Toast.LENGTH_LONG).show();
//
//            }

//            RequestQueue MyRequestQueue = Volley.newRequestQueue(this);
//            String url = "http://yourdomain.com/path";
//            StringRequest MyStringRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
//                  @Override
//                  public void onResponse(String response) {
//                      //This code is executed if the server responds, whether or not the response contains data.
//                      //The String 'response' contains the server's response.
//                      // Display the first 500 characters of the response string.
//                      mTextView.setText("Response is: "+ response.substring(0,500));
//                  }
//            }, new Response.ErrorListener() { //Create an error listener to handle errors appropriately.
//                  @Override
//                  public void onErrorResponse(VolleyError error) {
//                      //This code is executed if there is an error.
//                      mTextView.setText("That didn't work!");
//                  }
//            }) {
//                  protected Map<String, String> getParams() {
//                      Map<String, String> MyData = new HashMap<String, String>();
//                      MyData.put("Field", "Value"); //Add the data you'd like to send to the server.
//                      return MyData;
//                  }
//            };
//
//            MyRequestQueue.add(MyStringRequest);
  //      });

//        buttonPlayLastRecordAudio.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) throws IllegalArgumentException,
//                    SecurityException, IllegalStateException {
//
//                buttonStop.setEnabled(false);
//                buttonStart.setEnabled(false);
////                buttonStopPlayingRecording.setEnabled(true);
//
//                mediaPlayer = new MediaPlayer();
//                try {
//                    mediaPlayer.setDataSource(AudioSavePathInDevice);
//                    mediaPlayer.prepare();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//
//                mediaPlayer.start();
//                Toast.makeText(MainActivity.this, "Recording Playing",
//                        Toast.LENGTH_LONG).show();
//            }
//        });

//        buttonStopPlayingRecording.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                buttonStop.setEnabled(false);
//                buttonStart.setEnabled(true);
//                buttonStopPlayingRecording.setEnabled(false);
//                buttonPlayLastRecordAudio.setEnabled(true);
//
//                if(mediaPlayer != null){
//                    mediaPlayer.stop();
//                    mediaPlayer.release();
//                    MediaRecorderReady();
//                }
//            }
//        });
    }

//    String message = "Coffee is good!";
    private static final String TAG2 = "sendCommand";
    // Send user command (the saved audio file) to server
    public void sendCommand(View view) {
        // Do something after stop button is clicked

        // Stop recording
        mediaRecorder.stop();
        buttonStop.setEnabled(false);
//        buttonPlayLastRecordAudio.setEnabled(true);
        buttonStart.setEnabled(true);
//        buttonStopPlayingRecording.setEnabled(false);

        // Display notification on bottom
        Toast.makeText(MainActivity.this, "Command Received",
                Toast.LENGTH_LONG).show();

        // Convert audio file to Base64 string
        final File file = new File(AudioSavePathInDevice);
        byte bytes[] = new byte[(int) file.length()];
        try {
            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
            DataInputStream dis = new DataInputStream(bis);
            try {
                dis.readFully(bytes);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (IOException e){
            e.printStackTrace();
        }
        String encodedFile = Base64.encodeToString(bytes, 0);

        // Send POST request
        // Instantiate the RequestQueue.
//        String message = "No response from server";
//        String url = "http://www.google.com";
        String url = "https://e9011ebe.ngrok.io/command";
        final TextView mTextView = (TextView) findViewById(R.id.mTextView);
        mTextView.setText("Sending command...");
        final Intent intent = new Intent(this, DisplayMessageActivity.class);


        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("command", encodedFile);
        } catch (JSONException e){
            e.printStackTrace();
        }
        final String requestBody = jsonBody.toString();

        StringRequest stringRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.i("VOLLEY", response);
                file.delete();
                intent.putExtra(EXTRA_MESSAGE, response);
                startActivity(intent);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("VOLLEY", error.toString());
                mTextView.setText("Server error: " + error.toString());
            }
        }) {
            @Override
            public String getBodyContentType() {
                return "application/json; charset=utf-8";
            }

            @Override
            public byte[] getBody() throws AuthFailureError {
                try {
                    return requestBody == null ? null : requestBody.getBytes("utf-8");
                } catch (UnsupportedEncodingException uee) {
                    VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
                    return null;
                }
            }

            @Override
            protected Response<String> parseNetworkResponse(NetworkResponse response) {
                String responseString = "";
                if (response != null) {
//                    responseString = String.valueOf(response.statusCode);
//                    // can get more details such as response.headers
                    try {
                        responseString = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
                        return Response.success(responseString, HttpHeaderParser.parseCacheHeaders(response));
                    } catch (UnsupportedEncodingException e) {
                        return Response.error(new ParseError(e));
                    }
                }
                else
                    return Response.success(responseString, HttpHeaderParser.parseCacheHeaders(response));
            }
        };

        int socketTimeout = 10000;//30 seconds - change to what you want
        RetryPolicy policy = new DefaultRetryPolicy(socketTimeout, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
        stringRequest.setRetryPolicy(policy);
        MyRequestQueue.add(stringRequest);


//        ==============================================================================

//        StringRequest MyStringRequest = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
//            @Override
//            public void onResponse(String response) {
//                //This code is executed if the server responds, whether or not the response contains data.
//                //The String 'response' contains the server's response.
////                message = "This is onResponse";
//                mTextView.setText(response);
//            }
//        }, new Response.ErrorListener() { //Create an error listener to handle errors appropriately.
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                //This code is executed if there is an error.
////                message = "Error happened";
//                mTextView.setText("Error connecting to server");
//                System.out.println("Error in listening to response");
//            }
//        }) {
//            @Override
//            public byte[] getBody() throws AuthFailureError {
//
//                byte[] body = new byte[0];
//                try {
//                    body = message.getBytes("UTF-8");
//                } catch (UnsupportedEncodingException e) {
//                    Log.e(TAG2, "Unable to gets bytes from content", e.fillInStackTrace());
//                }
//                return body;
//            }
////            protected Map<String, String> getParams() {
////                Map<String, String> MyData = new HashMap<String, String>();
////                MyData.put("body", "coffee is really cool"); //Add the data you'd like to send to the server.
////                return MyData;
////            }
//        };

//        MyRequestQueue.add(MyStringRequest);

        // Start new activity to display the results
//        Intent intent = new Intent(this, DisplayMessageActivity.class);
//        intent.putExtra(EXTRA_MESSAGE, message);
//        startActivity(intent);
    }

    public void MediaRecorderReady(){
        mediaRecorder=new MediaRecorder();
        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        mediaRecorder.setOutputFile(AudioSavePathInDevice);
    }

    public String CreateRandomAudioFileName(int string){
        StringBuilder stringBuilder = new StringBuilder( string );
        int i = 0 ;
        while(i < string ) {
            stringBuilder.append(RandomAudioFileName.
                    charAt(random.nextInt(RandomAudioFileName.length())));

            i++ ;
        }
        return stringBuilder.toString();
    }

    private void requestPermission() {
        ActivityCompat.requestPermissions(MainActivity.this, new
                String[]{WRITE_EXTERNAL_STORAGE, RECORD_AUDIO}, RequestPermissionCode);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        switch (requestCode) {
            case RequestPermissionCode:
                if (grantResults.length> 0) {
                    boolean StoragePermission = grantResults[0] ==
                            PackageManager.PERMISSION_GRANTED;
                    boolean RecordPermission = grantResults[1] ==
                            PackageManager.PERMISSION_GRANTED;

                    if (StoragePermission && RecordPermission) {
                        Toast.makeText(MainActivity.this, "Permission Granted",
                                Toast.LENGTH_LONG).show();
                    } else {
                        Toast.makeText(MainActivity.this,"Permission Denied",Toast.LENGTH_LONG).show();
                    }
                }
                break;
        }
    }

    public boolean checkPermission() {
        int result = ContextCompat.checkSelfPermission(getApplicationContext(),
                WRITE_EXTERNAL_STORAGE);
        int result1 = ContextCompat.checkSelfPermission(getApplicationContext(),
                RECORD_AUDIO);
        return result == PackageManager.PERMISSION_GRANTED &&
                result1 == PackageManager.PERMISSION_GRANTED;
    }
}
