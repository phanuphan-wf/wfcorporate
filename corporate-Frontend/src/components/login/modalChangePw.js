import React, { useState, useEffect } from "react";
import Axios from "axios";
import CryptoJS from "crypto-js";

export default function ModalChangePassword(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    props.show && setUser(props.user);
  }, [props.show]);

  const changePassword = async () => {
    const oldPassword = CryptoJS.MD5(
      document.getElementById("oldPassword").value
    ).toString();
    const newPassword = CryptoJS.MD5(
      document.getElementById("newPassword").value
    ).toString();
    const confirmPassword = CryptoJS.MD5(
      document.getElementById("confirmPassword").value
    ).toString();

    if (oldPassword !== user.Password) {
      alert("Old Password is incorrect");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match");
      return;
    }

    const data = {
      User: user.User,
      Password: oldPassword,
      NewPassword: newPassword,
    };

    try {
      const res = await Axios.post(
        process.env.REACT_APP_API_URI +
          process.env.REACT_APP_admin +
          "/changepw",
        data
      ).then((res) => {
        if (res.data.code === 202) {
          alert("Password changed successfully");
          props.onHide();
          document.getElementById("oldPassword").value = "";
          document.getElementById("newPassword").value = "";
          document.getElementById("confirmPassword").value = "";
        }
      });
    } catch (err) {
      alert("Error changing password - " + err.message);
    }
  };

  return (
    <div
      id="modalChangePassword"
      tabIndex="-1"
      className={`fixed top-0 left-0 right-0 z-[99] w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-900 bg-opacity-50 ${
        props.show ? "" : "hidden"
      }`}
    >
      <div className="modal-dialog w-1/3 h-fit bg-white px-5 py-3 rounded absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="modal-content">
          <div className="modal-header flex justify-between border-b mb-3">
            <h5 className="modal-title" id="modalChangePasswordLabel">
              Change Password
            </h5>
            <button
              type="button"
              className="text-lg text-gray-400"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={props.onHide}
            >
              X
            </button>
          </div>
          <div className="modal-body flex flex-col gap-2 mb-4">
            <div className="form-group flex gap-3">
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                placeholder="Old Password"
              />
            </div>
            <div className="form-group flex gap-3">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="New Password"
              />
            </div>
            <div className="form-group flex gap-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div className="modal-footer flex gap-4 justify-end w-full border-t py-2">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={props.onHide}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => changePassword()}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
