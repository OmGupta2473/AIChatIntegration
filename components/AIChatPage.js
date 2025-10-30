import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import for AsyncStorage
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AIChatPage = ({ route, navigation }) => {
  const { prompt, title } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTypingBot, setIsTypingBot] = useState(false); // State to track if bot is typing
  const scrollViewRef = useRef(null);
  const storageKey = `chatHistory_${title}`; // Unique storage key for each bot type

  // Animation values for bouncing balls
  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim3 = useRef(new Animated.Value(0)).current;

  // Load chat history from AsyncStorage when the component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(storageKey);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadChatHistory();
    navigation.setOptions({ title: title });
  }, [navigation, title, storageKey]);

  // Save chat history to AsyncStorage whenever messages change
  useEffect(() => {
    const saveChatHistory = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    };

    saveChatHistory();
  }, [messages, storageKey]);

  // Start bouncing animation
  const startBouncingAnimation = () => {
    [bounceAnim1, bounceAnim2, bounceAnim3].forEach((anim, index) => {
      anim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
    });
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputText('');
      setIsTypingBot(true); // Start typing animation
      startBouncingAnimation(); // Start bouncing animation

      // Prepare messages for Groq, including chat history
      const chatHistory = messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant', // Ensure valid roles
        content: msg.text,
      }));

      try {
        console.log('Sending messages to Groq:', [
          { role: 'system', content: prompt },
          ...chatHistory,
          { role: 'user', content: inputText },
        ]);

        const chatCompletion = await client.chat.completions.create({
          messages: [
            { role: 'system', content: prompt },
            ...chatHistory,
            { role: 'user', content: inputText },
          ],
          model: 'llama3-8b-8192',
        });

        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: chatCompletion.choices[0].message.content,
          sender: 'bot',
        };

        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, botResponse]);
          setIsTypingBot(false); // Stop typing animation
        }, 3000); // Simulate delay for bot response
      } catch (error) {
        console.error('Error fetching response from Groq:', error);
        
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I couldn't process your request.",
          sender: 'bot',
        };
        
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
          setIsTypingBot(false); // Stop typing animation
        }, 3000); // Simulate delay for error response
      }
    }
  };

  const renderItem = (item) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.messageList}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
        
        {messages.map((item) => renderItem(item))}

        {/* Bouncing balls animation when the bot is responding */}
        {isTypingBot && (
          <View style={styles.typingContainer}>
            <Animated.View style={[styles.ball, { transform: [{ translateY: bounceAnim1 }] }]} />
            <Animated.View style={[styles.ball, { transform: [{ translateY: bounceAnim2 }] }]} />
            <Animated.View style={[styles.ball, { transform: [{ translateY: bounceAnim3 }] }]} />
          </View>
        )}
        
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
          placeholderTextColor="#888"
        />
        
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.buttonText}>{'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background color
  },
  messageList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // For Android
  },
  typingContainer:{
    width: 40,
    margin: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
   },
   ball:{
     width:10,
     height:10,
    borderRadius: 5,
     backgroundColor:"#41ce8c",
   },
  userMessage: {
    backgroundColor: '#41ce8c',
    alignSelf: 'flex-end',
    color: '#FFFFFF',
  },
  botMessage: {
    backgroundColor: '#eacfd1',
    alignSelf: 'flex-start',
    color: '#000000',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF', // White background for input area
    borderRadius: 10,
  },
  input: {
    fontSize: 18,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxWidth: "80%"
  },
  sendButton: {
    backgroundColor: '#41ce8c',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
   },
});

export default AIChatPage;