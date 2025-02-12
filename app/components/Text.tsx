/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { Text as TextReact } from "react-native";
import { remapProps } from "nativewind";

const Text = (props: any) => {  
  return (
    <TextReact {...props} style={[{ fontFamily: "Ubuntu" }, props.style]}>
      {props.children}
    </TextReact>
  );
};

export default Text;
