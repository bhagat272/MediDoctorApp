// import { DeviceEventEmitter } from "react-native";
// import io, { Socket } from "socket.io-client";
// import { DEVICE_INFO, getDeviceUniqueId, socketInstance } from "./helper";
// import { kUserData, SOCKET_URL } from "../redux/apis/commonValue";
// import { getData } from "../redux/apis/keyChain";

// interface SocketEventType {
//   send_message: string;
//   getConversationList: string;
//   getchats: string;
//   delete_chat: string;
//   clear_group_chat: string;
//   user_block_unblock: string;
//   read_message: string;
//   seenGroupMessage: string;
//   notification_enable: string;
//   user_chat_screen: string;

//   // copy from git please filter
//   getGroupDetails: string;
//   getOnlineUser: string;

//   get_sticker_list: string;
//   total_unread_message: string;
//   // calling ----
//   reject_call: string;
//   call_disconnect: string;
//   accept_reject_call_request: string;
//   accept_call: string;
//   call_reject: string;
//   call_accepted: string;
//   call_connection: string;
//   receiver_call_connect: string;
//   accept_reject_call_listener: string;
//   call_disconnected: string;
//   call_rejected: string;
//   user_chat_screen_listener: string;
//   get_my_active_call: string;
// }

// export const socketEvent: SocketEventType = {
//   send_message: "send_message",
//   getConversationList: "getConversationList",
//   getchats: "getchats",
//   delete_chat: "delete-chat",
//   clear_group_chat: "clear_group_chat",
//   user_block_unblock: "user_block_unblock",
//   read_message: "read-message",
//   seenGroupMessage: "seenGroupMessage",
//   notification_enable: "notification_enable",
//   user_chat_screen: "user_chat_screen",

//   // copy from git please filter
//   getGroupDetails: "getGroupDetails",
//   getOnlineUser: "get-online-user",

//   get_sticker_list: "get-sticker-list",
//   total_unread_message: "total_unread_message",

//   // calling ---
//   reject_call: "reject_call",
//   call_disconnect: "call_disconnect",
//   accept_reject_call_request: "accept_reject_call_request",
//   accept_call: "accept_call",
//   call_reject: "call_reject",
//   //---------------Receiver listners
//   call_accepted: "call_accepted",
//   call_connection: "call_connection",
//   receiver_call_connect: "receiver_call_connect",
//   accept_reject_call_listener: "accept_reject_call_listener",
//   call_disconnected: "call_disconnected",
//   call_rejected: "call_rejected",
//   user_chat_screen_listener: "user_chat_screen_listener",
//   get_my_active_call: "get_my_active_call",
// };

// export const socketConnectionCheck = (): void => {
//   console.log("socket before");
//   if (socketInstance?.socket) {
//     console.log("after check socket Intance");
//     socketInstance.socket.connect();
//   } else {
//     socketInit();
//   }
// };

// export const socketInit = async (): Promise<void> => {
//   const uniqueId: string = await getDeviceUniqueId();
//   console.log("socket after");
//   const user: any = await getData(kUserData);
//   console.log("user", user);
//   console.log("uniqueId", uniqueId);
//   socketInstance.socket = io(SOCKET_URL, {
//     forceNew: true,
//     reconnection: true,
//     // Set the number of reconnection attempts (Infinity or a high number if desired)
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 3000,
//     transports: ["websocket"],
//     upgrade: false,
//     autoConnect: true,
//     timeout: 30000,
//     query: {
//       user_id: user?.id,
//       device_type: DEVICE_INFO.device_type,
//       device_unique_id: uniqueId,
//       device_token: DEVICE_INFO.device_token,
//     },
//   });
//   console.log(
//     `${SOCKET_URL}?user_id=${user?.id}` +
//       `&device_type=${DEVICE_INFO.device_type}` +
//       `&device_unique_id=${uniqueId}` +
//       `&device_token=${DEVICE_INFO.device_token}`,
//   );

//   // Event listener for a successful connection.
//   socketInstance.socket.on("connect", (data: any) => {
//     console.log("-------🚀🚀🚀------Socket connected----🚀🚀🚀🚀---");
//   });

//   // Optional: Listen for reconnection attempts to log the number of attempts.
//   socketInstance.socket.on("reconnect_attempt", (attempt: number) => {
//     console.log(`-------------Socket reconnect attempt ${attempt}-------`);
//   });

//   // Optional: Listen for errors during reconnection.
//   socketInstance.socket.on("reconnect_error", (error: any) => {
//     console.log("-------------Socket reconnect error-------", error);
//   });

//   // Optional: Listen for a failure to reconnect after all attempts.
//   socketInstance.socket.on("reconnect_failed", () => {
//     console.log("-------------Socket reconnect failed-------");
//   });

//   // Handle disconnection events.
//   socketInstance.socket.on("disconnect", (data: any) => {
//     console.log("-------------Socket disconnect-------");
//     // If not a custom disconnect, you can either rely on built-in reconnection or force reconnect.
//     if (!socketInstance?.isCustomDisconnect) {
//       console.log("-------------Socket attempting manual reconnect-------");
//       socketInstance.socket.connect();
//     }
//   });

//   // Listen for connection errors.
//   socketInstance.socket.on("connect_error", (error: any) => {
//     console.log("-------------connect_error-------", error);
//   });

//   socketInstance.socket.on("error", (data: any) => {
//     console.log("-------------error-------", data);
//   });

//   // Listen for custom events and emit them via DeviceEventEmitter.
//   socketInstance.socket.on("receive_message", (response: any) => {
//     console.log("receive_message------111---", response);

//     DeviceEventEmitter.emit("receive_message", response);
//   });

//   socketInstance.socket.on("user_blocked", (response: any) => {
//     DeviceEventEmitter.emit("user_blocked", response);
//   });

//   // new listnerss please filter and remove

//   // calling ------------

//   socketInstance.socket.on(
//     socketEvent.accept_reject_call_listener,
//     (data: any) => {
//       DeviceEventEmitter.emit(socketEvent.accept_reject_call_listener, data);
//     },
//   );

//   socketInstance.socket.on(socketEvent.receiver_call_connect, (data: any) => {
//     DeviceEventEmitter.emit(socketEvent.receiver_call_connect, data);
//   });

//   socketInstance.socket.on(socketEvent.call_disconnected, (data: any) => {
//     DeviceEventEmitter.emit(socketEvent.call_disconnected, data);
//   });

//   socketInstance.socket.on(socketEvent.call_accepted, (data: any) => {
//     DeviceEventEmitter.emit(socketEvent.call_accepted, data);
//   });

//   socketInstance.socket.on(socketEvent.call_rejected, (data: any) => {
//     DeviceEventEmitter.emit(socketEvent.call_rejected, data);
//   });
// };

// export const ensureSocketConnected = (): void => {
//   if (!socketIsConnected() && socketInstance.socket) {
//     socketInstance.socket.connect();
//   }
// };

// export const socketReconnect = (): void => {
//   if (socketInstance.socket && !socketInstance.socket.connected) {
//     socketInstance.socket.connect();
//   }
// };

// export const socketCustomDisconnect = (): void => {
//   socketInstance.isCustomDisconnect = true;
//   if (socketInstance.socket) {
//     socketInstance.socket.disconnect();
//   }
// };
// export const socketCustomLogoutDisconnect = (): void => {
//   socketInstance.isCustomDisconnect = true;
//   if (socketInstance.socket) {
//     socketInstance.socket.disconnect();
//     socketInstance.socket = null;
//   }
// };

// export const socketIsConnected = (): boolean | undefined => {
//   return socketInstance.socket?.connected;
// };

// export const socketEmit = (
//   name: string,
//   request: any,
//   cb?: (response: any) => void,
// ): void => {
//   console.log("socketEmit-----", name, "----", request);
//   if (!socketIsConnected()) {
//     socketCustomDisconnect();
//     socketConnectionCheck();
//   }
//   socketInstance?.socket?.emit(name, request, cb);
// };

import { DeviceEventEmitter } from "react-native";
import io, { Socket } from "socket.io-client";
import { DEVICE_INFO, getDeviceUniqueId, socketInstance } from "./helper";
import { kUserData, SOCKET_URL } from "../redux/apis/commonValue";
import { getData } from "../redux/apis/keyChain";

interface SocketEventType {
  send_message: string;
  getConversationList: string;
  getchats: string;
  delete_chat: string;
  clear_group_chat: string;
  user_block_unblock: string;
  read_message: string;
  seenGroupMessage: string;
  notification_enable: string;
  user_chat_screen: string;
  getGroupDetails: string;
  getOnlineUser: string;
  get_sticker_list: string;
  total_unread_message: string;
  reject_call: string;
  call_disconnect: string;
  accept_reject_call_request: string;
  accept_call: string;
  call_reject: string;
  call_accepted: string;
  call_connection: string;
  receiver_call_connect: string;
  accept_reject_call_listener: string;
  call_disconnected: string;
  call_rejected: string;
  user_chat_screen_listener: string;
  get_my_active_call: string;
}

export const socketEvent: SocketEventType = {
  send_message: "send_message",
  getConversationList: "getConversationList",
  getchats: "getchats",
  delete_chat: "delete-chat",
  clear_group_chat: "clear_group_chat",
  user_block_unblock: "user_block_unblock",
  read_message: "read-message",
  seenGroupMessage: "seenGroupMessage",
  notification_enable: "notification_enable",
  user_chat_screen: "user_chat_screen",
  getGroupDetails: "getGroupDetails",
  getOnlineUser: "get-online-user",
  get_sticker_list: "get-sticker-list",
  total_unread_message: "total_unread_message",
  reject_call: "reject_call",
  call_disconnect: "call_disconnect",
  accept_reject_call_request: "accept_reject_call_request",
  accept_call: "accept_call",
  call_reject: "call_reject",
  call_accepted: "call_accepted",
  call_connection: "call_connection",
  receiver_call_connect: "receiver_call_connect",
  accept_reject_call_listener: "accept_reject_call_listener",
  call_disconnected: "call_disconnected",
  call_rejected: "call_rejected",
  user_chat_screen_listener: "user_chat_screen_listener",
  get_my_active_call: "get_my_active_call",
};

// 🔹 Queue for messages that need to be sent when socket connects
let messageQueue: Array<{
  name: string;
  request: any;
  cb?: (response: any) => void;
}> = [];

export const socketConnectionCheck = (): void => {
  if (socketInstance?.socket) {
    if (!socketInstance.socket.connected) {
      socketInstance.socket.connect();
    }
  } else {
    socketInit();
  }
};

export const socketInit = async (): Promise<void> => {
  console.log("socket init log", socketInstance.socket)
  // 🔹 Don't reinitialize if socket already exists and is connected
  if (socketInstance.socket?.connected) {
    console.log("✅ Socket already connected, skipping init");
    return;
  }

  const uniqueId: string = await getDeviceUniqueId();
  const user: any = await getData(kUserData);

  if (!user?.id) {
    console.log("❌ No user data found, cannot initialize socket");
    return;
  }

  console.log("🔄 Initializing socket...");
  console.log("user", user);
  console.log("uniqueId", uniqueId);

  // 🔹 Reset custom disconnect flag
  socketInstance.isCustomDisconnect = false;

  socketInstance.socket = io(SOCKET_URL, {
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    transports: ["websocket"],
    upgrade: false,
    autoConnect: true,
    timeout: 30000,
    query: {
      user_id: user?.id,
      device_type: DEVICE_INFO.device_type,
      device_unique_id: uniqueId,
      device_token: DEVICE_INFO.device_token,
    },
  });

  console.log(
    `${SOCKET_URL}?user_id=${user?.id}` +
    `&device_type=${DEVICE_INFO.device_type}` +
    `&device_unique_id=${uniqueId}` +
    `&device_token=${DEVICE_INFO.device_token}`,
  );

  // 🔹 Event listener for a successful connection
  socketInstance.socket.on("connect", (data: any) => {
    console.log("-------🚀🚀🚀------Socket connected----🚀🚀🚀🚀---");

    // 🔹 Process queued messages when socket connects
    if (messageQueue.length > 0) {
      console.log(`📤 Sending ${messageQueue.length} queued messages...`);
      messageQueue.forEach(({ name, request, cb }) => {
        socketInstance.socket?.emit(name, request, cb);
      });
      messageQueue = [];
    }
  });

  socketInstance.socket.on("reconnect_attempt", (attempt: number) => {
    console.log(`-------------Socket reconnect attempt ${attempt}-------`);
  });

  socketInstance.socket.on("reconnect_error", (error: any) => {
    console.log("-------------Socket reconnect error-------", error);
  });

  socketInstance.socket.on("reconnect_failed", () => {
    console.log("-------------Socket reconnect failed-------");
  });

  socketInstance.socket.on("disconnect", (data: any) => {
    console.log("-------------Socket disconnect-------");
    // socketInstance.socket = null
    // if (!socketInstance?.isCustomDisconnect) {
    //   console.log("-------------Socket attempting manual reconnect-------");
    //   socketInstance.socket.connect();
    // }
  });

  socketInstance.socket.on("connect_error", (error: any) => {
    console.log("-------------connect_error-------", error);
  });

  socketInstance.socket.on("error", (data: any) => {
    console.log("-------------error-------", data);
  });

  socketInstance.socket.on("receive_message", (response: any) => {
    console.log("receive_message------111---", response);
    DeviceEventEmitter.emit("receive_message", response);
  });

  socketInstance.socket.on("user_blocked", (response: any) => {
    DeviceEventEmitter.emit("user_blocked", response);
  });

  // Calling listeners
  socketInstance.socket.on(
    socketEvent.accept_reject_call_listener,
    (data: any) => {
      DeviceEventEmitter.emit(socketEvent.accept_reject_call_listener, data);
    },
  );

  socketInstance.socket.on(socketEvent.receiver_call_connect, (data: any) => {
    DeviceEventEmitter.emit(socketEvent.receiver_call_connect, data);
  });

  socketInstance.socket.on(socketEvent.call_disconnected, (data: any) => {
    DeviceEventEmitter.emit(socketEvent.call_disconnected, data);
  });

  socketInstance.socket.on(socketEvent.call_accepted, (data: any) => {
    DeviceEventEmitter.emit(socketEvent.call_accepted, data);
  });

  socketInstance.socket.on(socketEvent.call_rejected, (data: any) => {
    DeviceEventEmitter.emit(socketEvent.call_rejected, data);
  });
};

// 🔹 NEW: Wait for socket to be connected with timeout
export const waitForSocketConnection = (
  timeoutMs: number = 5000,
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (socketIsConnected()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (socketIsConnected()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(checkInterval);
        console.log("⚠️ Socket connection timeout");
        resolve(false);
      }
    }, 100);
  });
};

// 🔹 NEW: Ensure socket is connected
export const ensureSocketConnected = async (): Promise<boolean> => {
  if (socketIsConnected()) {
    return true;
  }

  if (!socketInstance.socket) {
    console.log("🔄 Socket doesn't exist, initializing...");
    await socketInit();
  } else if (!socketInstance.socket.connected) {
    console.log("🔄 Socket disconnected, reconnecting...");
    socketInstance.isCustomDisconnect = false;
    socketInstance.socket.connect();
  }

  // Wait for connection
  return await waitForSocketConnection();
};

export const socketReconnect = (): void => {
  console.log("Socket file data", socketInstance.socket)
  if (socketInstance.socket && !socketInstance.socket.connected) {
    socketInstance.isCustomDisconnect = false;
    socketInstance.socket.connect();
  }
};

export const socketCustomDisconnect = (): void => {
  socketInstance.isCustomDisconnect = true;
  if (socketInstance.socket) {
    socketInstance.socket.disconnect();
  }
};

export const socketCustomLogoutDisconnect = (): void => {
  socketInstance.isCustomDisconnect = true;
  if (socketInstance.socket) {
    socketInstance.socket.disconnect();
    socketInstance.socket = null;
  }
  messageQueue = [];
};

export const socketIsConnected = (): boolean | undefined => {
  return socketInstance.socket?.connected;
};

// 🔹 UPDATED: socketEmit with queue support
export const socketEmit = (
  name: string,
  request: any,
  cb?: (response: any) => void,
): void => {
  console.log("socketEmit-----", name, "----", request);

  if (!socketIsConnected()) {
    console.log("⚠️ Socket not connected, adding to queue...");

    // Add to queue
    messageQueue.push({ name, request, cb });

    // Try to connect
    if (!socketInstance.socket) {
      socketInit();
    } else {
      socketInstance.isCustomDisconnect = false;
      socketInstance.socket.connect();
    }

    return;
  }

  // Socket is connected, emit immediately
  socketInstance?.socket?.emit(name, request, cb);
};

// 🔹 NEW: socketEmitAsync - Returns a promise that resolves when socket is connected
export const socketEmitAsync = async (
  name: string,
  request: any,
): Promise<boolean> => {
  console.log("socketEmitAsync-----", name, "----", request);

  // Ensure socket is connected
  const isConnected = await ensureSocketConnected();

  if (!isConnected) {
    console.log("❌ Failed to connect socket");
    return false;
  }

  // Emit the event
  socketInstance?.socket?.emit(name, request);
  return true;
};
