import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
// import GoogleFit, {Scopes} from 'react-native-google-fit';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Define types
interface StepData {
  date: string;
  value: number;
}

interface DailyStepCountSample {
  source: string;
  steps: StepData[];
}

interface DistanceSample {
  distance: number;
  startDate: string;
  endDate: string;
}

interface CalorieSample {
  calorie: number;
  startDate: string;
  endDate: string;
}

const GoogleFitDashboard: React.FC = () => {
  // const [steps, setSteps] = useState<number>(0);
  // const [distance, setDistance] = useState<number>(0);
  // const [calories, setCalories] = useState<number>(0);
  // const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  // const [authError, setAuthError] = useState<string>('');

  // useEffect(() => {
  //   const initGoogleLoginAndFit = async () => {
  //     try {
  //       GoogleSignin.configure({
  //         webClientId:
  //           '177379183304-afl2fsvcq6lkvahebe8fehehgdkjlpco.apps.googleusercontent.com', // Ganti dengan Web Client ID dari Google Console
  //         scopes: ['https://www.googleapis.com/auth/fitness.activity.read'],
  //       });

  //       const isSignedIn = await GoogleSignin.getCurrentUser();
  //       if (!isSignedIn) {
  //         await GoogleSignin.signIn();
  //       }

  //       console.log('Google account signed in');

  //       if (Platform.OS === 'android') {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
  //         );
  //         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //           setAuthError('Activity recognition permission is required');
  //           return;
  //         }
  //       }

  //       const options = {
  //         scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_ACTIVITY_WRITE],
  //       };

  //       const authResult = await GoogleFit.authorize(options);

  //       if (authResult.success) {
  //         setIsAuthorized(true);
  //         setAuthError('');
  //         fetchHealthData();
  //       } else {
  //         setIsAuthorized(false);
  //         setAuthError(`Authorization failed: ${authResult.message}`);
  //       }
  //     } catch (error: any) {
  //       console.log('Login/Auth error:', error);
  //       setIsAuthorized(false);
  //       setAuthError(
  //         `Login/Auth error: ${error.message || JSON.stringify(error)}`,
  //       );
  //     }
  //   };

  //   initGoogleLoginAndFit();
  // }, []);

  // const fetchHealthData = () => {
  //   const today = new Date();
  //   const startDate = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate(),
  //   );
  //   const endDate = new Date();

  //   const options = {
  //     startDate: startDate.toISOString(),
  //     endDate: endDate.toISOString(),
  //   };

  //   // Steps
  //   GoogleFit.getDailyStepCountSamples(options)
  //     .then((results: DailyStepCountSample[]) => {
  //       const data = results.find(
  //         item => item.source === 'com.google.android.gms:estimated_steps',
  //       );
  //       if (data && data.steps && data.steps.length > 0) {
  //         const totalSteps = data.steps.reduce(
  //           (sum: number, step: StepData) => sum + step.value,
  //           0,
  //         );
  //         setSteps(totalSteps);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('Error fetching steps:', error);
  //     });

  //   // Distance
  //   GoogleFit.getDailyDistanceSamples(options)
  //     .then((results: DistanceSample[]) => {
  //       const totalDistance = results.reduce(
  //         (sum, item) => sum + item.distance,
  //         0,
  //       ); // meters
  //       setDistance(totalDistance);
  //     })
  //     .catch(error => {
  //       console.log('Error fetching distance:', error);
  //     });

  //   // Calories
  //   GoogleFit.getDailyCalorieSamples(options)
  //     .then((results: CalorieSample[]) => {
  //       const totalCalories = results.reduce(
  //         (sum, item) => sum + item.calorie,
  //         0,
  //       );
  //       setCalories(totalCalories);
  //     })
  //     .catch(error => {
  //       console.log('Error fetching calories:', error);
  //     });
  // };

  // const handleRetryAuth = () => {
  //   setAuthError('');
  //   setIsAuthorized(false);
  //   GoogleSignin.signOut().then(() => {
  //     GoogleSignin.signIn().then(() => {
  //       GoogleFit.authorize({
  //         scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_ACTIVITY_WRITE],
  //       }).then(authResult => {
  //         if (authResult.success) {
  //           setIsAuthorized(true);
  //           fetchHealthData();
  //         } else {
  //           setAuthError(`Authorization failed: ${authResult.message}`);
  //         }
  //       });
  //     });
  //   });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Fit Dashboard</Text>

      {/* {!isAuthorized && authError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{authError}</Text>
          <Text style={styles.helpText}>
            Make sure you have Google Fit installed and are signed in with a
            Google account.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryAuth}>
            <Text style={styles.retryButtonText}>Retry Authorization</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAuthorized && (
        <>
          <Text style={styles.label}>Steps: {steps}</Text>
          <Text style={styles.label}>
            Distance: {(distance / 1000).toFixed(2)} km
          </Text>
          <Text style={styles.label}>Calories: {calories.toFixed(2)} kcal</Text>
        </>
      )} */}
    </View>
  );
};

export default GoogleFitDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffcccc',
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#333333',
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
