// Hook para controlar estados
import { useState } from 'react'

// Cliente Supabase
import { supabase } from '../scr/services/supabase'

// Componentes React Native
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'

// Cores do projeto
import { COLORS } from '../scr/styles/colors'

// Navegação
import { router } from 'expo-router'

export default function Cadastro() {

  // Estados dos campos
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)

  // Função para criar conta
  async function criarConta() {

    // Validação dos campos
    if (!nome || !email || !senha || !confirmarSenha) {
      alert('Preencha todos os campos.')
      return
    }

    // Confirmação de senha
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.')
      return
    }

    try {
      setLoading(true)

      // Cria usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,

        options: {
          data: {
            nome,
          },
        },
      })

      // Erro ao criar usuário
      if (error) {
        alert(error.message)
        return
      }

      // Cria perfil na tabela profiles
      if (data.user) {

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              nome,
              email,
            },
          ])

        if (profileError) {
          console.log('Erro ao criar perfil:', profileError)
          alert('Erro ao criar perfil.')
          return
        }
      }

      alert('Conta criada com sucesso!')

      // Volta para tela de login
      router.back()

    } catch (err) {

      console.log('Erro inesperado:', err)
      alert('Erro ao criar conta.')

    } finally {

      setLoading(false)

    }
  }

  return (
    <View style={styles.container}>

      {/* Título */}
      <Text style={styles.title}>
        Criar Conta
      </Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Comece a organizar sua vida financeira
      </Text>

      {/* Nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Confirmar Senha */}
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {/* Botão Criar Conta */}
      <TouchableOpacity
        style={styles.button}
        onPress={criarConta}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Criando...' : 'Criar Conta'}
        </Text>
      </TouchableOpacity>

      {/* Voltar para Login */}
      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.link}>
          Voltar para Login
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    color: COLORS.textSecondary,
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  link: {
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: '600',
  },

})