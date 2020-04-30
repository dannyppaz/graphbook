import React, { Component } from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { Loading } from "../loading";
import { Error } from "../error";

const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      username
      avatar
    }
  }
`;

const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) {
      filename
      url
    }
  }
`;

export const UploadAvatarMutation = ({ children }) => {
  const [uploadAvatar, { loading, error, data }] = useMutation(UPLOAD_AVATAR, {
    update: (cache, { data: { uploadAvatar } }) => {
      try {
        const query = { query: GET_CURRENT_USER };
        const { currentUser } = cache.readQuery(query);
        const newData = {
          currentUser: { ...currentUser, ...{ avatar: uploadAvatar.url } },
        };
        cache.writeData({ ...query, data: newData });
      } catch (error) {
        console.error("Error when uploading avatar: ", error);
      }
    },
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { uploadAvatar })
  );
};
