const inputBook = document.getElementById('inputBook');
const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const completeBookshelfList = document.getElementById('completeBookshelfList');

function createBookElement(book) {
  const { id, title, author, year, isComplete } = book;

  const bookItem = document.createElement('article');
  bookItem.classList.add('book_item');
  bookItem.dataset.id = id;

  const bookTitle = document.createElement('h3');
  bookTitle.textContent = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.textContent = `Penulis: ${author}`;

  const bookYear = document.createElement('p');
  bookYear.textContent = `Tahun: ${year}`;

  const action = document.createElement('div');
  action.classList.add('action');

  const completeBookButton = document.createElement('button');
  completeBookButton.classList.add(isComplete ? 'yellow' : 'green');
  completeBookButton.textContent = isComplete ? 'Pindahkan' : 'Pindahkan';

  completeBookButton.addEventListener('click', function () {
    toggleReadStatus(id);
  });

  const deleteBookButton = document.createElement('button');
  deleteBookButton.classList.add('red');
  deleteBookButton.textContent = 'Hapus buku';

  deleteBookButton.addEventListener('click', function () {
    deleteBook(id);
  });

  action.appendChild(completeBookButton);
  action.appendChild(deleteBookButton);

  bookItem.appendChild(bookTitle);
  bookItem.appendChild(bookAuthor);
  bookItem.appendChild(bookYear);
  bookItem.appendChild(action);

  return bookItem;
}

function toggleReadStatus(bookId) {
  const bookItem = document.querySelector(`[data-id="${bookId}"]`);
  if (bookItem) {
    const isComplete = bookItem.querySelector('button').classList.contains('green');

    if (isComplete) {
      bookItem.querySelector('button').classList.remove('green');
      bookItem.querySelector('button').classList.add('yellow');
      completeBookshelfList.appendChild(bookItem);
    } else {
      bookItem.querySelector('button').classList.remove('yellow');
      bookItem.querySelector('button').classList.add('green');
      incompleteBookshelfList.appendChild(bookItem);
    }

    updateLocalStorage();
  }
}

function deleteBook(bookId) {
  const bookItem = document.querySelector(`[data-id="${bookId}"]`);
  if (bookItem) {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda tidak akan dapat mengembalikan ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        bookItem.remove();
        updateLocalStorage();
        Swal.fire(
          'Terhapus!',
          'Buku telah dihapus.',
          'success'
        );
      }
    });
  }
}

function addBookToShelf(event) {
  event.preventDefault();

  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const newBook = {
    id: generateUniqueId(),
    title,
    author,
    year,
    isComplete,
  };

  const newBookItem = createBookElement(newBook);

  if (isComplete) {
    completeBookshelfList.appendChild(newBookItem);
  } else {
    incompleteBookshelfList.appendChild(newBookItem);
  }

  updateLocalStorage();
  inputBook.reset();
}

function generateUniqueId() {
  return Date.now().toString();
}

function updateLocalStorage() {
  const allBooks = [];

  const incompleteBooks = Array.from(incompleteBookshelfList.children).map((bookItem) => {
    return extractBookDetails(bookItem);
  });

  const completeBooks = Array.from(completeBookshelfList.children).map((bookItem) => {
    return extractBookDetails(bookItem);
  });

  allBooks.push(...incompleteBooks, ...completeBooks);
  localStorage.setItem('books', JSON.stringify(allBooks));
}

function extractBookDetails(bookItem) {
  const id = bookItem.dataset.id;
  const title = bookItem.querySelector('h3').textContent;
  const author = bookItem.querySelector('p:nth-child(2)').textContent.split(': ')[1];
  const year = parseInt(bookItem.querySelector('p:nth-child(3)').textContent.split(': ')[1]);
  const isComplete = bookItem.querySelector('button').classList.contains('yellow');

  return { id, title, author, year, isComplete };
}

function displayStoredBooks() {
  const storedBooks = localStorage.getItem('books');

  if (storedBooks) {
    const parsedBooks = JSON.parse(storedBooks);

    parsedBooks.forEach((book) => {
      const newBookItem = createBookElement(book);

      if (book.isComplete) {
        completeBookshelfList.appendChild(newBookItem);
      } else {
        incompleteBookshelfList.appendChild(newBookItem);
      }
    });
  }
}

function searchBook(event) {
  event.preventDefault();

  const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
  const allBooks = getAllBooks();

  const matchingBooks = allBooks.filter((book) => book.title.toLowerCase().includes(searchTerm));

  displaySearchedBooks(matchingBooks);
}

function getAllBooks() {
  const incompleteBooks = Array.from(incompleteBookshelfList.children).map((bookItem) => {
    return extractBookDetails(bookItem);
  });

  const completeBooks = Array.from(completeBookshelfList.children).map((bookItem) => {
    return extractBookDetails(bookItem);
  });

  return [...incompleteBooks, ...completeBooks];
}

function displaySearchedBooks(books) {
  clearBookshelfLists();

  books.forEach((book) => {
    const newBookItem = createBookElement(book);

    if (book.isComplete) {
      completeBookshelfList.appendChild(newBookItem);
    } else {
      incompleteBookshelfList.appendChild(newBookItem);
    }
  });
}

function clearBookshelfLists() {
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';
}

inputBook.addEventListener('submit', addBookToShelf);

document.addEventListener('DOMContentLoaded', function () {
  displayStoredBooks();
});

const searchBookForm = document.getElementById('searchBook');

searchBookForm.addEventListener('submit', searchBook);