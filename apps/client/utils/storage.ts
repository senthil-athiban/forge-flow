
const saveToLocalStorage = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
}

const getFromLocalStorage = (key: string): string => {
    return window.localStorage.getItem(key) || '';
}

export {
    saveToLocalStorage,
    getFromLocalStorage
}