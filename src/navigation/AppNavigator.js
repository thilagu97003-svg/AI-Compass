import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { UserProvider } from '../context/UserContext';
import UserBadge from '../components/UserBadge';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import RecommendScreen from '../screens/RecommendScreen';
import ProgressScreen from '../screens/ProgressScreen';
import AboutScreen from '../screens/AboutScreen';
import ToolDetailScreen from '../screens/ToolDetailScreen';
import StepGuideScreen from '../screens/StepGuideScreen';
import QuizScreen from '../screens/QuizScreen';
import DictionaryScreen from '../screens/DictionaryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: ['home', 'home-outline'],
  Recommend: ['compass', 'compass-outline'],
  Dictionary: ['book', 'book-outline'],
  Progress: ['stats-chart', 'stats-chart-outline'],
  About: ['sparkles', 'sparkles-outline'],
};

const headerOptions = {
  headerStyle: { backgroundColor: colors.navy },
  headerTintColor: colors.white,
  headerTitleStyle: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  headerShadowVisible: false,
  headerRight: () => <UserBadge />,
};

function BrandTitle() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginRight: 8 }}>🧭</Text>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.white }}>
        AI Compass
      </Text>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOptions,
        headerTitleAlign: 'left',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#4A5A7A',
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 16 },
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 6, borderTopColor: '#DCE6F7' },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? tabIcons[route.name][0] : tabIcons[route.name][1]}
            size={24}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'AI Compass', tabBarLabel: 'Home', headerTitle: () => <BrandTitle /> }}
      />
      <Tab.Screen
        name="Recommend"
        component={RecommendScreen}
        options={{ title: 'Find My Tool', tabBarLabel: 'Find Tool' }}
      />
      <Tab.Screen
          name="Dictionary"
          component={DictionaryScreen}
          options={{ title: 'AI Dictionary', tabBarLabel: 'Dictionary' }}
        />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: 'My Progress', tabBarLabel: 'Progress' }}
      />
      <Tab.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={headerOptions}>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false, title: 'AI Compass' }}
          />
          <Stack.Screen
            name="Main"
            component={Tabs}
            options={{ headerShown: false, title: 'AI Compass' }}
          />
          <Stack.Screen
            name="ToolDetail"
            component={ToolDetailScreen}
            options={({ route }) => ({ title: route.params.tool.name })}
          />
          <Stack.Screen
            name="StepGuide"
            component={StepGuideScreen}
            options={({ route }) => ({ title: `${route.params.tool.name} Guide` })}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={({ route }) => ({ title: `${route.params.tool.name} Quiz` })}
          />
          <Stack.Screen
            name="DictionaryLookup"
            component={DictionaryScreen}
            options={{ title: 'AI Dictionary' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}