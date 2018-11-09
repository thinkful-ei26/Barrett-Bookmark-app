/* eslint-disable strict */
const STORE = (function () {

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

  function deleteBookmarkInStore(id) {
    STORE.bookmarks = STORE.bookmarks.filter(bookmark => bookmark.id !== id);
  }

  function setError(error) {
    STORE.error = error;
  }

  function toggleMinimumRating(rating) {
    STORE.minimumRating = rating;
	
  }

  function addBookmarkToStoreFromApi(bookmark) {
    STORE.bookmarks.push(bookmark);
  }

  return {
    bookmarks: [],
    adding: false,
    minimumRating: null,
    error: null,

    toggleExpandOnBookmark,
    getBookmarkIdFromElement,
    deleteBookmarkInStore,
    setError,
    toggleMinimumRating,
    addBookmarkToStoreFromApi
  };
} ());