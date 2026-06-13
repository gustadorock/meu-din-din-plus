// Componentes React Native
import {View,ScrollView,Text,StyleSheet,TouchableOpacity,TextInput} from 'react-native'

// Hooks React
import { useState, useCallback } from 'react'

// Atualiza quando a tela recebe foco
import { useFocusEffect } from 'expo-router'

import { router } from 'expo-router'

// Supabase
import { supabase } from '../scr/services/supabase'

// Cores do projeto
import { COLORS } from '../scr/styles/colors'

export default function Extrato() {

    // Lista de transações
    const [transacoes, setTransacoes] = useState<any[]>([])
    
    // Filtro selecionado
    const [filtro, setFiltro] = useState('todas')
    
    // Texto pesquisado
    const [pesquisa, setPesquisa] = useState('')

    useFocusEffect(
    useCallback(() => {
        carregarTransacoes()
    }, [])
    )

    async function carregarTransacoes() {

    // Usuário logado
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    // Busca transações
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.log(error)
        return
    }

    setTransacoes(data)
    }
    
    const transacoesFiltradas = transacoes.filter(item => {

    const correspondePesquisa =
        item.descricao
        .toLowerCase()
        .includes(pesquisa.toLowerCase())

    const correspondeFiltro =
        filtro === 'todas'
        ? true
        : item.tipo === filtro

    return correspondePesquisa && correspondeFiltro

    })
    
  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Extrato Financeiro
          </Text>

          <View style={styles.filtros}>
              
              <TextInput
                style={styles.inputPesquisa}
                placeholder="Pesquisar transação..."
                value={pesquisa}
                onChangeText={setPesquisa}
              />
              
        <TouchableOpacity
            style={[
            styles.filtroButton,
            filtro === 'todas' && styles.filtroAtivo
            ]}
            onPress={() => setFiltro('todas')}
        >
            <Text>Todas</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
            styles.filtroButton,
            filtro === 'receita' && styles.filtroAtivo
            ]}
            onPress={() => setFiltro('receita')}
        >
            <Text>Receitas</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
            styles.filtroButton,
            filtro === 'despesa' && styles.filtroAtivo
            ]}
            onPress={() => setFiltro('despesa')}
        >
            <Text>Despesas</Text>
        </TouchableOpacity>

        </View>
          
          {transacoesFiltradas.map((item) => (

            <View
                key={item.id}
                style={styles.card}
            >

                <View>

                <Text style={styles.descricao}>
                    {item.descricao}
                </Text>

                <Text style={styles.categoria}>
                    {item.categoria}
                </Text>

                </View>

                <Text
                style={
                    item.tipo === 'receita'
                    ? styles.receita
                    : styles.despesa
                }
                >
                {item.tipo === 'receita' ? '+' : '-'}
                R$ {Number(item.valor).toFixed(2)}
                  </Text>
                  
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                        pathname: '/editar-transacao',
                        params: {
                            id: item.id,
                        },
                        })
                    }
                    >
                    <Text style={styles.editar}>
                        Editar
                    </Text>
                </TouchableOpacity>
            </View>

          ))}
          
                <TouchableOpacity
                  style={styles.dashboardButton}
                  onPress={() => router.replace('/dashboard')}
                >
                  <Text style={styles.buttonText}>
                    Retornar ao Dashboard
                  </Text>
                </TouchableOpacity>

    </ScrollView>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },

  card: {
  backgroundColor: COLORS.white,
  padding: 16,
  borderRadius: 12,
  marginTop: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

    descricao: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    },

    categoria: {
    color: COLORS.textSecondary,
    marginTop: 4,
    },

    receita: {
    color: COLORS.success,
    fontWeight: '700',
    },

    despesa: {
    color: COLORS.danger,
    fontWeight: '700',
    },

    filtros: {
  flexDirection: 'row',
  marginTop: 20,
  marginBottom: 10,
  gap: 10,
},

filtroButton: {
  backgroundColor: COLORS.white,
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 10,
},

filtroAtivo: {
  borderWidth: 2,
  borderColor: COLORS.secondary,
},

  inputPesquisa: {
  backgroundColor: COLORS.white,
  borderRadius: 12,
  padding: 10,
  marginTop: 10,
  marginBottom: 15,
    },
  
  editar: {
  color: COLORS.secondary,
  fontWeight: '600',
  marginTop: 8,
    },
  
    dashboardButton: {
    backgroundColor: COLORS.primary,
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
})