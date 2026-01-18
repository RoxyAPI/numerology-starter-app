/** @jsxImportSource nativewind */
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { numerologyApi, hasApiKey } from "../../src/api";
import type { NumberMeaningResponse } from "../../src/api/types";
import { RoxyBranding } from "../../src/components/RoxyBranding";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

export default function MeaningsScreen() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [meaning, setMeaning] = useState<NumberMeaningResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMeaning = async (num: number) => {
    if (!hasApiKey()) return;
    
    try {
      setLoading(true);
      setSelectedNumber(num);
      const data = await numerologyApi.getNumberMeaning(num);
      setMeaning(data);
    } catch {
      setMeaning(null);
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
            To use this app, you need a RoxyAPI key.
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
          Number Meanings
        </Text>
        <Text className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
          Explore the meaning of numerology numbers
        </Text>

        <View className="flex-row flex-wrap mb-6">
          {NUMBERS.map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => fetchMeaning(num)}
              className={`w-16 h-16 rounded-xl mr-3 mb-3 justify-center items-center ${
                selectedNumber === num
                  ? 'bg-teal-600'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              <Text
                className={`text-2xl font-bold ${
                  selectedNumber === num
                    ? 'text-white'
                    : 'text-zinc-900 dark:text-white'
                }`}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && (
          <Text className="text-center text-zinc-500 dark:text-zinc-400">
            Loading...
          </Text>
        )}

        {meaning && !loading && (
          <View>
            <View className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 mb-6">
              <Text className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {meaning.number}
              </Text>
              <Text className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {meaning.meaning.title}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Keywords
              </Text>
              <View className="flex-row flex-wrap">
                {meaning.meaning.keywords.map((keyword: string, index: number) => (
                  <View key={index} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2 mr-2 mb-2">
                    <Text className="text-zinc-700 dark:text-zinc-300 text-sm capitalize">
                      {keyword}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Description
              </Text>
              <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {meaning.meaning.description}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
