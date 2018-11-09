/* eslint-disable strict */
/*eslint-env jquery*/ 
/*eslint indent: ["error", "tab"]*/

const api = (function () {
	const BASE_URL = 'https://thinkful-list-api.herokuapp.com/barrett';
  
	const getBookmarks = function(callback) {
		$.getJSON(`${BASE_URL}/bookmarks`, callback);
	};
  
	const createBookmarks = function(bookmark, callback) {
        // const newItem = JSON.stringify({name: name});
        // const newItem = JSON.stringify(name);
		$.ajax({
			url:`${BASE_URL}/bookmarks`,
			method: 'POST',
			contentType: 'application/json',
			data: bookmark,
			success: callback,
			error: error => console.error(error.responseJSON.message)
		});
	};
  
	const updateBookmarks = function(id, updateData, callback) {
		$.ajax({
			url: `${BASE_URL}/bookmarks/${id}`,
			method: 'PATCH',
			contentType: 'application/json',
			data: JSON.stringify(updateData),
			success: callback
		});
	};
  
	const deleteBookmarks = function(id, callback) {
		$.ajax({
			url: `${BASE_URL}/bookmarks/${id}`,
			method: 'DELETE',
			contentType: 'application/json',
			// data: JSON.stringify(id),
			success: callback
		});
	};
    
    
  
	return {
		getBookmarks,
		createBookmarks,
		updateBookmarks,
		deleteBookmarks
	};
}());