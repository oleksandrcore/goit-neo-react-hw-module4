import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./components/ImageModal/ImageModal";
import axios from "axios";
import css from "./App.module.css";
import { useState } from "react";

const CLIENT_ID = "iPI112ihZSl2Y4TwloK203mGIbS9eS91w-5NNNzpJQ8";
axios.defaults.baseURL = "https://api.unsplash.com/search/photos";

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async (query, page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("", {
        params: {
          client_id: CLIENT_ID,
          query: query,
          page: page,
          per_page: 12,
          orientation: "landscape",
        },
      });

      setImages((prevImages) =>
        page === 1
          ? response.data.results
          : [...prevImages, ...response.data.results]
      );
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    fetchImages(newQuery, 1);
  };

  const onLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(query, nextPage);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={onSubmit} />
      {error && <ErrorMessage error={error} />}
      <ImageGallery images={images} onImageClick={openModal} />
      {isLoading && <Loader />}
      {!isLoading && images.length > 0 && <LoadMoreBtn onClick={onLoadMore} />}
      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          image={selectedImage}
        />
      )}
    </div>
  );
}

export default App;
