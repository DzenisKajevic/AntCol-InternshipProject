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
  const pagination = useRef({
    page: "1",
    pageSize: "4",
  });

  useEffect(() => {
    if (reloadFavouriteSongs) {
      const fetchFavourites = async function () {
        let result = await mainAxios.getFavouriteFiles(
          pagination.current
        );
        if (result.error) {
          let emptyArray = [];
          dispatch(setFavouriteSongs(emptyArray));
          dispatch(setReloadFavouriteSongs(false));
        }
        else {
          dispatch(setFavouriteSongs(result.data.data));
          dispatch(setReloadFavouriteSongs(false));
        }
      };
      fetchFavourites();
    }
  }, [reloadFavouriteSongs]);

  return (
    <section>
      <h1 className="main-page-search-title">Favorite songs</h1>
      <SongCard source="FAVOURITES" />
      <div className="mainPage-button-container">
        <button
          id="previousPage"
          className="previousPage"
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

        <button id="currentPage" className="currentPage" style={ { display: favouriteSongs.pageCount ? null : "none" } }>
          { pagination.current.page }
        </button>
        <button
          id="nextPage"
          className="nextPage"
          style={ {
            display:
              Number(pagination.current.page) + 1 > favouriteSongs.pageCount || !favouriteSongs.pageCount
                ? "none"
                : null,
          } }
          onClick={ async () => {
            pagination.current.page++;
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
          { Number(pagination.current.page) + 1 }
        </button>
      </div>
    </section>
  );
};

export default MainPageFavorites;
