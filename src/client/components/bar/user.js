import React, { useState } from "react";
import { UploadAvatarMutation } from "../mutations/uploadAvatar";
import { AvatarUpload } from "../avatarModal";

export const UserBar = ({ user }) => {
  const [isOpen, setOpen] = useState(false);

  if (!user) return null;

  const showModal = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <div className="user">
      <img src={user.avatar} onClick={showModal} />
      <UploadAvatarMutation>
        <AvatarUpload isOpen={isOpen} showModal={showModal} />
      </UploadAvatarMutation>
      <span>{user.username}</span>
    </div>
  );
};
