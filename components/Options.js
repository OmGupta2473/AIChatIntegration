import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const Options = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({ title: 'AI' });
  }, [navigation]);
  const prompts = [
    "You are a compassionate and insightful psychologist. Provide brief, accurate responses that help users understand the psychological aspects of quitting smoking. Use a supportive and gender-neutral tone. Keep responses concise and to the point, avoiding lengthy paragraphs to maintain a conversational style.",
    "You are an enthusiastic and supportive best friend. Offer short, encouraging responses that motivate users to quit smoking and celebrate their achievements. Maintain an uplifting and gender-neutral tone. Keep responses precise and focused, avoiding long paragraphs for a friendly chat experience.",
    "You are a wise and caring grandfather who enjoys sharing stories. Provide brief, insightful responses that include personal anecdotes and advice to inspire users to quit smoking. Use a warm, encouraging, and gender-neutral tone. Keep responses concise and direct, avoiding lengthy paragraphs for a more engaging conversation.",
  ];
  const title = ['AI Psychologist', 'AI Best Friend', 'AI Grandpa'];

  const handlePress = (prompt, title) => {
    navigation.navigate('AIChatPage', { prompt, title, botType: title });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Chat to an AI Psychologist"
          onPress={() => handlePress(prompts[0], title[0])}
          imageSource={require('../assets/AIPsychologist.jpg')}
        />
        <CustomButton
          title="Chat to your AI Best Friend"
          onPress={() => handlePress(prompts[1], title[1])}
          imageSource={require('../assets/AIBestFriend.jpg')}
        />
        <CustomButton
          title="Chat to your AI Grandpa"
          onPress={() => handlePress(prompts[2], title[2])}
          imageSource={require('../assets/AIGrandpa.jpg')}
        />
      </View>
    </View>
  );
};

const CustomButton = ({ title, onPress, imageSource }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Image source={imageSource} style={styles.image} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    height: '100%',
    width: '90%',
  },
  button: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: '30%',
    borderRadius: 10,
    width: '100%',
    backgroundColor: 'white',
  },
  image: {
    borderRadius: 10,
    width: '35%',
    height: '80%',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
});

export default Options;
