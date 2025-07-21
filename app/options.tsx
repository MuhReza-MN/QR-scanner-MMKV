import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStorage } from '@/lib/storage';

import { useSharedValue } from 'react-native-reanimated';
import { KeyboardAvoidingView, View } from 'react-native';

import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, {colorKit, InputWidget, OpacitySlider, Panel2, SaturationSlider} from 'reanimated-color-picker';
import BaseContainer from '@/components/BaseContainer';
import Divider from '@/components/Divider';
import { colorPickerStyle } from '@/components/colorPickerStyle';

export default function OptionScreen() {
    const [eventName, setEventName] = useState('');
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const isValidUri = (uri: string) => uri.startsWith('file://') || uri.startsWith('http');
    
    const initialCol1 = colorKit.randomHslColor().hex();
    const [cardColor1, setCardColor1] = useState(initialCol1);
    const currentCol1 = useSharedValue(initialCol1);
    const onColChange1 = (color: ColorFormatsObject) => {
        'worklet';
        currentCol1.value = color.hex;
    };
    const onColorPick1 = (color: ColorFormatsObject) => {
        setCardColor1(color.hex);
    };
    
    const initialCol2 = colorKit.randomHslColor().hex();
    const [cardColor2, setCardColor2] = useState(initialCol2);
    const currentCol2 = useSharedValue(initialCol2);
    const onColChange2 = (color: ColorFormatsObject) => {
        'worklet';
        currentCol2.value = color.hex;
    };
    const onColorPick2 = (color: ColorFormatsObject) => {
        setCardColor2(color.hex);
    };

    const [cardColorType, setCardColorType] = useState('');

    const storage = getStorage();

    const saveChanges = () => {
        storage.set('eventName', eventName);
        console.log('Saved Event Name :', eventName);
    };

    useEffect(() => {
        const savedEventName = storage.getString('eventName');
        if (savedEventName) {
            setEventName(savedEventName);
        }
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <Text style={styles.labelTop}>Event Name</Text>
            <TextInput
                style={styles.input}
                value={eventName}
                onChangeText={setEventName}
                placeholder='Enter event name'/>
            <Text style={styles.label}>Event Logo</Text>
            <View style={styles.logoCon}>
                <TouchableOpacity style={styles.logoPicker}>
                </TouchableOpacity>
                <Text style={styles.subLabel}>Click Image to Change</Text>
            </View>
            <Text style={[styles.label, {marginBottom: 20}]}>Card Color Options</Text>
            <View style={[styles.colorContainer]}>
                <TouchableOpacity style={[{flexDirection: 'row', flex: 1}]}>
                    <View style={[styles.colorBox, {marginTop: 0, flex: 1}]}/>
                    <Text style={[styles.label, {marginTop: 0, flex: 5}]}>Color Hex 1</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[{flexDirection: 'row', flex: 1}]}>
                    <View style={[styles.colorBox, {marginTop: 0, flex: 1}]}/>
                    <Text style={[styles.label, {marginTop: 0, flex: 5}]}>Color Hex 2</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={styles.saveBtn} onPress={saveChanges} >
                <Text style={styles.saveBtnTxt}>Simpan</Text>
            </TouchableOpacity>
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
        marginTop: 20,
        marginBottom: 6,
    },
    labelTop: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 6,
    },
    subLabel: {
        textAlign: 'center',
        marginBottom: 5,
    },
    labelColor: {
        paddingStart: 10,
    },
    colorContainer: {
        flexDirection: 'row',
        paddingStart: 10,
    },
    colorBox: {
    width: 25,
    height: 32,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 0, 0, 1)',
    marginEnd: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    logoCon: {
        marginTop: 8,
        backgroundColor: '#f5f5f5',
    },
    saveBtn: {
        backgroundColor: '#12c70c',
        padding: 12,
        borderRadius: 8,
        marginTop: 50,
        alignItems: 'center',
    },
    saveBtnTxt: {
        color: 'white',
        fontWeight: 'bold',
    },
    logoPicker: {
        marginBottom: 3,
        height: 225,
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