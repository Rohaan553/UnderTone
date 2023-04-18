import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {API_TOKEN, PROJECT_ID, ENDPOINT_ID} from '@env';

const HomePage = () => {
  const [placeholderText, setPlaceHolderText] = useState("Type or paste your text here...");
  const [inputText, setInputText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [resetDisabled, setResetDisabled] = useState(true);
  const [requestResult, setRequestResult] = useState("");
  const [conversation, setConversation] = useState([]);
  const [convoRequestResult, setConvoRequestResult] = useState("");

  const theme = useColorScheme(); // import device's color scheme (dark mode or light mode)
  const clearButtonRef = useRef(); // get a reference to the Clear button
  const analyzeButtonRef = useRef(); // get a reference to the Analyze button
  const analyzeConvoButtonRef = useRef(); // get a reference to the Analyze button
  const resetConvoButtonRef = useRef(); // get a reference to the reset conversation button

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
      console.log(conversation.length)
      if (conversation.length > 0) {
        analyzeConvoButtonRef.current.setNativeProps({
          style: {
            backgroundColor: '#46024E'
          }
        });
      }   
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

  useEffect(() => {
    if (conversation.length > 0) {
      analyzeConvoButtonRef.current.setNativeProps({
        style: {
          backgroundColor: '#46024E'
        }
      });
      setResetDisabled(false);
      resetConvoButtonRef.current.setNativeProps({
        style: {
          backgroundColor: '#46024E'
        }
      });
    } 
  });
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

            // console.log(API_TOKEN);
            // console.log(PROJECT_ID);
            // console.log(ENDPOINT_ID);


            fetch(`https://us-central1-aiplatform.googleapis.com/ui/projects/${PROJECT_ID}/locations/us-central1/endpoints/${ENDPOINT_ID}:predict`, {
              method: "POST",
              headers: {
                "Authorization": "Bearer " + API_TOKEN,
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
              setConversation(prevConvo => [...prevConvo, {"input_text": inputText, "rawResults": rawResults, "emotion": emotionResult}]);
              setResetDisabled(false);
              setConvoRequestResult("");
              setRequestResult(emotionResult.charAt(0).toUpperCase() + emotionResult.slice(1)); //capitalizing result
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


        {/* Analyze Conversation Button */}
        <Pressable
          style={styles.unPressedButton}
          onPressIn={pressInEvent => { // restyle button on initiation of press
            analyzeConvoButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'hsl(294, 35%, 35%)'
              }
            });
          }}
          onPress={pressEvent => {
            console.log(`pressed Analyze conversation with inputText ${inputText}`);

            // console.log(API_TOKEN);
            if (inputText) { // Don't fetch is there isn't any text in the input box
              fetch(`https://us-central1-aiplatform.googleapis.com/ui/projects/${PROJECT_ID}/locations/us-central1/endpoints/${ENDPOINT_ID}:predict`, {
              method: "POST",
              headers: {
                "Authorization": "Bearer " + API_TOKEN,
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
                setResetDisabled(false);
                
                setConversation(prevConvo => [...prevConvo, {"input_text": inputText, "rawResults": rawResults, "emotion": emotionResult}]);
                let convoEmotion = getConversationPrediction(conversation);
                setConvoRequestResult(convoEmotion.charAt(0).toUpperCase() + convoEmotion.slice(1));
                
              })
              .catch(e => {
                console.log(e);
              })

              analyzeConvoButtonRef.current.setNativeProps({
                style: {
                  backgroundColor: '#46024E'
                }
            });
            } else { // no input so just evaluate the existing conversation
              let convoEmotion = getConversationPrediction(conversation);
              setConvoRequestResult(convoEmotion.charAt(0).toUpperCase() + convoEmotion.slice(1));
            }
            
          }}
          disabled={resetDisabled}
          ref={analyzeConvoButtonRef}>

          <Text style={styles.buttonText}>Analyze Conversation</Text>
        </Pressable>
        

     
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
        

        {/* Reset Conversation Button */}
        <Pressable
          style={styles.unPressedButton}
          onPressIn={pressInEvent => { // restyle button on initiation of press
            resetConvoButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'hsl(294, 35%, 35%)'
              }
            });
          }}
          onPress={pressEvent => { // when press is released
            console.log("pressed reset conversation");
            alert("Conversation Reset");
            setConversation([]);
            setResetDisabled(true);
            setConvoRequestResult("");
            setRequestResult("");

            analyzeConvoButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'grey'
              }
            });  
            resetConvoButtonRef.current.setNativeProps({
              style: {
                backgroundColor: 'grey'
              }
            });     
          }}
          disabled={resetDisabled}
          ref={resetConvoButtonRef}>
          <Text style={styles.buttonText}>Reset Conversation</Text>
        </Pressable>
        {convoRequestResult ? 
            <View style={styles.report}>
            <Text style={styles.titleText}>{"Conversation Result"}</Text>
            <Text style={styles.reportText}>{convoRequestResult}</Text>
            </View> 
            :
          <View style={styles.report}>
            <Text style={styles.titleText}>{requestResult ? "Result" : ""}</Text>
            <Text style={styles.reportText}>{requestResult ? requestResult : ""}</Text>
            </View>
        }
        

        
        

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

function getConversationPrediction(convos) {
  if (convos) {
    console.log(convos);
    let conf_map = {};
    sums = {};
    convos.forEach((convo) => {
      rawResults = convo['rawResults'];
      results = rawResults["predictions"][0];
      confidences = results["confidences"];
      emotions = results["displayNames"];

      
      confidences.forEach((conf, confIndex) => {
        
        if (emotions[confIndex] in sums) {
          sums[emotions[confIndex]] += conf;
        } else {
          sums[emotions[confIndex]] = conf;
        }
      });
    });

    maxConf = 0.0;
    maxEmotion = "";
    // maxConfIndex = 0;
    for (emotion in sums) {
      if (sums[emotion] > maxConf) {
        maxConf = sums[emotion];
        maxEmotion = emotion;
      }
    }
    console.log(maxEmotion + ' ' + maxConf)
  }
  return maxEmotion;
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
  availableButton: {
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
    backgroundColor: '#46024E'
  },
  report: {
    marginTop: '7%',
  },
  reportText: {
    color: "#46024E",
    fontSize: 32,
    fontWeight: '600',
    textAlign: "center"
  },
});