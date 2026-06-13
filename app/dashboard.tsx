import { Dimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { Image } from 'react-native'

// Componentes do React Native
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,} from 'react-native'

// Hooks do React
import { useCallback, useState } from 'react'

// Cliente do Supabase
import { supabase } from '../scr/services/supabase'

// Importa as rotas doprojeto
import { router, useFocusEffect } from 'expo-router'

// Cores do projeto
import { COLORS } from '../scr/styles/colors'

type Transacao = {
  id: string
  descricao: string
  categoria: string
  tipo: string
  valor: number
}

export default function Dashboard() {

    // Total de receitas
    const [receitas, setReceitas] = useState(0)

    // Total de despesas
    const [despesas, setDespesas] = useState(0)

    // Saldo atual
    const [saldo, setSaldo] = useState(0)

    const [avatarUrl, setAvatarUrl] = useState('')

    const screenWidth = Dimensions.get('window').width

    const valorEconomizado = receitas - despesas

    const percentualEconomia =
    receitas > 0
    ? (((receitas - despesas) / receitas) * 100).toFixed(1)
    : 0
    

    // Estado para armazenar as transações
    const [transacoes, setTransacoes] = useState<Transacao[]>([])

    // Nome do usuário
    const [nomeUsuario, setNomeUsuario] = useState('')
        // Carrega dados financeiros
        useFocusEffect(
            useCallback(() => {
                carregarResumo()
            }, [])
        )

    async function carregarResumo() {

    // Obtém usuário logado
    const {
        data: { user }
    } = await supabase.auth.getUser()

        if (!user) return
        
        // Busca dados do perfil
        const { data: perfil } = await supabase
        .from('profiles')
        .select('nome, avatar_url')
        .eq('id', user.id)
        .single()

        if (perfil) {
        setNomeUsuario(perfil.nome)
        setAvatarUrl(perfil.avatar_url)
        }

    // Busca transações do usuário
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false})

    if (error) {
        console.log(error)
        return
    }

    let totalReceitas = 0
    let totalDespesas = 0

    data.forEach(item => {

        if (item.tipo === 'receita') {
        totalReceitas += Number(item.valor)
        }

        if (item.tipo === 'despesa') {
        totalDespesas += Number(item.valor)
        }
    })

    setReceitas(totalReceitas)
    setDespesas(totalDespesas)
    setTransacoes(data)
    setSaldo(totalReceitas - totalDespesas)
    }
    
    const chartData = [
    {
        name: 'Receitas',
        value: receitas,
        color: '#22C55E',
        legendFontColor: '#334155',
        legendFontSize: 14,
    },
    {
        name: 'Despesas',
        value: despesas,
        color: '#EF4444',
        legendFontColor: '#334155',
        legendFontSize: 14,
    },
    ]

    async function sair() {

    await supabase.auth.signOut()

    router.replace('/login')

    }

  return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}>

        <View style={styles.header}>

    {avatarUrl ? (

        <Image
        source={{ uri: avatarUrl }}
        style={styles.miniAvatar}
        />

    ) : (

        <View style={styles.miniAvatarPlaceholder}>
        <Text style={styles.miniAvatarLetter}>
            {nomeUsuario?.charAt(0)?.toUpperCase()}
        </Text>
        </View>

    )}

    <Text
    style={styles.greeting}
    numberOfLines={1}
    >
    Olá {nomeUsuario?.split(' ')[0]}! Seja Bem-vindo.
    </Text>

    </View>

      {/* Card de saldo */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          Saldo Atual
        </Text>

        <Text style={styles.balanceValue}>
          R$ {Number(saldo).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
            })}
        </Text>
      </View>

      {/* Cards de resumo */}
      <View style={styles.row}>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Receitas
          </Text>

          <Text style={styles.receita}>
            R$ {receitas.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Despesas
          </Text>

          <Text style={styles.despesa}>
            R$ {despesas.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            })}
          </Text>
        </View>

          </View>
          
        {/* Gráfico financeiro */}
        <Text style={styles.sectionTitle}>
        Resumo Financeiro
        </Text>

        {(receitas > 0 || despesas > 0) && (
        <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            chartConfig={{
            color: () => COLORS.text,
            }}
        />
          )}
          
        <View style={styles.economiaCard}>

        <Text style={styles.economiaLabel}>
            Economia do mês
        </Text>

        <Text style={styles.economiaValue}>
            {percentualEconomia}%
        </Text>

        <Text style={styles.economiaMoney}>
            R$ {valorEconomizado.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
            })}
        </Text>


        </View>

        {/* Botão */}
        <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/nova-transacao')}
            >
              <Text style={styles.buttonText}>
                Adicionar Transação
              </Text>
          </TouchableOpacity>

        <TouchableOpacity
            style={styles.extratoButton}
            onPress={() => router.push('/extrato')}
            >
            <Text style={styles.buttonText}>
                Ver Extrato Completo
            </Text>
          </TouchableOpacity>

        <TouchableOpacity
            style={styles.perfilButton}
            onPress={() => router.push('/perfil')}
            >
            <Text style={styles.buttonText}>
                Meu Perfil
            </Text>
        </TouchableOpacity>

          
          
            {/* Últimas movimentações */}
            <Text style={styles.sectionTitle}>
                Últimas movimentações...
            </Text>

            {transacoes.length === 0 && (
            <Text style={styles.emptyText}>
                Nenhuma movimentação cadastrada.
            </Text>
            )}
          
            {transacoes.slice(0, 5).map((item: Transacao) => (

            <View
                key={item.id}
                style={styles.transactionCard}
            >

                <View>

                <Text style={styles.transactionDescription}>
                    {item.descricao}
                </Text>

                <Text style={styles.transactionCategory}>
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
                R$ {Number(item.valor).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
                </Text>

            </View>

            ))}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={sair}
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
        padding: 20,
        paddingTop: 60,
    },

    greeting: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 12,
    },

    balanceCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
    },

    balanceLabel: {
        color: COLORS.white,
        fontSize: 16,
    },

    balanceValue: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: '700',
        marginTop: 10,
    },

    row: {
        flexDirection: 'row',
        gap: 10,
    },

    summaryCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
    },

    summaryTitle: {
        color: COLORS.textSecondary,
        marginBottom: 10,
    },

    receita: {
        color: COLORS.success,
        fontWeight: '700',
        fontSize: 18,
    },

    despesa: {
        color: COLORS.danger,
        fontWeight: '700',
        fontSize: 18,
    },

    button: {
        marginTop: 30,
        backgroundColor: COLORS.secondary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },

    buttonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
    },
  
    sectionTitle: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    },

    transactionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    },

    transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    },

    transactionCategory: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    },

    contentContainer: {
    paddingBottom: 100,
    },

    extratoButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    },

    emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
    },

    economiaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    },

    economiaLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    },

    economiaValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.success,
    marginTop: 8,
    },

    economiaMoney: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
    },

    perfilButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    },

    header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},

miniAvatar: {
  width: 45,
  height: 45,
  borderRadius: 22.5,
},

miniAvatarPlaceholder: {
  width: 45,
  height: 45,
  borderRadius: 22.5,
},

miniAvatarLetter: {
  color: COLORS.white,
  fontWeight: '700',
  fontSize: 20,
    },

    logoutButton: {
  backgroundColor: '#DC2626',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 20,
},


})