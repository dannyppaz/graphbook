import React, { Component, useState } from "react";
import Modal from "react-modal";
import DropNCrop from "@synapsestudios/react-drop-n-crop";

Modal.setAppElement("#root");
const modalStyle = {
  content: {
    width: "400px",
    height: "450px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var ia = new Uint8Array(byteString.length);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const file = new Blob([ia], { type: mimeString });
  return file;
}

export const AvatarUpload = ({ isOpen, showModal, uploadAvatar }) => {
  const [state, setState] = useState({
    result: null,
    filename: null,
    filetype: null,
    src: null,
    error: null,
  });

  const onChange = (value) => {
    setState(value);
  };

  const uploadAvatarFn = () => {
    var file = dataURItoBlob(state.result);
    file.name = state.filename;
    uploadAvatar({ variables: { file } }).then(() => {
      showModal();
    });
  };

  const changeImage = () => {
    setState((prevState) => ({ ...prevState, ...{ src: null } }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={showModal}
      contentLabel="Change avatar"
      style={modalStyle}
    >
      <DropNCrop onChange={onChange} value={state} />
      {state.src !== null && (
        <button className="cancelUpload" onClick={changeImage}>
          Change image
        </button>
      )}
      <button className="uploadAvatar" onClick={uploadAvatarFn}>
        Save
      </button>
    </Modal>
  );
};
