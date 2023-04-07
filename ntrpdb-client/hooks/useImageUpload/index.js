// import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { IMAGE_UPLOAD } from "../../graphql/mutations/ImageUpload";
// import { NotificationContext, SET_NOTIFICATION } from "../../context/NotificationContext";

const useImageUploadMutation = () => {
  // const { dispatchNotification } = useContext(NotificationContext);
  const [imageUpload, { loading }] = useMutation(IMAGE_UPLOAD, {
    onCompleted: (data) => {
      console.log({ SUCCESS_IMAGE_UPLOAD: data });
    },
    onError: () => {
      console.log("ERROR IN IMAGE UPLOAD");
    },
  });

  return { imageUpload, loading };
};

export { useImageUploadMutation };
