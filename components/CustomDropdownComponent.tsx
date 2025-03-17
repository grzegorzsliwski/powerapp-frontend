import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownComponentProps {
  label: string;
  placeholder: string;
  value: string | null;
  setValue: (value: string) => void;
  data?: DropdownItem[];
  generateData?: () => DropdownItem[];
  iconSource?: ImageSourcePropType;
  primaryColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  label,
  placeholder,
  value,
  setValue,
  data,
  generateData,
  iconSource,
  primaryColor = "#FF9C01",
  backgroundColor = "#161622",
  borderColor = "#232533",
}) => {
  const [isFocus, setIsFocus] = React.useState(false);

  const dropdownData = useMemo(() => {
    if (data) return data;
    if (generateData) return generateData();
    return [];
  }, [data, generateData]);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            isFocus && { color: primaryColor },
            { backgroundColor },
          ]}
        >
          {label}
        </Text>
      );
    }
    return null;
  };

  const renderItem = (item: DropdownItem, selected?: boolean) => {
    return (
      <View
        style={[
          styles.customItemContainer,
          selected && styles.selectedItemContainer,
        ]}
      >
        <Text style={styles.itemTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          { borderColor, backgroundColor },
          isFocus && { borderColor: primaryColor },
        ]}
        placeholderStyle={[styles.placeholderStyle]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={[
          styles.inputSearchStyle,
          { backgroundColor: borderColor },
        ]}
        iconStyle={styles.iconStyle}
        data={dropdownData}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : "..."}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() =>
          iconSource ? (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24, marginRight: 5 }}
              resizeMode="contain"
              tintColor="white"
            />
          ) : null
        }
        containerStyle={[
          styles.dropdownContainer,
          { backgroundColor, borderColor },
        ]}
        itemTextStyle={styles.itemTextStyle}
        activeColor="transparent"
        itemContainerStyle={styles.itemContainer}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  dropdown: {
    height: 64,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  label: {
    color: "white",
    fontFamily: "Poppins-Medium",
    position: "absolute",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  selectedTextStyle: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "white",
    borderRadius: 16,
    paddingHorizontal: 12,
    fontFamily: "Poppins-Medium",
  },
  dropdownContainer: {
    borderRadius: 16,
    marginTop: 4,
    borderWidth: 2,
  },
  itemTextStyle: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    paddingHorizontal: 4,
  },
  itemContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 16,
  },
  customItemContainer: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  selectedItemContainer: {
    backgroundColor: "#232533",
    borderRadius: 12,
  },
});

export default DropdownComponent;
