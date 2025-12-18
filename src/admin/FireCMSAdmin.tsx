import { useCallback } from "react";
import {
  Scaffold,
  AppBar,
  Drawer,
  NavigationRoutes,
  SideDialogs,
  FireCMS,
  useBuildNavigationController,
  Authenticator,
  useValidateAuthenticator,
} from "@firecms/core";
import {
  FirebaseAuthController,
  FirebaseLoginView,
  FirebaseSignInProvider,
  FirebaseUserWrapper,
  useFirebaseAuthController,
  useFirebaseStorageSource,
  useFirestoreDelegate,
  useInitialiseFirebase,
  useAppCheck,
} from "@firecms/firebase";
import { ReCaptchaEnterpriseProvider } from "@firebase/app-check";

import { sessionsCollection, recipesCollection, chatSessionsCollection } from "./collections";
import schoolfruitLogo from "../assets/schoolfruit-logo.png";

import "./admin.css";

// Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: "AIzaSyCDggrdZnKpTZPQztoWoQwrbH2l_jr9G_A",
  authDomain: "fruitvriendjes-35c8c.firebaseapp.com",
  projectId: "fruitvriendjes-35c8c",
  storageBucket: "fruitvriendjes-35c8c.firebasestorage.app",
  messagingSenderId: "104281679692",
  appId: "1:104281679692:web:6754372d57f65ed53e11e9",
  measurementId: "G-P1C709MBME"
};

// All collections for the CMS
const collections = [
  sessionsCollection,
  recipesCollection,
  chatSessionsCollection,
];

// Sign in providers - only Google and email/password (no anonymous)
const signInOptions: FirebaseSignInProvider[] = [
  "google.com",
  "password",
];

export function FireCMSAdmin() {
  // Authenticator to reject anonymous users
  const myAuthenticator: Authenticator<FirebaseUserWrapper> = useCallback(async ({
    user,
    authController
  }) => {
    // Reject if no user
    if (!user) {
      return false;
    }

    // Reject anonymous users
    if (user.isAnonymous) {
      throw Error("Anonymous users are not allowed to access the admin panel. Please sign in with Google or email/password.");
    }

    // Reject users without email (additional safety check)
    if (!user.email) {
      throw Error("Users without an email address cannot access the admin panel.");
    }

    console.log("🔐 Admin access granted to:", user.email);
    return true;
  }, []);

  // Initialize Firebase
  const { firebaseApp, firebaseConfigLoading, configError } = useInitialiseFirebase({
    firebaseConfig,
  });

  // App Check
  const { loading: appCheckLoading } = useAppCheck({
    firebaseApp,
    options: {
      provider: new ReCaptchaEnterpriseProvider("6LcQeC4sAAAAAIcJR51ruWdvVg16DQYMgNsrmLsT"),
      isTokenAutoRefreshEnabled: true,
    },
  });

  // Auth controller with authenticator
  const authController: FirebaseAuthController = useFirebaseAuthController({
    firebaseApp,
    signInOptions,
  });

  // Firestore delegate
  const firestoreDelegate = useFirestoreDelegate({
    firebaseApp,
  });

  // Storage source
  const storageSource = useFirebaseStorageSource({
    firebaseApp,
  });

  // Navigation controller
  const navigationController = useBuildNavigationController({
    collections,
    authController,
    dataSourceDelegate: firestoreDelegate,
    basePath: "/admin",
  });

  // Validate authenticator - reject anonymous users
  const {
    canAccessMainView,
    authLoading,
    notAllowedError,
  } = useValidateAuthenticator({
    authController,
    authenticator: myAuthenticator,
    dataSourceDelegate: firestoreDelegate,
    storageSource,
  });

  if (firebaseConfigLoading || appCheckLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center text-red-600">
          <p>Error loading Firebase configuration</p>
          <p className="text-sm">{configError}</p>
        </div>
      </div>
    );
  }

  return (
    <FireCMS
      authController={authController}
      navigationController={navigationController}
      dataSourceDelegate={firestoreDelegate}
      storageSource={storageSource}
    >
      {({ context, loading }) => {
        if (loading) {
          return (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          );
        }

        // Show login if not authenticated OR if user cannot access main view (e.g., anonymous user)
        if (!context.authController.user || !canAccessMainView) {
          return (
            <FirebaseLoginView
              authController={authController}
              firebaseApp={firebaseApp!}
              signInOptions={signInOptions}
              notAllowedError={notAllowedError || context.authController.authError}
              logo={schoolfruitLogo}
              disableSignupScreen={true}
              disableResetPassword={true}
            />
          );
        }

        return (
          <Scaffold autoOpenDrawer={false} logo={schoolfruitLogo}>
            <AppBar title="Fruitvriendjes Admin" includeModeToggle={false} />
            <Drawer />
            <NavigationRoutes />
            <SideDialogs />
          </Scaffold>
        );
      }}
    </FireCMS>
  );
}

export default FireCMSAdmin;
