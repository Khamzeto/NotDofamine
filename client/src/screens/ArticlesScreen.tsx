import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import ArticleDetail from '../components/ArticleDetail';
import PodcastPlayerModal from '../components/PodcastPlayerModal';
import BookDetail from '../components/BookDetail';

const articles = [
  {
    title: 'Саморазвитие: Путь к Лучшему Себе',
    content:
      'Саморазвитие – это постоянный процесс улучшения себя. Начните с постановки целей и создайте план их достижения. Важно развивать как физические, так и умственные навыки. Читайте книги, слушайте подкасты, занимайтесь спортом и учитесь новому.',
  },
  {
    title: 'Как Справиться с Прокрастинацией',
    content:
      'Прокрастинация может быть большим препятствием на пути к успеху. Начните с выявления причин откладывания дел. Разработайте систему тайм-менеджмента, установите приоритеты и создайте рабочее окружение, способствующее концентрации.',
  },
  {
    title: 'Развитие Эмоционального Интеллекта',
    content:
      'Эмоциональный интеллект важен для личного и профессионального роста. Учитесь понимать и управлять своими эмоциями, а также эмпатии к другим людям. Практикуйте активное слушание и развивайте навыки межличностного общения.',
  },
];

const books = [
  {
    title: 'Не тупи',
    cover: 'https://fkniga.ru/media/product/03/03081003/KA-00374017.jpg',
    content: `
      Глава 1: Введение в Саморазвитие

      Саморазвитие – это непрерывный процесс улучшения себя во всех аспектах жизни. Для достижения этого необходимо установить четкие цели и стремиться к их выполнению. Важно не только развивать свои профессиональные навыки, но и уделять внимание личностному росту. Читайте книги, посещайте тренинги, общайтесь с успешными людьми и учитесь новому. Путь к лучшей версии себя не всегда будет легким, но постоянная работа над собой принесет удовлетворение и успех.

      Глава 2: Сила Привычек

      Привычки играют ключевую роль в нашем саморазвитии. Они формируют наш образ жизни и влияют на нашу продуктивность. Чтобы создать полезные привычки, нужно начать с маленьких шагов и постепенно увеличивать их сложность. Используйте методику "маленьких шагов", чтобы постепенно привыкнуть к новым действиям. Например, если вы хотите начать заниматься спортом, начните с 5-минутной тренировки каждый день и постепенно увеличивайте время.

      Глава 3: Мотивация и Цели

      Мотивация – это двигатель нашего прогресса. Устанавливайте конкретные и измеримые цели, чтобы поддерживать мотивацию на высоком уровне. Разделите большие цели на маленькие задачи, чтобы не перегружаться и видеть прогресс. Постоянно напоминайте себе, зачем вы начали этот путь, и награждайте себя за достижения.

      Глава 4: Управление Временем

      Эффективное управление временем – это ключ к продуктивности. Используйте планировщики, чтобы распределять свое время и задачи. Установите приоритеты и избегайте прокрастинации. Определите свои наиболее продуктивные часы и используйте их для выполнения самых сложных задач. Важно находить баланс между работой и отдыхом, чтобы не выгореть.

      Глава 5: Личностный Рост

      Личностный рост включает развитие эмоционального интеллекта, самоосознания и эмпатии. Учитесь понимать свои эмоции и управлять ими. Практикуйте активное слушание и старайтесь понять точку зрения других людей. Развивайте навыки общения и решайте конфликты конструктивно. Личностный рост помогает улучшить отношения с окружающими и добиться успеха в личной и профессиональной жизни.

      Глава 6: Здоровый Образ Жизни

      Здоровье – это основа успешного саморазвития. Регулярные физические упражнения, сбалансированное питание и достаточный сон играют важную роль в поддержании энергии и концентрации. Найдите виды активности, которые приносят вам удовольствие, и сделайте их частью своей рутины. Забота о здоровье улучшает качество жизни и повышает продуктивность.

      Глава 7: Постоянное Обучение

      Никогда не прекращайте учиться. Постоянное обучение помогает оставаться конкурентоспособным и адаптироваться к изменениям. Читайте книги, проходите онлайн-курсы, посещайте семинары и мастер-классы. Развивайте новые навыки и применяйте их на практике. Обучение открывает новые возможности и помогает достигать больших высот.

      Глава 8: Заключение

      Саморазвитие – это долгий и сложный путь, но он приносит огромные награды. Постоянно работайте над собой, устанавливайте новые цели и стремитесь к их достижению. Помните, что успех приходит к тем, кто не боится трудностей и готов учиться на своих ошибках. Будьте настойчивыми, и ваш путь к лучшей версии себя будет успешным.
    `.repeat(5), // Repeat to create multiple pages of content
  },
  {
    title: 'Тонкое искусство пофигизма',
    cover: 'https://i.pinimg.com/736x/31/18/da/3118dae0cf53b6b743b9a8fa1acdaabe.jpg',
    content: `
      Глава 1: Введение в Саморазвитие

      Саморазвитие – это непрерывный процесс улучшения себя во всех аспектах жизни. Для достижения этого необходимо установить четкие цели и стремиться к их выполнению. Важно не только развивать свои профессиональные навыки, но и уделять внимание личностному росту. Читайте книги, посещайте тренинги, общайтесь с успешными людьми и учитесь новому. Путь к лучшей версии себя не всегда будет легким, но постоянная работа над собой принесет удовлетворение и успех.

      Глава 2: Сила Привычек

      Привычки играют ключевую роль в нашем саморазвитии. Они формируют наш образ жизни и влияют на нашу продуктивность. Чтобы создать полезные привычки, нужно начать с маленьких шагов и постепенно увеличивать их сложность. Используйте методику "маленьких шагов", чтобы постепенно привыкнуть к новым действиям. Например, если вы хотите начать заниматься спортом, начните с 5-минутной тренировки каждый день и постепенно увеличивайте время.

      Глава 3: Мотивация и Цели

      Мотивация – это двигатель нашего прогресса. Устанавливайте конкретные и измеримые цели, чтобы поддерживать мотивацию на высоком уровне. Разделите большие цели на маленькие задачи, чтобы не перегружаться и видеть прогресс. Постоянно напоминайте себе, зачем вы начали этот путь, и награждайте себя за достижения.

      Глава 4: Управление Временем

      Эффективное управление временем – это ключ к продуктивности. Используйте планировщики, чтобы распределять свое время и задачи. Установите приоритеты и избегайте прокрастинации. Определите свои наиболее продуктивные часы и используйте их для выполнения самых сложных задач. Важно находить баланс между работой и отдыхом, чтобы не выгореть.

      Глава 5: Личностный Рост

      Личностный рост включает развитие эмоционального интеллекта, самоосознания и эмпатии. Учитесь понимать свои эмоции и управлять ими. Практикуйте активное слушание и старайтесь понять точку зрения других людей. Развивайте навыки общения и решайте конфликты конструктивно. Личностный рост помогает улучшить отношения с окружающими и добиться успеха в личной и профессиональной жизни.

      Глава 6: Здоровый Образ Жизни

      Здоровье – это основа успешного саморазвития. Регулярные физические упражнения, сбалансированное питание и достаточный сон играют важную роль в поддержании энергии и концентрации. Найдите виды активности, которые приносят вам удовольствие, и сделайте их частью своей рутины. Забота о здоровье улучшает качество жизни и повышает продуктивность.

      Глава 7: Постоянное Обучение

      Никогда не прекращайте учиться. Постоянное обучение помогает оставаться конкурентоспособным и адаптироваться к изменениям. Читайте книги, проходите онлайн-курсы, посещайте семинары и мастер-классы. Развивайте новые навыки и применяйте их на практике. Обучение открывает новые возможности и помогает достигать больших высот.

      Глава 8: Заключение

      Саморазвитие – это долгий и сложный путь, но он приносит огромные награды. Постоянно работайте над собой, устанавливайте новые цели и стремитесь к их достижению. Помните, что успех приходит к тем, кто не боится трудностей и готов учиться на своих ошибках. Будьте настойчивыми, и ваш путь к лучшей версии себя будет успешным.
    `.repeat(5), // Repeat to create multiple pages of content
  },
];

const podcasts = [
  {
    title: 'Подкаст 1',
    artist: 'Автор 1',
    cover: 'https://via.placeholder.com/200',
    url: 'https://example.com/podcast1.mp3',
  },
  {
    title: 'Мотивация',
    artist: 'Руслан',
    cover: 'https://i1.sndcdn.com/artworks-yzdlzQExvv3gQv2w-AexnBw-t500x500.jpg',
    url: require('../assets/motivat.mp3'),
  },
  {
    title: 'Подкаст 3',
    artist: 'Автор 3',
    cover: 'https://via.placeholder.com/200',
    url: 'https://example.com/podcast3.mp3',
  },
];

const ArticlesScreen = () => {
  const [selectedSection, setSelectedSection] = useState('books');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const renderSection = () => {
    if (selectedArticle) {
      return (
        <ArticleDetail
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      );
    }

    if (selectedBook) {
      return <BookDetail book={selectedBook} onBack={() => setSelectedBook(null)} />;
    }

    switch (selectedSection) {
      case 'books':
        return (
          <View style={styles.sectionContent}>
            {books.map((book, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookButton}
                onPress={() => setSelectedBook(book)}
              >
                <Image style={styles.bookCover} source={{ uri: book.cover }} />
                <Text style={styles.bookTitle}>{book.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'articles':
        return (
          <View style={styles.sectionContent}>
            {articles.map((article, index) => (
              <TouchableOpacity
                key={index}
                style={styles.articleButton}
                onPress={() => setSelectedArticle(article)}
              >
                <Text style={styles.articleButtonText}>{article.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'podcasts':
        return (
          <View style={styles.sectionContent}>
            {podcasts.map((podcast, index) => (
              <TouchableOpacity
                key={index}
                style={styles.podcastButton}
                onPress={() => {
                  setSelectedPodcast(podcast);
                  setModalVisible(true);
                }}
              >
                <Image style={styles.podcastCover} source={{ uri: podcast.cover }} />
                <View style={styles.podcastInfo}>
                  <Text style={styles.podcastTitle}>{podcast.title}</Text>
                  <Text style={styles.podcastArtist}>{podcast.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedSection('books')}
        >
          <Text style={styles.buttonText}>Книги</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedSection('articles')}
        >
          <Text style={styles.buttonText}>Статьи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedSection('podcasts')}
        >
          <Text style={styles.buttonText}>Подкасты</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>{renderSection()}</ScrollView>
      {selectedPodcast && (
        <PodcastPlayerModal
          podcast={selectedPodcast}
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 90,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    alignItems: 'center',
  },
  sectionContent: {
    width: '90%',
    padding: 20,
  },
  item: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  bookButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bookCover: {
    width: 150,
    height: 220,
    borderRadius: 10,
  },
  bookTitle: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  articleButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  articleButtonText: {
    color: 'white',
    fontSize: 18,
  },
  podcastButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  podcastCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  podcastInfo: {
    marginLeft: 15,
  },
  podcastTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  podcastArtist: {
    color: 'grey',
    fontSize: 14,
  },
});

export default ArticlesScreen;
