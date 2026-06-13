import AsyncStorage from '@react-native-async-storage/async-storage';

const setData = async (key: string, val: unknown): Promise<void> => {
    try {
        const tempValue = JSON.stringify(val);
        await AsyncStorage.setItem(key, tempValue);
    } catch (error) {
        console.error("AsyncStorage Error:", error);
    }
};

const getData = async <T>(key: string): Promise<T | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) as T : null;
    } catch (error) {
        console.error("AsyncStorage Error:", error);
        return null;
    }
};

const removeItemValue = async (key: string): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error("AsyncStorage Error:", error);
        return false;
    }
};

export {
    setData,
    getData,
    removeItemValue
};
