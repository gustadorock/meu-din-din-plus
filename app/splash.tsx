import { View, Text, Image, StyleSheet } from 'react-native'

export default function Splash() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Meu Din Din+
      </Text>

      <Text style={styles.subtitle}>
        De real em real, seus sonhos se realizam.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0A6A8A',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
})