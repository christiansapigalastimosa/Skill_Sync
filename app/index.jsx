import { Link } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        M Y  G O A L 
      </Text>
       <Text style={styles.title1}> S - K - I - L - L S - Y - N - C</Text>
      <Link style={styles.link} href="/goals">
        View Your Goals
      </Link>
      <Link style={styles.link} href="/goals/create">
        Add a New Goal
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "lightblue",
  },
  title: {
    marginVertical: 15,
    fontSize: 28,
    color: '#c00cf7ff',
    fontWeight: "500",
    
  },
  title1: {
    marginVertical: 15,
    fontSize: 24,
    color: '#c00cf7ff',
  },
  link: {
    marginVertical: 20,
    padding: 18,
    backgroundColor: '#c00cf7ff',
    color: 'white',
    borderRadius: 8,
  },
})

export default Home