import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getStorage } from '@/lib/storage';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const storage = getStorage();
  const [eventName, setEventName] = useState('');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const defaultLogo = require('@/assets/images/rune.png');

  const [cardColorType, setCardColorType] = useState(storage.getString('cardColorType') || 'gradient');
  const [cardColor1, setCardColor1] = useState(storage.getString('cardColor1') || '#fc3636');
  const [cardColor2, setCardColor2] = useState(storage.getString('cardColor2') || '#4736fc');

  useFocusEffect(
    React.useCallback(() => {
      const savedEventName = storage.getString('eventName');
      const savedColor1 = storage.getString('cardColor1');
      const savedColor2 = storage.getString('cardColor2');
      const savedColorType = storage.getString('cardColorType');
      const savedLogo = storage.getString('eventLogo');
      if (savedEventName) setEventName(savedEventName);
      if (savedColor1) setCardColor1(savedColor1);
      if (savedColor2) setCardColor2(savedColor2);
      if (savedColorType) setCardColorType(savedColorType);

      if (savedLogo) {
        setLogoUri(savedLogo);
      } else { setLogoUri(null); }
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.optHeader}>
        <Link href={"/options"} asChild>
          <TouchableOpacity style={styles.optCons}>
            <FontAwesome6 name="gear" size={50} />
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.setCenters}>
        <LinearGradient
          colors={cardColorType === 'gradient' ? [cardColor1, cardColor2] : [cardColor1, cardColor1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>
          <View style={styles.logoContainer}>
            <Image
              source={logoUri? { uri: logoUri} : defaultLogo}
              style={styles.logo}
              contentFit='contain'
            />
          </View>
          <Text style={styles.eventName}>{eventName || 'Event Name 2'}</Text>
        </LinearGradient>
        <Link href={"/scanner"} asChild>
          <TouchableOpacity>
            <LinearGradient
              colors={cardColorType === 'gradient' ? [cardColor1, cardColor2] : [cardColor1, cardColor1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}>
              <View style={styles.scanContainer}>
                <Text style={styles.scanText}>SCAN QR</Text>
                <View style={styles.iconsCon}>
                  <MaterialIcons name="arrow-right-alt" size={32} color={"white"} />
                  <MaterialIcons name="qr-code-scanner" size={50} color={"white"} style={{ marginTop: 10 }} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  optHeader: {
    alignItems: 'flex-end',
    paddingEnd: 10,
    paddingTop: 10,
    paddingBottom: 25,
  },
  optCons: {
    borderWidth: 3,
    borderRadius: 25,
    padding: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  setCenters: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
    paddingHorizontal: 5,
    marginBottom: 100,
  },
  logoContainer: {
    gap: 5,
    verticalAlign: 'middle',
    alignItems: 'center',
  },
  eventName: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 15,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 5,
  },
  card: {
    borderRadius: 15,
    marginHorizontal: 5,
  },
  appLogo: {
    height: 120,
    width: 90,
    bottom: 0,
    left: 0,
    marginBottom: 20,
  },
  scanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 110,
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  iconsCon: {
    flexDirection: 'column',
    alignItems: "flex-end",
  },
});
