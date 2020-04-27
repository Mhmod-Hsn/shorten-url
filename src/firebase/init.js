import firebase from '@firebase/app';
import '@firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCX8ZmD7jvx0IyIHnoBLRWyoSzCQ3Y0peo",
  authDomain: "lnk-shrt.firebaseapp.com",
  databaseURL: "https://lnk-shrt.firebaseio.com",
  projectId: "lnk-shrt",
  storageBucket: "lnk-shrt.appspot.com",
  messagingSenderId: "521812384267",
  appId: "1:521812384267:web:28f1f377b694c6cc82450e"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// export firestore database
export default firebaseApp.firestore()
