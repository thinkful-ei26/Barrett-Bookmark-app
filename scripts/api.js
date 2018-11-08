/* eslint-disable strict */
/*eslint-env jquery*/ 
/*eslint indent: ["error", "tab"]*/

const api = (function () {
	const BASE_URL = 'https://thinkful-list-api.herokuapp.com/barrett';
  
	const getItems = function(callback) {
		$.getJSON(`${BASE_URL}/bookmarks`, callback);
	};
  
	const createItem = function(name, callback) {
		const newItem = JSON.stringify({name: name});
		$.ajax({
			url:`${BASE_URL}/bookmarks`,
			method: 'POST',
			contentType: 'application/json',
			data: newItem,
			success: callback,
			error: error => console.error(error.responseJSON.message)
		});
	};
  
	const updateItem = function(id, updateData, callback) {
		$.ajax({
			url: `${BASE_URL}/bookmarks/${id}`,
			method: 'PATCH',
			contentType: 'application/json',
			data: JSON.stringify(updateData),
			success: callback
		});
	};
  
	const deleteItem = function(id, callback) {
		$.ajax({
			url: `${BASE_URL}/bookmarks/${id}`,
			method: 'DELETE',
			contentType: 'application/json',
			// data: JSON.stringify(id),
			success: callback
		});
	};
    
    
  
	return {
		getItems,
		createItem,
		updateItem,
		deleteItem
	};
}());