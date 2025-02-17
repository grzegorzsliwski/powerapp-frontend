// src/app/program/index.tsx
import { FlatList, Text, View } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import TrainingProgram from "@/components/TrainingProgram";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";
import { router } from "expo-router";
import useApi from "@/hooks/useApi";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

interface Program {
  _id: string;
  programName: string;
  numberOfWeeks: number;
}

const Program = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [programs, setPrograms] = useState<Program[]>([]);

  const {
    isLoading,
    error,
    callApi: fetchPrograms,
  } = useApi<Program[]>(`${BASE_URL}program/list`, "GET", {
    onSuccess: (data) => setPrograms(data),
    onError: (error) => console.error("Failed to fetch programs:", error),
  });

  const { callApi: duplicateProgram } = useApi<Program>(
    `${BASE_URL}program/${selectedProgramId}/duplicate`,
    "POST",
    {
      onSuccess: () => {
        fetchPrograms();
        bottomSheetRef.current?.dismiss();
      },
      onError: (error) => console.error("Failed to duplicate program:", error),
    }
  );

  const { callApi: deleteProgram } = useApi<{ message: string }>(
    `${BASE_URL}program/${selectedProgramId}/delete`,
    "DELETE",
    {
      onSuccess: () => {
        fetchPrograms();
        bottomSheetRef.current?.dismiss();
      },
      onError: (error) => console.error("Failed to delete program:", error),
    }
  );

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEdit = (programId: string) => {
    router.push(`/program/edit?id=${programId}`);
    bottomSheetRef.current?.dismiss();
  };

  const handleDuplicate = async (programId: string) => {
    try {
      await duplicateProgram();
    } catch (error) {
      // Error handling is managed by useApi hook through onError callback
    }
  };

  const handleDelete = async (programId: string) => {
    try {
      await deleteProgram();
    } catch (error) {
      // Error handling is managed by useApi hook through onError callback
    }
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
      onPress: () => selectedProgramId && handleDuplicate(selectedProgramId),
    },
    {
      id: "delete",
      label: "Delete Program",
      iconName: "delete",
      onPress: () => selectedProgramId && handleDelete(selectedProgramId),
      destructive: true,
    },
  ];

  const handlePresentModalPress = (programId: string) => {
    setSelectedProgramId(programId);
    bottomSheetRef.current?.present();
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full px-4 mt-8">
        <CustomButton
          title="Create New Program"
          handlePress={() => router.push("/program/create")}
        />

        {error && (
          <View className="my-4">
            <Text className="text-red-500">{error}</Text>
          </View>
        )}

        {isLoading ? (
          <View className="flex items-center justify-center h-40">
            <Text>Loading programs...</Text>
          </View>
        ) : (
          <FlatList
            className="my-4"
            data={programs}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TrainingProgram
                id={item._id}
                programName={item.programName}
                numberOfWeeks={item.numberOfWeeks}
                onPress={() => {
                  router.push(`/program/program-details?id=${item._id}`);
                }}
                onPressMore={() => handlePresentModalPress(item._id)}
              />
            )}
          />
        )}
      </View>
      <CustomBottomSheetModal
        ref={bottomSheetRef}
        options={bottomSheetOptions}
      />
    </SafeAreaView>
  );
};

export default Program;
