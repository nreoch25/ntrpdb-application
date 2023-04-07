import { useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GOOGLE_AUTH_URL } from "../../graphql/queries/GoogleAuthUrl";
import { LOG_IN_GOOGLE } from "../../graphql/mutations/LogInGoogle";

const useGoogleLogin = ({ onCompleted, onError }) => {
  const [loadGoogleAuthUrl, { data: googleAuthUrlData, error: googleAuthUrlError }] =
    useLazyQuery(GOOGLE_AUTH_URL);

  console.log({ googleAuthUrlData, googleAuthUrlError });

  const [
    logInGoogle,
    { data: logInGoogleData, loading: logInGoogleLoading, error: logInGoogleError },
  ] = useMutation(LOG_IN_GOOGLE, {
    onCompleted,
    onError,
  });

  const logInGoogleRef = useRef(logInGoogle);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const loginType = sessionStorage.getItem("loginType");

    if (code && loginType === "google") {
      logInGoogleRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (googleAuthUrlData?.googleAuthUrl) {
      window.location.href = googleAuthUrlData.googleAuthUrl;
    }
    if (googleAuthUrlError) {
      onError();
    }
  }, [googleAuthUrlData, googleAuthUrlError]);

  return { loadGoogleAuthUrl, logInGoogleData, logInGoogleLoading, logInGoogleError };
};

export { useGoogleLogin };
