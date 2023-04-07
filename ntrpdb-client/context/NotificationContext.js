import React, { useReducer, createContext, useEffect } from "react";
import { notification } from "antd";

const NotificationContext = createContext();

const SET_NOTIFICATION = "SET_NOTIFICATION";

const defaultNotification = {
  open: false,
  status: "",
  message: "",
};

const reducer = (state, action) => {
  const { status, message, open } = action.payload;

  switch (action.type) {
    case SET_NOTIFICATION:
      return { status, message, open };

    default:
      return state;
  }
};

const NotificationProvider = ({ children }) => {
  const [notify, dispatchNotification] = useReducer(reducer, defaultNotification);

  useEffect(() => {
    if (notify.open) {
      notification[notify.status]({
        message: notify.message,
        onClose: () => {
          dispatchNotification({
            type: SET_NOTIFICATION,
            payload: {
              open: false,
              status: "",
              message: "",
            },
          });
        },
      });
    }
  }, [notify.open, notify.status, notify.message]);

  return (
    <NotificationContext.Provider value={{ dispatchNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider, SET_NOTIFICATION };
