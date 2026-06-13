import React from "react";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

const KeyboardScroll = (
  props: React.JSX.IntrinsicAttributes &
    React.JSX.IntrinsicClassAttributes<KeyboardAwareScrollView> &
    Readonly<KeyboardAwareScrollViewProps>,
) => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={70}
      extraHeight={190}
      keyboardOpeningTime={0}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      {...props}
    >
      {props.children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardScroll;
