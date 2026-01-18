import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Calculator, User, Calendar, Heart, BookText } from "lucide-react-native";
import { appColors } from "../../src/constants/colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.gray[400],
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? appColors.zinc[950] : appColors.white,
          borderTopColor: colorScheme === 'dark' ? appColors.zinc[800] : appColors.gray[200],
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? appColors.zinc[950] : appColors.white,
        },
        headerTintColor: colorScheme === 'dark' ? appColors.white : appColors.zinc[900],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Life Path",
          tabBarIcon: ({ color }) => <Calculator color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="chart"
        options={{
          title: "Full Chart",
          tabBarIcon: ({ color }) => <User color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="personal-year"
        options={{
          title: "Personal Year",
          tabBarIcon: ({ color }) => <Calendar color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: "Compatibility",
          tabBarIcon: ({ color }) => <Heart color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="meanings"
        options={{
          title: "Meanings",
          tabBarIcon: ({ color }) => <BookText color={String(color)} size={24} />,
        }}
      />
    </Tabs>
  );
}
