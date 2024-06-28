import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ArticleDetail = ({ article, onBack }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.content}>{article.content}</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Назад к статьям</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background for comfortable reading
    marginTop: 40,
  },
  scrollView: {
    padding: 20,
  },
  title: {
    color: 'tomato',
    fontSize: 28, // Larger font size for the title
    fontWeight: 'bold', // Bold title
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    color: 'white',
    fontSize: 18, // Slightly larger font size for content
    lineHeight: 28, // Increased line height for better readability
    textAlign: 'justify', // Justify text for a clean look
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 15, // More padding for a larger touch area
    paddingHorizontal: 25,
    backgroundColor: 'tomato',
    borderRadius: 25,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18, // Larger font size for button text
    fontWeight: 'bold', // Bold button text
  },
});

export default ArticleDetail;
