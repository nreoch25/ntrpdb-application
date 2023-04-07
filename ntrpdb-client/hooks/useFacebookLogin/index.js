import { useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FACEBOOK_AUTH_URL } from "../../graphql/queries/FacebookAuthUrl";
import { LOG_IN_FACEBOOK } from "../../graphql/mutations/LogInFacebook";

const useFacebookLogin = ({ onCompleted, onError }) => {
  const [loadFacebookAuthUrl, { data: facebookAuthUrlData, error: facebookAuthUrlError }] =
    useLazyQuery(FACEBOOK_AUTH_URL);

  const [
    logInFacebook,
    { data: logInFacebookData, loading: logInFacebookLoading, error: logInFacebookError },
  ] = useMutation(LOG_IN_FACEBOOK, {
    onCompleted,
    onError,
  });

  const logInFacebookRef = useRef(logInFacebook);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const loginType = sessionStorage.getItem("loginType");

    if (code && loginType === "facebook") {
      logInFacebookRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (facebookAuthUrlData?.facebookAuthUrl) {
      window.location.href = facebookAuthUrlData.facebookAuthUrl;
    }
    if (facebookAuthUrlError) {
      onError();
    }
  }, [facebookAuthUrlData, facebookAuthUrlError]);

  return { loadFacebookAuthUrl, logInFacebookData, logInFacebookLoading, logInFacebookError };
};

export { useFacebookLogin };
