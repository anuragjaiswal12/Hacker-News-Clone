import Story from '../components/Story.js';
import view from '../utils/view.js';
import baseUrl from '../utils/baseUrl.js';
import store from '../store.js';
import checkFavorite from '../utils/checkFavorite.js';

export default async function Stories(path) {
    const { favorites } = store.getState();
    const stories = await getStories(path);
    const hasStories = stories.length > 0;

    view.innerHTML = `<div>
        ${hasStories ? stories.map((story, i) => Story({ ...story, index: i + 1, isFavorite: checkFavorite(favorites, story) })).join('') : 'No Stories'}
    </div>`;

    document.querySelectorAll('.favorite').forEach(favoriteButton => {
        favoriteButton.addEventListener('click', async function () {
            const story = JSON.parse(this.dataset.story);
            const isFavorited = checkFavorite(favorites, story);
            store.dispatch({ type: isFavorited ? "REMOVE_FAVORITE" : "ADD_FAVORITE", payload: { favorite: story } })
            await Stories(path);
        });
    });
}

async function getStories(path) {
    let finalUrl = baseUrl;
    if (path === '/')
        finalUrl += '/news';
    else if (path === '/new')
        finalUrl += '/newest';
    else
        finalUrl += path;
    const res = await fetch(finalUrl);
    return await res.json();
}