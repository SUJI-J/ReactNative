import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText ] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    const s = JSON.stringify(toSave)
    await AsyncStorage.setItem(STORAGE_KEY, s)
  };
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  const addToDo = async () => {
    if(text === ""){
      return
    }
    const newToDos = {
      ...toDos, //이전 ToDo도 가지면서
      [Date.now()]: {text, working}, //새로운 ToDo도 추가함 (sol 2 : ES6방법)
      };  
    /*sol 1
    const newToDos =  Object.assign(
      {},     //비어있는 object 결합 Target Object
      toDos,  //이전 ToDo와 새로운 ToDo 합침
      {[Date.now()]: {text, work:working }, 
      }); */
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  //console.log(toDos);
  const deleteToDo = async(key) => {
    Alert.alert(
      "Delete To Do?", 
      "Are you sure?", [
      {text: "Cancel" },
      {text: "Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = {...toDos};
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
      } }
    ]);
    return;
    
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText,  color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity> 
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText,  color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={
          working ? "Add a To Do" : "Where do you want to go?"
        } 
        style={styles.input} 
      />
        <ScrollView>{
          Object.keys(toDos).map((key) => 
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <FontAwesome name="trash" size={18} color="white" />
              </TouchableOpacity>
            </View>
            ) : null
          )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, 
  },
  header: {
    justifyContent: "space-between",
    flexDirection:"row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 35,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
