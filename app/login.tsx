import { Image } from 'react-native'

// Importa o hook useState para armazenar valores digitados
import { useState } from 'react'

// Cliente do Supabase
import { supabase } from '../scr/services/supabase'

// Permite navegar entre telas
import { router } from 'expo-router'

// Importa componentes visuais do React Native
import {View,Text,StyleSheet,TextInput,TouchableOpacity,} from 'react-native'

// Componente principal da tela
export default function Login() {

  // Armazena o email digitado
  const [email, setEmail] = useState('')

  // Armazena a senha digitada
  const [senha, setSenha] = useState('')

// Realiza login do usuário
async function fazerLogin() {

    // Validação básica
    if (!email || !senha) {
        alert('Preencha email e senha.')
        return
    }

  // Tenta autenticar no Supabase
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    // Exibe erro
    if (error) {
        alert(error.message)
        return
    }

    // Login realizado
    alert('Login realizado com sucesso!')
    router.replace('/dashboard')

  console.log(data)
}

  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Nome do aplicativo */}
      <Text style={styles.title}>
        Meu Din Din Plus
      </Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Faça login para continuar
      </Text>

      {/* Campo de Email */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo de Senha */}
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão Entrar */}
      <TouchableOpacity
        style={styles.button}
        onPress={fazerLogin}
      >
        <Text style={styles.buttonText}>
          Entrar
        </Text>
      </TouchableOpacity>

    {/* Botão Criar Conta */}
        <TouchableOpacity
            onPress={() => router.push('/cadastro')}
        >
        <Text style={styles.link}>
            Criar uma conta
        </Text>
        </TouchableOpacity>

    </View>
  )
}

// Estilos da tela
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    padding: 24,
  },

  // Título
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A6A8A',
    textAlign: 'center',
  },

  // Subtítulo
  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
  },

  // Campos de entrada
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Botão principal
  button: {
    backgroundColor: '#0A6A8A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  // Texto do botão
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Link "Criar conta"
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#2EC4A6',
    fontWeight: '600',
  },

  logo: {
  width: 120,
  height: 120,
  alignSelf: 'center',
  marginBottom: 10,
},
})