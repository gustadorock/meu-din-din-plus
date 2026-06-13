// Componentes React Native
import {View,Text,StyleSheet,TextInput,TouchableOpacity} from 'react-native'

// Recebe parâmetros da rota
import { router, useLocalSearchParams } from 'expo-router'

// Hooks React
import { useEffect, useState } from 'react'

// Cliente Supabase
import { supabase } from '../scr/services/supabase'

// Cores do projeto
import { COLORS } from '../scr/styles/colors'

export default function EditarTransacao() {

    // Recebe o ID enviado pela tela de Extrato
    const { id } = useLocalSearchParams()

    // Tipo da transação
    const [tipo, setTipo] = useState('')

    // Categoria
    const [categoria, setCategoria] = useState('')

    // Descrição
    const [descricao, setDescricao] = useState('')

    useEffect(() => {
    carregarTransacao()
    }, [])
    async function carregarTransacao() {

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.log(error)
        return
    }

    setTipo(data.tipo)
    setCategoria(data.categoria)
    setDescricao(data.descricao)
    setValor(String(data.valor))
    }

    async function salvarAlteracoes() {

    const { error } = await supabase
        .from('transactions')
        .update({
        categoria,
        descricao,
        valor: Number(valor),
        })
        .eq('id', id)

    if (error) {
        alert(error.message)
        return
    }

    alert('Transação atualizada com sucesso!')

    router.replace('/extrato')
    }
    // Valor
    const [valor, setValor] = useState('')
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Editar Transação
          </Text>
          
            <Text style={styles.label}>
  Categoria
</Text>

        <TextInput
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
        />

        <Text style={styles.label}>
        Descrição
        </Text>

        <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        />

        <Text style={styles.label}>
        Valor
        </Text>

        <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        />

        <TouchableOpacity
        style={styles.button}
        onPress={salvarAlteracoes}
        >
        <Text style={styles.buttonText}>
            Salvar Alterações
        </Text>
      </TouchableOpacity>
      
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },

  label: {
  marginTop: 15,
  marginBottom: 6,
  color: COLORS.text,
  fontWeight: '600',
},

    input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    },

    button: {
    marginTop: 30,
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    },

    buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    },
})