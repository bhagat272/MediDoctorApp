import { LinkingOptions } from "@react-navigation/native";

export const linking: any = {
  prefixes: ["medidoctor://"],

  config: {
    screens: {
      Home: "Home",

      IncomingCallScreen: {
        path: "incoming-call",
        parse: {
          callId: (callId: string) => callId,
        },
      },

      CallScreen: {
        path: "call-screen",
        parse: {
          roomId: (roomId: string) => roomId,
        },
      },
    },
  },
};
