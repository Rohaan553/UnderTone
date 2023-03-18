import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import HomePage from './HomePage';


export default function App() {
  return (
    <TouchableWithoutFeedback 
    onPress={() => {Keyboard.dismiss();}}
    touchSoundDisabled={true}
    >
    <View style={styles.container}>
      <HomePage/> 
      <StatusBar style="auto" />
    </View>
     </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
