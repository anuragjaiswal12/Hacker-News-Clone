function createStore(reducer) {
    let currentState = reducer(undefined, {});

    return {
        getState: () => currentState,
        dispatch: action => {
            currentState = reducer(currentState, action);
            localStorage.setItem('fav', JSON.stringify(currentState));
        }
    }
}

const initialState = JSON.parse(localStorage.getItem('fav')) || {
    favorites: []
    // favorites: []
}

function favoritesReducer(state = initialState, action) {
    switch (action.type) {
        case "ADD_FAVORITE": {
            const addedFavorite = action.payload.favorite;
            const favorites = [...state.favorites, addedFavorite];
            return { favorites };
        }
        case "REMOVE_FAVORITE": {
            const removedFavorite = action.payload.favorite;
            const favorites = state.favorites.filter(favorite => favorite.id !== removedFavorite.id);
            return { favorites };
        }
        default:
            return state;
    }
}

const store = createStore(favoritesReducer);

export default store;