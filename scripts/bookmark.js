'use strict';
/*eslint indent: ["error", "tab"]*/

const STORE = {
	bookmarks: [
		{
			title: 'bookmark',
			url: 'url_link',
			rating: '1-star',
			description: 'description string',
			id: 'asdjfnvbsi',
			expanded: false,
		}],
	adding: false,
	minimumRating: null,
};

function generateBookmarkDefaultElement(item) {
	if (item.expanded === true)
		return `
			<li class="bookmark bookmark-expanded" data-item-id="${item.id}">
				<p class="bookmark-name">${item.title}</p>
				<p class="bookmark-description">${item.description}</p>
				<span class="bookmark-rating">Rating: ${item.rating}</span>
				<a target="blank" href="${item.url}"><button>Visit Site</button></a>
				<button class="delete-bookmark-button">Delete</button>
				<button class="hide-bookmark-button">Hide</button>
			</li>`;
	return `
		<li class="bookmark bookmark-default" data-item-id="${item.id}"> 
			<p class="bookmark-name">${item.title}</p>
			<button type="button" class="expand-bookmark-button">Expand</button>
			<span class="bookmark-rating">Rating: ${item.rating}</span>
		</li>`;
}

function generateBookmarkDefaultItemString(bookmarks) {
	const items = bookmarks.map((item) => generateBookmarkDefaultElement(item));
	return items.join('');
}

function renderBookmarks() {
// renders DOM according to the current state of the store/api
// default state is a list view of currently added bookmarks in condensed view showing
// only name and rating, no rating filter on, add button and minimum rating dropdown
	if (STORE.adding === true) {
		const addBookmarkForm = `
	<form id="add-bookmark-form" name="newBookmarkForm">
                
		<label for="name">New Bookmark Name:</label>
		<input type="text" name="newBookmarkName" id="name" class="js-new-bookmark-name">
		
		<label for="url">URL:</label>
		<input type="text" name="newBookmarkUrl" id="url" class="js-new-bookmark-url">
		
		<div>
				<label for="description">Description:</label>
				<input type="text" name="newBookmarkDescription" id="description" class="js-new-bookmark-description">
		</div>
		<section class="rating-buttons">
				<input type="radio" name="rating" class="rating-buttons" value="1">1 star<br>
				<input type="radio" name="rating" class="rating-buttons" value="2">2 stars<br>
				<input type="radio" name="rating" class="rating-buttons" value="3">3 stars<br>
				<input type="radio" name="rating" class="rating-buttons" value="4">4 stars<br>
				<input type="radio" name="rating" class="rating-buttons" value="5">5 stars<br>
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
	$('.add-bookmark-section').on('click', '.submit-bookmark-button', event => {
		event.preventDefault();
		const newBookmark = $(this).serializeJson();
		console.log(newBookmark);
		api.createBookmarks(newBookmark, (bookmark) => {
			STORE.bookmarks.push(bookmark);
			console.log(STORE);
			renderBookmarks();
		});
	});
}

$.fn.extend({
	serializeJson : function() {
		const title = $('#name').val();
		const url = $('#url').val();
		const rating = $('.rating-buttons:checked').val();
		const description = $('#description').val();
		const data = {title, url, rating, description};
		return JSON.stringify(data);
		// const formData = new FormData(document.getElementById('add-bookmark-form'));
		// const bookmark = {};
		// formData.forEach((value, name) => bookmark[name] = value);
		// return JSON.stringify(bookmark);
	}

});

function handleExpandedView() {
// click/keyboard on bookmark to see expanded view, 
//  update store, re-render to show title, description, url link button, rating, hide button
// select hide button to return to default view, update store, render
	$('.js-bookmarks').on('click', '.expand-bookmark-button', (event) => {
		toggleExpandOnBookmark(event.target);
		renderBookmarks();
	});
}

function handleHideExpandedView() {
	$('.js-bookmarks').on('click', '.hide-bookmark-button', () => {
		toggleExpandOnBookmark(event.target);
		renderBookmarks();
	});
}

function toggleExpandOnBookmark(target) {
	const id = getBookmarkIdFromElement(target);
	const bookmark = STORE.bookmarks.find(function(bookmark) {
		return bookmark.id === id;
	});
	bookmark.expanded = !bookmark.expanded;
}

function getBookmarkIdFromElement(target) {
	return $(target)
		.closest('.bookmark')
		.data('item-id');
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
	handleHideExpandedView();
	handleDeleteBookmarks();
	handleCannotSubmitBookmark();
	handleMinimumRatinfFilter();
	getBookmarkIdFromElement();
}

$(handleBookmarks());
