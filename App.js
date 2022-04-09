import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Notes from './components/Notes';
import AddNote from './components/AddNote';
import DeletedNote from './components/DeletedNote';
import EditNote from './components/EditNote';

const Stack = createNativeStackNavigator();

export default function App() {

  const [note, setNote] = useState();
  const [notes, setNotes] = useState([]);
  const [date, setDate] = useState(new Date().toUTCString());
  const [moveToBin, setMoveToBin] = useState([]);

  useEffect(() => {
    loadNotes();
  }, [])

  const loadNotes = () => {
    AsyncStorage.getItem('storedNotes').then(data => {
      if (data !== null) {
        setNotes(JSON.parse(data));
      }
    }).catch((error) => console.log(error))

    AsyncStorage.getItem('deletedNotes').then(data => {
      if (data !== null) {
        setMoveToBin(JSON.parse(data));
      }
    }).catch((error) => console.log(error))

    AsyncStorage.getItem('date');
  }

  function handleNote() {
    let newNote = note;
    let newNotes = [newNote, ...notes];
    setNotes(newNotes);
    setNote(null);

    AsyncStorage.setItem('storedNotes', JSON.stringify(newNotes)).then(() => {
      setNote(newNotes)
    }).catch(error => console.log(error))

    AsyncStorage.setItem('storedNotes', JSON.stringify(date)).then(() => {
      setDate(date)
    }).catch(error => console.log(error))

  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Notes' options={{
          headerTitleAlign: 'center'
        }}>
          {props => <Notes {...props} notes={notes} setNotes={setNotes} note={note} setNote={setNote} date={date} setDate={setDate} moveToBin={moveToBin} setMoveToBin={setMoveToBin} />}
        </Stack.Screen>

        <Stack.Screen name="AddNote">
          {props => <AddNote {...props} note={note} setNote={setNote} handleNote={handleNote} />}
        </Stack.Screen>

        <Stack.Screen name="DeletedNote">
          {props => <DeletedNote {...props} moveToBin={moveToBin} setMoveToBin={setMoveToBin} notes={notes} setNotes={setNotes} date={date} />}
        </Stack.Screen>

        <Stack.Screen name="EditNote">
          {props => <EditNote {...props} notes={notes} setNotes={setNotes} date={date} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}




