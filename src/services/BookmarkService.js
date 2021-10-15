import AsyncStorage from '@react-native-async-storage/async-storage';

const states = [];
const bookmarks = [];
const isLoaded = false;

const isBookmarked = (manga) => {
    return bookmarks.indexOf(manga) > -1;
}

const addBookmark = (manga) => {
    bookmarks.push(manga);
    storeData('bookmarks', bookmarks);
    notify();
}

const removeBookmark = (manga) => {
    const index = bookmarks.indexOf(manga);
    if (index > -1) {
        bookmarks.splice(index, 1);
        storeData('bookmarks', bookmarks);
        notify();
    }
}

const loadService = async () => {
    if (!isLoaded) {
        const value = await retrieveData('bookmarks');

        if (value) {
            const values = JSON.parse(value);
            for (let i = 0; i < values.length; i++) {
                bookmarks.push(values[i]);
                
            }
            return;
        }

        await storeData('bookmarks', []);
    }
};

const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('bookmarks', jsonValue)
    } catch (e) {
        console.log(e);
    }
}

const retrieveData = async key => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
        console.log(e);
    }
}

const getBookmarks = () => {
    return [...bookmarks];
}

const addState = state => {
    states.push(state)
}

const removeState = state => {
    const index = states.indexOf(state);
    if (index > -1) {
        states.splice(index, 1);
    }
}

const notify = () => {
    for (let i = 0; i < states.length; i++) {
        states[i]([...getBookmarks()])
    }
}

const clear = async () => {
    await storeData('bookmarks', []);
    notify();
}

export default { loadService, addBookmark, removeBookmark, addState, removeState, getBookmarks, clear, isBookmarked };