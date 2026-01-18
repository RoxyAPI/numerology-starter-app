/** @jsxImportSource nativewind */
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, useColorScheme } from "react-native";
import { numerologyApi, hasApiKey } from "../../src/api";
import type { ChartResponse } from "../../src/api/types";
import { RoxyBranding } from "../../src/components/RoxyBranding";
import { NumberDetailModal } from "../../src/components/NumberDetailModal";
import { appColors } from "../../src/constants/colors";

export default function ChartScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [fullName, setFullName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<ChartResponse | null>(null);
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

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    if (!yearNum || !monthNum || !dayNum) {
      setError("Please enter valid birth date");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await numerologyApi.getChart({ 
        fullName: fullName.trim(), 
        year: yearNum, 
        month: monthNum, 
        day: dayNum,
        currentYear: new Date().getFullYear()
      });
      setResult(data);
    } catch (err) {
      setError("Failed to generate chart");
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
          Complete Numerology Chart
        </Text>
        <Text className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Generate your full numerology profile with all core numbers
        </Text>

        <View className="mb-6">
          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Full Name
            </Text>
            <TextInput
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 h-14 text-lg"
              placeholder="John Smith"
              placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              textAlignVertical="center"
            />
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Year
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
            <View className="w-20">
              <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Month
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
            <View className="w-20">
              <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Day
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
              Generate Chart
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
            <View className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 mb-6">
              <Text className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                {result.profile.name}
              </Text>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                Born {result.profile.birthdate}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                Core Numbers
              </Text>
              
              <TouchableOpacity 
                className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-3 active:bg-zinc-100 dark:active:bg-zinc-800"
                onPress={() => openNumberDetail(result.coreNumbers.lifePath.number)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                      Life Path
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      {result.coreNumbers.lifePath.meaning.title}
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {result.coreNumbers.lifePath.number}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-3 active:bg-zinc-100 dark:active:bg-zinc-800"
                onPress={() => openNumberDetail(result.coreNumbers.expression.number)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                      Expression
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      {result.coreNumbers.expression.meaning.title}
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.coreNumbers.expression.number}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-3 active:bg-zinc-100 dark:active:bg-zinc-800"
                onPress={() => openNumberDetail(result.coreNumbers.soulUrge.number)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                      Soul Urge
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      {result.coreNumbers.soulUrge.meaning.title}
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {result.coreNumbers.soulUrge.number}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-3 active:bg-zinc-100 dark:active:bg-zinc-800"
                onPress={() => openNumberDetail(result.coreNumbers.personality.number)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                      Personality
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      {result.coreNumbers.personality.meaning.title}
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {result.coreNumbers.personality.number}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 active:bg-zinc-100 dark:active:bg-zinc-800"
                onPress={() => openNumberDetail(result.coreNumbers.birthDay.number)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                      Birth Day
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      {result.coreNumbers.birthDay.meaning.title}
                    </Text>
                  </View>
                  <Text className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {result.coreNumbers.birthDay.number}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {result.additionalInsights.personalYear && (
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {new Date().getFullYear()} Personal Year
                </Text>
                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {result.additionalInsights.personalYear.personalYear}
                </Text>
                <Text className="text-sm text-zinc-700 dark:text-zinc-300">
                  {result.additionalInsights.personalYear.theme}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <NumberDetailModal
        visible={modalVisible}
        number={selectedNumber}
        onClose={closeModal}
      />
    </ScrollView>
  );
}
