import { useContext } from "react";
import { Card, Layout, Typography, Spin } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { useLinkedInLogin } from "../../hooks/useLinkedInLogin";
import { useFacebookLogin } from "../../hooks/useFacebookLogin";
import UserContext from "../../context/UserContext";
import { NotificationContext, SET_NOTIFICATION } from "../../context/NotificationContext";

const { Content } = Layout;
const { Text, Title } = Typography;

const Signin = () => {
  const { setUser } = useContext(UserContext);
  const { dispatchNotification } = useContext(NotificationContext);
  const router = useRouter();

  const onCompletedGoogle = (data) => {
    if (data && data.logInGoogle && data.logInGoogle.token) {
      setUser(data.logInGoogle);
      const { id, token } = data.logInGoogle;
      sessionStorage.setItem("token", token);
      dispatchNotification({
        type: SET_NOTIFICATION,
        payload: {
          open: true,
          status: "success",
          message: "You are successfully signed in",
        },
      });
      sessionStorage.removeItem("loginType");
      router.push(`/user/${id}`);
    }
  };

  const onError = () => {
    dispatchNotification({
      type: SET_NOTIFICATION,
      payload: {
        open: true,
        status: "error",
        message: "We could not sign you in",
      },
    });
  };

  const onCompletedLinkedIn = (data) => {
    console.log({ insideLIOnCompleted: data });
    if (data && data.logInLinkedIn && data.logInLinkedIn.token) {
      setUser(data.logInLinkedIn);
      const { id, token } = data.logInLinkedIn;
      sessionStorage.setItem("token", token);
      dispatchNotification({
        type: SET_NOTIFICATION,
        payload: {
          open: true,
          status: "success",
          message: "You are successfully signed in",
        },
      });
      sessionStorage.removeItem("loginType");
      router.push(`/user/${id}`);
    }
  };

  const onCompletedFacebook = (data) => {
    if (data && data.logInFacebook && data.logInFacebook.token) {
      setUser(data.logInFacebook);
      const { id, token } = data.logInFacebook;
      console.log({ id, token });
      sessionStorage.setItem("token", token);
      dispatchNotification({
        type: SET_NOTIFICATION,
        payload: {
          open: true,
          status: "success",
          message: "You are successfully signed in",
        },
      });
      sessionStorage.removeItem("loginType");
      router.push(`/user/${id}`);
    }
  };

  const { loadGoogleAuthUrl, logInGoogleLoading } = useGoogleLogin({
    onCompleted: onCompletedGoogle,
    onError,
  });

  const { loadLinkedInAuthUrl, logInLinkedInLoading } = useLinkedInLogin({
    onCompleted: onCompletedLinkedIn,
    onError,
  });

  const { loadFacebookAuthUrl, logInFacebookLoading } = useFacebookLogin({
    onCompleted: onCompletedFacebook,
    onError,
  });

  if (logInGoogleLoading || logInLinkedInLoading || logInFacebookLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Loggin you in..." />
      </Content>
    );
  }

  return (
    <Content className="log-in">
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Login to NTRPDB!
          </Title>
        </div>
        <button
          className="log-in-card__button log-in-card__google"
          onClick={() => {
            sessionStorage.setItem("loginType", "google");
            loadGoogleAuthUrl();
          }}
        >
          <Image
            src="/images/google_logo.jpg"
            alt="Google Logo"
            className="log-in-card__button-logo"
            width="43"
            height="43"
          />
          <span className="log-in-card__button-text">Sign in with Google</span>
        </button>
        <button
          className="log-in-card__button log-in-card__linkedin"
          onClick={() => {
            sessionStorage.setItem("loginType", "linkedIn");
            loadLinkedInAuthUrl();
          }}
        >
          <Image
            src="/images/linkedIn_logo.jpg"
            alt="LinkedIn Logo"
            className="log-in-card__button-logo"
            width="43"
            height="43"
          />
          <span className="log-in-card__button-text">Sign in with LinkedIn</span>
        </button>
        <button
          className="log-in-card__button log-in-card__facebook"
          onClick={() => {
            sessionStorage.setItem("loginType", "facebook");
            loadFacebookAuthUrl();
          }}
        >
          <Image
            src="/images/facebook_logo.png"
            alt="Google Logo"
            className="log-in-card__button-logo"
            width="43"
            height="43"
          />
          <span className="log-in-card__button-text">Sign in with Facebook</span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the consent form to sign in with your
          account.
        </Text>
      </Card>
    </Content>
  );
};

export default Signin;
