/* eslint-disable strict */
$(document).ready(function() {
  bookmark.bindEventListeners();
  bookmark.renderBookmarks();
  api.getBookmarks((items) => {
    items.forEach((bookmark) => STORE.addBookmarkToStoreFromApi(bookmark));
    bookmark.renderBookmarks();
  });
});