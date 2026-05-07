import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadProofPhoto(orderId: string, uri: string): Promise<string> {
  const response    = await fetch(uri);
  const blob        = await response.blob();
  const storageRef  = ref(storage, `proof/${orderId}/${Date.now()}.jpg`);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}
