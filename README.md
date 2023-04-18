## About

UnderTone is a mobile app that takes an English text input and uses machine learning-powered sentiment analysis to identify the emotion(s) expressed by that text, with the goal of helping non-native speakers of English understand how their text messages might come across to others.

## How to Contribute

**PREREQUISITES:**  Make sure you have [Node.js](https://nodejs.org/en) 17+ and the `npm` package manager installed on your computer. Register an Expo account at https://expo.dev/signup, install the [Expo Go](https://expo.dev/client) app on your mobile device or simulator, and log in to your Expo account within the app. Both your computer and your mobile environment should be connected to the same network.

#### .env setup
1. Create a .env file in src with the following parameters
2. API_TOKEN='<Insert gcp token>' - To get the token run gcloud auth print-access-token on your Google Cloud Shell
3. ENDPOINT_ID='<insert endpoint id>' - Can be found on the Deploy & Test page of the model on Vertex AI under 'Sample request'
4. PROJECT_ID='<insert project id>' - Can be found on the Deploy & Test page of the model on Vertex AI under 'Sample request'

If you are getting a dotenv error: Run `npm install react-native-dotenv`

1. Run `git clone https://github.com/Rohaan553/UnderTone.git` to download the app files to your computer.
2. `cd` into the `src` directory and run `npm install` to install the app's dependencies.
3. Run `npx expo login` and enter your Expo account credentials to log in to Expo Application Services on your computer.
4. Run `npx expo start` to start the development server.
5. On your mobile device, the development server should automatically appear on the **Home** tab of Expo Go.



