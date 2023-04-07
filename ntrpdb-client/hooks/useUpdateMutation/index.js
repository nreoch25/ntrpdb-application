import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../graphql/mutations/UpdateUser";
import { NotificationContext, SET_NOTIFICATION } from "../../context/NotificationContext";
import { CURRENT_USER } from "../../graphql/queries/CurrentUser";

const useUpdateUserMutation = ({ setEditMode }) => {
  const { dispatchNotification } = useContext(NotificationContext);
  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (data && data.updateUser && data.updateUser.success) {
        setEditMode(false);
        dispatchNotification({
          type: SET_NOTIFICATION,
          payload: {
            open: true,
            status: "success",
            message: "You successfully updated your profile",
          },
        });
      }
    },
    onError: () => {
      dispatchNotification({
        type: SET_NOTIFICATION,
        payload: {
          open: true,
          status: "error",
          message: "We could not update your profile",
        },
      });
    },
    refetchQueries: [CURRENT_USER],
  });

  return { updateUser, loading };
};

export { useUpdateUserMutation };
