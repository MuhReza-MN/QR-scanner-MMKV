import React from 'react';
import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

export default function ScannerScreen() {

  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [isBarcodeMode, setIsBarcodeMode] = useState(true);
  const [barcodeResult, setBarcodeResult] = useState<String | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const handleZoomLevel = useCallback((val: number) => {
    setZoom(val);
  }, []);

  const handleBarcodeScanner = useCallback(
    ({ data } : barcodeResult) => {
      setBarcodeResult(data);
    },[]
  );

  const isValidUrl = (text: string) => {
  const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
  return pattern.test(text);
  };


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.container}>
          <Text style={styles.text}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.btnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          zoom={zoom}
          barcodeScannerSettings={{ 
            barcodeTypes: [
              "qr","ean13","ean8",
              "pdf417","aztec",
              "datamatrix",
            ],
          }}
          onBarcodeScanned={isBarcodeMode ? handleBarcodeScanner : undefined}>
            <View style={styles.overlay}>
              <View style={styles.scanArea}/>
            </View>

            <View style={styles.controlContainer}>
              <View style={styles.row}>
                <Text style={styles.text}>
                  Zoom: {zoom.toFixed(1)}x
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={zoom}
                  onValueChange={handleZoomLevel}/>
              </View>
            </View>
          </CameraView>
          <Modal
            animationType='slide'
            transparent={true}
            visible={!!barcodeResult}
            onRequestClose={() => setBarcodeResult(null)}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Barcode Detected:</Text>
                {isValidUrl(barcodeResult) ? (
                  <TouchableOpacity onPress={() => Linking.openURL(barcodeResult)}>
                    <Text style={styles.linkText}>{barcodeResult}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.barcodeText}>{barcodeResult}</Text>
                )}
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setBarcodeResult(null)}>
                    <Text style={styles.btnText}>Close</Text>
                  </TouchableOpacity>
              </View>
          </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea : {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  scanArea: {
    width: 250,
    height: 250,
    borderColor: '#00FF00',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  controlContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    color: "#000",
    fontSize: 16,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  captureBtn: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  captureBtnText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  barcodeText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
  linkText: {
  color: '#1E90FF',
  textDecorationLine: 'underline',
  },

});
