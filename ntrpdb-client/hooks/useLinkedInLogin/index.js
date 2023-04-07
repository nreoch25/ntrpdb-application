import { useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LINKEDIN_AUTH_URL } from "../../graphql/queries/LinkedInAuthUrl";
import { LOG_IN_LINKEDIN } from "../../graphql/mutations/LogInLinkedIn";

const useLinkedInLogin = ({ onCompleted, onError }) => {
  const [loadLinkedInAuthUrl, { data: linkedInAuthUrlData, error: linkedInAuthUrlError }] =
    useLazyQuery(LINKEDIN_AUTH_URL);

  const [
    logInLinkedIn,
    { data: logInLinkedInData, loading: logInLinkedInLoading, error: logInLinkedInError },
  ] = useMutation(LOG_IN_LINKEDIN, {
    onCompleted,
    onError,
  });

  const logInLinkedInRef = useRef(logInLinkedIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const loginType = sessionStorage.getItem("loginType");

    console.log({ code, loginType });

    if (code && loginType === "linkedIn") {
      logInLinkedInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (linkedInAuthUrlData?.linkedInAuthUrl) {
      window.location.href = linkedInAuthUrlData.linkedInAuthUrl;
    }
    if (linkedInAuthUrlError) {
      onError();
    }
  }, [linkedInAuthUrlData, linkedInAuthUrlError]);

  return { loadLinkedInAuthUrl, logInLinkedInData, logInLinkedInLoading, logInLinkedInError };
};

export { useLinkedInLogin };
