import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Draggable from 'react-native-draggable';

const AIButton = ({ 
  navigation, 
  x = Dimensions.get('window').width / 2 - 25, 
  y = Dimensions.get('window').height / 2 - 25, 
  renderText = 'AI', 
  isCircle = true, 
  renderSize =50, 
  renderColor = "#C2F2E4", 
  shouldReverse = false, 
  minX = -25, 
  maxX = Dimensions.get('window').width, 
  minY = -25, 
  maxY = Dimensions.get('window').height-100 
}) => {
  return (
    <View style={styles.container}>
      <Draggable
        x={x}
        y={y}
        renderText={renderText}
        isCircle={isCircle}
        renderSize={renderSize}
        renderColor={renderColor}
        shouldReverse={shouldReverse}
        minX={minX}
        maxX={maxX}
        minY={minY}
        maxY={maxY}
        onShortPressRelease={() => navigation.navigate('Options')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIButton;
