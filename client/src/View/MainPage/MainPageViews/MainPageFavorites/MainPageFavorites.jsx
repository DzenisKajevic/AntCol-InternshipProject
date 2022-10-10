import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReloadFavouriteSongs } from "../../../../slices/favourites/favouriteSongsSlice";
import { setFavouriteSongs } from "../../../../slices/favourites/favouriteSongsSlice";
import * as mainAxios from "../../mainAxios";
import { SongCard } from "../MainPageSearch/components/SongCard/SongCard";

const MainPageFavorites = () => {
  const dispatch = useDispatch();
  const reloadFavouriteSongs = useSelector(
    (state) => state.favouriteSongs.reloadFavourites
  );
  const favouriteSongs = useSelector((state) => state.favouriteSongs);
  const sortSongAsc = useRef(true);
  const sortAuthorAsc = useRef(true);
  const pagination = useRef({
    page: "1",
    pageSize: "4",
  });

  useEffect(() => {
    if (reloadFavouriteSongs) {
      const fetchFavourites = async function () {
        let result = await mainAxios.getFavouriteFiles({
          page: 1,
          pageSize: 10,
        });
        console.log(result);
        dispatch(setFavouriteSongs(result.data.data));
        dispatch(setReloadFavouriteSongs(false));
        //console.log(result);
      };
      fetchFavourites().catch(console.error);
    }
    console.log("Favourite songs: ", favouriteSongs.songs);
  }, [reloadFavouriteSongs]);

  const sortByAuthor = function () {
    let tempFavouriteSongs = structuredClone(favouriteSongs.songs);
    // check author a > b, if equal, check songName a > b.
    if (sortAuthorAsc.current)
      tempFavouriteSongs.sort((a, b) =>
        a.metadata.author > b.metadata.author
          ? 1
          : a.metadata.author === b.metadata.author
            ? a.metadata.songName > b.metadata.songName
              ? 1
              : -1
            : -1
      );
    else
      tempFavouriteSongs.sort((a, b) =>
        a.metadata.author > b.metadata.author
          ? -1
          : a.metadata.author === b.metadata.author
            ? a.metadata.songName > b.metadata.songName
              ? -1
              : 1
            : 1
      );

    sortAuthorAsc.current = !sortAuthorAsc.current;
    dispatch(setFavouriteSongs(tempFavouriteSongs)); // invoke rerender
  };

  const sortBySong = function () {
    let tempFavouriteSongs = structuredClone(favouriteSongs.songs);
    // check author a > b, if equal, check songName a > b.
    if (sortSongAsc.current)
      tempFavouriteSongs.sort((a, b) =>
        a.metadata.songName > b.metadata.songName
          ? 1
          : a.metadata.songName === b.metadata.songName
            ? a.metadata.author > b.metadata.author
              ? 1
              : -1
            : -1
      );
    else
      tempFavouriteSongs.sort((a, b) =>
        a.metadata.songName > b.metadata.songName
          ? -1
          : a.metadata.songName === b.metadata.songName
            ? a.metadata.author > b.metadata.author
              ? -1
              : 1
            : 1
      );

    sortSongAsc.current = !sortSongAsc.current;
    dispatch(setFavouriteSongs(tempFavouriteSongs));
  };

  return (
    <section>
      <h1 className="main-page-search-title">Favorite songs</h1>
      <SongCard source="FAVOURITES" />
      <div className="mainPage-button-container">
        <button
          id="previousPage"
          style={ {
            display: pagination.current.page - 1 <= 0 ? "none" : null,
          } }
          onClick={ async () => {
            pagination.current.page--;
            let result = await mainAxios.getFavouriteFiles({
              page: pagination.current.page,
              pageSize: pagination.current.pageSize,
            });
            dispatch(setFavouriteSongs(result.data.data));
            dispatch(setReloadFavouriteSongs(true));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(pagination.current.page) - 1 }
        </button>

        <button id="currentPage">{ pagination.current.page }</button>
        <button
          id="nextPage"
          style={ {
            display:
              Number(pagination.current.page) + 1 > favouriteSongs.pageCount
                ? "none"
                : null,
          } }
          onClick={ async () => {
            console.log(favouriteSongs.pageCount);
            pagination.current.page++;
            let result = await mainAxios.getFavouriteFiles({
              page: pagination.current.page,
              pageSize: pagination.current.pageSize,
            });
            console.log(result);
            dispatch(setFavouriteSongs(result.data.data));
            dispatch(setReloadFavouriteSongs(true));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(pagination.current.page) + 1 }
        </button>
      </div>
    </section>
  );
};

export default MainPageFavorites;
