/** @jsxImportSource nativewind */
import { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { numerologyApi } from "../api";
import type { NumberMeaningResponse } from "../api/types";
import { appColors } from "../constants/colors";

interface NumberDetailModalProps {
  visible: boolean;
  number: number | null;
  onClose: () => void;
}

export function NumberDetailModal({ visible, number, onClose }: NumberDetailModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [meaning, setMeaning] = useState<NumberMeaningResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && number !== null) {
      fetchMeaning();
    }
  }, [visible, number]);

  const fetchMeaning = async () => {
    if (number === null) return;

    try {
      setLoading(true);
      setError(null);
      const data = await numerologyApi.getNumberMeaning(number);
      setMeaning(data);
    } catch (err) {
      setError("Failed to load number meaning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950" edges={['top']}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View className="bg-teal-600 dark:bg-teal-700 pt-4 pb-6 px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-3xl font-bold text-white">
              Number {number}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-white/20 rounded-full w-10 h-10 justify-center items-center"
            >
              <Text className="text-white text-xl font-semibold">×</Text>
            </TouchableOpacity>
          </View>
          
          {meaning && !loading && (
            <View>
              <Text className="text-5xl font-bold text-white mb-2">
                {meaning.number}
              </Text>
              <Text className="text-xl font-semibold text-white/90">
                {meaning.meaning.title}
              </Text>
              {meaning.type === "master" && (
                <View className="bg-white/20 rounded-lg px-3 py-1 self-start mt-2">
                  <Text className="text-white font-semibold text-sm">
                    Master Number
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="p-6"
        >
          {loading && (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color={appColors.primary} />
              <Text className="text-zinc-500 dark:text-zinc-400 mt-4 text-base">
                Loading detailed meaning...
              </Text>
            </View>
          )}

          {error && (
            <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4">
              <Text className="text-red-600 dark:text-red-400 text-center">
                {error}
              </Text>
            </View>
          )}

          {meaning && !loading && (
            <View>
              {/* Keywords */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Keywords
                </Text>
                <View className="flex-row flex-wrap">
                  {meaning.meaning.keywords.map((keyword: string, index: number) => (
                    <View 
                      key={index} 
                      className="bg-teal-100 dark:bg-teal-900/30 rounded-lg px-3 py-2 mr-2 mb-2"
                    >
                      <Text className="text-teal-700 dark:text-teal-300 text-sm font-medium capitalize">
                        {keyword}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Overview
                </Text>
                <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {meaning.meaning.description}
                </Text>
              </View>

              {/* Strengths */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Strengths
                </Text>
                <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  {meaning.meaning.strengths.map((strength: string, index: number) => (
                    <View key={index} className="flex-row mb-2 last:mb-0">
                      <Text className="text-green-600 dark:text-green-400 mr-2 font-bold">✓</Text>
                      <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                        {strength}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Challenges */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Challenges
                </Text>
                <View className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  {meaning.meaning.challenges.map((challenge: string, index: number) => (
                    <View key={index} className="flex-row mb-2 last:mb-0">
                      <Text className="text-amber-600 dark:text-amber-400 mr-2">⚠</Text>
                      <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                        {challenge}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Career */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Career & Professional Life
                </Text>
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {meaning.meaning.career}
                  </Text>
                </View>
              </View>

              {/* Relationships */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Relationships & Love
                </Text>
                <View className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
                  <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {meaning.meaning.relationships}
                  </Text>
                </View>
              </View>

              {/* Spirituality */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Spiritual Path
                </Text>
                <View className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {meaning.meaning.spirituality}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
