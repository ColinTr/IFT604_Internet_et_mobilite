package com.example.koboard;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import com.example.koboard.httpUtils.HttpRecupererPlaylist;
import com.example.koboard.ui.Kusique.KusiqueFragment;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.material.navigation.NavigationView;
import com.google.firebase.messaging.FirebaseMessaging;
import com.spotify.sdk.android.authentication.AuthenticationClient;
import com.spotify.sdk.android.authentication.AuthenticationRequest;
import com.spotify.sdk.android.authentication.AuthenticationResponse;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    public static String countryCode = "FR";

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        View headerView = navigationView.getHeaderView(0);
        TextView tv_nom_utilisateur = headerView.findViewById(R.id.tv_nom_utilisateur);
        tv_nom_utilisateur.setText(GlobalClass.getUser().getUsername());
        mAppBarConfiguration = new AppBarConfiguration.Builder(R.id.nav_kusique, R.id.nav_koulette, R.id.nav_kognotte, R.id.nav_home, R.id.nav_kochat,
                R.id.nav_konote, R.id.nav_kourse, R.id.nav_kotemps)
                .setDrawerLayout(drawer)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        FirebaseMessaging.getInstance().subscribeToTopic(GlobalClass.getUser().getId());


        LocationManager locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        LocationListener locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(@NonNull Location location) {
                Geocoder gcd = new Geocoder(MainActivity.this, Locale.getDefault());
                List<Address> addresses;
                try {
                    addresses = gcd.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
                    if (addresses != null && !addresses.isEmpty()) {
                        String lastCountryCode = countryCode;
                        countryCode = addresses.get(0).getCountryCode();
                        if(!countryCode.equals("") && (!lastCountryCode.equals(countryCode) || GlobalClass.getPlaylist == false))  {
                            Log.d("COUNTRY", countryCode);
                            new HttpRecupererPlaylist(new HttpRecupererPlaylist.AsyncResponse() {
                                @Override
                                public void processFinish(String uriPlaylist) {
                                    GlobalClass.getPlaylist = true;
                                    KusiqueFragment.PLAYLIST_URI = uriPlaylist;
                                    Log.d("PLAYLIST URI COUNTRY", uriPlaylist);
                                }
                            }, countryCode).execute();
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onProviderDisabled(@NonNull String provider) {
                Intent intent = new Intent(Settings.ACTION_LOCALE_SETTINGS);
                startActivity(intent);
            }
        };
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[] {
                    Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION
            }, 10);
        }
        else {
            locationManager.requestLocationUpdates("gps", 5000, 0, locationListener);
        }

        AuthenticationRequest.Builder builder =
                new AuthenticationRequest.Builder(KusiqueFragment.CLIENT_ID, AuthenticationResponse.Type.TOKEN, KusiqueFragment.REDIRECT_URI);

        builder.setScopes(new String[]{"streaming"});
        AuthenticationRequest request = builder.build();

        AuthenticationClient.openLoginActivity(this, KusiqueFragment.REQUEST_CODE, request);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    public void disconnect(MenuItem item) {
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        if (account != null) {
            GlobalClass.mGoogleSignInClient.signOut();
        }
        FirebaseMessaging.getInstance().unsubscribeFromTopic(GlobalClass.getUser().getId());
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);

        // Check if result comes from the correct activity
        if (requestCode == KusiqueFragment.REQUEST_CODE) {
            AuthenticationResponse response = AuthenticationClient.getResponse(resultCode, intent);
            switch (response.getType()) {
                case TOKEN:
                    GlobalClass.SPOTIFY_AUTH_TOKEN = response.getAccessToken();
                    Log.d("SPOTIFY_AUTH_TOKEN", GlobalClass.SPOTIFY_AUTH_TOKEN);
                    break;

                // Auth flow returned an error
                case ERROR:
                    // Handle error response
                    break;

                // Most likely auth flow was cancelled
                default:
                    // Handle other cases
            }
        }
    }
}