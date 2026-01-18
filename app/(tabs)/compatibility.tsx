/** @jsxImportSource nativewind */
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, useColorScheme } from "react-native";
import { numerologyApi, hasApiKey } from "../../src/api";
import type { CompatibilityResponse } from "../../src/api/types";
import { RoxyBranding } from "../../src/components/RoxyBranding";
import { appColors } from "../../src/constants/colors";

export default function CompatibilityScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Person 1
  const [name1, setName1] = useState("");
  const [year1, setYear1] = useState("");
  const [month1, setMonth1] = useState("");
  const [day1, setDay1] = useState("");
  
  // Person 2
  const [name2, setName2] = useState("");
  const [year2, setYear2] = useState("");
  const [month2, setMonth2] = useState("");
  const [day2, setDay2] = useState("");
  
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    if (!hasApiKey()) {
      setError("Please set your API key in .env file");
      return;
    }

    if (!name1.trim() || !name2.trim()) {
      setError("Please enter both names");
      return;
    }

    const y1 = parseInt(year1), m1 = parseInt(month1), d1 = parseInt(day1);
    const y2 = parseInt(year2), m2 = parseInt(month2), d2 = parseInt(day2);

    if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) {
      setError("Please enter valid birth dates for both people");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Calculate core numbers for both people
      const [lp1, exp1, soul1, lp2, exp2, soul2] = await Promise.all([
        numerologyApi.getLifePath({ year: y1, month: m1, day: d1 }),
        numerologyApi.getExpression({ fullName: name1.trim() }),
        numerologyApi.getSoulUrge({ fullName: name1.trim() }),
        numerologyApi.getLifePath({ year: y2, month: m2, day: d2 }),
        numerologyApi.getExpression({ fullName: name2.trim() }),
        numerologyApi.getSoulUrge({ fullName: name2.trim() }),
      ]);
      
      // Get compatibility
      const data = await numerologyApi.getCompatibility({
        person1: {
          lifePath: lp1.number,
          expression: exp1.number,
          soulUrge: soul1.number,
        },
        person2: {
          lifePath: lp2.number,
          expression: exp2.number,
          soulUrge: soul2.number,
        },
      });
      
      setResult(data);
    } catch (err) {
      setError("Failed to calculate compatibility");
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
          Compatibility Calculator
        </Text>
        <Text className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Analyze numerology compatibility between two people
        </Text>

        {/* Person 1 */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Person 1
          </Text>
          
          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Full Name
            </Text>
            <TextInput
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 h-14 text-lg"
              placeholder="John Smith"
              placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
              value={name1}
              onChangeText={setName1}
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
                value={year1}
                onChangeText={setYear1}
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
                value={month1}
                onChangeText={setMonth1}
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
                value={day1}
                onChangeText={setDay1}
                keyboardType="number-pad"
                maxLength={2}
                textAlignVertical="center"
              />
            </View>
          </View>
        </View>

        {/* Person 2 */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Person 2
          </Text>
          
          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Full Name
            </Text>
            <TextInput
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl px-4 h-14 text-lg"
              placeholder="Jane Doe"
              placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
              value={name2}
              onChangeText={setName2}
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
                placeholder="1992"
                placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
                value={year2}
                onChangeText={setYear2}
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
                placeholder="3"
                placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
                value={month2}
                onChangeText={setMonth2}
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
                placeholder="22"
                placeholderTextColor={isDark ? appColors.zinc[500] : appColors.zinc[400]}
                value={day2}
                onChangeText={setDay2}
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
              Calculate Compatibility
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
            <View className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6 mb-6">
              <Text className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-2">
                Overall Compatibility
              </Text>
              <Text className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                {result.overallScore}%
              </Text>
              <Text className="text-xl font-semibold text-zinc-900 dark:text-white">
                {result.rating}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Detailed Scores
              </Text>
              
              <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base text-zinc-700 dark:text-zinc-300">
                    Life Path Compatibility
                  </Text>
                  <Text className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    {result.lifePath.compatibility}%
                  </Text>
                </View>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  {result.lifePath.description}
                </Text>
              </View>

              <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base text-zinc-700 dark:text-zinc-300">
                    Expression Compatibility
                  </Text>
                  <Text className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    {result.expression.compatibility}%
                  </Text>
                </View>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  {result.expression.description}
                </Text>
              </View>

              <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base text-zinc-700 dark:text-zinc-300">
                    Soul Urge Compatibility
                  </Text>
                  <Text className="text-lg font-bold text-pink-600 dark:text-pink-400">
                    {result.soulUrge.compatibility}%
                  </Text>
                </View>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  {result.soulUrge.description}
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Strengths
              </Text>
              {result.strengths.map((strength: string, index: number) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-green-600 dark:text-green-400 mr-2">💚</Text>
                  <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                    {strength}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Challenges
              </Text>
              {result.challenges.map((challenge: string, index: number) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-amber-600 dark:text-amber-400 mr-2">⚠️</Text>
                  <Text className="text-base text-zinc-700 dark:text-zinc-300 flex-1">
                    {challenge}
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
              <Text className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-2">
                Relationship Advice
              </Text>
              <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {result.advice}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
