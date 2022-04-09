import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import * as Style from '../assets/styles'


const AddNote = ({ navigation, ...props }) => {
    return (
        <ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                behavior='padding'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ padding: 20, justifyContent: 'space-around' }}>
                        <TextInput
                            value={props.note}
                            onChangeText={(text) => props.setNote(text)}
                            style={styles.input}
                            placeholder='Type here...'
                            multiline={true}
                        />

                        <TouchableOpacity style={styles.button} onPress={() => {
                            if (props.note === '') {
                                Alert.alert('Please Type Something')
                            } else {
                                props.handleNote();
                                navigation.navigate('Notes');
                            }
                        }}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default AddNote

export const styles = StyleSheet.create({
    addNoteContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        padding: 20,
        paddingTop: 20,
        width: '100%',
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
        borderRadius: 5,
        height: 300,
        textAlignVertical: 'top'
    },
    button: {
        backgroundColor: Style.color,
        width: '40%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        alignSelf: 'flex-end',
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700'
    }
})