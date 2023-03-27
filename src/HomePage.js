import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomePage = () => {
  const [placeholderText, setPlaceHolderText] = useState("Type or paste your text here...");
  const [inputText, setInputText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [requestResult, setRequestResult] = useState("");

  const theme = useColorScheme(); // import device's color scheme (dark mode or light mode)
  const clearButtonRef = useRef(); // get a reference to the Clear button
  const analyzeButtonRef = useRef(); // get a reference to the Analyze button

  // enable or disable buttons based on status of inputText
  useEffect(() => {
    if (isDisabled && inputText.length > 0) {
      console.log("enabling clear button");
      setIsDisabled(false);

      // restyle clear button
      clearButtonRef.current.setNativeProps({
        style: {
          backgroundColor: '#46024E'
        }
      });

      // restyle analyze button
      analyzeButtonRef.current.setNativeProps({
        style: {
          backgroundColor: '#46024E'
        }
      });
    } else if (!isDisabled && inputText.length == 0) {
      console.log("disabling clear button");
      setIsDisabled(true);

      // restyle clear button
      clearButtonRef.current.setNativeProps({
        style: {
          backgroundColor: 'grey'
        }
      });

      // restyle analyze button
      analyzeButtonRef.current.setNativeProps({
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
            setPlaceHolderText(""); // clear placeholder text
          }}
          onBlur={blurEvent => {
            console.log("text box blurred");

            // if no text was entered, restore the placeholder text
            if (inputText.length == 0) {
              setPlaceHolderText("Type or paste your text here...");
            }
          }}
          value={inputText}
          onChangeText={text => {
            setInputText(text);
          }}
        />

        <Pressable
          style={styles.unPressedButton}
          onPressIn={pressInEvent => { // restyle button on initiation of press
            analyzeButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'hsl(294, 35%, 35%)'
              }
            });
          }}
          onPress={pressEvent => {
            console.log(`pressed Analyze with inputText ${inputText}`);

            fetch("https://us-central1-aiplatform.googleapis.com/v1/projects/696534557838/locations/us-central1/endpoints/3459129551680962560:predict", {
              method: "POST",
              headers: {
                "Authorization": "Bearer YOUR_TOKEN_HERE",
                "Content-Type": "application/json; charset=UTF-8",
                "x-goog-user-project": "practical-ai-376103"
              },
              body: JSON.stringify({
                "instances": [{
                  "mimeType": "text/plain",
                  "content": inputText.trim()
                }]
              })
            })
            .then(response => {
              console.log(`response: ${JSON.stringify(response)}`);
              return response.json();
            })
            .then(rawResults => {
              console.log(`results: ${JSON.stringify(rawResults)}`);
              emotionResult = getPredictionResults(rawResults);
              setRequestResult(emotionResult);
            })
            .catch(e => {
              console.log(e);
            })

            analyzeButtonRef.current.setNativeProps({
              style: {
                backgroundColor: '#46024E'
              }
            });
          }}
          disabled={isDisabled}
          ref={analyzeButtonRef}>

          <Text style={styles.buttonText}>Analyze</Text>
        </Pressable>

        <Text style={{
          display: requestResult ? 'block' : 'none',
          color: theme == 'light' ? 'black' : 'white'
          }}>
          {requestResult}
        </Text>

        <Pressable
          style={styles.unPressedButton}
          onPressIn={pressInEvent => { // restyle button on initiation of press
            clearButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'hsl(294, 35%, 35%)'
              }
            });
          }}
          onPress={pressEvent => { // when press is released
            console.log("pressed clear");
            setInputText("");
            setRequestResult("");
            setPlaceHolderText("Type or paste your text here...");

            // restyle clear button
            clearButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'grey'
              }
            });

            // restyle analyze button
            analyzeButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'grey'
              }
            });
          }}
          disabled={isDisabled}
          ref={clearButtonRef}>

          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>

        <Text style={styles.titleText}>{requestResult ? requestResult : ""}</Text>

      </SafeAreaView>
    </View>
   



  );
}

export default HomePage;

function getPredictionResults(rawResults) {
  results = rawResults["predictions"][0];
  confidences = results["confidences"];
  emotions = results["displayNames"];

  maxConf = 0.0;
  maxConfIndex = 0;
  confidences.forEach((conf, confIndex) => {
    if (conf > maxConf) { // TODO: Handle ties
      maxConf = conf;
      maxConfIndex = confIndex;
    }
  });

  console.log(confidences);
  console.log(emotions);

  // there is a 1:1 correspondence between the indices in the confidences array and the emotions array
  // so we can use confidex indices to index into the emotions array or vice versa
  return emotions[maxConfIndex];

  // if (maxConfIndex == 0) { // highest confidence emotion is "neutral"
  //   alert("This message is not strongly associated with any particular emotion.");
  // } else {
  //   // there is a 1:1 correspondence between the indices in the confidences array and the emotions array
  //   // so we can use confidex indices to index into the emotions array or vice versa
  //   alert(`This message is most strongly associated with the emotion of ${emotions[maxConfIndex]}!`); // 1:1 correspondence betwen indices in both confidence and emotion arrays
  // }
}

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
    borderRadius: 6,
    backgroundColor: 'grey'
  },
});