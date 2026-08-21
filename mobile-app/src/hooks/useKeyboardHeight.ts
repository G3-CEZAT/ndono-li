import { useEffect, useState } from "react";
import { Keyboard, LayoutAnimation, Platform } from "react-native";

// KeyboardAvoidingView est peu fiable sur Android (surtout avec l'affichage edge-to-edge
// activé par défaut depuis RN 0.76+ / Expo SDK 52+) : on gère donc la remontée manuellement
// en écoutant la hauteur réelle du clavier.
export function useKeyboardHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return height;
}
