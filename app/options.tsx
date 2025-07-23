import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStorage } from '@/lib/storage';
import { LinearGradient } from 'expo-linear-gradient';

import { useSharedValue } from 'react-native-reanimated';
import { View } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import * as ImagePicker from 'expo-image-picker';
import ColorPicker, { InputWidget, Panel2, OpacitySlider, SaturationSlider } from 'reanimated-color-picker';

export default function OptionScreen() {
    const storage = getStorage();

    const [eventName, setEventName] = useState(storage.getString('eventName') || '');
    const [logoUri, setLogoUri] = useState<string | null>(storage.getString('eventLogo') || null);
    const defaultLogo = require('@/assets/images/rune.png');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
        if (!result.canceled) {
            setLogoUri(result.assets[0].uri);
        }
    }

    const [cardColorType, setCardColorType] = useState(storage.getString('cardColorType') || 'gradient');
    const [cardColor1, setCardColor1] = useState(storage.getString('cardColor1') || '#fc3636');
    const [cardColor2, setCardColor2] = useState(storage.getString('cardColor2') || '#4736fc');
    const [editColorNum, setEditColorNum] = useState<'color1' | 'color2' | null>(null);

    const [isPickerVisible, setPickerVisible] = useState(false);

    const colorTypeOptions = useMemo(() => ([
        { id: 'gradient', label: 'Gradient', value: 'gradient', color: '#2418acff' },
        { id: 'solid', label: 'Solid', value: 'solid', color: '#2418acff' },
    ]), []);

    const currentColor = useSharedValue(cardColor1);

    const openColorPicker = (target: 'color1' | 'color2') => {
        setEditColorNum(target);
        currentColor.value = target === 'color1' ? cardColor1 : cardColor2;
        setPickerVisible(true);
    };

    const handleColorChange = ({ hex }: { hex: string }) => {
        if (editColorNum === 'color1') setCardColor1(hex)
        else if (editColorNum === 'color2') setCardColor2(hex)
    }

    const saveChanges = () => {
        storage.set('eventName', eventName);
        storage.set('cardColor1', cardColor1);
        storage.set('cardColor2', cardColor2);
        storage.set('cardColorType', cardColorType);
        
        if (logoUri) {
            storage.set('eventLogo', logoUri);
        } else {
            storage.delete('eventLogo');
        }

        alert('success');
    };

    useEffect(() => {
        (async() => {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Media Permissions Needed!')
            }
        })();

        const savedEventName = storage.getString('eventName');
        const savedColor1 = storage.getString('cardColor1');
        const savedColor2 = storage.getString('cardColor2');
        const savedColorType = storage.getString('cardColorType');
        const savedLogo = storage.getString('eventLogo');
        if (savedEventName) setEventName(savedEventName);
        if (savedColor1) setCardColor1(savedColor1);
        if (savedColor2) setCardColor2(savedColor2);
        if (savedColorType) setCardColorType(savedColorType);
        if (savedLogo) setLogoUri(savedLogo);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <Text style={styles.labelTop}>Event Name</Text>
            <TextInput
                style={styles.input}
                value={eventName}
                onChangeText={setEventName}
                placeholder='Enter event name' />
            <Text style={styles.label}>Event Logo</Text>
            <View style={styles.logoCon}>
                <TouchableOpacity 
                    style={styles.logoPicker}
                    onPress={pickImage}>
                        {logoUri &&
                            <Image source={{ uri: logoUri }} style={styles.logoImage}/>
                        }
                </TouchableOpacity>
                <Text style={styles.subLabel}>Click Image to Change</Text>

            </View>
            <Text style={[styles.label, { marginBottom: 0 }]}>Card Color Options</Text>
            <View style={[styles.colorContainer, { marginBottom: 0 }]}>
                <Text style={[styles.label, { paddingEnd: 20, paddingBottom: 20 }]}>Card Color Type :</Text>
                <RadioGroup
                    radioButtons={colorTypeOptions}
                    onPress={(selectedId) => { setCardColorType; setCardColorType(selectedId);}}
                    selectedId={cardColorType}
                    layout='row' />
            </View>
            <LinearGradient
                colors={cardColorType === 'gradient' ? [cardColor1, cardColor2] : [cardColor1, cardColor1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}>
                <View style={styles.cardPreview} />
            </LinearGradient>
            <View style={styles.colorRow}>
                <TouchableOpacity onPress={() => openColorPicker('color1')} style={styles.colorOptContainer}>
                    <View style={[styles.colorBox, { backgroundColor: cardColor1 }]} />
                    <Text style={[styles.label, { bottom: 12 }]}>CardColor 1</Text>
                </TouchableOpacity>
                {cardColorType === 'gradient' && (
                    <TouchableOpacity onPress={() => openColorPicker('color2')} style={styles.colorOptContainer}>
                        <View style={[styles.colorBox, { backgroundColor: cardColor2 }]} />
                        <Text style={[styles.label, { bottom: 12 }]}>CardColor 2</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={saveChanges} >
                <Text style={styles.saveBtnTxt}>Simpan</Text>
            </TouchableOpacity>
            <Modal visible={isPickerVisible} transparent animationType='slide'>
                <View style={styles.pickerModal}>
                    <ColorPicker
                        value={editColorNum === 'color1' ? cardColor1 : cardColor2}
                        sliderThickness={26}
                        thumbSize={13}
                        thumbShape='doubleTriangle'
                        onChange={(color) => {
                            'worklet';
                            currentColor.value = color.hex;
                        }}
                        onCompleteJS={handleColorChange}
                        adaptSpectrum
                        style={{ width: '100%' }}>
                        <Panel2
                            style={styles.panelStyle}
                            verticalChannel='brightness'
                            thumbShape='ring'
                            thumbSize={30} />
                        <SaturationSlider style={styles.sliderStyle} />
                        <OpacitySlider style={styles.sliderStyle} />
                        <InputWidget inputStyle={styles.inputStyle} iconColor='707070' />
                    </ColorPicker>

                    <TouchableOpacity
                        style={[styles.closePicker]}
                        onPress={() => { setPickerVisible(false);}}>
                        <Text style={styles.saveBtnTxt}>Done</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    logoImage: {
        width: 200,
        height: 200,
        borderRadius: 30,
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
        alignItems: 'center',
    },
    colorBox: {
        width: 40,
        height: 40,
        borderWidth: 1,
        marginEnd: 10,
    },
    colorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 60,
        paddingStart: 20,
    },
    colorOptContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    cardPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: 110,
        paddingHorizontal: 15,
        borderColor: '#d3d3d3ff',
        borderWidth: 5,
        borderRadius: 6,
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
        alignItems: 'center',
    },
    card: {
        borderRadius: 15,
        marginHorizontal: 5,
        marginBottom: 20,
    },
    pickerModal: {
        backgroundColor: '#f5f5f5',
        margin: 30,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    panelStyle: {
        height: 250,
        width: '100%',
        borderRadius: 12,
        marginBottom: 10,
    },
    sliderStyle: {
        marginVertical: 6,
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: '#cccccccc',
        borderRadius: 8,
        padding: 8,
        color: '#333',
    },
    closePicker: {
        backgroundColor: '#12c70c',
        width: '90%',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 100,
        marginBottom: 20,
    },
});