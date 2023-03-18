import { StyleSheet, Text, View, TextInput, Pressable} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
const HomePage = () => {
    return ( 
        
             <View style={styles.container}> 
            
            <SafeAreaView>
            <Text style={styles.titleText}>UnderTone</Text>  
            <TextInput
                style={styles.input}
                multiline= {true}
                numberOfLines={7}
                placeholder='Type or paste your text here...'
            />
            <Pressable
                style={({pressed}) => [styles.unPressedButton,
                    {
                    backgroundColor: pressed ? 'hsl(294, 35%, 35%)' : '#46024E',
                    },
                    
                ]}>
                <Text style={styles.buttonText}>Analyze</Text>
            </Pressable>

            </SafeAreaView>
         </View>
       
       
     );
}
 
export default HomePage;

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
titleText: {
    color: "#46024E",
    fontSize: 48,
    fontWeight: '900',
    paddingBottom: "2.5%",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    padding: '2%',
  },
  input: {
    fontSize: 20,
    fontWeight: '500',
    textAlignVertical: 'top',
    borderColor: '#6B6B6B', 
    minWidth: '65%',
    maxWidth: '65%',
    margin: 12,
    borderWidth: 1,
    borderRadius: 6,

  },
  unPressedButton: {
    minWidth: '65%',
    maxWidth: '65%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: "1%",
    paddingLeft: "2.5%",
    paddingRight: "2.5%",
    paddingTop: ".5%",
    paddingBottom: ".5%",
    borderRadius: 6,

  },
});