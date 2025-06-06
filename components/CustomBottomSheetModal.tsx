import React, { useCallback, useImperativeHandle, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export type OptionItem = {
  id: string;
  label: string;
  iconName: string;
  onPress: () => void;
  destructive?: boolean;
};

type CustomBottomSheetModalProps2 = {
  options: OptionItem[];
};

type CustomBottomSheetModalProps = {
  options: OptionItem[];
};

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

const CustomBottomSheetModal = React.forwardRef<
  BottomSheetRef,
  CustomBottomSheetModalProps
>(({ options }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const handleSheetChanges = useCallback((index: number) => {
    console.log("BottomSheet Index:", index);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleOptionPress = (option: OptionItem) => {
    bottomSheetModalRef.current?.dismiss();
    option.onPress();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#161622" }}
      handleIndicatorStyle={{ backgroundColor: "#CDCDE0" }}
    >
      <BottomSheetView className="flex-1 p-4">
        {options.map((option) => (
          <Pressable
            key={option.id}
            className="py-3"
            onPress={() => handleOptionPress(option)}
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: "#CDCDE0",
            }}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons
                name={option.iconName}
                size={24}
                color={option.destructive ? "#DC2626" : "#CDCDE0"}
              />
              <Text
                className={`font-pregular text-gray-100 ${
                  option.destructive ? "text-red-600" : ""
                }`}
              >
                {option.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default CustomBottomSheetModal;
