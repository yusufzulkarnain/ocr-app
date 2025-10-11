import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserData} from '../types/auth';

const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  HAS_SEEN_ONBOARDING: '@has_seen_onboarding',
  TRANSACTIONS: '@transactions',
};

interface TransactionItem {
  id: number;
  userId: string;
  date: string;
  amount: number;
  description: string;
  status: 'success' | 'pending';
  type: 'iuran' | 'kredit';
  foto?: string;
}

// Function to get next available ID
const getNextTransactionId = async (): Promise<number> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!jsonValue) {
      return 1;
    }

    const transactions: TransactionItem[] = JSON.parse(jsonValue);
    if (transactions.length === 0) {
      return 1;
    }

    return Math.max(...transactions.map(t => t.id)) + 1;
  } catch (error) {
    console.error('Error getting next ID:', error);
    return 1;
  }
};

// Function to add new transaction
export const addNewTransaction = async (
  userId: string,
  newTransaction: Omit<TransactionItem, 'id' | 'userId'>,
): Promise<boolean> => {
  try {
    // Get existing transactions
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const existingTransactions: TransactionItem[] = jsonValue
      ? JSON.parse(jsonValue)
      : [];

    // Get next available ID
    const nextId = await getNextTransactionId();

    // Create new transaction object
    const transactionToAdd: TransactionItem = {
      id: nextId,
      userId,
      ...newTransaction,
    };

    // Add to existing transactions
    const updatedTransactions = [...existingTransactions, transactionToAdd];

    // Save back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(updatedTransactions),
    );

    return true;
  } catch (error) {
    console.error('Error adding new transaction:', error);
    return false;
  }
};

// Example usage:
/*
const newIuran = {
  date: '2024-03-21',
  amount: 150000,
  description: 'Iuran Bulanan Mei',
  status: 'pending',
  type: 'iuran',
};

const success = await addNewTransaction(userId, newIuran);
if (success) {
  console.log('Transaction added successfully');
} else {
  console.log('Failed to add transaction');
}
*/

export const storeUserData = async (userData: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData),
    );
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const updateUserPhoto = async (
  newPhotoBase64: string,
): Promise<void> => {
  try {
    // Ambil data lama
    const existingData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!existingData) {
      console.warn('Tidak ada data user yang tersimpan.');
      return;
    }

    // Parse ke objek
    const parsedData: UserData = JSON.parse(existingData);

    // Update field foto
    parsedData.foto = newPhotoBase64;

    // Simpan kembali
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(parsedData),
    );

    console.log('Foto user berhasil diperbarui di AsyncStorage');
  } catch (error) {
    console.error('Error updating user photo:', error);
  }
};

export const getUserTransactions = async (
  userId: string,
  type?: 'iuran' | 'kredit',
): Promise<TransactionItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!jsonValue) {
      return [];
    }

    const transactions: TransactionItem[] = JSON.parse(jsonValue);
    return transactions.filter(
      t => t.userId === userId && (!type || t.type === type),
    );
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

export const setHasSeenOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
  } catch (error) {
    console.error('Error storing onboarding status:', error);
  }
};

export const getHasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    return value === 'true';
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return false;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.HAS_SEEN_ONBOARDING,
      STORAGE_KEYS.TRANSACTIONS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

// Fungsi untuk menampilkan data transaksi
export const displayTransactions = async (userId: string) => {
  try {
    // Ambil semua iuran
    const iuranData = await getUserTransactions(userId, 'iuran');
    console.log('\n=== Data Iuran ===');
    iuranData.forEach(iuran => {
      console.log(`
        ID: ${iuran.id}
        Tanggal: ${iuran.date}
        Jumlah: Rp ${iuran.amount.toLocaleString('id-ID')}
        Deskripsi: ${iuran.description}
        Status: ${iuran.status}
      `);
    });

    // Ambil semua kredit
    const kreditData = await getUserTransactions(userId, 'kredit');
    console.log('\n=== Data Kredit ===');
    kreditData.forEach(kredit => {
      console.log(`
        ID: ${kredit.id}
        Tanggal: ${kredit.date}
        Jumlah: Rp ${kredit.amount.toLocaleString('id-ID')}
        Deskripsi: ${kredit.description}
        Status: ${kredit.status}
      `);
    });

    // Tampilkan total
    const totalIuran = iuranData.reduce((sum, item) => sum + item.amount, 0);
    const totalKredit = kreditData.reduce((sum, item) => sum + item.amount, 0);

    console.log('\n=== Ringkasan ===');
    console.log(`Total Iuran: Rp ${totalIuran.toLocaleString('id-ID')}`);
    console.log(`Total Kredit: Rp ${totalKredit.toLocaleString('id-ID')}`);

    return {
      iuran: iuranData,
      kredit: kreditData,
      summary: {
        totalIuran,
        totalKredit,
      },
    };
  } catch (error) {
    console.error('Error displaying transactions:', error);
    return null;
  }
};

// Contoh penggunaan:
/*
const userId = '1';
const result = await displayTransactions(userId);
if (result) {
  // Data tersedia dalam format terstruktur
  const { iuran, kredit, summary } = result;

  // Gunakan data sesuai kebutuhan
  console.log(`Jumlah transaksi iuran: ${iuran.length}`);
  console.log(`Jumlah transaksi kredit: ${kredit.length}`);
  console.log(`Total iuran: Rp ${summary.totalIuran}`);
  console.log(`Total kredit: Rp ${summary.totalKredit}`);
}
*/
