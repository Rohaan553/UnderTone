import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, useColorScheme } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
const HomePage = () => {
  const [placeholderText, setPlaceHolderText] = useState("Type or paste your text here...");
  const [inputText, setInputText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const theme = useColorScheme(); // import device's color scheme (dark mode or light mode)
  const clearButtonRef = useRef(); // get a reference to the Clear button

  // enable or disable clear button based on status of inputText
  useEffect(() => {
    if (inputText.length > 0) {
      console.log("enabling clear button");
      setIsDisabled(false);

      // restyle clear button
      clearButtonRef.current.setNativeProps({
        style: {
          backgroundColor: '#46024E'
        }
      });
    } else {
      console.log("disabling clear button");
      setIsDisabled(true);

      // restyle clear button
      clearButtonRef.current.setNativeProps({
        style: {
          backgroundColor: 'grey'
        }
      });
    }
  }, [inputText]);

  return (

    <View style={theme == 'light' ? styles.container : styles.containerDark}>

      <SafeAreaView style={theme == 'light' ? styles.container : styles.containerDark}>
        <Text style={theme == 'light' ? styles.titleText : styles.titleTextDark}>UnderTone</Text>
        <TextInput
          style={theme == 'light' ? styles.input : styles.inputDark}
          multiline={true}
          numberOfLines={6}
          placeholder={placeholderText}
          placeholderTextColor={theme == 'light' ? 'grey' : 'lightgray'}
          onFocus={focusEvent => {
            console.log("text box focused");
            setPlaceHolderText("");
          }}
          value={inputText}
          onChangeText={text => {
            setInputText(text);
          }}
        />

        <Pressable
          style={({ pressed }) => [styles.unPressedButton,
          {
            backgroundColor: pressed ? 'hsl(294, 35%, 35%)' : '#46024E',
          }
          ]}
          onPress={pressEvent => {
            console.log("pressed Analyze")

            if (inputText.length == 0) {
              alert("Please enter some text first!");
            } else {
              fetch("https://us-central1-aiplatform.googleapis.com/v1/projects/696534557838/locations/us-central1/endpoints/3459129551680962560:predict", {
                method: "post",
                headers: {
                  "Authorization": "Bearer \"YOUR_TOKEN_HERE\"",
                  "Content-type": "application/json; charset=UTF-8"
                },
                body: {
                  "instances": [{
                    "mimeType": "text/plain",
                    "content": {inputText}
                  }]
                }
              })
              .then(response => {
                console.log(response);
                return response.json();
              })
              .then(results => {
                console.log(results);
              })
              .catch(e => {
                console.log(e);
              })
            }
          }}>

          <Text style={styles.buttonText}>Analyze</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.unPressedButton,
          {
            backgroundColor: pressed ? 'hsl(294, 35%, 35%)' : '#46024E',
          }
          ]}
          onPress={pressEvent => {
            console.log("pressed clear");
            setInputText("");
            setPlaceHolderText("Type or paste your text here...");
          }}
          disabled={isDisabled}
          ref={clearButtonRef}>

          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>

      </SafeAreaView>
    </View>


  );
}

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    color: "#46024E",
    fontSize: 48,
    fontWeight: '900',
    textAlign: "center"
  },
  titleTextDark: {
    color: "white",
    fontSize: 48,
    fontWeight: '900',
    textAlign: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    padding: '2%'
  },
  input: {
    fontSize: 20,
    fontWeight: '500',
    textAlignVertical: 'top',
    borderColor: '#6B6B6B',
    minWidth: '65%',
    maxWidth: '65%',
    maxHeight: '30%',
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 6
  },
  inputDark: {
    fontSize: 20,
    fontWeight: '500',
    textAlignVertical: 'top',
    borderColor: '#6B6B6B',
    minWidth: '65%',
    maxWidth: '65%',
    maxHeight: '30%',
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 6,
    color: "white"
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
    borderRadius: 6
  },
});