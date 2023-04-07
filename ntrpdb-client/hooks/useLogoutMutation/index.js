import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { LOG_OUT } from "../../graphql/mutations/LogOut";
import { NotificationContext, SET_NOTIFICATION } from "../../context/NotificationContext";

const useLogoutMutation = ({ setUser }) => {
  const { dispatchNotification } = useContext(NotificationContext);
  const router = useRouter();
  const [logOut] = useMutation(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setUser(null);
        sessionStorage.removeItem("token");
        dispatchNotification({
          type: SET_NOTIFICATION,
          payload: {
            open: true,
            status: "success",
            message: "You are successfully signed out",
          },
        });
        router.push("/login");
      }
    },
    onError: () => {
      dispatchNotification({
        type: SET_NOTIFICATION,
        payload: {
          open: true,
          status: "error",
          message: "We could not sign you out",
        },
      });
    },
  });

  const handleLogout = () => {
    logOut();
  };

  return { handleLogout };
};

export { useLogoutMutation };
