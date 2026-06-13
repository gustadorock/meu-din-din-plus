// Hook para armazenar valores dos campos
import { useState } from 'react'

import { Picker } from '@react-native-picker/picker'

// Componentes do React Native
import {View,Text,StyleSheet,TextInput,TouchableOpacity,} from 'react-native'

// Cliente do Supabase
import { supabase } from '../scr/services/supabase'

// Navegação entre as telas
import { router } from 'expo-router'

import { formatCurrency } from '../scr/utils/currency'

// Cores do projeto
import { COLORS } from '../scr/styles/colors'

// Categorias do app
import { RECEITAS, DESPESAS } from '../scr/constants/categories'

export default function NovaTransacao() {

  // Tipo da transação
  const [tipo, setTipo] = useState('despesa')

  // Categoria escolhida
  const [categoria, setCategoria] = useState('Alimentação')

  // Descrição
  const [descricao, setDescricao] = useState('')

  // Valor
  const [valor, setValor] = useState('R$ 0,00')
    
  // Categoria digitada pelo usuário
    const [novaCategoria, setNovaCategoria] = useState('')
    
  // Define quais categorias mostrar
  const categoriasDisponiveis =
  tipo === 'receita'
  ? RECEITAS
  : DESPESAS
  
    const valorNumerico = Number(
    valor
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()
    )
    
    // Será conectada ao Supabase no próximo passo
    // Salva uma transação no banco
    function alterarValor(texto: string) {
    setValor(formatCurrency(texto))
    }

    async function salvarTransacao() {

    // Validação básica
    if (!descricao || valorNumerico <= 0) {
        alert('Informe uma descrição e um valor válido.')
        return
    }

    // Obtém usuário logado
    const {
    data: { user }
    } = await supabase.auth.getUser()

    // Verifica se existe usuário
    if (!user) {
    alert('Usuário não autenticado.')
    return
    }

    // Define a categoria que será salva
    const categoriaFinal =
    categoria === 'Outros'
        ? novaCategoria
        : categoria

    // Insere registro
    const { error } = await supabase
    .from('transactions')
    .insert([
        {
        user_id: user.id,
        tipo,
        categoria: categoriaFinal,
        descricao,
        valor: valorNumerico,
        }
    ])

    if (error) {
        alert(error.message)
        return
    }

        alert('Transação salva com sucesso!')
        
        // Volta para o Dashboard
        router.replace('/dashboard')
    }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Nova Transação
      </Text>

      {/* Tipo */}
      <Text style={styles.label}>
        Tipo
      </Text>

      <View style={styles.row}>

        <TouchableOpacity
          style={[
            styles.tipoButton,
            tipo === 'receita' && styles.tipoAtivo
          ]}
        onPress={() => {
            setTipo('receita')
            setCategoria(RECEITAS[0])
            }}
        >
          <Text>Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoButton,
            tipo === 'despesa' && styles.tipoAtivo
          ]}
          onPress={() => {
            setTipo('despesa')
            setCategoria(DESPESAS[0])
            }}
        >
          <Text>Despesa</Text>
        </TouchableOpacity>

      </View>

      {/* Categoria */}
      <Text style={styles.label}>
        Categoria
      </Text>
      
    <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
        style={styles.picker}
    >

    {categoriasDisponiveis.map((item) => (
        <Picker.Item
        key={item}
        label={item}
        value={item}
        />
    ))}

          </Picker>
          
    {categoria === 'Outros' && (

    <TextInput
        style={styles.input}
        placeholder="Digite uma categoria"
        value={novaCategoria}
        onChangeText={setNovaCategoria}
    />

    )}

      {/* Descrição */}
      <Text style={styles.label}>
        Descrição
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Almoço"
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* Valor */}
      <Text style={styles.label}>
        Valor
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={valor}
        onChangeText={alterarValor}
      />

      {/* Botão */}
      <TouchableOpacity
        style={styles.button}
        onPress={salvarTransacao}
      >
        <Text style={styles.buttonText}>
          Salvar Transação
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
    marginBottom: 25,
  },

  label: {
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: COLORS.text,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  tipoButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  tipoAtivo: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  button: {
    marginTop: 20,
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
  
  categoriasContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 15,
},

    categoriaButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    },

    categoriaAtiva: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
    },

    picker: {
  backgroundColor: COLORS.white,
  borderRadius: 12,
  marginBottom: 15,
    },
})