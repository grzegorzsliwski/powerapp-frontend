import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";
import ProgramList from "@/components/ProgramList";
import usePrograms from "@/hooks/usePrograms";

const ProgramPage = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );

  const {
    programs,
    isLoading,
    error,
    fetchPrograms,
    duplicateProgram,
    deleteProgram,
  } = usePrograms();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEdit = (programId: string) => {
    router.push(`/program/edit?id=${programId}`);
    bottomSheetRef.current?.dismiss();
  };

  const bottomSheetOptions = [
    {
      id: "edit",
      label: "Edit Program",
      iconName: "edit",
      onPress: () => selectedProgramId && handleEdit(selectedProgramId),
    },
    {
      id: "duplicate",
      label: "Duplicate Program",
      iconName: "content-copy",
      onPress: () => selectedProgramId && duplicateProgram(selectedProgramId),
    },
    {
      id: "delete",
      label: "Delete Program",
      iconName: "delete",
      onPress: () => selectedProgramId && deleteProgram(selectedProgramId),
      destructive: true,
    },
  ];

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full mt-8">
        <CustomButton
          title="Create New Program"
          handlePress={() => router.push("/program/create-program")}
          containerStyle="mx-4"
        />

        {error && (
          <View className="my-4">
            <Text className="text-red-500">{error}</Text>
          </View>
        )}

        <ProgramList
          programs={programs}
          isLoading={isLoading}
          onSelect={(id) => {
            setSelectedProgramId(id);
            bottomSheetRef.current?.present();
          }}
        />
      </View>

      <CustomBottomSheetModal
        ref={bottomSheetRef}
        options={bottomSheetOptions}
      />
    </SafeAreaView>
  );
};

export default ProgramPage;
