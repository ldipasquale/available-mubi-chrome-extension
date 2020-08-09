const Texts = {
  SHOW_AVAILABLE: 'Show only available movies',
}

const ClassNames = {
  FILMS_CONTAINER: 'films-container',
  ENTITY_BODY: 'entity-body',
  GRID: 'grid',
  MOVIE: 'film-tile',
  HIDDEN_MOVIE: 'film-tile--hidden',
  PLAY_BUTTON: 'play-button',
  SHOW_MORE_LINK: 'film-show-more-link',
  SHOW_AVAILABLE_BUTTON: 'available-movies-button',
  ENABLED_SHOW_AVAILABLE_BUTTON: 'available-movies-button--enabled',
  LOAD_MORE_BUTTON: 'app-load-more',
  PAGINATED_CONTAINER: 'paginated-container',
}

const UPDATE_MOVIES_INTERVAL = 500

let isShowingAvailableMovies = false

function getAllMovies() {
  return document.querySelectorAll(`.${ClassNames.MOVIE}`)
}

function showAvailableMovies(movies, button) {
  if (button !== undefined) {
    button.classList.add(ClassNames.ENABLED_SHOW_AVAILABLE_BUTTON)
  }

  for (var i = 0; i < movies.length; i++) {
    const movie = movies[i]

    if (movie.querySelector(`.${ClassNames.PLAY_BUTTON}`) === null) {
      movie.classList.add(ClassNames.HIDDEN_MOVIE)
    }
  }
}

function showAllMovies(movies, button) {
  if (button !== undefined) {
    button.classList.remove(ClassNames.ENABLED_SHOW_AVAILABLE_BUTTON)
  }

  for (var i = 0; i < movies.length; i++) {
    const movie = movies[i]

    movie.classList.remove(ClassNames.HIDDEN_MOVIE)
  }
}


function createButton() {
  const button = document.createElement('a')
  button.classList.add(ClassNames.SHOW_MORE_LINK, ClassNames.SHOW_AVAILABLE_BUTTON)
  button.innerHTML = Texts.SHOW_AVAILABLE

  function handleButtonClick() {
    isShowingAvailableMovies = !isShowingAvailableMovies

    const allMovies = getAllMovies()

    if (isShowingAvailableMovies) {
      showAllMovies(allMovies, button)
    } else {
      showAvailableMovies(allMovies, button)
    }
  }

  button.onclick = handleButtonClick

  return button
}

function insertButton(button) {
  const filmsContainer = document.querySelector(`.${ClassNames.FILMS_CONTAINER}`)

  if (filmsContainer !== null) {
    return filmsContainer.insertBefore(button, filmsContainer.firstChild)
  }

  const entityBodyGrid = document.querySelector(`.${ClassNames.ENTITY_BODY} .${ClassNames.GRID}`)

  if (entityBodyGrid !== null) {
    return entityBodyGrid.insertBefore(button, entityBodyGrid.firstChild)
  }
}

function addPushMoreButtonListener() {
  const loadMoreButton = document.querySelector(`.${ClassNames.LOAD_MORE_BUTTON}`)

  if (loadMoreButton === null) {
    return
  }

  const paginatedContainer = document.querySelector(`.${ClassNames.PAGINATED_CONTAINER}`)

  loadMoreButton.onclick = function() {
    if (isShowingAvailableMovies) {
      return
    }

    const updateMoviesInterval = setInterval(function() {
      if (paginatedContainer.attributes['data-buffer'].value !== 'buffer-start') {
        setTimeout(function() {
          showAvailableMovies(getAllMovies())
        }, 500)

        clearInterval(updateMoviesInterval)
      }
    }, UPDATE_MOVIES_INTERVAL)
  }
}

window.onload = function() {
  const allMovies = getAllMovies()

  if (allMovies.length === 0) {
    return
  }

  const toggleButton = createButton()

  insertButton(toggleButton)

  if (!isShowingAvailableMovies) {
    showAvailableMovies(allMovies, toggleButton)
  }

  addPushMoreButtonListener()
}