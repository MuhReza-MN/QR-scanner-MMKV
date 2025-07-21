import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OptionScreen() {
    const [eventName, setEventName] = useState('');
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const isValidUri = (uri: string) => uri.startsWith('file://') || uri.startsWith('http');
    
    const [cardColor1, setCardColor1] = useState('');
    const [cardColor2, setCardColor2] = useState('');
    const [cardColorType, setCardColorType] = useState('');


    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <Text style={styles.title}>Options</Text>

            <Text style={styles.label}>Event Name</Text>
            <TextInput
                style={styles.input}
                value={eventName}
                placeholder='Enter event name'/>
            <TouchableOpacity style={styles.saveBtn} >
                <Text style={styles.saveBtnTxt}>Simpan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoPicker} >
            </TouchableOpacity>

            <Text style={[styles.label, {marginTop: 20}]}>Card Color Option</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    saveBtn: {
        backgroundColor: '#12c70c',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
    },
    saveBtnTxt: {
        color: 'white',
        fontWeight: 'bold',
    },
    logoPicker: {
        marginTop: 8,
        height: 150,
        backgroundColor: '#eee',
        justifyContent: 'center',
        borderRadius: 8,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        resizeMode: 'contain',
    },

});