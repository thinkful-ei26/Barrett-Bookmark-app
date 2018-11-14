'use strict';
/*eslint indent: ["error", "tab"]*/

const bookmark = (function () {

	function generateBookmarkDefaultElement(item) {
		if (item.expanded === true)
			return `
			<li class="bookmark bookmark-expanded" data-item-id="${item.id}">
				<p class="bookmark-name">${item.title}</p>
				<p class="bookmark-desc">${item.desc}</p>
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
		console.log(bookmarks);
		const items = bookmarks.map((item) => generateBookmarkDefaultElement(item));
	
		return items.join('');
	}

	function renderBookmarks() {
		// renders DOM according to the current state of the store/api
		// default state is a list view of currently added bookmarks in condensed view showing
		// only name and rating, no rating filter on, add button and minimum rating dropdown
		let bookmarks = [ ...STORE.bookmarks];

		if (STORE.error) {
			
			const el = generateError(STORE.error);
			$('.error').html(el);
		} else {
			$('.error').empty();
		}

		if (STORE.minimumRating) {
			bookmarks = bookmarks.filter((bookmark) => bookmark.rating === STORE.minimumRating);
		}

		const bookmarkDefaultItemString = generateBookmarkDefaultItemString(bookmarks); 
		$('.js-bookmarks').html(bookmarkDefaultItemString);

		if (STORE.adding === true) {
			let nameLbl = $('#name');
			let nameTxt = (nameLbl.length) ? nameLbl.val() : ''; // ()?:; ternary operator
			const addBookmarkForm = `
	<form id="add-bookmark-form" name="newBookmarkForm">
                
		<label for="name">New Bookmark Name:</label>
		<input type="text" name="newBookmarkName" id="name" class="js-new-bookmark-name" value="${nameTxt}">
		
		<label for="url">URL:</label>
		<input type="text" name="newBookmarkUrl" id="url" class="js-new-bookmark-url">
		
		<div>
				<label for="desc">Description:</label>
				<input type="text" name="newBookmarkDesc" id="desc" class="js-new-bookmark-desc">
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
				renderBookmarks();
			},
			(err) => {
				console.log(err);
				STORE.setError(err);
				renderBookmarks();
			});
		});
	}

	$.fn.extend({
		serializeJson : function() {
			const title = $('#name').val();
			const url = $('#url').val();
			const rating = $('.rating-buttons:checked').val();
			const desc = $('#desc').val();
			const data = {title, url, rating, desc};
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
			STORE.toggleExpandOnBookmark(event.target);
			renderBookmarks();
		});
	}

	function handleHideExpandedView() {
		$('.js-bookmarks').on('click', '.hide-bookmark-button', () => {
			STORE.toggleExpandOnBookmark(event.target);
			renderBookmarks();
		});
	}

	function handleDeleteBookmarks() {
		// select delete button in expanded view, remove bookmark from store and api
		// render
		$('.js-bookmarks').on('click', '.delete-bookmark-button', event => {
			const id = STORE.getBookmarkIdFromElement(event.target);
			api.deleteBookmarks(id, () => {
				STORE.deleteBookmarkInStore(id);
				renderBookmarks();
			},
			(err) => {
				console.log(err);
				STORE.setError(err);
				renderBookmarks();
			});
		});
	}

	function generateError(err) {
		let message = '';
		if (err.responseJSON && err.responseJSON.message) {
			message = err.responseJSON.message;
		} else {
			message = `${err.code} Server Error`;
		}

		return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
	}

	function handleCloseErrorWindow() {
		$('.error').on('click', '#cancel-error', () => {
			$('.error').empty();
		});
	}

	function handleMinimumRatingFilter() {
		// select a rating from minimum rating dropdown
		// change store minimumRating, render filtered bookmarks
		$('#minimum-rating-dropdown').on('change', event => {
			const minimumRating = $(event.target).find(':selected').text();
			STORE.toggleMinimumRating(parseInt(minimumRating));
			console.log(STORE);
			renderBookmarks();
		});
	
	}

	// function getBookmarksFromServer() {
	// 	api.getBookmarks((bookmarks) => {
	// 		bookmarks.forEach((bookmark) => {
	// 			STORE.addBookmarkToStoreFromApi(bookmark);
	// 			renderBookmarks();
	// 		});
	// 	}); 
	// }

	function bindEventListeners() {
		renderBookmarks();
		handleAddNewBookmark();
		handleAddBookmarksButtonClicked();
		handleCancelAddBookmarks();
		handleExpandedView();
		handleHideExpandedView();
		handleDeleteBookmarks();
		handleMinimumRatingFilter();
		handleCloseErrorWindow();
	}

	return {
		renderBookmarks,
		bindEventListeners
	};
} ());


