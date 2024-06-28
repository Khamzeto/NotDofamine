import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import * as Speech from 'expo-speech';

const BookDetail = ({ book, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 200; // Adjust the number of characters per page
  const totalPages = Math.ceil(book.content.length / itemsPerPage);

  const getPageContent = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return book.content.slice(start, end);
  };

  const speakContent = () => {
    Speech.speak(getPageContent());
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image style={styles.coverImage} source={{ uri: book.cover }} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.content}>{getPageContent()}</Text>
        <View style={styles.pagination}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={prevPage}
            disabled={currentPage === 0}
          >
            <Text style={styles.navButtonText}>Назад</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>
            {currentPage + 1} / {totalPages}
          </Text>
          <TouchableOpacity
            style={styles.navButton}
            onPress={nextPage}
            disabled={currentPage === totalPages - 1}
          >
            <Text style={styles.navButtonText}>Вперед</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.speakButton} onPress={speakContent}>
          <Text style={styles.speakButtonText}>Озвучить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Назад к книгам</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    marginTop: 40,
  },
  scrollView: {
    padding: 20,
  },
  coverImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: 'tomato',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    color: 'white',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'justify',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  navButton: {
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 25,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
  },
  pageNumber: {
    color: 'white',
    fontSize: 18,
  },
  speakButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'tomato',
    borderRadius: 25,
    alignItems: 'center',
  },
  speakButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: 'tomato',
    borderRadius: 25,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookDetail;
