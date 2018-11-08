'use strict';
/*eslint indent: ["error", "tab"]*/

const STORE = {
	bookmarks: [
		{
			name: 'bookmark',
			rating: '1 star',
			url: 'url_link',
			description: 'description string',
			id: '',
			expanded: false,
		}],
	adding: false,
	minimumRating: null,
};

function generateBookmarkDefaultElement(item, itemIndex, template) {
	return `
		<li class="bookmark-default data-item-id="${itemIndex}"> 
			<p class="bookmark-name">${item.name}</p><button>Expand</button>
			<span class="bookmark-rating">Rating: ${item.rating}</span>
		</li>`;
}

function generateBookmarkDefaultItemString(bookmarks) {
	const items = bookmarks.map((item, index) => generateBookmarkDefaultElement(item, index));
	return items.join('');
}

function renderBookmarks() {
// renders DOM according to the current state of the store/api
// default state is a list view of currently added bookmarks in condensed view showing
// only name and rating, no rating filter on, add button and minimum rating dropdown
	if (STORE.adding === true) {
		const addBookmarkForm = `
	<form id="add-bookmark-form">
                
		<label for="name">New Bookmark Name:</label>
		<input type="text" name="new-bookmark-name" id="name" class="js-new-bookmark-name">
		
		<label for="url">URL:</label>
		<input type="text" name="new-bookmark-url" id="url" class="js-new-bookmark-url">
		
		<div>
				<label for="description">Description:</label>
				<input type="text" name="new-bookmark-description" id="description" class="js-new-bookmark-description">
		</div>
		<section class="rating-buttons">
				<input type="radio" name="rating" value="1-star">1 star<br>
				<input type="radio" name="rating" value="2-stars">2 stars<br>
				<input type="radio" name="rating" value="3-stars">3 stars<br>
				<input type="radio" name="rating" value="4-stars">4 stars<br>
				<input type="radio" name="rating" value="5-stars">5 stars<br>
		</section>
		<input class="submit-bookmark-button" type="submit" value="Submit">
		<button type="button" class="cancel-add-bookmark-button">Cancel</button>
	</form>`;
		$('.add-bookmark-section').html(addBookmarkForm);
	}
	else {
		$('.add-bookmark-section').html('');
	}
	const bookmarkDefaultItemString = generateBookmarkDefaultItemString(STORE.bookmarks); 
	$('.js-bookmarks').html(bookmarkDefaultItemString);

}


function handleAddBookmarksButtonClicked() {
// add bookmarks to list
// re-render with add bookmark menu: name, url, description, rating, hidden id, add and cancel buttons
// submit adds new item to local store and api
	$('.add-bookmark-button').on('click', () => {
		STORE.adding = true;
		console.log(STORE.adding);
		renderBookmarks();
	});
}

function handleCancelAddBookmarks() {
	$('.add-bookmark-section').on('click', '.cancel-add-bookmark-button', () => {
		STORE.adding = false;
		renderBookmarks();
	});
}

function handleAddNewBookmark() {
	$('.add-bookmark-section').on('submit', 'submit-bookmark-button', event => {
		event.preventDefault();
		console.log('something happened');
	});
}

function handleExpandedView() {
// click/keyboard on bookmark to see expanded view, 
//  update store, re-render to show title, description, url link button, rating, hide button
// select hide button to return to default view, update store, render
}

function handleDeleteBookmarks() {
// select delete button in expanded view, remove bookmark from store and api
// render
}

function handleCannotSubmitBookmark() {
// give userappropriate feedback if the submission fails
// seek help here
}

function handleMinimumRatinfFilter() {
// select a rating from minimum rating dropdown
// change store minimumRating, render filtered bookmarks
}

function handleBookmarks() {
	renderBookmarks();
	handleAddNewBookmark();
	handleAddBookmarksButtonClicked();
	handleCancelAddBookmarks();
	handleExpandedView();
	handleDeleteBookmarks();
	handleCannotSubmitBookmark();
	handleMinimumRatinfFilter();
	
}

$(handleBookmarks());
