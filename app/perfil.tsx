import * as FileSystem from 'expo-file-system/legacy'

import * as ImagePicker from 'expo-image-picker'

import { Image } from 'react-native'

// Componentes React Native
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,} from 'react-native'

// Hooks React
import { useState, useCallback } from 'react'

// Navegação
import { router, useFocusEffect } from 'expo-router'

// Supabase
import { supabase } from '../scr/services/supabase'

// Cores
import { COLORS } from '../scr/styles/colors'

export default function Perfil() {

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [receitas, setReceitas] = useState(0)
  const [despesas, setDespesas] = useState(0)
  const [saldo, setSaldo] = useState(0)

  const [totalTransacoes, setTotalTransacoes] = useState(0)

  useFocusEffect(
    useCallback(() => {
      carregarPerfil()
    }, [])
  )

  async function carregarPerfil() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    setEmail(user.email || '')

    // Busca nome do perfil
    const { data: perfil } = await supabase
      .from('profiles')
      .select('nome, avatar_url')
      .eq('id', user.id)
      .single()

    if (perfil) {
    setNome(perfil.nome)
    setAvatarUrl(perfil.avatar_url || '')
  }

    // Busca transações
    const { data: transacoes, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)

    if (error || !transacoes) {
      console.log(error)
      return
    }

    let totalReceitas = 0
    let totalDespesas = 0

    transacoes.forEach(item => {

      if (item.tipo === 'receita') {
        totalReceitas += Number(item.valor)
      }

      if (item.tipo === 'despesa') {
        totalDespesas += Number(item.valor)
      }

    })

    setReceitas(totalReceitas)
    setDespesas(totalDespesas)
    setSaldo(totalReceitas - totalDespesas)

    setTotalTransacoes(transacoes.length)
  }

  async function logout() {

    await supabase.auth.signOut()

    router.replace('/')
  }

  async function alterarFoto() {

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsEditing: true,
    aspect: [1, 1],
  })

  if (result.canceled) return

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

    const image = result.assets[0]
    console.log(image)

  console.log('URI da imagem:', image.uri)

  const fileName = `${user.id}-${Date.now()}.jpg`

  const base64 = await FileSystem.readAsStringAsync(
  image.uri,
  {
    encoding: 'base64'
  }
    )
    
    console.log('Base64 tamanho:', base64.length)

  const binaryString = atob(base64)

  const bytes = Uint8Array.from(
    binaryString,
    (char) => char.charCodeAt(0)
  )

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, bytes, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  console.log('Nome do arquivo:', fileName)
  console.log('Erro upload:', error)

  if (error) {
    alert(JSON.stringify(error))
    return
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  const publicUrl = data.publicUrl

  console.log('URL pública:', publicUrl)

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      avatar_url: publicUrl,
    })
    .eq('id', user.id)

  console.log('Erro profile:', profileError)

  setAvatarUrl(publicUrl)

  alert('Foto atualizada com sucesso!')

  carregarPerfil()
}

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >

      <Text style={styles.title}>
        Meu Perfil
      </Text>

      {/* Dados do usuário */}

      <View style={styles.avatarContainer}>

      {avatarUrl ? (

        <Image
          source={{ uri: avatarUrl }}
            style={styles.avatar}
        />

        ) : (

        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarLetter}>
            {nome?.charAt(0)?.toUpperCase()}
          </Text>
        </View>

        )}

      </View>
      
      <TouchableOpacity
      style={styles.changePhotoButton}
      onPress={alterarFoto}
      >
      <Text style={styles.changePhotoText}>
        Alterar Foto
      </Text>
      </TouchableOpacity>

      <View style={styles.card}>

        <Text style={styles.nome}>
          {nome}
        </Text>

        <Text style={styles.email}>
          {email}
        </Text>

      </View>

      {/* Resumo financeiro */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Resumo Financeiro
        </Text>

        <Text style={styles.info}>
          Receitas: R$ {receitas.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>

        <Text style={styles.info}>
          Despesas: R$ {despesas.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>

        <Text style={styles.info}>
          Saldo: R$ {saldo.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>

      </View>

      {/* Estatísticas */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Estatísticas
        </Text>

        <Text style={styles.info}>
          Total de transações: {totalTransacoes}
        </Text>

      </View>

      {/* Botão Dashboard */}

      <TouchableOpacity
        style={styles.dashboardButton}
        onPress={() => router.replace('/dashboard')}
      >
        <Text style={styles.buttonText}>
          Voltar ao Dashboard
        </Text>
      </TouchableOpacity>

      {/* Logout */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.buttonText}>
          Sair da Conta
        </Text>
      </TouchableOpacity>

    </ScrollView>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentContainer: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },

  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  email: {
    marginTop: 5,
    color: COLORS.textSecondary,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
  },

  info: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },

  dashboardButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  logoutButton: {
    backgroundColor: COLORS.danger,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },

  avatarContainer: {
  alignItems: 'center',
  marginBottom: 15,
},

avatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
},

avatarPlaceholder: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: COLORS.primary,
  justifyContent: 'center',
  alignItems: 'center',
},

avatarLetter: {
  color: COLORS.white,
  fontSize: 10,
  fontWeight: '700',
  },

  changePhotoButton: {
  marginTop: 10,
},

changePhotoText: {
  color: COLORS.primary,
  fontWeight: '700',
  fontSize: 20,
  textAlign: 'center',
  marginTop: -15,
},

})