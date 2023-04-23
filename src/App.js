import { StatusBar } from 'expo-status-bar'; //
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, useColorScheme, ScrollView } from 'react-native';
import HomePage from './HomePage';


export default function App() {
  const theme = useColorScheme(); // import device's color scheme (dark mode or light mode)
  
  return (
    <ScrollView style={theme == 'light' ? styles.container : styles.containerDark}>
      <TouchableWithoutFeedback 
      onPress={() => {Keyboard.dismiss();}}
      touchSoundDisabled={true}
      >
      <View style={theme == 'light' ? styles.container : styles.containerDark}>
        <HomePage/> 
        <StatusBar style="auto" />
      </View>
      </TouchableWithoutFeedback>
     </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#000'
  },
});
