import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import * as Style from '../assets/styles'
import { styles } from './Notes'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeletedNote = ({ ...props }) => {

  function deleteNote(index) {

    Alert.alert(
      'Permanently Delete',
      'Are you sure you want to permanently delete selected note? ', [
      {
        text: 'No',
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: () => {

          // let getDelete = props.moveToBin[index];
          // let array = [getDelete, ...props.notes];

          let newArray = [...props.moveToBin];
          newArray.splice(index, 1);
          props.setMoveToBin(newArray);

          AsyncStorage.setItem('deletedNotes', JSON.stringify(newArray)).then(() => {
            props.setMoveToBin(newArray);
          }).catch(error => console.log(error))
        }
      }
    ]
    )

  }

  function undoNote(index) {
    let getBack = props.moveToBin[index];
    let array = [getBack, ...props.notes];
    props.setNotes(array);

    let newArray = [...props.moveToBin];
    newArray.splice(index, 1);
    props.setMoveToBin(newArray);

    AsyncStorage.setItem('storedNotes', JSON.stringify(array)).then(() => {
      props.setNotes(array)
    }).catch(error => console.log(error))

    AsyncStorage.setItem('deletedNotes', JSON.stringify(newArray)).then(() => {
      props.setMoveToBin(newArray)
    }).catch(error => console.log(error))
  }

  function undoAllNotes() {
    let deletedNotes = [...props.moveToBin];
    let notes = [...props.notes];
    deletedNotes.forEach((item, index) => {
      notes.push(item)
    })
    props.setMoveToBin([]);
    props.setNotes(deletedNotes)

    AsyncStorage.setItem('storedNotes', JSON.stringify(notes)).then(() => {
      props.setNotes(notes)
    }).catch(error => console.log(error))

    AsyncStorage.setItem('deletedNotes', JSON.stringify([])).then(() => {
      props.setMoveToBin([])
    }).catch(error => console.log(error))
  }

  function emptyBin() {
    Alert.alert(
      'Permanently Delete',
      'Are you sure you want to permanently delete all notes? ', [
      {
        text: 'No',
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: () => {
          let emptyArray = [...props.moveToBin];
          emptyArray = [];
          props.setMoveToBin(emptyArray);

          AsyncStorage.setItem('deletedNotes', JSON.stringify(emptyArray)).then(() => {
            props.setMoveToBin(emptyArray);
          }).catch(error => console.log(error))
        }
      }
    ]
    )
  }

  return (
    <ScrollView>
      <View style={[styles.notesContainer]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={style.emptyButton} onPress={() => undoAllNotes()}>
            <Text style={style.emptyButtonText}>
              Undo All
            </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: '700', fontSize: 18, color: Style.color }}>
            Total:{props.moveToBin.length}
          </Text>
          <TouchableOpacity style={style.emptyButton} onPress={() => emptyBin()}>
            <Text style={style.emptyButtonText}>
              Empty
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider}></View>

        {props.moveToBin.length === 0
          ?

          <View style={styles.emptyNoteContainer}>
            <Text style={styles.emptyNoteText}>Nothing to show yet....!</Text>
          </View>
          :

          props.moveToBin.map((item, index) =>
            <View style={styles.item} key={index}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.note}>
                  <Text style={styles.index}>{index + 1}. </Text>
                  <Text style={styles.text}>{item}</Text>
                </View>
                <TouchableOpacity onPress={() => undoNote(index)}>
                  <Text style={styles.delete}>Undo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateContainer}>
                <Text>Edited on {moment(item.createdAt).format('LLL')}</Text>
                <TouchableOpacity onPress={() => deleteNote(index)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )

        }
      </View>
    </ScrollView>
  )
}

export default DeletedNote

const style = StyleSheet.create({
  emptyButton: {
    backgroundColor: Style.color,
    width: '25%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 5
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700'
  }
})
