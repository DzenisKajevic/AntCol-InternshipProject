import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchResults } from "../../../../slices/search/searchResultsSlice";
import { setReloadFavouriteSongs } from "../../../../slices/favourites/favouriteSongsSlice";
import { setFavouriteSongs } from "../../../../slices/favourites/favouriteSongsSlice";
import * as mainAxios from "../../mainAxios";

const MainPageFavorites = () => {
  const dispatch = useDispatch();
  const reloadFavouriteSongs = useSelector((state) => state.favouriteSongs.reloadFavourites);
  const favouriteSongs = useSelector((state) => state.favouriteSongs.songs)
  const sortSongAsc = useRef(true);
  const sortAuthorAsc = useRef(true);

  useEffect(() => {
    if (reloadFavouriteSongs) {
      const fetchFavourites = async function () {
        let result = await mainAxios.getFavouriteFiles({ "page": 1, "pageSize": 10 });
        dispatch(setFavouriteSongs(result.data.data));
        dispatch(setReloadFavouriteSongs(false));
        //console.log(result);
      }
      fetchFavourites()
        .catch(console.error);
    }
    //console.log(reloadFavouriteSongs);
  }, [reloadFavouriteSongs]);

  const sortByAuthor = function () {
    let tempFavouriteSongs = structuredClone(favouriteSongs.songs);
    // check author a > b, if equal, check songName a > b.
    if (sortAuthorAsc.current)
      tempFavouriteSongs.sort((a, b) => (a.metadata.author > b.metadata.author) ? 1 : (a.metadata.author === b.metadata.author) ?
        ((a.metadata.songName > b.metadata.songName) ? 1 : -1) : -1);

    else
      tempFavouriteSongs.sort((a, b) => (a.metadata.author > b.metadata.author) ? -1 : (a.metadata.author === b.metadata.author) ?
        ((a.metadata.songName > b.metadata.songName) ? -1 : 1) : 1);

    sortAuthorAsc.current = !sortAuthorAsc.current;
    dispatch(setSearchResults(tempFavouriteSongs)); // invoke rerender
  }

  const sortBySong = function () {
    let tempFavouriteSongs = structuredClone(favouriteSongs.songs);
    // check author a > b, if equal, check songName a > b.
    if (sortSongAsc.current)
      tempFavouriteSongs.sort((a, b) => (a.metadata.songName > b.metadata.songName) ? 1 : (a.metadata.songName === b.metadata.songName) ?
        ((a.metadata.author > b.metadata.author) ? 1 : -1) : -1);
    else
      tempFavouriteSongs.sort((a, b) => (a.metadata.songName > b.metadata.songName) ? -1 : (a.metadata.songName === b.metadata.songName) ?
        ((a.metadata.author > b.metadata.author) ? -1 : 1) : 1);

    sortSongAsc.current = !sortSongAsc.current;
    dispatch(setReloadFavouriteSongs(tempFavouriteSongs));
  }

  return (
    <>
      <h1>fav</h1>
    </>
  );
};

export default MainPageFavorites;
