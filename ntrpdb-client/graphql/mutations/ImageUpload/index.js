import { gql } from "@apollo/client";

export const IMAGE_UPLOAD = gql`
  mutation ImageUpload($file: Upload!) {
    imageUpload(file: $file) {
      filename
    }
  }
`;
