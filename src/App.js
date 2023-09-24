import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@mui/material/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState, useEffect} from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TuneIcon from '@mui/icons-material/Tune';
import SpeedIcon from '@mui/icons-material/Speed';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputAdornment, IconButton, TextField } from '@mui/material';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import languagesData from './languages/languages.json';
import FormControl from '@material-ui/core/FormControl';


import azureVoices from './voices/azureVoices.json';
import amazonVoices from './voices/amazonVoices.json';
import googleVoices from './voices/googleVoicesV2.json';
import tiktokVoices from './voices/tiktokVoicesV2.json';


import ReactAudioPlayer from 'react-audio-player';

import logo from './images/Logo.png';
import githubImage from './images/github.png';
import twitterImage from './images/twitter.png';
import youtubeImage from './images/youtube.png';





function App() {

  const socialImageStyle = {
    width: '40px',      // Set the desired width
    height: '40px',     // Set the desired height
    marginRight: '10px' // Add spacing between images
  };


  const initialPitch = 0;
  const initialSpeed = 0;
  const initialVolume = 100;


 

  const [APIKey, setAPIKey] = useState('');
  const [WebsocketServerIP, setWebsocketServerIP] = useState('localhost');
  const [WebsocketPort, setWebsocketPort] = useState("9008");
  const [charLimit, setCharLimit] = useState(0);
  const [charUsed, setCharUsed] = useState(0);

  const [transCharLimit, setTransCharLimit] = useState(0);
  const [transCharUsed, setTransCharUsed] = useState(0);
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    // Retrieve the API key from localStorage when the component mounts
    const localStorageKeys = [
      'APIKey',
      'charLimit',
      'charUsed',
      'transCharLimit',
      'transCharUsed',
      'textValue',
      'WebsocketServerIP',
      'WebsocketPort',
      'WebsocketEnabled',
      'AudioGenerationDisabled'
    ];
  
    localStorageKeys.forEach((key) => {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        switch (key) {
          case 'APIKey':
            setAPIKey(storedValue);
            break;
          case 'charLimit':
            setCharLimit(storedValue);
            break;
          case 'charUsed':
            setCharUsed(storedValue);
            break;
          case 'transCharLimit':
            setTransCharLimit(storedValue);
            break;
          case 'transCharUsed':
            setTransCharUsed(storedValue);
            break;
          case 'textValue':
            setTextValue(storedValue);
            handleTextChange({ target: { value: storedValue } });
            break;
          case 'WebsocketServerIP':
            setWebsocketServerIP(storedValue);
            break;
          case 'WebsocketPort':
            setWebsocketPort(storedValue);//web socket values need to be set before the send bool
            break;
          case 'WebsocketEnabled':
            setIsWebSocketEnabled(storedValue);//web socket values need to be set before the send bool
            break;
          case 'AudioGenerationDisabled':
              setIsAudioGenDisabled(storedValue);//web socket values need to be set before the send bool
              break;
          default:
            break;
        }
      }
    });
  }, []);

   // Function to handle changes to the APIKey and update localStorage
   const handleAPIKeyChange = (event) => {
    const newAPIKey = event.target.value;
    setAPIKey(newAPIKey);

    // Store the API key in localStorage
    localStorage.setItem('APIKey', newAPIKey);
  };

  const handleServerIPChange = (event) => {
    const newWebsocketServerIP = event.target.value;
    setWebsocketServerIP(newWebsocketServerIP);

    // Store 
    localStorage.setItem('WebsocketServerIP', newWebsocketServerIP);
  };

  const handleServerPortChange = (event) => {
    const newPort = event.target.value;
    setWebsocketPort(newPort);

    // Store the API key in localStorage
    localStorage.setItem("WebsocketPort", newPort);
  };



  const [selectedEngine, setSelectedEngine] = useState('Azure');
  const [selectedAccent, setSelectedAccent] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState('en-US-SaraNeural');
  const [selectedStyle, setSelectedStyle] = useState('normal');
  const [localeOptions, setLocaleOptions] = useState([]);
  const [inputLanguage, setInputLanguage] = useState('English [en-US] (Default)');
  const [outputLanguage, setOutputLanguage] = useState('No Translation (Default)');
  const [pitch, setPitch] = useState(initialPitch);
  const [speed, setSpeed] = useState(initialSpeed);
  const [volume, setVolume] = useState(initialVolume);





   // Define the voice sources as an object
   const voiceSources = {
    "Azure": azureVoices,
    "Amazon Polly": amazonVoices,
    "Google Cloud (Pro Only)": googleVoices,
    "TikTok": tiktokVoices,

    // Add more engines and import their voices as needed
    // Example:
    // "IBM Watson (Pro Only)": ibmWatsonVoices,
  };

  useEffect(() => {
    const selectedEngineVoices = voiceSources[selectedEngine];
    if (selectedEngineVoices) {
      const uniqueLocales = [...new Set(selectedEngineVoices.map(voice => getLocaleBaseName(voice.Locale)))];
      

      // Map the unique locales to menu items, grouping similar locales
      const localeMenuItems = uniqueLocales.map(locale => (
        <MenuItem key={locale} value={locale}>
          {getLocaleDisplayName(locale)}
        </MenuItem>
      ));

      setLocaleOptions(localeMenuItems);
    }
  }, [selectedEngine]);

  const localeMappings = {
    'af': 'Afrikaans',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'yue': 'Cantonese (Simplified)',
    'ca': 'Catalan',
    'zh': 'Chinese',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'fil': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'gl': 'Galician',
    'de': 'German',
    'el': 'Greek',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'ko': 'Korean',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'mk': 'Macedonian',
    'ms': 'Malay',
    'mr': 'Marathi',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt-BR': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sr': 'Serbian',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'es': 'Spanish',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tw': 'Taiwanese',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
  };

  const getLocaleDisplayName = (locale) => {
    // Get the display name for a specific locale or group  

    return localeMappings[locale] || locale;
  };

  const getLocaleBaseName = (locale) => {
    // Split the locale on the dash and keep only the part before the dash
    return locale.split('-')[0];
  };

  const filterVoicesByLocale = (locale, selectedEngine) => {
    const voices = voiceSources[selectedEngine] || []; // Default to an empty array if the engine is not found
    return voices.filter((voice) => getLocaleBaseName(voice.Locale) === locale);
  };

  const updateAvailableVoices = () => {
    // Filter voices based on the selected accent (Locale)
    const filteredVoices = filterVoicesByLocale(selectedAccent,selectedEngine);

    setAvailableVoices(filteredVoices);
  };
  const updateAvailableStyles= () => {
    // Filter voices based on the selected accent (Locale)
    const filteredVoices = filterVoicesByLocale(selectedAccent,selectedEngine);

    // Extract available styles from the filtered voices
    const availableStyles = [].concat(
      ...filteredVoices
        .filter((voice) => voice.ShortName === selectedVoice)
        .map((voice) => voice.StyleList)
    );
    setAvailableStyles(availableStyles);
  };


  const [availableVoices, setAvailableVoices] = useState([]);
  const [availableStyles, setAvailableStyles] = useState([]);

  useEffect(() => {
    // Update available voices and styles whenever selectedAccent or selectedEngine changes
    updateAvailableVoices();
   
  }, [selectedAccent, selectedEngine]);

  useEffect(() => {
    updateAvailableStyles();
   
  }, [selectedVoice]);

  useEffect(() => {
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].ShortName);
    }
    if(selectedAccent == "en" && selectedEngine == "Azure")
    {
      setSelectedVoice("en-US-SaraNeural");
    }
  }, [availableVoices]);



  const handleAccentChange = (e) => {
    setSelectedAccent(e.target.value);

    // Set a default voice here (e.g., the first available voice)
   
  };


  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword2, setShowPassword2] = useState(false);

  const handleTogglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };


  


const handlePitchChange = (event, newValue) => {
  setPitch(newValue);
};

const handleSpeedChange = (event, newValue) => {
  setSpeed(newValue);
};

const handleVolumeChange = (event, newValue) => {
  setVolume(newValue);
};

const handlePitchInputChange = (event) => {
  setPitch(event.target.value === '' ? 0 : Number(event.target.value));
};

const handleSpeedInputChange = (event) => {
  setSpeed(event.target.value === '' ? 0 : Number(event.target.value));
};

const handleVolumeInputChange = (event) => {
  setVolume(event.target.value === '' ? 0 : Number(event.target.value));
};


const handlePitchBlur = () => {
  if (pitch < 0) {
    setPitch(0);
  } else if (pitch > 100) {
    setPitch(100);
  }
};

const handleSpeedBlur = () => {
  if (speed < 0) {
    setSpeed(0);
  } else if (speed > 100) {
    setSpeed(100);
  }
};

const handleVolumeBlur = () => {
  if (volume < 0) {
    setVolume(0);
  } else if (volume > 100) {
    setVolume(100);
  }
};



const [audioUrl, setAudioUrl] = useState(''); // State variable to hold audio URL
const [textUsed, setTextUsed] = useState('');
const [errorMessage, setErrorMessage] = useState(''); // State variable to hold error message


const handleNoTTS = async (text) => {
  setAudioUrl('');
  setTextUsed(text);
};

const handlePlayTTS2 = async (text) => {
  console.log('log works');

  if(selectedEngine !== "TikTok")
  {
  try {


    
    const message = {
      // Set your message parameters here
      TTSMode: selectedEngine,
      text: text,
      Voice: selectedVoice,
      Style: selectedStyle,
      Speed: speed,
      Pitch: pitch,
      Volume: volume,
      SpokenLang: inputLanguage,
      TranslateLang: outputLanguage,
      transAudio: true
    };
    //local host on port 3000 is allowed on voice wizard pro
    const url = `https://ttsvoicewizard-playground.herokuapp.com/api/tts?` +
      `apiKey=${APIKey}` +
      `&TTSMode=${message.TTSMode}` +
      `&text=${message.text}` +
      `&voice=${message.Voice}` +
      `&style=${message.Style}` +
      `&speed=${message.Speed}` +
      `&pitch=${message.Pitch}` +
      `&volume=${message.Volume}` +
      `&fromLang=${message.SpokenLang}` +
      `&toLang=${message.TranslateLang}` +
      `&transAudio=${message.transAudio}`;

    const response = await fetch(url, {
      method: 'POST',
      dataType: 'jsonp'
      
    });

    if (response.ok) {
      const json = await response.json();
      const dataHere = json.audioString;
      setCharUsed(json.charUsed);
      setCharLimit(json.charLimit);
      setTransCharUsed(json.transCharUsed);
      setTransCharLimit(json.transCharLimit);
      const voiceWizardAPITranslationString = json.translationText;

      localStorage.setItem('charLimit', charLimit);
      localStorage.setItem('charUsed', charUsed);
      localStorage.setItem('transCharLimit', transCharLimit);
      localStorage.setItem('transCharUsed', transCharUsed);

      // Convert dataHere to a WAV file, assuming you have a function to do that

       // Convert base64 audio to a Blob
       const byteCharacters = atob(dataHere);
       const byteNumbers = new Array(byteCharacters.length);
       for (let i = 0; i < byteCharacters.length; i++) {
         byteNumbers[i] = byteCharacters.charCodeAt(i);
       }
       const byteArray = new Uint8Array(byteNumbers);
       const blob = new Blob([byteArray], { type: 'audio/wav' });
 
       // Create a URL for the Blob
       const blobUrl = URL.createObjectURL(blob);

       setAudioUrl(blobUrl);
       setTextUsed(text);
       setErrorMessage('');
 
       // Create an Audio element
       const audio = new Audio(blobUrl);
       const audio2 = new Audio(blobUrl);
 
       // Play the audio
       if(selectedOutputDevice)
       {
        audio.setSinkId(selectedOutputDevice)
        if(isOutputDevice2Visible)
        {
          audio2.setSinkId(selectedOutputDevice2)
        }
       }
       audio.volume = volume*.01; 
       audio2.volume = volume*.01; 
       if(isAudioEnabled)
       {
        audio.play();
        if(isOutputDevice2Visible)
        {
          audio2.play();
        }
       }



      // Display other values
      
      console.log(message.TTSMode);
      console.log(`TTS Characters Used: ${charUsed}/${charLimit}`);
      console.log(`Translation Characters Used: ${transCharUsed}/${transCharLimit}`);
      console.log(message.SpokenLang);
      console.log(message.TranslateLang);
      console.log(message.transAudio);
    } else {
      setErrorMessage('An error occurred. Please try again.');
      setAudioUrl('');
      setTextUsed('');
      console.error('API call failed:', response.status, response.statusText);
    }
  } catch (error) {
    setErrorMessage('An error occurred. Please try again.');
      setAudioUrl('');
      setTextUsed('');
    console.error('Error making API call:', error);
  }
}
else
{
  try {

    console.log(selectedEngine);
    
    //local host on port 3000 is allowed on voice wizard pro
    const url = `https://tiktok-tts.weilnet.workers.dev/api/generation`;

   
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: selectedVoice, // Make sure to define GetTikTokVoice function
      }),
    });

    if (response.ok) {
      const json = await response.json();
      const dataHere = json.data;

      // Convert dataHere to a WAV file, assuming you have a function to do that

       // Convert base64 audio to a Blob
       const byteCharacters = atob(dataHere);
       const byteNumbers = new Array(byteCharacters.length);
       for (let i = 0; i < byteCharacters.length; i++) {
         byteNumbers[i] = byteCharacters.charCodeAt(i);
       }
       const byteArray = new Uint8Array(byteNumbers);
       const blob = new Blob([byteArray], { type: 'audio/wav' });
 
       // Create a URL for the Blob
       const blobUrl = URL.createObjectURL(blob);

       setAudioUrl(blobUrl);
       setTextUsed(text);
       setErrorMessage('');
 
       // Create an Audio element
       const audio = new Audio(blobUrl);
       const audio2 = new Audio(blobUrl);
 
       // Play the audio
       if(selectedOutputDevice)
       {
        audio.setSinkId(selectedOutputDevice)
        if(isOutputDevice2Visible)
        {
          audio2.setSinkId(selectedOutputDevice2)
        }
       }
       audio.volume = volume*.01; 
       audio2.volume = volume*.01; 
       if(isAudioEnabled)
       {
        audio.play();
        if(isOutputDevice2Visible)
        {
          audio2.play();
        }
       }




    } else {
      setErrorMessage('An error occurred. Please try again.');
      setAudioUrl('');
      setTextUsed('');
      console.error('API call failed:', response.status, response.statusText);
    }
  } catch (error) {
    setErrorMessage('An error occurred. Please try again.');
      setAudioUrl('');
      setTextUsed('');
    console.error('Error making API call:', error);
  }

}
};

const handlePlayButtonPress = () => {


      sendWebSocketMessage(textValue);
      if(!isAudioGenDisabled)
      {
        handlePlayTTS2(textValue);
      }
      else
      { 
        handleNoTTS(textValue);
      }
};

  const [outputDevices, setOutputDevices] = useState([]);
  const [selectedOutputDevice, setSelectedOutputDevice] = useState(null);
  const [selectedOutputDevice2, setSelectedOutputDevice2] = useState(null);

  const [isOutputDevice2Visible, setOutputDevice2Visible] = useState(false);
  const toggleOutputDevice2Visibility = () => {
    setOutputDevice2Visible(!isOutputDevice2Visible);
  };

  useEffect(() => {
    // Function to enumerate audio output devices
    const enumerateAudioOutputDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
        setOutputDevices(audioOutputDevices);
  
        // Set the selectedOutputDevice to the deviceId of the first device
        if (audioOutputDevices.length > 0) {
          setSelectedOutputDevice(audioOutputDevices[0].deviceId);
          setSelectedOutputDevice2(audioOutputDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error enumerating audio output devices:', error);
      }
    };
  
    // Enumerate audio output devices when the component mounts
    enumerateAudioOutputDevices();
  }, []);

  const handleOutputDeviceChange = (event) => {
    const selectedDeviceId = event.target.value;
    setSelectedOutputDevice(selectedDeviceId);
    // Here, you can set the audio output to the selected device
    // using the Web Audio API, as mentioned in the previous answer
  };
  const handleOutputDeviceChange2 = (event) => {
    const selectedDeviceId = event.target.value;
    setSelectedOutputDevice2(selectedDeviceId);
    // Here, you can set the audio output to the selected device
    // using the Web Audio API, as mentioned in the previous answer
  };

  const [isAudioEnabled, setIsAudioEnabled] = useState(true); // Initial state is true

  const toggleSwitchAudio = () => {
    setIsAudioEnabled((prevValue) => !prevValue); // Toggle the boolean state
  };

 
  const [socket, setSocket] = useState(null);
  const [isWebSocketEnabled, setIsWebSocketEnabled] = useState(false);



  useEffect(() => {
    let newSocket = null;

    if (isWebSocketEnabled) {
      // Create a new WebSocket when the component mounts
      newSocket = new WebSocket("ws://"+WebsocketServerIP+":"+WebsocketPort);

      newSocket.addEventListener("open", () => {
        console.log("WebSocket connection opened");
        setSocket(newSocket); // Store the socket in state when it's open
      });

      newSocket.addEventListener("error", (event) => {
        console.error("WebSocket error:", event);
      });

      newSocket.addEventListener("close", (event) => {
        console.log("WebSocket connection closed");
        if (event.wasClean) {
          console.log("WebSocket connection closed cleanly");
        } else {
          console.error("WebSocket connection unexpectedly closed");
        }
      });
    }

    // Clean up the WebSocket when the component unmounts
    return () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [isWebSocketEnabled]);

  const sendWebSocketMessage = (messageToSend) => {
    if (socket && socket.readyState === WebSocket.OPEN) {


      socket.send(messageToSend);
    } else {
      console.error("WebSocket is not open or not available");
    }
  };
  
  const [isListening, setIsListening] = useState(false);
  const Dictaphone = () => {
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
  
    } = useSpeechRecognition();

    

     useEffect(() => {
    // Add an event listener to detect when speech recognition stops
    if(listening === false)
    {  
      if(transcript)
      {
      sendWebSocketMessage(transcript);
        if(!isAudioGenDisabled)
        {
          handlePlayTTS2(transcript);
        }
        else
        { 
          handleNoTTS(transcript);
        }
      }
      if(isListening ===true)
      {
        SpeechRecognition.startListening({language: inputLanguage });
      }
    } 

  }, [listening]);
  
    {/*const [isListening, setIsListening] = useState(false);*/}
  
  
      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition (Try Google Chrome).<br/></span>;
      }
  
  
  
    
  
    const handleToggleListening = () => {
      if (!listening) {
        SpeechRecognition.startListening({language: inputLanguage });
        setIsListening(true);
      } 
      else {
        SpeechRecognition.stopListening(); 
        setIsListening(false);
          
      }
  
    };
  
  
  
  
  
    return (
      <div>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
        <Button
          variant="contained"
          color={listening ? 'success' : 'primary'}
          onClick={handleToggleListening}
        >
          {listening ? 'Stop' : 'Speak'}
        </Button>
       {/* <button onClick={resetTranscript}>Clear</button>*/}
        <p>{transcript}</p>
      </div>
    );
  };// add Dictaphone like this: <Dictaphone />




  const toggleWebSocket = () => {
    setIsWebSocketEnabled((prevEnabled) => !prevEnabled);

    localStorage.setItem('WebsocketEnabled', isWebSocketEnabled);
  };



const populateInputLanguage = () => {
  return languagesData
    .filter(language => language.sourceName !== "")
    .map(language => (
      <MenuItem key={language.sourceName} value={language.sourceName}>
        {language.sourceName}
      </MenuItem>
    ));
};

const populateOutputLanguage = () => {
  return languagesData
    .filter(language => language.targetName !== "")
    .map(language => (
      <MenuItem key={language.targetName} value={language.targetName}>
        {language.targetName}
      </MenuItem>
    ));
};

const [isAudioGenDisabled, setIsAudioGenDisabled] = useState(false);


  const toggleAudioGen = () => {
    setIsAudioGenDisabled((prevEnabled) => !prevEnabled);

    localStorage.setItem('AudioGenerationDisabled', isAudioGenDisabled);
  };

const [wordCount, setWordCount] = useState(0);



const handleTextChange = (e) => {
  const inputValue = e.target.value;
  
  // Enforce the word limit (300 characters)
  if (inputValue.length <= 300) {
    setTextValue(inputValue);
    setWordCount(inputValue.length);

    localStorage.setItem('textValue', inputValue);
   
  }
};



  return (
    <div className="App" >
   
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>


    <AppBar position="static">
      <Toolbar>
        {/* <Button color="inherit" component={Link} to="/">Home</Button> */}
        <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
        <ul className="nav-links">
        <Button color="inherit" component="a" href="https://github.com/VRCWizard/TTS-Voice-Wizard/wiki/Quickstart-Guide">Documentation</Button>
        <Button color="inherit" component="a" href="https://ko-fi.com/ttsvoicewizard/tiers">Pricing</Button>
        <Button color="inherit" component="a" href="https://ttsvoicewizard.com/#contact">Contact</Button>
        </ul>
      </Toolbar>
    </AppBar> 
    <br/>
    <Card
      sx={{
        minWidth: 300,
        marginLeft: '1in',
        marginRight: '1in',
      }}
    >
       <Typography variant="h5" component="div">
          Speech to Text
        </Typography>
    <Dictaphone />


 

    </Card>
    <br/>
    <Card
      sx={{
        minWidth: 300,
        marginLeft: '1in',
        marginRight: '1in',
      }}
    >
    <CardContent>
      {/* Title */}
      <Typography variant="h5" component="div">
        Text to Speech
      </Typography>
      {/* Text Field */}
      <TextField
        label="Text to Speech"
        multiline
        rows={6}
        value={textValue}
        onChange={handleTextChange}
        fullWidth
        inputProps={{ maxLength: 300 }} // Enforce the maximum length (300 characters)
        
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'left' }}>
            Word Count: {wordCount} / 300
          </div>

       <div style={{ textAlign: 'right' }}>
         Character Usage: {charUsed} / {charLimit}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
         Translation Character Usage: {transCharUsed} / {transCharLimit}
        </div>
        
      
      <br />
      <br />
      <Button variant="contained" color="primary" onClick={() => handlePlayButtonPress()}>
        Play TTS
      </Button>
    </CardContent>
    </Card>

<br/>

<Card
      sx={{
        minWidth: 300,
        marginLeft: '1in',
        marginRight: '1in',
      }}
    >

<CardContent>
   {/* Title */}
   <Typography variant="h5" component="div">
        Output
      </Typography>
   {/* Display the error message in red */}
   {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

{/* Display the text used */}
{textUsed && <p>"{textUsed}"</p>}

{/* Render your audio player here */}
  {/* Conditionally render the audio player based on whether audioUrl is not empty */}
    
  {audioUrl && (
         
        <ReactAudioPlayer
          src={audioUrl}
          autoPlay={false} // Set autoPlay to false
          controls
        />
      )}

    </CardContent>

      
</Card>

<br/>


<Card
      sx={{
        minWidth: 300,
        marginLeft: '1in',
        marginRight: '1in',
      }}
    >

<CardContent>
        {/*Title*/}
        <Typography variant="h5" component="div">
          Customization
        </Typography>

<div style={{ display: 'flex', gap: '20px' }}>

     {/*Engine Dropdown*/}
     <TextField 
     select 
     variant={"outlined"} 
     style={{width: "40%"}} 
     label="Engine"
     value={selectedEngine}
     onChange={(e) => setSelectedEngine(e.target.value)}
     >
      {Object.keys(voiceSources).map((engineName) => (
          <MenuItem key={engineName} value={engineName}>
            {engineName}
          </MenuItem>
        ))}
</TextField>
    

     {/*Accent Dropdown*/}
    <TextField 
    select 
    variant={"outlined"} 
    style={{width: "80%"}} 
    label="Locale"
    value={selectedAccent}
    onChange={handleAccentChange}
    >
      {localeOptions
    .filter(locale => localeMappings.hasOwnProperty(locale.props.value))
    .sort((a, b) => {
      const localeA = localeMappings[a.props.value];
      const localeB = localeMappings[b.props.value];
      return localeA.localeCompare(localeB);
    })
    .map(filteredLocale => filteredLocale)
}
</TextField>


 {/*Voice Dropdown*/}
 <TextField 
 select 
 variant={"outlined"} 
 style={{width: "50%"}} 
 label="Voice"
 value={selectedVoice}
 onChange={(e) => setSelectedVoice(e.target.value)}
 >
   <MenuItem value="">Select a voice</MenuItem>
        {availableVoices.map((voice) => (

          <MenuItem key={voice.ShortName} value={voice.ShortName}>
            {voice.ShortName}
          </MenuItem>
        ))}
</TextField>
    

     {/*Style Dropdown*/}
    <TextField 
    select 
    variant={"outlined"} 
    style={{width: "40%"}} 
    label="Style"
    value={selectedStyle}
    onChange={(e) => setSelectedStyle(e.target.value)}
    >
    <MenuItem value="">Select a style</MenuItem>
    <MenuItem value={"normal"}>normal</MenuItem> 
        {availableStyles.map((style) => (
          <MenuItem key={style} value={style}>
            {style}
          </MenuItem>
        ))}
</TextField>


    </div>

    <div style={{ display: 'flex', gap: '20px' }}>
    {/*Volume Slider*/}
<Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        Volume
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <VolumeUpIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof volume === 'number' ? volume : 0}
            onChange={handleVolumeChange}
            aria-labelledby="input-slider"
            min={0} // Set the minimum value
            max={100}  // Set the maximum value
          />
        </Grid>
        <Grid item>
          <Input
            value={volume}
            size="small"
            onChange={handleVolumeInputChange}
            onBlur={handleVolumeBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>


     {/*Pitch Slider*/}
<Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        Pitch
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TuneIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof pitch === 'number' ? pitch : 0}
            onChange={handlePitchChange}
            aria-labelledby="input-slider"
            min={-100} // Set the minimum value
            max={100}  // Set the maximum value
          />
        </Grid>
        <Grid item>
          <Input
            value={pitch}
            size="small"
            onChange={handlePitchInputChange}
            onBlur={handlePitchBlur}
            inputProps={{
              step: 10,
              min: -100,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>


      {/*Speed Slider*/}
<Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        Speed
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <SpeedIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof speed === 'number' ? speed : 0}
            onChange={handleSpeedChange}
            aria-labelledby="input-slider"
            min={-100} // Set the minimum value
            max={100}  // Set the maximum value
          />
        </Grid>
        <Grid item>
          <Input
            value={speed}
            size="small"
            onChange={handleSpeedInputChange}
            onBlur={handleSpeedBlur}
            inputProps={{
              step: 10,
              min: -100,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
    </div>



    <br/>

    <div style={{ display: 'flex', gap: '20px' }}>


     {/*InputLanguage Dropdown*/}
     <TextField select 
     variant={"outlined"} 
     style={{width: "50%"}} 
     label="Source Language"
     value = {inputLanguage}
     onChange={(e) => setInputLanguage(e.target.value)}
     >
    {populateInputLanguage()}
</TextField>
    

     {/*OutputLanguage Dropdown*/}
    <TextField select 
    variant={"outlined"} 
    style={{width: "50%"}} 
    label="Target Language"
    value = {outputLanguage}
    onChange={(e) => setOutputLanguage(e.target.value)}
    >
    <MenuItem value={"No Translation (Default)"}>No Translation (Default)</MenuItem>  
    
    {populateOutputLanguage()}
</TextField>



    </div>

    <br/>
    <br/>

   
    <Box sx={{ maxWidth: 250 }}>
   
    <TextField
      type={showPassword ? 'text' : 'password'}
      style={{width: "200%"}} 
      label="Voice Wizard Pro Key"
      value={APIKey}
      onChange={handleAPIKeyChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Toggle password visibility"
              onClick={handleTogglePasswordVisibility}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    
    </Box>

    </CardContent> 
</Card>
    <br/>
    <br/>


    <Card
      sx={{
        minWidth: 300,
        marginLeft: '1in',
        marginRight: '1in',
      }}
    >
<CardContent>
  {/*Title*/}
  <Typography variant="h5" component="div">
          Audio
        </Typography>

        <FormControlLabel
        control={<Switch checked={isAudioEnabled} onChange={toggleSwitchAudio} />}
        label="Auto Play TTS"
      />

<div style={{  }}>
     {/*OutputDevice Dropdown*/}
     <TextField select 
    variant={"outlined"} 
    style={{width: "50%"}} 
    label="Audio Output Device 1"
    value={selectedOutputDevice}
    onChange={handleOutputDeviceChange}
    InputLabelProps={{
      shrink: selectedOutputDevice !== null, // This will shrink the label when the field is not empty, this fixes it not shrinking when device is first added
    }}
  
    >
         
        {outputDevices.map(device => (
          <MenuItem key={device.deviceId} value={device.deviceId}>
            {device.label}
          </MenuItem>
        ))}

</TextField>

<br/>

   {/* Switch to toggle OutputDevice 2 visibility */}
   <FormControlLabel
          control={
            <Switch
              checked={isOutputDevice2Visible}
              onChange={toggleOutputDevice2Visibility}
            />
          }
          label="Enable 2nd Output Device"
        />

<br/>

 {/*OutputDevice 2 Dropdown*/}
 {isOutputDevice2Visible && (
          <TextField
            select
            variant="outlined"
            style={{ width: '50%' }}
            label="Audio Output Device 2"
            value={selectedOutputDevice2}
            onChange={handleOutputDeviceChange2}
            InputLabelProps={{
              shrink: selectedOutputDevice2 !== null,
            }}
          >
            {outputDevices.map(device => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </TextField>
        )}

</div>


    <br/>
    <br/>


</CardContent> 
</Card>
    <br/>
    <br/>


    <Card
      sx={{
        minWidth: 300,
        marginLeft: '1in',
        marginRight: '1in',
      }}
    >

<CardContent>
    {/*Title*/}
    <Typography variant="h5" component="div">
          WebSocket / OSC Integration
        </Typography>

        <FormControlLabel control={<Switch defaultChecked />} 
    checked={isWebSocketEnabled}
    onChange={toggleWebSocket}
   label="Send to WebSocket (to be forwarded over OSC)" />

<br/>

<FormControlLabel control={<Switch defaultChecked />} 
    checked={isAudioGenDisabled}
    onChange={toggleAudioGen}
   label="Disable audio generation from web app (only send text)" />




    <div style={{ display: 'flex', gap: '20px' }}>
    
   
   <TextField
     type={showPassword2 ? 'text' : 'password'}
     style={{width: "100%"}} 
     label="Websocket Server IP"
     value={WebsocketServerIP}
     onChange={handleServerIPChange}
     InputProps={{
       endAdornment: (
         <InputAdornment position="end">
           <IconButton
             aria-label="Toggle password visibility"
             onClick={handleTogglePasswordVisibility2}
             edge="end"
           >
             {showPassword2 ? <Visibility /> : <VisibilityOff />}
           </IconButton>
         </InputAdornment>
       ),
     }}
   />
   
  

   
   
   <TextField
     style={{width: "50%"}} 
     label="Websocket Server Port"
     value={WebsocketPort}
     onChange={handleServerPortChange}
   />
   
   
   </div>

   <p>OSC can not be sent directly from the browser, that's why we send to a locally hosted Websocket server (which then sends the OSC message).</p>
   <p>The desktop version of TTS Voice Wizard has a Websocket server built-in for receiving text from the web app.</p>
   <p>If your server is on a different machine make sure to change the IP from localhost to the actual IP address.</p>
   
   <br/>
   <br/>
    

    </CardContent>

      
    </Card>





 
  
       
    </FormControl>

    <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</link>
</head>
    <footer>
      
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <p> Copyright &copy; 2023 TTS Voice Wizard. All Rights Reserved.</p>
            </div>


            <div className="col-md-6">
      <ul className="list-inline social-buttons" style={{ display: 'flex', alignItems: 'center' }}>
        <li className="list-inline-item">
          <a href="https://github.com/VRCWizard" target="_blank" rel="noopener noreferrer">
            <img src={githubImage} alt="GitHub" style={socialImageStyle} />
          </a>
        </li>
        <li className="list-inline-item">
          <a href="https://twitter.com/Wizard_VR" target="_blank" rel="noopener noreferrer">
            <img src={twitterImage} alt="Twitter" style={socialImageStyle} />
          </a>
        </li>
        <li className="list-inline-item">
          <a href="https://www.youtube.com/@ttsvoicewizard" target="_blank" rel="noopener noreferrer">
            <img src={youtubeImage} alt="YouTube" style={socialImageStyle} />
          </a>
        </li>
      </ul>
    </div>
          
        </div>
    </div>
</footer>

      
    </div>
    
    
  );
}

export default App;