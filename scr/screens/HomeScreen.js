import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { supabase } from '../services/supabase'

export default function HomeScreen() {
  useEffect(() => {
    testarConexao()
  }, [])

  async function testarConexao() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')

    console.log('DATA:', data)
    console.log('ERROR:', error)
  }

  return (
    <View>
      <Text>Meu Din Din+</Text>
    </View>
  )
}