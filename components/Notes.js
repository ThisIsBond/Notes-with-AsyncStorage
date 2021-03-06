import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Keyboard } from 'react-native'
import React, { useState } from 'react';
import * as Style from '../assets/styles';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Icon, IconRegistry, Layout } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Notes = ({ navigation, ...props }) => {

    const [searchNote, setSearchNote] = useState();

    function clearNotes() {
        let emptyArray = [...props.notes];
        let deletedComponentArray = [...props.moveToBin];
        emptyArray.forEach((item, index) => {
            deletedComponentArray.push(item);
        })
        emptyArray = [];
        props.setNotes(emptyArray);
        props.setMoveToBin(deletedComponentArray);

        AsyncStorage.setItem('storedNotes', JSON.stringify(emptyArray)).then(() => {
            props.setNotes(emptyArray);
        }).catch(error => console.log(error))

        AsyncStorage.setItem('deletedNotes', JSON.stringify(deletedComponentArray)).then(() => {
            props.setMoveToBin(deletedComponentArray);
        }).catch(error => console.log(error))
    }

    function search() {
        if (searchNote === '') {
            Alert.alert('Type something in search box');
        } else if (searchNote !== '') {
            props.notes.forEach((item, index) => {
                if (item.includes(searchNote)) {
                    let searchItem = [...props.notes];
                    let firstElementOfArr = searchItem[0];
                    let index = [...props.notes].indexOf(item);

                    searchItem[0] = item;
                    searchItem[index] = firstElementOfArr;
                    props.setNotes(searchItem)
                }
            })
        }
        setSearchNote('');
        Keyboard.dismiss();
    }

    function deleteNotes(index) {
        let newArray = [...props.notes];
        let movedNote = newArray.splice(index, 1);
        props.setNotes(newArray);
        props.setMoveToBin(movedNote);

        let bin = [movedNote, ...props.moveToBin];
        props.setMoveToBin(bin);

        AsyncStorage.setItem('storedNotes', JSON.stringify(newArray)).then(() => {
            props.setNotes(newArray)
        }).catch(error => console.log(error))

        AsyncStorage.setItem('deletedNotes', JSON.stringify(bin)).then(() => {
            props.setMoveToBin(bin)
        }).catch(error => console.log(error))
    }

    return (
        <View style={styles.notesContainer}>
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Your Notes...</Text>
                <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity style={[styles.button, { marginLeft: 40 }]} onPress={() => {
                        navigation.navigate('DeletedNote')
                    }}>
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider {...eva} theme={eva.light} >
                            <Icon name='trash-2-outline' fill='white' style={{ width: 25, height: 50 }} />
                        </ApplicationProvider>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button]} onPress={() => {
                        navigation.navigate('AddNote')
                    }}>
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider {...eva} theme={eva.light} >
                            <Icon name='plus-outline' fill='white' style={{ width: 25, height: 50 }} />
                        </ApplicationProvider>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: 18, color: Style.color }}>Total: {props.notes.length}</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.searchContainer}>
                <TextInput
                    value={searchNote}
                    onChangeText={(text) => setSearchNote(text)}
                    placeholder='Search'
                    placeholderTextColor={Style.color}
                    style={[styles.input, { borderWidth: 3 }]}
                />

                <TouchableOpacity style={[styles.searchButton, { width: 40 }]} onPress={() => search()}>
                    <IconRegistry icons={EvaIconsPack} />
                    <ApplicationProvider {...eva} theme={eva.light} >
                        <Icon name='search' fill='white' style={{ width: 22, height: 40 }} />
                    </ApplicationProvider>
                </TouchableOpacity>

                <TouchableOpacity style={styles.searchButton} onPress={() => clearNotes()}>
                    <Text style={styles.searchButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {props.notes.length === 0
                    ?

                    <View style={styles.emptyNoteContainer}>
                        <Text style={styles.emptyNoteText}>There is no note yet! Click on + button to add new note</Text>
                    </View>
                    :

                    props.notes.map((item, index) =>
                        <View style={styles.item} key={index}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={styles.note}>
                                    <Text style={styles.index}>{index + 1}.  </Text>
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteNotes(index)}>
                                    <Text style={styles.delete}>X</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.dateContainer}>
                                <Text>Edited on {moment(item.createdAt).format('LLL')}</Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('EditNote', {
                                        i: index,
                                        n: item
                                    })
                                }}>
                                    <Text style={styles.delete}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    )
                }
            </ScrollView>
        </View>
    )
}

export default Notes

export const styles = StyleSheet.create({
    notesContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        marginBottom: 70,
        opacity: 0.9
    },
    heading: {
        fontSize: 30,
        fontWeight: '700',
        color: Style.color
    },
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: Style.color,
        marginTop: 5,
        marginBottom: 5
    },
    item: {
        marginBottom: 20,
        padding: 15,
        color: 'black',
        opacity: 0.8,
        marginTop: 10,
        shadowColor: Style.color,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        borderColor: Style.color,
        borderWidth: 2,
        borderRadius: 5,
        borderLeftWidth: 15
    },
    index: {
        fontSize: 20,
        fontWeight: '800',
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        backgroundColor: Style.color,
        width: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        height: 50
    },
    buttonText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '800'
    },
    scrollView: {
        marginBottom: 70
    },
    note: {
        flexDirection: 'row',
        width: '75%'
    },
    text: {
        fontWeight: '700',
        fontSize: 17,
        alignSelf: 'center'
    },
    delete: {
        color: Style.color,
        fontWeight: '700',
        fontSize: 15
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        width: '65%',
        fontSize: 19,
        color: 'black',
        fontWeight: '600',
        opacity: 0.8,
        shadowColor: Style.color,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        borderColor: Style.color,
        borderWidth: 2,
        borderRadius: 5
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8
    },
    searchButton: {
        backgroundColor: Style.color,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        borderRadius: 5,
        height: 40
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15
    },
    emptyNoteContainer: {
        alignItems: 'center',
        marginTop: 240
    },
    emptyNoteText: {
        color: Style.color,
        fontWeight: '600',
        fontSize: 15
    },
    dateContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    }
})