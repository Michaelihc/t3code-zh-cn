import { localizeMobileString } from "../../i18n/mobileStrings";
import { Platform, Switch } from "react-native";

import { NativeSwitch } from "./NativeSwitch";
import type { ThemedSwitchProps } from "./NativeSwitch.types";

export type { ThemedSwitchProps } from "./NativeSwitch.types";

export function ThemedSwitch(props: ThemedSwitchProps) {
  const localizedProps = {
    ...props,
    accessibilityLabel:
      props.accessibilityLabel === undefined
        ? undefined
        : localizeMobileString(props.accessibilityLabel),
    accessibilityHint:
      props.accessibilityHint === undefined
        ? undefined
        : localizeMobileString(props.accessibilityHint),
  };
  if (Platform.OS === "android") {
    return <NativeSwitch {...localizedProps} />;
  }

  return (
    <Switch
      {...localizedProps}
      ios_backgroundColorClassName="accent-switch-inactive-track"
      trackColorOffClassName="accent-switch-inactive-track"
      trackColorOnClassName="accent-switch-active-track"
    />
  );
}
