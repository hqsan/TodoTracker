import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons'
import { Link } from 'expo-router'

import { useFonts, RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono'
import Animated, { LinearTransition } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from "expo-status-bar";

import { data } from "@/data/todos"

export default function Index() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  const [loaded, error] = useFonts({
    RobotoMono_400Regular,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageToDos = jsonValue != null ? JSON.parse(jsonValue) : null
        if( storageToDos && storageToDos.length ) {
          setTodos(storageToDos.sort((a, b) => b.id - a.id))
        } else {
          setTodos(data.sort((a, b) => b.id - a.id))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [data])

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (e) {
        console.error(e)
      }
    }
    storeData()
  }, [todos])

  if( !loaded && !error ) {
    return null
  }

  const styles = createStyles(theme, colorScheme)

  const addTodo = () => {
    if( text.trim() ) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos])
      setText('')
    }
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
      >
      {item.title}</Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="#F05123" selectable={undefined} />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode='on-drag'
      />
      <View style={styles.inputContainer}>
        <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={styles.modeToggle}>
          {colorScheme === 'dark'
          ? <Octicons name='moon' size={36} color={theme.text} selectable={undefined} style={styles.toggleTheme} />
          : <Octicons name='sun' size={36} color={theme.text} selectable={undefined} style={styles.toggleTheme} /> }
        </Pressable>
        <Link style={styles.edit} href="/">Back to List</Link>
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}></StatusBar>
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto'
  },

  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 18,
    minWidth: 0,
    color: theme.text,
    fontFamily: 'RobotoMono_400Regular'
  },

  addButton: {
    backgroundColor: theme.button,
    borderRadius: 5,
    padding: 10
  },

  addButtonText: {
    fontSize: 18,
    color: theme.buttonText,
    fontFamily: 'RobotoMono_400Regular'
  },

  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    padding: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto'
  },

  todoText: {
    flex: 1,
    fontSize: 18,
    color: theme.text,
    fontFamily: 'RobotoMono_400Regular'
  },

  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },

  modeToggle: {
    marginLeft: 10
  },

  toggleTheme: {
    width: 36
  },

  edit: {
    fontSize: 20,
    marginTop: 5,
    marginRight: 10,
    fontFamily: 'RobotoMono_400Regular',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: theme.text,
    textAlign: 'right'
  },

  header: {
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 32,
    color: theme.text,
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomColor: '#F05123',
    borderBottomWidth: 1,
  }
})
}