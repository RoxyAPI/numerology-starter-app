/** @jsxImportSource nativewind */
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, useColorScheme } from "react-native";
import { numerologyApi, hasApiKey } from "../../src/api";
import type { LifePathResponse } from "../../src/api/types";
import { RoxyBranding } from "../../src/components/RoxyBranding";
import { NumberDetailModal } from "../../src/components/NumberDetailModal";
import { appColors } from "../../src/constants/colors";

export default function LifePathScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<LifePathResponse | null>(null);
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

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    if (!yearNum || !monthNum || !dayNum) {
      setError("Please enter valid birth date");
      return;
    }

    if (yearNum < 1900 || yearNum > 2100) {
      setError("Year must be between 1900 and 2100");
      return;
    }

    if (monthNum < 1 || monthNum > 12) {
      setError("Month must be between 1 and 12");
      return;
    }

    if (dayNum < 1 || dayNum > 31) {
      setError("Day must be between 1 and 31");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await numerologyApi.getLifePath({ year: yearNum, month: monthNum, day: dayNum });
      setResult(data);
    } catch (err) {
      setError("Failed to calculate Life Path number");
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
          <Text className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            To use this app, you need a RoxyAPI key. Get started with our free tier:
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
          Life Path Calculator
        </Text>
        <Text className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Calculate your Life Path number - the most important number in numerology
        </Text>

        <View className="mb-6">
          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Birth Year (1900-2100)
            </Text>
            <TextInput
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 h-14 text-lg"
              placeholder="1990"
              placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              maxLength={4}
              textAlignVertical="center"
            />
          </View>

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
              Calculate Life Path
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
              onPress={() => openNumberDetail(result.number)}
              className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 mb-6 active:bg-teal-100 dark:active:bg-teal-900/30"
            >
              <Text className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-2">
                Your Life Path Number
              </Text>
              <Text className="text-5xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {result.number}
              </Text>
              <Text className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                {result.meaning.title}
              </Text>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                {result.calculation}
              </Text>
              {result.type === "master" && (
                <View className="bg-teal-100 dark:bg-teal-800/30 rounded-lg px-3 py-1 self-start">
                  <Text className="text-teal-700 dark:text-teal-300 font-semibold text-xs">
                    Master Number
                  </Text>
                </View>
              )}
              {result.hasKarmicDebt && (
                <View className="bg-red-100 dark:bg-red-800/30 rounded-lg px-3 py-1 self-start mt-2">
                  <Text className="text-red-700 dark:text-red-300 font-semibold text-xs">
                    Karmic Debt {result.karmicDebtNumber}
                  </Text>
                </View>
              )}
              <Text className="text-xs text-teal-600 dark:text-teal-400 mt-3">
                Tap for detailed meaning →
              </Text>
            </TouchableOpacity>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Keywords
              </Text>
              <View className="flex-row flex-wrap">
                {result.meaning.keywords.map((keyword, index) => (
                  <View key={index} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2 mr-2 mb-2">
                    <Text className="text-zinc-700 dark:text-zinc-300 text-sm capitalize">
                      {keyword}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Description
              </Text>
              <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {result.meaning.description}
              </Text>
            </View>

            {result.meaning.strengths && result.meaning.strengths.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Strengths
                </Text>
                {result.meaning.strengths.map((strength, index) => (
                  <View key={index} className="flex-row mb-2">
                    <Text className="text-teal-600 dark:text-teal-400 mr-2">•</Text>
                    <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                      {strength}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {result.meaning.challenges && result.meaning.challenges.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  Challenges
                </Text>
                {result.meaning.challenges.map((challenge, index) => (
                  <View key={index} className="flex-row mb-2">
                    <Text className="text-zinc-400 dark:text-zinc-500 mr-2">•</Text>
                    <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                      {challenge}
                    </Text>
                  </View>
                ))}
              </View>
            )}
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
