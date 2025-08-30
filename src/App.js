import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import BookModal from "./components/BookModal";
import Header from "./components/Header";
import FavoritesList from "./components/FavoritesList";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import ReviewModal from "./components/ReviewModal";
import ReviewsList from "./components/ReviewsList";

function App() {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Load favorites and reviews from sessionStorage on component mount
  useEffect(() => {
    console.log(localStorage.getItem("test")); // "123"

    const savedFavorites = localStorage.getItem("bookFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    const savedReviews = localStorage.getItem("bookReviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("bookFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Save reviews to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem("bookReviews", JSON.stringify(reviews));
  }, [reviews]);

  const searchBooks = useCallback(async (query, searchType = "title") => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      let searchUrl;
      const baseUrl = "https://openlibrary.org/search.json";

      switch (searchType) {
        case "author":
          searchUrl = `${baseUrl}?author=${encodeURIComponent(query)}`;
          break;
        case "subject":
          searchUrl = `${baseUrl}?subject=${encodeURIComponent(query)}`;
          break;
        case "isbn":
          searchUrl = `${baseUrl}?isbn=${encodeURIComponent(query)}`;
          break;
        case "publisher":
          searchUrl = `${baseUrl}?publisher=${encodeURIComponent(query)}`;
          break;
        default:
          searchUrl = `${baseUrl}?title=${encodeURIComponent(query)}`;
      }

      searchUrl += "&limit=50"; // Get more results

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        const processedBooks = data.docs
          .filter((book) => book.title && (book.author_name || book.author_key))
          .map((book) => ({
            key: book.key,
            title: book.title,
            authors: book.author_name || ["Unknown Author"],
            first_publish_year: book.first_publish_year,
            isbn: book.isbn?.[0],
            cover_id: book.cover_i,
            subjects: book.subject?.slice(0, 5) || [],
            publisher: book.publisher?.[0],
            language: book.language?.[0] || "en",
            pages: book.number_of_pages_median,
            rating: book.ratings_average
              ? Math.round(book.ratings_average * 10) / 10
              : null,
            publish_date: book.publish_date?.[0],
            cover_url: book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : null,
          }));

        setBooks(processedBooks);

        // Add to search history
        const newHistoryItem = {
          query,
          type: searchType,
          timestamp: new Date().toISOString(),
          resultsCount: processedBooks.length,
        };

        setSearchHistory((prev) => {
          const filtered = prev.filter(
            (item) => !(item.query === query && item.type === searchType)
          );
          return [newHistoryItem, ...filtered].slice(0, 10); // Keep last 10 searches
        });
      } else {
        setError(
          `No books found for "${query}". Try a different search term or search type.`
        );
      }
    } catch (err) {
      setError(
        "Failed to search books. Please check your connection and try again."
      );
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback((book) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.key === book.key);
      if (isAlreadyFavorite) {
        return prev.filter((fav) => fav.key !== book.key);
      } else {
        return [...prev, book];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (bookKey) => {
      return favorites.some((fav) => fav.key === bookKey);
    },
    [favorites]
  );

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const handleReviewSubmit = useCallback((review) => {
    setReviews((prev) => [review, ...prev]);
  }, []);

  const handleDeleteReview = useCallback((reviewId) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  }, []);

  const getBookReviews = useCallback(
    (bookKey) => {
      return reviews.filter((review) => review.bookKey === bookKey);
    },
    [reviews]
  );

  const getBookAverageRating = useCallback(
    (bookKey) => {
      const bookReviews = getBookReviews(bookKey);
      if (bookReviews.length === 0) return 0;
      const total = bookReviews.reduce((sum, review) => sum + review.rating, 0);
      return (total / bookReviews.length).toFixed(1);
    },
    [getBookReviews]
  );

  const openReviewModal = () => {
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  return (
    <div className="App">
      <Header
        favoriteCount={favorites.length}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
      />

      <main className="main-content">
        <SearchBar
          onSearch={searchBooks}
          searchHistory={searchHistory}
          onClearHistory={clearSearchHistory}
        />

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        )}

        {loading && <LoadingSpinner />}

        {showFavorites ? (
          <FavoritesList
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onBookClick={handleBookClick}
          />
        ) : (
          <BookList
            books={books}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onBookClick={handleBookClick}
            getBookReviews={getBookReviews}
            getBookAverageRating={getBookAverageRating}
          />
        )}

        {selectedBook && (
          <BookModal
            book={selectedBook}
            isFavorite={isFavorite(selectedBook.key)}
            onToggleFavorite={() => toggleFavorite(selectedBook)}
            onClose={closeModal}
            reviews={reviews}
            getBookReviews={getBookReviews}
            getBookAverageRating={getBookAverageRating}
            onDeleteReview={handleDeleteReview}
            onOpenReviewModal={openReviewModal}
          />
        )}

        {showReviewModal && selectedBook && (
          <ReviewModal
            book={selectedBook}
            onClose={closeReviewModal}
            onSubmitReview={handleReviewSubmit}
          />
        )}
      </main>
    </div>
  );
}

export default App;
