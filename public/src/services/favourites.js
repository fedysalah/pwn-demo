import localforage from 'localforage';

var favouritesStorage = localforage.createInstance({
    name: "JugSummercamp",
    driver: [localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE],
  });

  export const addFavourite = (talk) => {
    return favouritesStorage
        .setItem(talk.id, talk)
        .catch((err) => {
            console.log(err);
        });
}

export const readFavourite = (talk) => {
    return favouritesStorage
        .getItem(talk.id)
        .catch((err) => {
            console.log(err);
        });
}

export const readAllFavouriteKeys = () => {
    return favouritesStorage
        .keys()
        .catch((err) => {
            console.log(err);
        });
}

export const removeFavourite = (talk) => {
    return favouritesStorage
        .removeItem(talk.id)
        .catch((err) => {
            console.log(err);
        });
}