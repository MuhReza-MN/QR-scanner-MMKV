import { MMKV } from "react-native-mmkv";

let storageInstance: MMKV | null = null;

export function getStorage(): MMKV {
  if (!storageInstance) {
    storageInstance = new MMKV({
      id: 'settings',
      encryptionKey: 'zeztz',
    });
  }
  return storageInstance;
}
