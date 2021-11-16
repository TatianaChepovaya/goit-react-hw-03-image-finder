import axios from "axios";

const BASE_URL = "https://pixabay.com/api";
const ACCESS_KEY = "22352284-07c51f530b6e71a5deb2eb1e0";

const fetchImagesWithQuery = (searchQuery, page) => {
  return axios
    .get(
      `${BASE_URL}/?q=${searchQuery}&page=${page}&key=${ACCESS_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.length !== 0) {
          return response.data.hits;
        }
      }
      if (response.status === 404) {
        throw new Error(response.message || "Your query is not find");
      }
    });
};

const api = {
  fetchImagesWithQuery
};

export default api;
