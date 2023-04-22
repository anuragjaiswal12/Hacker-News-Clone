import view from '../utils/view.js';
import baseUrl from '../utils/baseUrl.js';
import checkFavorite from '../utils/checkFavorite.js';
import Story from '../components/Story.js';
import Comment from '../components/Comment.js';
import store from '../store.js';

export default async function Item() {
    const { favorites } = store.getState();
    let story = null;
    let items = null;
    let hasError = false;
    let hasItems = false;
    try {
        story = await getStory();
        items = story.comments;
        hasItems = items.length > 0;
    }
    catch (error) {
        hasError = true;
    }
    if (hasError) {
        view.innerHTML = `<div class="error">Error fetching story</div>`;
    }
    view.innerHTML = `
    <div>
        ${Story({ ...story, isFavorite: checkFavorite(favorites, story) })}
    </div>
    <hr>
    <div>
        ${hasItems ? items.map((item) => Comment(item)).join('') : 'No Comments'}
    </div>`;

    document.querySelector('.favorite').addEventListener('click', async function () {
        const story = JSON.parse(this.dataset.story);
        const isFavorited = checkFavorite(favorites, story);
        store.dispatch({ type: isFavorited ? "REMOVE_FAVORITE" : "ADD_FAVORITE", payload: { favorite: story } })
        await Item();
    });
}

async function getStory() {
    const storyId = window.location.hash.split('?id=')[1];
    const res = await fetch(`${baseUrl}/item/${storyId}`)
    return await res.json();
}