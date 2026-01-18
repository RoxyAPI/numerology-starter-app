/** @jsxImportSource nativewind */
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, useColorScheme } from "react-native";
import { numerologyApi, hasApiKey } from "../../src/api";
import type { PersonalYearResponse } from "../../src/api/types";
import { RoxyBranding } from "../../src/components/RoxyBranding";
import { NumberDetailModal } from "../../src/components/NumberDetailModal";
import { appColors } from "../../src/constants/colors";

export default function PersonalYearScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [result, setResult] = useState<PersonalYearResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const openNumberDetail = (number: number) => {
    setSelectedNumber(number);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNumber(null);
  };

  const calculate = async () => {
    if (!hasApiKey()) {
      setError("Please set your API key in .env file");
      return;
    }

    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const yearNum = parseInt(year);

    if (!monthNum || !dayNum) {
      setError("Please enter valid birth month and day");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await numerologyApi.getPersonalYear({ 
        month: monthNum, 
        day: dayNum,
        year: yearNum
      });
      setResult(data);
    } catch (err) {
      setError("Failed to calculate Personal Year");
    } finally {
      setLoading(false);
    }
  };

  if (!hasApiKey()) {
    return (
      <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
        <View className="p-6">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            API Key Required
          </Text>
          <RoxyBranding />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="p-6">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Personal Year Calculator
        </Text>
        <Text className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Discover your annual cycle and what {year} has in store
        </Text>

        <View className="mb-6">
          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Birth Month (1-12)
            </Text>
            <TextInput
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 h-14 text-lg"
              placeholder="7"
              placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
              value={month}
              onChangeText={setMonth}
              keyboardType="number-pad"
              maxLength={2}
              textAlignVertical="center"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Birth Day (1-31)
            </Text>
            <TextInput
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 h-14 text-lg"
              placeholder="15"
              placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
              value={day}
              onChangeText={setDay}
              keyboardType="number-pad"
              maxLength={2}
              textAlignVertical="center"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={calculate}
          disabled={loading}
          className="bg-teal-600 rounded-xl py-4 mb-6 active:bg-teal-700"
        >
          {loading ? (
            <ActivityIndicator color={appColors.white} />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Calculate Personal Year
            </Text>
          )}
        </TouchableOpacity>

        {error && (
          <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6">
            <Text className="text-red-600 dark:text-red-400 text-center">
              {error}
            </Text>
          </View>
        )}

        {result && (
          <View>
            <TouchableOpacity 
              onPress={() => openNumberDetail(result.personalYear)}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 active:bg-blue-100 dark:active:bg-blue-900/30"
            >
              <Text className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                Your {year} Personal Year
              </Text>
              <Text className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {result.personalYear}
              </Text>
              <Text className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                {result.theme}
              </Text>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                {result.cycle}
              </Text>
              <Text className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Tap for detailed meaning →
              </Text>
            </TouchableOpacity>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Forecast
              </Text>
              <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {result.forecast}
              </Text>
            </View>

            {result.opportunities.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Opportunities
                </Text>
                {result.opportunities.map((opp: string, index: number) => (
                  <View key={index} className="flex-row mb-2">
                    <Text className="text-green-600 dark:text-green-400 mr-2">✓</Text>
                    <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                      {opp}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {result.challenges.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Challenges
                </Text>
                {result.challenges.map((challenge: string, index: number) => (
                  <View key={index} className="flex-row mb-2">
                    <Text className="text-amber-600 dark:text-amber-400 mr-2">⚠</Text>
                    <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                      {challenge}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
              <Text className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-2">
                Advice for {year}
              </Text>
              <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {result.advice}
              </Text>
            </View>
          </View>
        )}

        <NumberDetailModal
          visible={modalVisible}
          number={selectedNumber}
          onClose={closeModal}
        />
      </View>
    </ScrollView>
  );
}
