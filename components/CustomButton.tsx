import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

interface CustomButton {
  title?: string;
  handlePress?: (event: GestureResponderEvent) => void;
  containerStyle?: string;
  textStyles?: string;
  isLoading?: boolean;
}
const CustomButton: React.FC<CustomButton> = ({
  title,
  handlePress,
  containerStyle,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyle} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
