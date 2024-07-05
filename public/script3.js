    globalThis.document.addEventListener('DOMContentLoaded', () => {
      const searchInput = globalThis.document.getElementById('searchInput');
      const searchResults = globalThis.document.getElementById('searchResults');
      const searchSeasons = globalThis.document.getElementById('seasons');
      const selectedMovieIdInput = globalThis.document.getElementById('selectedMovieId');
      const selectedMediaType = globalThis.document.getElementById('selectedMediaType');
      const form = globalThis.document.getElementById('searchForm');
      const tvButton = globalThis.document.getElementById('tvButton');
      const movieButton = globalThis.document.getElementById('movieButton');
      const searchTypeContainer = globalThis.document.getElementById('searchTypeContainer');
      const searchMovieContainer = globalThis.document.getElementById('searchMovieContainer');
      const clearButton = globalThis.document.getElementById('clearButton');
      const episodeList = globalThis.document.getElementById('episodeList');
      const submitButton = globalThis.document.getElementById('subBtn');
      const spinner = document.getElementById('spinner-border');
      const getMoviesDetails = document.getElementById('get_movies_details');

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTc3NGEwZDMxOTQzMTg0MmM4YWI4OGVkOTk1YjUxNSIsInN1YiI6IjY0YzUzYTc0Y2FkYjZiMDE0NDBkNTc1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-7MHPqHHx0avE_n4Y3kU49FEJ02CsOb54b8Mbp2NCs',
        }
      };

      Cookies.set('name', 'value', {
        sameSite: 'none',
        secure: true
      });

      let baseUrl = 'https://api.themoviedb.org/3';
      let uploadedVideos = 0;

      const genres = JSON.parse(genre.replace(/&#34;/g, '"'));

      // console.log(genres);

      // submitButton.style.display = 'block';

      // Function to fetch data from the API
      const fetchDataFromAPI = async (searchTerm) => {
        try {
          const url = `${baseUrl}/search/multi?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
          // console.log(url);
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          return data.results;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      };

      const fetchDataFromTVAPI = async (searchTerm, mediaType, id) => {
        try {
          let url;
          if (mediaType === 'tv') {
            url = `${baseUrl}/tv/${id}?language=en-US`;
          }
          // console.log(url, id);
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          return data.seasons;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      };

      const fetchDataFromMovieAPI = async (id) => {
        try {
          const url = `${baseUrl}/movie/${id}?language=en-US`;
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          // console.log("I clicked a movie...");
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      }

      const fetchDataFromCollectionsAPI = async (id) => {
        try {
          const url = `${baseUrl}/collection/${id}?language=en-US`;
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data);
          // console.log("I clicked a movie collection...");
          return data.parts;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      }

      const fetchSeasonData = async (tvId, seasonNumber) => {
        try {
          const url = `https://api.themoviedb.org/3/tv/${tvId}?language=en-US&append_to_response=season/${seasonNumber}`;
          const response = await fetch(url, options);
          const data = await response.json();
          // console.log(data['season/'+seasonNumber].episodes);
          // console.log("I clicked a season...");
          return data['season/'+seasonNumber].episodes;
        } catch (error) {
          console.error('Error fetching season data:', error);
          return null;
        }
      };

      // Function to update the search results
      const updateSearchResults = async () => {
        const searchTerm = searchInput.value.trim();

        if (searchTerm === '') {
          searchResults.innerHTML = '';
          return;
        }

        const data = await fetchDataFromAPI(searchTerm);
        // console.log(data);

        const resultsHTML = data.map((movie) => {
            return `<li class="list-group-item" data-id="${movie.id}" data-type="${movie.media_type}" data-value="${movie.name || movie.title}">${movie.name || movie.title}</li>`;
        }).join('');
        searchResults.innerHTML = resultsHTML;

        if (data.some(movie => movie.media_type === 'tv')) {
          searchTypeContainer.style.display = 'block';
          searchMovieContainer.style.display = 'none';
        } else {
          searchMovieContainer.style.display = 'block';
          searchTypeContainer.style.display = 'none';
        }
      };

      // Function to handle the click event on search results
      const handleResultClick = (event) => {
        const selectedId = event.target.dataset.id;
        const selectedTitle = event.target.dataset.value;
        const selectedType = event.target.dataset.type;
        // console.log(selectedId, selectedTitle, selectedType);
        selectedMovieIdInput.value = selectedId;
        searchInput.value = selectedTitle;
        selectedMediaType.value = selectedType;
        searchResults.innerHTML = '';

        // console.log(selectedType);

        if (selectedType === 'tv') {
          tvButton.setAttribute('data-id', selectedId);
        }
        else if (selectedType === 'movie') {
          movieButton.setAttribute('data-id', selectedId);
        }
      };

      // Function to handle the click event on episodes results
      const handleSeasonClick = (event) => {
        const searchTerm = searchInput.value.trim();
        const selectedId = event.target.dataset.id;
        const selectedTitle = event.target.dataset.value;
        const selectedType = event.target.dataset.type;
        // console.log(searchTerm, selectedId, selectedTitle, selectedType);
        selectedMovieIdInput.value = selectedId;
        searchInput.value = searchTerm + ' ' + selectedTitle;
        selectedMediaType.value = selectedType;
        searchSeasons.innerHTML = '';
      };

      const langSelect = document.getElementById("language");

      let lang = '';

      // console.log(langSelect);

      langSelect.addEventListener("change", function () {
        const selectedValue = langSelect.value;

        lang = selectedValue;

        // console.log(selectedValue);

        if (selectedValue === '') {
          alert("Please select a language.");
          submitButton.style.display = 'none';                          
          return;
        }
      });

      // Function to handle the click event on the TV button
      tvButton.addEventListener('click', async (event) => {
        const searchTerm = searchInput.value.trim();
        const tvID = event.target.dataset.id;

        // console.log(event.target);

        // console.log(searchTerm, tvID);
        const data = await fetchDataFromTVAPI(searchTerm, 'tv', tvID);

        const resultsHTML = data.map((tvShow) => {
          return `<li class="list-group-item" data-id="${tvID}" data-type="tv" data-season="${tvShow.season_number}" data-value="${searchTerm} ${tvShow.name}">${searchTerm} ${tvShow.name}</li>`;
        }).join('');
        searchResults.innerHTML = resultsHTML;
        searchTypeContainer.style.display = 'none';

        // searchResults.innerHTML = '';
        searchSeasons.innerHTML = '';

        // console.log(tvID, data);
      });

      movieButton.addEventListener('click', async (event) => {
        const searchTerm = searchInput.value.trim();
        const movieID = event.target.dataset.id;

        // console.log(searchTerm, movieID);

        const movieData = await fetchDataFromMovieAPI(movieID);
        // console.log(movieData['belongs_to_collection'] !== null, movieData);
        // console.log(movieData.hasOwnProperty('success') == false, movieData['belongs_to_collection'] === null);

        if (movieData.hasOwnProperty('success') == false && movieData['belongs_to_collection'] !== null) {
          const collectionID = movieData['belongs_to_collection'].id;
          // console.log(collectionID);

          selectedMovieIdInput.value = collectionID;

          const data = await fetchDataFromCollectionsAPI(collectionID);

          // console.log(data);

          const resultsHTML = data.map((movieParts) => {
            return `
              <div>
                <div class="row mb-1" id="get_movies_detail">
                  <div class="col-12 col-sm-12">
                      <!-- name -->
                    <div class="mb-3">
                      <label for="exampleFormControlName_${movieParts.id}" class="form-label">Name</label>
                      <input type="text" class="form-control" id="exampleFormControlName_${movieParts.id}" name="title" placeholder="e.g., abcd" required>
                    </div>
                      <!-- description -->
                    <div class="mb-3">
                      <label for="exampleFormControlTextarea1_${movieParts.id}" class="form-label">Description</label>
                      <textarea class="form-control" name="description" id="exampleFormControlTextarea1_${movieParts.id}" rows="3" required></textarea>
                    </div>
                      <!-- cast -->
                    <div class="mb-3">
                      <label for="exampleFormControlTextarea2_${movieParts.id}" class="form-label">Cast</label>
                      <textarea class="form-control" name="cast" id="exampleFormControlTextarea2_${movieParts.id}" rows="3" required></textarea>
                    </div>
                      <!-- creator -->
                    <div class="mb-3">
                      <label for="exampleFormControlCreator_${movieParts.id}" class="form-label">Creator</label>
                      <input type="text" class="form-control" name="creator" id="exampleFormControlCreator_${movieParts.id}" placeholder="e.g., xyz" required>
                    </div>
                      <!-- age -->
                    <div class="mb-3">
                      <label for="exampleFormControlAge_${movieParts.id}" class="form-label">Age</label>
                        <input type="number" class="form-control" name="age"  id="exampleFormControlAge_${movieParts.id}" placeholder="e.g., 12" min="12" max="50" required>
                    </div>
                      <!-- release date -->
                    <div class="mb-3">
                      <label for="exampleFormControlDate_${movieParts.id}" class="form-label">Release Date</label>
                        <input type="date" class="form-control" id="exampleFormControlDate_${movieParts.id}" name="release_date" required>
                    </div>
                      <!-- type -->
                    <div class="mb-3">
                      <label class="form-label">Type</label>
                      <select class="form-select" aria-label="Default select example" name="movie_type" required>
                        <option value="movie" selected>Movie</option>
                        <option value="collection">Collection</option>
                        <option value="series">Series</option>
                      </select>
                    </div>
                      <!-- genres -->
                    <div class="mb-3" id="genres_class"></div>
                      <!-- logo -->
                    <div class="mb-3">
                      <div style="display: none;">
                        <label for="formFile1" class="form-label">Logo Image</label>
                        <h4>UPLOADED</h4>
                      </div>
                      <div>
                          <label for="formFile" class="form-label">Logo Image</label>
                          <input class="form-control" type="file" id="formFilel_${movieParts.id}" required>
                          <input type="hidden" name="logo" id="formNameFilel_${movieParts.id}">
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                          <button type="button" class="btn upload-limage-btn border-0" data-lshow-id="${movieParts.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                          <div id="spinner_subl_${movieParts.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                    </div>
                      <!-- poster image -->
                    <div class="mb-3">
                      <div style="display: none;">
                        <label for="formFile_${movieParts.id}" class="form-label">Poster Image</label>
                        <h4>UPLOADED</h4>
                      </div>
                      <div>
                        <label for="formFile" class="form-label">Poster Image</label>
                        <input class="form-control" type="file" id="formFilep_${movieParts.id}" required>
                        <input type="hidden" name="poster_img" id="formNameFilep_${movieParts.id}">
                      </div>
                        <div class="d-flex align-items-center justify-content-between">
                          <button type="button" class="btn upload-pimage-btn border-0" data-pshow-id="${movieParts.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                          <div id="spinner_subp_${movieParts.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                    </div>
                      <!-- background image -->
                    <div class="mb-3">
                      <div style="display: none;">
                        <label for="formFile_${movieParts.id}" class="form-label">Background Image</label>
                        <h4>UPLOADED</h4>
                      </div>
                      <div>
                          <label for="formFile" class="form-label">Background Image</label>
                          <input class="form-control" type="file" id="formFilebg_${movieParts.id}" required>
                          <input type="hidden" name="bg_img" id="formNameFilebg_${movieParts.id}">
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                          <button type="button" class="btn upload-bgimage-btn border-0" data-bgshow-id="${movieParts.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                          <div id="spinner_subbg_${movieParts.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div class="row border mb-4">
                  <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${movieParts.id}" style="display: none;">
                    <div class="embed-responsive embed-responsive-16by9">
                      <div id="image_${movieParts.id}" class="uploaded-text">UPLOADED</div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${movieParts.id}">
                    <label class="file-label" for="movieFile_${movieParts.id}" id="fileLabel_${movieParts.id}">
                      <i class="fa-solid fa-file-video"></i> Choose Video
                    </label>
                    <input type="file" id="movieFile_${movieParts.id}" class="file-input" accept="video/*" />
                    <input type="hidden" class="border-0" id="movieId_${movieParts.id}" name="movieId" value="${movieParts.id}">
                    <!-- <input type="hidden" id="movieVal_${movieParts.id}" name="movieVal" class="custom-file-input"> -->
                    <input type="hidden" id="fileCode_${movieParts.id}" name="fileCode" class="custom-file-input">
                    <span id="file_name_${movieParts.id}" name="file_name_${movieParts.id}" class="file-name">No file chosen</span>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start d-flex justify-content-between align-items-center" style="word-wrap: break-word;">
                    <p class="text-break">${movieParts.title}</p>
                    <input type="hidden" class="border-0" id="movieName_${movieParts.id}" name="movieName" value="${movieParts.title}">
                    <input type="hidden" name="seasonNumber" value="null" />
                  </div>
                  <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                    <div id="spinner_${movieParts.id}" class="spinner-border" role="status" style="display: none;">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <button type="button" class="btn upload-button border-0" data-movieshow-id="${movieParts.id}">
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                    </button>
                    <!-- Subtitle Button -->
                    <button type="button" class="btn subtitle-button border-0" data-tvshow-id="${movieParts.id}">
                      <i class="fa-solid fa-closed-captioning"></i>
                    </button>
                  </div>
                  <!-- subtitle section -->
                  <div class="col-xxl mt-3" id="subtitle_block_${movieParts.id}" style="display: none;">
                    <div class= "row">
                      <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-sub-responsive_${movieParts.id}" style="display: none;">
                        <div class="embed-responsive embed-responsive-16by9">
                          <div id="image_sub_${movieParts.id}" class="uploaded-text">UPLOADED</div>
                        </div>
                      </div>
                      <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-sub-uploader_${movieParts.id}">
                        <label class="file-label" for="episode_Sub_File_${movieParts.id}" id="file_Sub_Label_${movieParts.id}">
                          <i class="fa-solid fa-file-video"></i> Choose Subtitle File
                        </label>
                        <input type="file" id="episode_Sub_File_${movieParts.id}" class="file-input" />
                        <input type="hidden" class="border-0" id="episode_Sub_Id_${movieParts.id}" value="${movieParts.id}">
                        <!-- <input type="hidden" id="episode_Sub_Val_${movieParts.id}" name="episode_Sub_Val" class="custom-file-input"> -->
                        <input type="hidden" id="file_Sub_Code_${movieParts.id}" name="file_Sub_Code" class="custom-file-input">
                        <span id="file_Sub_name_${movieParts.id}" name="file_Sub_name_${movieParts.id}" class="file-name">No file chosen</span>
                      </div>
                      <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                        <!-- <p class="text-break">${movieParts.title}</p> -->
                        <input type="hidden" class="border-0" id="episodeSubName_${movieParts.id}" value="${movieParts.name}">
                        <input type="hidden" value="null" />
                      </div>
                      <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                        <div id="spinner_sub_${movieParts.id}" class="spinner-border" role="status" style="display: none;">
                          <span class="sr-only">Loading...</span>
                        </div>
                        <button type="button" class="btn upload-sub-button border-0" data-tvshow-id="${movieParts.id}">
                          <i class="fa-solid fa-cloud-arrow-up"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
          }).join('');
          episodeList.innerHTML = resultsHTML;

          // globalThis.document.querySelectorAll('.upload-limage-btn').forEach(button => {
          //   button.addEventListener('click', function(e) {
          //     const movieShowId = this.getAttribute('data-lshow-id');
          //     // console.log(movieShowId);
          //     uploadLogoImage(movieShowId, this);
          //   });
          // });

          // globalThis.document.querySelectorAll('.upload-pimage-btn').forEach(button => {
          //   button.addEventListener('click', function(e) {
          //     const movieShowId = this.getAttribute('data-pshow-id');
          //     // console.log(movieShowId);
          //     uploadPosterImage(movieShowId, this);
          //   });
          // });

          // globalThis.document.querySelectorAll('.upload-bgimage-btn').forEach(button => {
          //   button.addEventListener('click', function(e) {
          //     const movieShowId = this.getAttribute('data-bgshow-id');
          //     // console.log(movieShowId);
          //     uploadBgImage(movieShowId, this);
          //   });
          // });
        }

        else if (movieData.hasOwnProperty('success') == false && movieData['belongs_to_collection'] === null) {
          episodeList.innerHTML = `
            <div>
              <div class="row mb-1" id="get_movies_detail">
                <div class="col-12 col-sm-12">
                    <!-- name -->
                  <div class="mb-3">
                    <label for="exampleFormControlName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="exampleFormControlName" name="title" placeholder="e.g., abcd" required>
                  </div>
                    <!-- description -->
                  <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                    <textarea class="form-control" name="description" id="exampleFormControlTextarea1" rows="3" required></textarea>
                  </div>
                    <!-- cast -->
                  <div class="mb-3">
                    <label for="exampleFormControlTextarea2" class="form-label">Cast</label>
                    <textarea class="form-control" name="cast" id="exampleFormControlTextarea2" rows="3" required></textarea>
                  </div>
                    <!-- creator -->
                  <div class="mb-3">
                    <label for="exampleFormControlCreator" class="form-label">Creator</label>
                    <input type="text" class="form-control" name="creator" id="exampleFormControlCreator" placeholder="e.g., xyz" required>
                  </div>
                    <!-- age -->
                  <div class="mb-3">
                    <label for="exampleFormControlAge" class="form-label">Age</label>
                      <input type="number" class="form-control" name="age"  id="exampleFormControlAge" placeholder="e.g., 12" min="12" max="50" required>
                  </div>
                    <!-- release date -->
                  <div class="mb-3">
                    <label for="exampleFormControlDate" class="form-label">Release Date</label>
                      <input type="date" class="form-control" id="exampleFormControlDate" name="release_date" required>
                  </div>
                    <!-- type -->
                  <div class="mb-3">
                    <label class="form-label">Type</label>
                    <select class="form-select" aria-label="Default select example" name="movie_type" required>
                      <option value="movie" selected>Movie</option>
                      <option value="collection">Collection</option>
                      <option value="series">Series</option>
                    </select>
                  </div>
                    <!-- genres -->
                  <div class="mb-3" id="genres_class"></div>
                    <!-- logo -->
                  <div class="mb-3">
                    <div style="display: none;">
                      <label for="formFile1" class="form-label">Logo Image</label>
                      <h4>UPLOADED</h4>
                    </div>
                    <div>
                      <label for="formFile" class="form-label">Logo Image</label>
                      <input class="form-control" type="file" id="formFilel_${movieData.id}" required>
                      <input type="hidden" name="logo" id="formNameFilel_${movieData.id}">
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                      <button type="button" class="btn upload-limage-btn border-0" data-lshow-id="${movieData.id}">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </button>
                      <div id="spinner_subl_${movieData.id}" class="spinner-border" role="status" style="display: none;">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                    <!-- poster image -->
                  <div class="mb-3">
                    <div style="display: none;">
                      <label for="formFile_${movieData.id}" class="form-label">Poster Image</label>
                      <h4>UPLOADED</h4>
                    </div>
                    <div>
                      <label for="formFile" class="form-label">Poster Image</label>
                      <input class="form-control" type="file" id="formFilep_${movieData.id}" required>
                      <input type="hidden" name="poster_img" id="formNameFilep_${movieData.id}">
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                      <button type="button" class="btn upload-pimage-btn border-0" data-pshow-id="${movieData.id}">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </button>
                      <div id="spinner_subp_${movieData.id}" class="spinner-border" role="status" style="display: none;">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                    <!-- background image -->
                  <div class="mb-3">
                    <div style="display: none;">
                      <label for="formFile_${movieData.id}" class="form-label">Background Image</label>
                      <h4>UPLOADED</h4>
                    </div>
                    <div>
                      <label for="formFile" class="form-label">Background Image</label>
                      <input class="form-control" type="file" id="formFilebg_${movieData.id}" required>
                      <input type="hidden" name="bg_img" id="formNameFilebg_${movieData.id}">
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                      <button type="button" class="btn upload-bgimage-btn border-0" data-bgshow-id="${movieData.id}">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </button>
                      <div id="spinner_subbg_${movieData.id}" class="spinner-border" role="status" style="display: none;">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row border mb-4">
                <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${movieData.id}" style="display: none;">
                  <div class="embed-responsive embed-responsive-16by9">
                    <div id="image_${movieData.id}" class="uploaded-text">UPLOADED</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${movieData.id}">
                  <label class="file-label" for="movieFile_${movieData.id}" id="fileLabel_${movieData.id}">
                    <i class="fa-solid fa-file-video"></i> Choose Video
                  </label>
                  <input type="file" id="movieFile_${movieData.id}" class="file-input" />
                  <input type="hidden" class="border-0" id="movieId_${movieData.id}" name="movieId" value="${movieData.id}">
                  <input type="hidden" id="fileCode_${movieData.id}" name="fileCode" class="custom-file-input">
                  <span id="file_name_${movieData.id}" name="file_name_${movieData.id}" class="file-name">No file chosen</span>
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start d-flex justify-content-between align-items-center" style="word-wrap: break-word;">
                  <p class="text-break">${movieData.title}</p>
                  <input type="hidden" class="border-0" id="movieName_${movieData.id}" name="movieName" value="${movieData.title}">
                  <input type="hidden" name="seasonNumber" value="null" />
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                  <div id="spinner_${movieData.id}" class="spinner-border" role="status" style="display: none;">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <button type="button" class="btn upload-button border-0" data-movieshow-id="${movieData.id}">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                  </button>
                  <!-- Subtitle Button -->
                  <button type="button" class="btn subtitle-button border-0" data-tvshow-id="${movieData.id}">
                    <i class="fa-solid fa-closed-captioning"></i>
                  </button>
                </div>
                <!-- subtitle section -->
                <div class="col-xxl mt-3" id="subtitle_block_${movieData.id}" style="display: none;">
                  <div class= "row">
                    <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-sub-responsive_${movieData.id}" style="display: none;">
                      <div class="embed-responsive embed-responsive-16by9">
                        <div id="image_sub_${movieData.id}" class="uploaded-text">UPLOADED</div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-sub-uploader_${movieData.id}">
                      <label class="file-label" for="episode_Sub_File_${movieData.id}" id="file_Sub_Label_${movieData.id}">
                        <i class="fa-solid fa-file-video"></i> Choose Subtitle File
                      </label>
                      <input type="file" id="episode_Sub_File_${movieData.id}" class="file-input" />
                      <input type="hidden" class="border-0" id="episode_Sub_Id_${movieData.id}" value="${movieData.id}">
                      <input type="hidden" id="file_Sub_Code_${movieData.id}" name="file_Sub_Code" class="custom-file-input">
                      <span id="file_Sub_name_${movieData.id}" name="file_Sub_name_${movieData.id}" class="file-name">No file chosen</span>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                      <!-- <p class="text-break">${movieData.title}</p> -->
                      <input type="hidden" class="border-0" id="episodeSubName_${movieData.id}" value="${movieData.name}">
                      <input type="hidden" value="null" />
                    </div>
                    <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                      <div id="spinner_sub_${movieData.id}" class="spinner-border" role="status" style="display: none;">
                        <span class="sr-only">Loading...</span>
                      </div>
                      <button type="button" class="btn upload-sub-button border-0" data-tvshow-id="${movieData.id}">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;

          // globalThis.document.getElementById("upload-image-btn1").addEventListener('click', (e) => {
          //   // console.log(e.target.parentElement.previousElementSibling);
          //   // console.log(globalThis.document.getElementById("formFile1").value);
          //   const formFile1 = globalThis.document.getElementById("formFile1");
          //   // console.log(formFile1, typeof formFile1.value, formFile1.value === '');

          //   // console.log(formFile1.files[0]);
          //   const file = formFile1.files[0];

          //   if (formFile1.files.length === 0) {
          //     alert('Please select a image to upload.');
          //     e.target.disabled = false;
          //     return;
          //   }

          //   else if (file) {
          //     // console.log(file.name);
          //     function isVideoExtension(extension) {
          //       const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
          //       return videoExtensions.includes(extension.toLowerCase());
          //     }
          //     const extension = file.name.match(/\.([^\.]+)$/);

          //     if (extension) {
          //       const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
          //       const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
          //       // console.log(isVideo);
          //       if (!isVideo) {
          //         alert('Please select a image to upload.');
          //         e.target.disabled = false;
          //         // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
          //         formFile1.value = "";
          //         return;
          //       }
          //     } else {
          //       console.log("No extension found");
          //     }
          //   }

          //   const spinner = document.getElementById("spinner_sub_1");
          //   spinner.style.display = 'block';

          //   const formdata = new FormData();
          //   formdata.append("fileToUpload", file);

          //   const requestOptions = {
          //     method: "POST",
          //     body: formdata,
          //     redirect: "follow"
          //   };

          //   fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
          //     .then((response) => response.json())
          //     .then((result) => {
          //       // console.log(result);
          //       if (result.isSuccess == true) {
          //         spinner.style.display = 'none';
          //         e.target.parentElement.style.display = 'none';
          //         globalThis.document.getElementById('formNameFile1').value = result.image;
          //         e.target.parentElement.parentElement.previousElementSibling.style.display = 'none';
          //         e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
          //         // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
          //         e.target.parentElement.parentElement.parentElement.style.marginBottom = '50px';

          //         langSelect.addEventListener("change", function () {
          //           const selectedValue = langSelect.value;

          //           // console.log('upload', selectedValue);

          //           if (selectedValue === '') {
          //             alert("Please select a language.");
          //             submitButton.style.display = 'none';                          
          //             return;
          //           }

          //           else {
          //             submitButton.style.display = 'block';
          //           }
          //         });
          //       }
          //       else {
          //         alert('Failed to upload.');
          //         e.target.disabled = false;
          //         file.value = '';
          //         spinner.style.display = 'none';
          //         return;
          //       }
          //     })
          //     .catch((error) => console.error(error));
          // })

          // globalThis.document.getElementById("upload-image-btn2").addEventListener('click', (e) => {
          //   // console.log(e.target.parentElement.previousElementSibling);
          //   // console.log(globalThis.document.getElementById("formFile1").value);
          //   const formFile1 = globalThis.document.getElementById("formFile2");
          //   // console.log(formFile1, typeof formFile1.value, formFile1.value === '');

          //   // console.log(formFile1.files[0]);
          //   const file = formFile1.files[0];

          //   if (formFile1.files.length === 0) {
          //     alert('Please select a image to upload.');
          //     e.target.disabled = false;
          //     return;
          //   }

          //   else if (file) {
          //     // console.log(file.name);
          //     function isVideoExtension(extension) {
          //       const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
          //       return videoExtensions.includes(extension.toLowerCase());
          //     }
          //     const extension = file.name.match(/\.([^\.]+)$/);

          //     if (extension) {
          //       const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
          //       const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
          //       // console.log(isVideo);
          //       if (!isVideo) {
          //         alert('Please select a image to upload.');
          //         e.target.disabled = false;
          //         // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
          //         formFile1.value = "";
          //         return;
          //       }
          //     } else {
          //       console.log("No extension found");
          //     }
          //   }

          //   const spinner = document.getElementById("spinner_sub_2");
          //   spinner.style.display = 'block';

          //   const formdata = new FormData();
          //   formdata.append("fileToUpload", file);

          //   const requestOptions = {
          //     method: "POST",
          //     body: formdata,
          //     redirect: "follow"
          //   };

          //   fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
          //     .then((response) => response.json())
          //     .then((result) => {
          //       // console.log(result);
          //       if (result.isSuccess == true) {
          //         spinner.style.display = 'none';
          //         e.target.parentElement.style.display = 'none';
          //         globalThis.document.getElementById('formNameFile2').value = result.image;
          //         e.target.parentElement.parentElement.previousElementSibling.style.display = 'none';
          //         e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
          //         // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
          //         e.target.parentElement.parentElement.parentElement.style.marginBottom = '50px';

          //         langSelect.addEventListener("change", function () {
          //           const selectedValue = langSelect.value;

          //           // console.log('upload', selectedValue);

          //           if (selectedValue === '') {
          //             alert("Please select a language.");
          //             submitButton.style.display = 'none';                          
          //             return;
          //           }

          //           else {
          //             submitButton.style.display = 'block';
          //           }
          //         });
          //       }
          //       else {
          //         alert('Failed to upload.');
          //         e.target.disabled = false;
          //         file.value = '';
          //         return;
          //       }
          //     })
          //     .catch((error) => console.error(error));
          // })

          // globalThis.document.getElementById("upload-image-btn3").addEventListener('click', (e) => {
          //   // console.log(e.target.parentElement.previousElementSibling);
          //   // console.log(globalThis.document.getElementById("formFile1").value);
          //   const formFile1 = globalThis.document.getElementById("formFile3");
          //   // console.log(formFile1, typeof formFile1.value, formFile1.value === '');

          //   // console.log(formFile1.files[0]);
          //   const file = formFile1.files[0];

          //   if (formFile1.files.length === 0) {
          //     alert('Please select a image to upload.');
          //     e.target.disabled = false;
          //     return;
          //   }

          //   else if (file) {
          //     // console.log(file.name);
          //     function isVideoExtension(extension) {
          //       const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
          //       return videoExtensions.includes(extension.toLowerCase());
          //     }
          //     const extension = file.name.match(/\.([^\.]+)$/);

          //     if (extension) {
          //       const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
          //       const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
          //       // console.log(isVideo);
          //       if (!isVideo) {
          //         alert('Please select a image to upload.');
          //         e.target.disabled = false;
          //         // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
          //         formFile1.value = "";
          //         return;
          //       }
          //     } else {
          //       console.log("No extension found");
          //     }
          //   }

          //   const spinner = document.getElementById("spinner_sub_3");
          //   spinner.style.display = 'block';

          //   const formdata = new FormData();
          //   formdata.append("fileToUpload", file);

          //   const requestOptions = {
          //     method: "POST",
          //     body: formdata,
          //     redirect: "follow"
          //   };

          //   fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
          //     .then((response) => response.json())
          //     .then((result) => {
          //       // console.log(result);
          //       if (result.isSuccess == true) {
          //         spinner.style.display = 'none';
          //         e.target.parentElement.style.display = 'none';
          //         globalThis.document.getElementById('formNameFile3').value = result.image;
          //         e.target.parentElement.parentElement.previousElementSibling.style.display = 'none';
          //         e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
          //         // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
          //         e.target.parentElement.parentElement.parentElement.style.marginBottom = '50px';

          //         langSelect.addEventListener("change", function () {
          //           const selectedValue = langSelect.value;

          //           // console.log('upload', selectedValue);

          //           if (selectedValue === '') {
          //             alert("Please select a language.");
          //             submitButton.style.display = 'none';                          
          //             return;
          //           }

          //           else {
          //             submitButton.style.display = 'block';
          //           }
          //         });
          //       }
          //       else {
          //         alert('Failed to upload.');
          //         e.target.disabled = false;
          //         file.value = '';
          //         return;
          //       }
          //     })
          //     .catch((error) => console.error(error));
          // })
        }

        else {
          alert("Movie not found...Please choose another option...")
          searchInput.value = '';
          globalThis.location.reload();
        }

        searchTypeContainer.style.display = 'none';
        searchMovieContainer.style.display = 'none';
        movieButton.style.display = 'none';
        searchSeasons.innerHTML = '';

        const genreDiv = document.getElementById('genres_class');

        if (genres && genres.length >= 1) {
          const genreLabel = document.createElement('label'); // Create a label element
          genreLabel.className = 'form-label'; // Add the class attribute
          genreLabel.textContent = 'Genre';

          const genreSelect = document.createElement('select'); // Create a select element
          genreSelect.className = 'form-select'; // Add the class attribute
          genreSelect.multiple = true; // Add the multiple attribute
          genreSelect.setAttribute('aria-label', 'Multiple select example'); // Add the aria-label attribute
          genreSelect.name = 'genre'; // Add the name attribute
          genreSelect.required = true;

          genres.forEach(genre => {
            const genreOption = document.createElement('option'); // Create an option element
            genreOption.textContent = genre.genre_name;
            genreOption.value = genre.id;
            genreSelect.appendChild(genreOption); // Append the option to the select element
          });

          genreDiv.appendChild(genreLabel);
          genreDiv.appendChild(genreSelect);
        }

        // Attach event listener to all buttons with the class "upload-button"
        globalThis.document.querySelectorAll('.upload-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-movieshow-id');
            // console.log(movieShowId);
            uploadVideo(movieShowId, this);
          });
        });

        globalThis.document.querySelectorAll('.subtitle-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const tvShowId = this.getAttribute('data-tvshow-id');
            const subBlock = globalThis.document.getElementById(`subtitle_block_${tvShowId}`);

            // console.log(tvShowId, subBlock);

            // Toggle the display of the subtitle file input
            if (subBlock.style.display === "none" || subBlock.style.display === "") {
              subBlock.style.display = "block";
            } else {
              subBlock.style.display = "none";
            }
          });
        });

        globalThis.document.querySelectorAll('.upload-sub-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const tvShowId = this.getAttribute('data-tvshow-id');
            // console.log(tvShowId, e.target);
            uploadSubVideo(tvShowId, this);
          });
        });

        globalThis.document.querySelectorAll('.upload-limage-btn').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-lshow-id');
            // console.log(movieShowId);
            uploadLogoImage(movieShowId, this);
          });
        });

        globalThis.document.querySelectorAll('.upload-pimage-btn').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-pshow-id');
            // console.log(movieShowId);
            uploadPosterImage(movieShowId, this);
          });
        });

        globalThis.document.querySelectorAll('.upload-bgimage-btn').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-bgshow-id');
            // console.log(movieShowId);
            uploadBgImage(movieShowId, this);
          });
        });

        // Add the click event listener to the document and delegate it to file-input elements
        document.addEventListener("change", function (event) {
          if (event.target.matches(".file-input")) {
            const fileInput = event.target;
            const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span

            // console.log(fileInput, fileNameDisplay);

            const file = fileInput.files[0];
            // console.log(file);
            if (file) {
              fileNameDisplay.textContent = file.name;
            } else {
              fileNameDisplay.textContent = "No file chosen";
            }
          }
        });

        function uploadVideo(movieShowId, btn) {
          submitButton.style.display = 'none';
          btn.disabled = true;

          // console.log(movieShowId);

          const videoIframe = document.querySelector(`#embed-responsive_${movieShowId}`);
          const fileInput = document.querySelector(`#movieFile_${movieShowId}`);
          const videoUploader = document.querySelector(`#video-uploader_${movieShowId}`);

          // console.log(videoIframe);

          videoIframe.style.display = "none"; 

          const file = fileInput.files[0];
          // console.log(file);             

          if (fileInput.files.length === 0) {
            alert('Please select a video to upload.');
            btn.disabled = false;
            return;
          }

          else if (file) {
            // console.log(file.name);
            function isVideoExtension(extension) {
              const videoExtensions = [".mp4", ".avi", ".wmv", ".mov", ".mkv", ".flv", ".webm", ".3gp", ".ogv", ".mpeg", ".mpg", ".divx", ".vob"];
              return videoExtensions.includes(extension.toLowerCase());
            }
            const extension = file.name.match(/\.([^\.]+)$/);

            if (extension) {
              const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
              const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
              // console.log(isVideo);
              if (!isVideo) {
                alert('Please select a video to upload.');
                btn.disabled = false;
                const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                fileNameDisplay.textContent = "No file chosen";
                return;
              }
            } else {
              console.log("No extension found");
            }
          }

          const fCode = document.getElementById(`fileCode_${movieShowId}`);

          const spinner = document.getElementById(`spinner_${movieShowId}`);
          spinner.style.display = 'block';

          const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

          const baseUri = 'https://oneupload.to/';

          const formdata = new FormData();
          formdata.append("key", "617ujm5brrei3rqdhdm");
          formdata.append("file", file);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          fetch(`${proxyUrl}https://s1.oneupload.to/upload/04`, requestOptions)
            .then(response => response.json())
            .then(async (result) => {
              // console.log(result);

              let status = await result.status;
              // console.log(status);

              if(status == '200') {
                const filecode = await result.files[0].filecode;
                // console.log(filecode);

                fCode.value = filecode;

                spinner.style.display = 'none';
                const requestOptions1 = {
                  method: 'GET',
                  redirect: 'follow'
                };

                fetch(`${proxyUrl}${baseUri}api/file/direct_link?key=617ujm5brrei3rqdhdm&file_code=${filecode}`, requestOptions1)
                  .then(response => response.json())
                  .then(async (result) => {
                    // console.log(result);

                    status = await result.status;
                    // console.log(status);

                    if(status == '200') {
                      // const url = await result.result.versions[0].url;
                      // console.log(url);

                      if(filecode) {
                        videoUploader.style.display = 'none';
                        videoIframe.style.display = "block";
                        // Get a reference to the <iframe> element inside the <div>

                        spinner.style.display = 'none';

                        // console.log(lang);

                        langSelect.addEventListener("change", function () {
                          const selectedValue = langSelect.value;

                          // console.log('upload', selectedValue);

                          if (selectedValue === '') {
                            alert("Please select a language.");
                            submitButton.style.display = 'none';                          
                            return;
                          }

                          else {
                            submitButton.style.display = 'block';
                          }
                        });

                        // console.log(btn);
                        // btn.disabled = true;
                      }

                      else {
                        alert(`Unable to upload ${file.name}.`);
                        const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                        fileNameDisplay.textContent = "No file chosen";
                        submitButton.style.display = 'none';
                        spinner.style.display = 'none';
                        btn.disabled = false;
                      }
                    }

                    else {
                      alert(`Unable to upload ${file.name}.`);
                      const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                      fileNameDisplay.textContent = "No file chosen";
                      btn.disabled = false;
                      return;                 
                    }
                  })
                  .catch(error => {
                    // console.log('error', error);
                    btn.disabled = false;
                    spinner.style.display = 'none';
                  });
              }

              else {
                alert(`Unable to upload ${file.name}.`);
                const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                fileNameDisplay.textContent = "No file chosen";
                btn.disabled = false;
                return;                 
              }
            })
            .catch(error => {
              // console.log('error', error);
              btn.disabled = false;
              spinner.style.display = 'none';
            });
        }

        function uploadSubVideo(tvShowId, btn) {
          // console.log("hii sub1");
          submitButton.style.display = 'none';
          btn.disabled = true;

          // console.log(tvShowId);

          const videoIframe = document.querySelector(`#embed-sub-responsive_${tvShowId}`);
          const fileInput = document.querySelector(`#episode_Sub_File_${tvShowId}`);
          const videoUploader = document.querySelector(`#video-sub-uploader_${tvShowId}`);

          // console.log(videoIframe, fileInput, videoUploader);

          videoIframe.style.display = "none"; 
          const file = fileInput.files[0];
          // console.log(file);             

          if (fileInput.files.length === 0) {
            alert('Please select a file to upload.');
            btn.disabled = false;
            return;
          }

          else if (file) {
            // console.log(file.name);
            function isSubtitleExtension(extension) {
              const subtitleExtensions = [".srt", ".sub", ".vtt"];
              return subtitleExtensions.includes(extension.toLowerCase());
            }
            const extension = file.name.match(/\.([^\.]+)$/);

            if (extension) {
              const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
              const isSubtitle = isSubtitleExtension("." + extractedExtension); // Add dot prefix
              // console.log(isVideo);
              if (!isSubtitle) {
                alert('Please select a file to upload.');
                btn.disabled = false;
                const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                // console.log(fileNameDisplay);
                fileNameDisplay.textContent = "No file chosen";
                return;
              }
            } else {
              console.log("No extension found");
            }
          }

          const fCode = document.getElementById(`file_Sub_Code_${tvShowId}`);

          const spinner = document.getElementById(`spinner_sub_${tvShowId}`);
          spinner.style.display = 'block';

          // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

          // const baseUri = 'https://oneupload.to/';

          const formdata = new FormData();
          // formdata.append("key", "617ujm5brrei3rqdhdm");
          // formdata.append("file", file);
          formdata.append("subtitle", file);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          fetch("https://feflix.tech/feflix_api/upload_subtitle.php",requestOptions)
            .then(response => response.json())
            .then(async (result) => {
              // console.log(result);

              let status = result.isSuccess;
              // console.log(status);

              if(status == true) {
                const filecode = result.subFile;
                // console.log(filecode);

                fCode.value = filecode;

                spinner.style.display = 'none';

                if(filecode) {
                  videoUploader.style.display = 'none';
                  videoIframe.style.display = "block";
                  // Get a reference to the <iframe> element inside the <div>

                  spinner.style.display = 'none';
                  langSelect.addEventListener("change", function () {
                    const selectedValue = langSelect.value;

                    // console.log('upload', selectedValue);

                    if (selectedValue === '') {
                      alert("Please select a language.");
                      submitButton.style.display = 'none';                          
                      return;
                    }

                    else {
                      submitButton.style.display = 'block';
                    }
                  });                          

                  // console.log(btn);
                  btn.disabled = true;
                }

                else {
                  alert(`Unable to upload 4 ${file.name}.`);
                  const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                  fileNameDisplay.textContent = "No file chosen";
                  submitButton.style.display = 'none';
                  spinner.style.display = 'none';
                  btn.disabled = false;
                  return;
                }
              }

              else {
                alert(`Unable to upload ${file.name}.`);
                const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                fileNameDisplay.textContent = "No file chosen";
                submitButton.style.display = 'none';
                btn.disabled = false;
                return;                 
              }
            })
            .catch(error => {
              // console.log('error', error);
              btn.disabled = false;
              spinner.style.display = 'none';
            });
        }

        function uploadLogoImage(id, btn) {
          // console.log("logo....");
          submitButton.style.display = 'none';
          btn.disabled = true;

          const formFile1 = globalThis.document.getElementById(`formFilel_${id}`);

          const file = formFile1.files[0];

          if (formFile1.files.length === 0) {
            alert('Please select a image to upload.');
            btn.disabled = false;
            return;
          }

          else if (file) {
            // console.log(file.name);
            function isVideoExtension(extension) {
              const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
              return videoExtensions.includes(extension.toLowerCase());
            }
            const extension = file.name.match(/\.([^\.]+)$/);

            if (extension) {
              const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
              const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
              // console.log(isVideo);
              if (!isVideo) {
                alert('Please select a image to upload.');
                btn.disabled = false;
                // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                formFile1.value = "";
                return;
              }
            } else {
              console.log("No extension found");
            }
          }

          // btn.parentElement.previousElementSibling.style.display = 'none';
          // btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
          // btn.parentElement.parentElement.style.marginBottom = '50px';

          // console.log(file.name);
          // globalThis.document.getElementById(`formNameFilel_${id}`).value = `logo_${id}`;

          const spinner = document.getElementById(`spinner_subl_${id}`);
          spinner.style.display = 'block';

          const formdata = new FormData();
          formdata.append("fileToUpload", file);

          const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
          };

          fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              // console.log(result);
              if (result.isSuccess == true) {
                spinner.style.display = 'none';
                btn.parentElement.style.display = 'none';
                globalThis.document.getElementById(`formNameFilel_${id}`).value = result.image;
                btn.parentElement.previousElementSibling.style.display = 'none';
                btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                btn.parentElement.parentElement.style.marginBottom = '50px';
                // btn.parentElement.parentElement.previousElementSibling.style.display = 'none';
                // btn.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                // // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
                // btn.parentElement.parentElement.parentElement.style.marginBottom = '50px';

                langSelect.addEventListener("change", function () {
                  const selectedValue = langSelect.value;

                  // console.log('upload', selectedValue);

                  if (selectedValue === '') {
                    alert("Please select a language.");
                    submitButton.style.display = 'none';                          
                    return;
                  }

                  else {
                    submitButton.style.display = 'block';
                  }
                });
              }
              else {
                alert('Failed to upload.');
                btn.disabled = false;
                file.value = '';
                spinner.style.display = 'none';
                return;
              }
            })
            .catch((error) => console.error(error));
        }

        function uploadPosterImage(id, btn) {
          // console.log("poster....");
          submitButton.style.display = 'none';
          btn.disabled = true;

          const formFile1 = globalThis.document.getElementById(`formFilep_${id}`);

          const file = formFile1.files[0];

          if (formFile1.files.length === 0) {
            alert('Please select a image to upload.');
            btn.disabled = false;
            return;
          }

          else if (file) {
            // console.log(file.name);
            function isVideoExtension(extension) {
              const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
              return videoExtensions.includes(extension.toLowerCase());
            }
            const extension = file.name.match(/\.([^\.]+)$/);

            if (extension) {
              const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
              const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
              // console.log(isVideo);
              if (!isVideo) {
                alert('Please select a image to upload.');
                btn.disabled = false;
                // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                formFile1.value = "";
                return;
              }
            } else {
              console.log("No extension found");
            }
          }

          // btn.parentElement.previousElementSibling.style.display = 'none';
          // btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
          // btn.parentElement.parentElement.style.marginBottom = '50px';

          // console.log(file.name);
          // globalThis.document.getElementById(`formNameFilel_${id}`).value = `logo_${id}`;

          const spinner = document.getElementById(`spinner_subp_${id}`);
          spinner.style.display = 'block';

          const formdata = new FormData();
          formdata.append("fileToUpload", file);

          const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
          };

          fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              // console.log(result);
              if (result.isSuccess == true) {
                spinner.style.display = 'none';
                btn.parentElement.style.display = 'none';
                globalThis.document.getElementById(`formNameFilep_${id}`).value = result.image;
                btn.parentElement.previousElementSibling.style.display = 'none';
                btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                btn.parentElement.parentElement.style.marginBottom = '50px';
                // btn.parentElement.parentElement.previousElementSibling.style.display = 'none';
                // btn.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                // // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
                // btn.parentElement.parentElement.parentElement.style.marginBottom = '50px';

                langSelect.addEventListener("change", function () {
                  const selectedValue = langSelect.value;

                  // console.log('upload', selectedValue);

                  if (selectedValue === '') {
                    alert("Please select a language.");
                    submitButton.style.display = 'none';                          
                    return;
                  }

                  else {
                    submitButton.style.display = 'block';
                  }
                });
              }
              else {
                alert('Failed to upload.');
                btn.disabled = false;
                file.value = '';
                spinner.style.display = 'none';
                return;
              }
            })
            .catch((error) => console.error(error));
        }

        function uploadBgImage(id, btn) {
          // console.log("bg....");
          submitButton.style.display = 'none';
          btn.disabled = true;

          const formFile1 = globalThis.document.getElementById(`formFilebg_${id}`);

          const file = formFile1.files[0];

          if (formFile1.files.length === 0) {
            alert('Please select a image to upload.');
            btn.disabled = false;
            return;
          }

          else if (file) {
            // console.log(file.name);
            function isVideoExtension(extension) {
              const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
              return videoExtensions.includes(extension.toLowerCase());
            }
            const extension = file.name.match(/\.([^\.]+)$/);

            if (extension) {
              const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
              const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
              // console.log(isVideo);
              if (!isVideo) {
                alert('Please select a image to upload.');
                btn.disabled = false;
                // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                formFile1.value = "";
                return;
              }
            } else {
              console.log("No extension found");
            }
          }

          // console.log(file.name, btn.parentElement);
          // globalThis.document.getElementById(`formNameFilebg_${id}`).value = `bg_${id}`;

          const spinner = document.getElementById(`spinner_subbg_${id}`);
          spinner.style.display = 'block';

          const formdata = new FormData();
          formdata.append("fileToUpload", file);

          const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
          };

          fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              // console.log(result);
              if (result.isSuccess == true) {
                spinner.style.display = 'none';
                btn.parentElement.style.display = 'none';
                globalThis.document.getElementById(`formNameFilebg_${id}`).value = result.image;
                btn.parentElement.previousElementSibling.style.display = 'none';
                btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                btn.parentElement.parentElement.style.marginBottom = '50px';
                // btn.parentElement.parentElement.previousElementSibling.style.display = 'none';
                // btn.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
                // btn.parentElement.parentElement.parentElement.style.marginBottom = '50px';

                langSelect.addEventListener("change", function () {
                  const selectedValue = langSelect.value;

                  // console.log('upload', selectedValue);

                  if (selectedValue === '') {
                    alert("Please select a language.");
                    submitButton.style.display = 'none';                          
                    return;
                  }

                  else {
                    submitButton.style.display = 'block';
                  }
                });
              }
              else {
                alert('Failed to upload.');
                btn.disabled = false;
                file.value = '';
                spinner.style.display = 'none';
                return;
              }
            })
            .catch((error) => console.error(error));
        }

      });

      searchResults.addEventListener('click', async (event) => {
        if (event.target.tagName === 'LI' && event.target.dataset.season) {
          submitButton.style.display = 'none';
          const selectedSeason = event.target.dataset.season;
          const selectedTVId = event.target.dataset.id;

          // console.log('Fetching Episodes for Season:', selectedSeason);
          // console.log('TV Show ID:', selectedTVId);

          const seasonData = await fetchSeasonData(selectedTVId, selectedSeason);

          // console.log('Season Data:', seasonData);

          if (seasonData && seasonData.length >= 1) {
            const resultsHTML = seasonData.map((tvShow) => {
              return `
                <div>
                  <div class="row mb-1" id="get_movies_detail">
                    <div class="col-12 col-sm-12">
                        <!-- name -->
                      <div class="mb-3">
                        <label for="exampleFormControlName_${tvShow.id}" class="form-label">Name</label>
                        <input type="text" class="form-control" id="exampleFormControlName_${tvShow.id}" name="title" placeholder="e.g., abcd" required>
                      </div>
                        <!-- description -->
                      <div class="mb-3">
                        <label for="exampleFormControlTextarea1_${tvShow.id}" class="form-label">Description</label>
                        <textarea class="form-control" name="description" id="exampleFormControlTextarea1_${tvShow.id}" rows="3" required></textarea>
                      </div>
                        <!-- cast -->
                      <div class="mb-3">
                        <label for="exampleFormControlTextarea2_${tvShow.id}" class="form-label">Cast</label>
                        <textarea class="form-control" name="cast" id="exampleFormControlTextarea2_${tvShow.id}" rows="3" required></textarea>
                      </div>
                        <!-- creator -->
                      <div class="mb-3">
                        <label for="exampleFormControlCreator_${tvShow.id}" class="form-label">Creator</label>
                        <input type="text" class="form-control" name="creator" id="exampleFormControlCreator_${tvShow.id}" placeholder="e.g., xyz" required>
                      </div>
                        <!-- age -->
                      <div class="mb-3">
                        <label for="exampleFormControlAge_${tvShow.id}" class="form-label">Age</label>
                          <input type="number" class="form-control" name="age"  id="exampleFormControlAge_${tvShow.id}" placeholder="e.g., 12" min="12" max="50" required>
                      </div>
                        <!-- release date -->
                      <div class="mb-3">
                        <label for="exampleFormControlDate_${tvShow.id}" class="form-label">Release Date</label>
                          <input type="date" class="form-control" id="exampleFormControlDate_${tvShow.id}" name="release_date" required>
                      </div>
                        <!-- type -->
                      <div class="mb-3">
                        <label class="form-label">Type</label>
                        <select class="form-select" aria-label="Default select example" name="movie_type" required>
                          <option value="movie" selected>Movie</option>
                          <option value="collection">Collection</option>
                          <option value="series">Series</option>
                        </select>
                      </div>
                        <!-- genres -->
                      <div class="mb-3" id="genres_class"></div>
                        <!-- logo -->
                      <div class="mb-3">
                        <div style="display: none;">
                          <label for="formFile" class="form-label">Logo Image</label>
                          <h4>UPLOADED</h4>
                        </div>
                        <div>
                            <label for="formFile" class="form-label">Logo Image</label>
                            <input class="form-control" type="file" id="formFilel_${tvShow.id}" required>
                            <input type="hidden" name="logo" id="formNameFilel_${tvShow.id}">
                          </div>
                          <div class="d-flex align-items-center justify-content-between">
                            <button type="button" class="btn upload-limage-btn border-0" data-lshow-id="${tvShow.id}">
                              <i class="fa-solid fa-cloud-arrow-up"></i>
                            </button>
                            <div id="spinner_subl_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                      </div>
                        <!-- poster image -->
                      <div class="mb-3">
                        <div style="display: none;">
                          <label for="formFile_${tvShow.id}" class="form-label">Poster Image</label>
                          <h4>UPLOADED</h4>
                        </div>
                        <div>
                          <label for="formFile" class="form-label">Poster Image</label>
                          <input class="form-control" type="file" id="formFilep_${tvShow.id}" required>
                          <input type="hidden" name="poster_img" id="formNameFilep_${tvShow.id}">
                        </div>
                          <div class="d-flex align-items-center justify-content-between">
                            <button type="button" class="btn upload-pimage-btn border-0" data-pshow-id="${tvShow.id}">
                              <i class="fa-solid fa-cloud-arrow-up"></i>
                            </button>
                            <div id="spinner_subp_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                      </div>
                        <!-- background image -->
                      <div class="mb-3">
                        <div style="display: none;">
                          <label for="formFile_${tvShow.id}" class="form-label">Background Image</label>
                          <h4>UPLOADED</h4>
                        </div>
                        <div>
                            <label for="formFile" class="form-label">Background Image</label>
                            <input class="form-control" type="file" id="formFilebg_${tvShow.id}" required>
                            <input type="hidden" name="bg_img" id="formNameFilebg_${tvShow.id}">
                          </div>
                          <div class="d-flex align-items-center justify-content-between">
                            <button type="button" class="btn upload-bgimage-btn border-0" data-bgshow-id="${tvShow.id}">
                              <i class="fa-solid fa-cloud-arrow-up"></i>
                            </button>
                            <div id="spinner_subbg_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div class="row border mb-4">
                    <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${tvShow.id}" style="display: none;">
                      <div class="embed-responsive embed-responsive-16by9">
                        <div id="image_${tvShow.id}" class="uploaded-text">UPLOADED</div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${tvShow.id}">
                      <label class="file-label" for="episodeFile_${tvShow.id}" id="fileLabel_${tvShow.id}">
                        <i class="fa-solid fa-file-video"></i> Choose Video
                      </label>
                      <input type="file" id="episodeFile_${tvShow.id}" class="file-input" />
                      <input type="hidden" class="border-0" id="episodeId_${tvShow.id}" name="episodeId" value="${tvShow.id}">
                      <input type="hidden" id="fileCode_${tvShow.id}" name="fileCode" class="custom-file-input">
                      <span id="file_name_${tvShow.id}" name="file_name_${tvShow.id}" class="file-name">No file chosen</span>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                      <p class="text-break">${tvShow.name}</p>
                      <input type="hidden" class="border-0" id="episodeName_${tvShow.id}" value="${tvShow.name}">
                      <input type="hidden" name="seasonNumber" value="${selectedSeason}" />
                    </div>
                    <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                      <div id="spinner_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                        <span class="sr-only">Loading...</span>
                      </div>
                      <button type="button" class="btn upload-button border-0" data-movieshow-id="${tvShow.id}">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                      </button>
                      <!-- Subtitle Button -->
                      <button type="button" class="btn subtitle-button border-0" data-tvshow-id="${tvShow.id}">
                        <i class="fa-solid fa-closed-captioning"></i>
                      </button>
                    </div>
                    <!-- subtitle section -->
                    <div class="col-xxl mt-3" id="subtitle_block_${tvShow.id}" style="display: none;">
                      <div class= "row">
                        <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-sub-responsive_${tvShow.id}" style="display: none;">
                          <div class="embed-responsive embed-responsive-16by9">
                            <div id="image_sub_${tvShow.id}" class="uploaded-text">UPLOADED</div>
                          </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-sub-uploader_${tvShow.id}">
                          <label class="file-label" for="episode_Sub_File_${tvShow.id}" id="file_Sub_Label_${tvShow.id}">
                            <i class="fa-solid fa-file-video"></i> Choose Subtitle File
                          </label>
                          <input type="file" id="episode_Sub_File_${tvShow.id}" class="file-input" />
                          <input type="hidden" class="border-0" id="episode_Sub_Id_${tvShow.id}" value="${tvShow.id}">
                          <input type="hidden" id="file_Sub_Code_${tvShow.id}" name="file_Sub_Code" class="custom-file-input">
                          <span id="file_Sub_name_${tvShow.id}" name="file_Sub_name_${tvShow.id}" class="file-name">No file chosen</span>
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                          <!-- <p class="text-break">${tvShow.name}</p> -->
                          <input type="hidden" class="border-0" id="episodeSubName_${tvShow.id}" value="${tvShow.name}">
                          <input type="hidden" value="${selectedSeason}" />
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                          <div id="spinner_sub_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                          <button type="button" class="btn upload-sub-button border-0" data-tvshow-id="${tvShow.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`
            }).join('');
            episodeList.innerHTML = resultsHTML;

            const genreDiv = document.getElementById('genres_class');

            if (genres && genres.length >= 1) {
              const genreLabel = document.createElement('label'); // Create a label element
              genreLabel.className = 'form-label'; // Add the class attribute
              genreLabel.textContent = 'Genre';

              const genreSelect = document.createElement('select'); // Create a select element
              genreSelect.className = 'form-select'; // Add the class attribute
              genreSelect.multiple = true; // Add the multiple attribute
              genreSelect.setAttribute('aria-label', 'Multiple select example'); // Add the aria-label attribute
              genreSelect.name = 'genre'; // Add the name attribute
              genreSelect.required = true;

              genres.forEach(genre => {
                const genreOption = document.createElement('option'); // Create an option element
                genreOption.textContent = genre.genre_name;
                genreOption.value = genre.id;
                genreSelect.appendChild(genreOption); // Append the option to the select element
              });

              genreDiv.appendChild(genreLabel);
              genreDiv.appendChild(genreSelect);
            }

            globalThis.document.querySelectorAll('.upload-limage-btn').forEach(button => {
              button.addEventListener('click', function(e) {
                const movieShowId = this.getAttribute('data-lshow-id');
                // console.log(movieShowId);
                uploadLogoImage(movieShowId, this);
              });
            });

            globalThis.document.querySelectorAll('.upload-pimage-btn').forEach(button => {
              button.addEventListener('click', function(e) {
                const movieShowId = this.getAttribute('data-pshow-id');
                // console.log(movieShowId);
                uploadPosterImage(movieShowId, this);
              });
            });

            globalThis.document.querySelectorAll('.upload-bgimage-btn').forEach(button => {
              button.addEventListener('click', function(e) {
                const movieShowId = this.getAttribute('data-bgshow-id');
                // console.log(movieShowId);
                uploadBgImage(movieShowId, this);
              });
            });

            // Attach event listener to all buttons with the class "upload-button"
            globalThis.document.querySelectorAll('.upload-button').forEach(button => {
              button.addEventListener('click', function(e) {
                const tvShowId = this.getAttribute('data-movieshow-id');
                // console.log(tvShowId, e.target);
                uploadVideo(tvShowId, this);
              });
            });

            globalThis.document.querySelectorAll('.subtitle-button').forEach(button => {
              button.addEventListener('click', function(e) {
                const tvShowId = this.getAttribute('data-tvshow-id');
                const subBlock = globalThis.document.getElementById(`subtitle_block_${tvShowId}`);

                // console.log(tvShowId, subBlock);

                // Toggle the display of the subtitle file input
                if (subBlock.style.display === "none" || subBlock.style.display === "") {
                  subBlock.style.display = "block";
                } else {
                  subBlock.style.display = "none";
                }
              });
            });

            globalThis.document.querySelectorAll('.upload-sub-button').forEach(button => {
              button.addEventListener('click', function(e) {
                const tvShowId = this.getAttribute('data-tvshow-id');
                // console.log(tvShowId, e.target);
                uploadSubVideo(tvShowId, this);
              });
            });

            // Add the click event listener to the document and delegate it to file-input elements
            document.addEventListener("change", function (event) {
              if (event.target.matches(".file-input")) {
                const fileInput = event.target;
                const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span

                // console.log(fileInput, fileNameDisplay);

                const file = fileInput.files[0];
                // console.log(file);
                if (file) {
                  fileNameDisplay.textContent = file.name;
                } else {
                  fileNameDisplay.textContent = "No file chosen";
                }
              }
            });

            function uploadVideo(tvShowId, btn) {
              submitButton.style.display = 'none';
              btn.disabled = true;

              // console.log(tvShowId);

              const videoIframe = document.querySelector(`#embed-responsive_${tvShowId}`);
              const fileInput = document.querySelector(`#episodeFile_${tvShowId}`);
              const videoUploader = document.querySelector(`#video-uploader_${tvShowId}`);

              // console.log(videoIframe);

              videoIframe.style.display = "none"; 
              const file = fileInput.files[0];
              // console.log(file);             

              if (fileInput.files.length === 0) {
                alert('Please select a video to upload.');
                btn.disabled = false;
                return;
              }

              else if (file) {
                // console.log(file.name);
                function isVideoExtension(extension) {
                  const videoExtensions = [".mp4", ".avi", ".wmv", ".mov", ".mkv", ".flv", ".webm", ".3gp", ".ogv", ".mpeg", ".mpg", ".divx", ".vob"];
                  return videoExtensions.includes(extension.toLowerCase());
                }
                const extension = file.name.match(/\.([^\.]+)$/);

                if (extension) {
                  const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
                  const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
                  // console.log(isVideo);
                  if (!isVideo) {
                    alert('Please select a video to upload.');
                    btn.disabled = false;
                    const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                    fileNameDisplay.textContent = "No file chosen";
                    return;
                  }
                } else {
                  console.log("No extension found");
                }
              }

              const fCode = document.getElementById(`fileCode_${tvShowId}`);

              const spinner = document.getElementById(`spinner_${tvShowId}`);
              spinner.style.display = 'block';

              const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

              const baseUri = 'https://oneupload.to/';

              const formdata = new FormData();
              formdata.append("key", "617ujm5brrei3rqdhdm");
              formdata.append("file", file);

              const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
              };

              fetch(`${proxyUrl}https://s1.oneupload.to/upload/04`, requestOptions)
                .then(response => response.json())
                .then(async (result) => {
                  // console.log(result);

                  let status = await result.status;
                  // console.log(status);

                  if(status == '200') {
                    const filecode = await result.files[0].filecode;
                    // console.log(filecode);

                    fCode.value = filecode;

                    spinner.style.display = 'none';
                    const requestOptions1 = {
                      method: 'GET',
                      redirect: 'follow'
                    };

                    fetch(`${proxyUrl}${baseUri}api/file/direct_link?key=617ujm5brrei3rqdhdm&file_code=${filecode}`, requestOptions1)
                      .then(response => response.json())
                      .then(async (result) => {
                        // console.log(result);

                        status = await result.status;
                        // console.log(status);

                        if(status == '200') {
                          // const url = await result.result.versions[0].url;
                          // console.log(url);

                          if(filecode) {
                            videoUploader.style.display = 'none';
                            videoIframe.style.display = "block";
                            // Get a reference to the <iframe> element inside the <div>

                            spinner.style.display = 'none';

                            // console.log(lang);

                            langSelect.addEventListener("change", function () {
                              const selectedValue = langSelect.value;

                              // console.log('upload', selectedValue);

                              if (selectedValue === '') {
                                alert("Please select a language.");
                                submitButton.style.display = 'none';                          
                                return;
                              }

                              else {
                                submitButton.style.display = 'block';
                              }
                            });

                            // console.log(btn);
                            // btn.disabled = true;
                          }

                          else {
                            alert(`Unable to upload video ${file.name}.`);
                            const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                            fileNameDisplay.textContent = "No file chosen";
                            submitButton.style.display = 'none';
                            spinner.style.display = 'none';
                            btn.disabled = false;
                          }
                        }

                        else {
                          alert(`Unable to upload ${file.name}.`);
                          const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                          fileNameDisplay.textContent = "No file chosen";
                          btn.disabled = false;
                          return;                 
                        }
                      })
                      .catch(error => {
                        // console.log('error', error);
                        btn.disabled = false;
                        spinner.style.display = 'none';
                      });
                  }

                  else {
                    alert(`Unable to upload video2 ${file.name}.`);
                    const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                    fileNameDisplay.textContent = "No file chosen";
                    btn.disabled = false;
                    return;                 
                  }
                })
                .catch(error => {
                  // console.log('error', error);
                  btn.disabled = false;
                  spinner.style.display = 'none';
                });
            }

            function uploadSubVideo(tvShowId, btn) {
              // console.log("hii sub2");
              submitButton.style.display = 'none';
              btn.disabled = true;

              // console.log(tvShowId);

              const videoIframe = document.querySelector(`#embed-sub-responsive_${tvShowId}`);
              const fileInput = document.querySelector(`#episode_Sub_File_${tvShowId}`);
              const videoUploader = document.querySelector(`#video-sub-uploader_${tvShowId}`);

              // console.log(videoIframe, fileInput, videoUploader);

              videoIframe.style.display = "none"; 
              const file = fileInput.files[0];
              // console.log(file);             

              if (fileInput.files.length === 0) {
                alert('Please select a file to upload.');
                btn.disabled = false;
                return;
              }

              else if (file) {
                // console.log(file.name);
                function isSubtitleExtension(extension) {
                  const subtitleExtensions = [".srt", ".sub", ".vtt"];
                  return subtitleExtensions.includes(extension.toLowerCase());
                }
                const extension = file.name.match(/\.([^\.]+)$/);

                if (extension) {
                  const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
                  const isSubtitle = isSubtitleExtension("." + extractedExtension); // Add dot prefix
                  // console.log(isVideo);
                  if (!isSubtitle) {
                    alert('Please select a file to upload.');
                    btn.disabled = false;
                    const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                    // console.log(fileNameDisplay);
                    fileNameDisplay.textContent = "No file chosen";
                    return;
                  }
                } else {
                  console.log("No extension found");
                }
              }

              const fCode = document.getElementById(`file_Sub_Code_${tvShowId}`);

              const spinner = document.getElementById(`spinner_sub_${tvShowId}`);
              spinner.style.display = 'block';

              const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

              const baseUri = 'https://oneupload.to/';

              const formdata = new FormData();
              // formdata.append("key", "617ujm5brrei3rqdhdm");
              // formdata.append("file", file);
              // formdata.append("tmdbId", tvShowId);
              // formdata.append("username", "gfgh");
              formdata.append("subtitle", file);

              const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
              };

              fetch("https://feflix.tech/feflix_api/upload_subtitle.php", requestOptions)
                .then(response => response.json())
                .then(async (result) => {
                  // console.log(result);

                  let status = result.isSuccess;
                  // console.log(status, result.subFile);

                  if(status == true) {
                    const filecode = result.subFile;
                    // console.log(filecode);

                    fCode.value = filecode;

                    spinner.style.display = 'none';

                    if(filecode) {
                      videoUploader.style.display = 'none';
                      videoIframe.style.display = "block";
                      // Get a reference to the <iframe> element inside the <div>

                      spinner.style.display = 'none';
                      langSelect.addEventListener("change", function () {
                        const selectedValue = langSelect.value;

                        // console.log('upload', selectedValue);

                        if (selectedValue === '') {
                          alert("Please select a language.");
                          submitButton.style.display = 'none';                          
                          return;
                        }

                        else {
                          submitButton.style.display = 'block';
                        }
                      });                          

                      // console.log(btn);
                      btn.disabled = true;
                    }

                    else {
                      alert(`Unable to upload 5 ${file.name}.`);
                      const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                      fileNameDisplay.textContent = "No file chosen";
                      submitButton.style.display = 'none';
                      spinner.style.display = 'none';
                      btn.disabled = false;
                      return;
                    }
                  }

                  else {
                    alert(`Unable to upload ${file.name}.`);
                    const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                    fileNameDisplay.textContent = "No file chosen";
                    submitButton.style.display = 'none';
                    btn.disabled = false;
                    return;                 
                  }
                })
                .catch(error => {
                  // console.log('error', error);
                  btn.disabled = false;
                  spinner.style.display = 'none';
                }); 
            }

            function uploadLogoImage(id, btn) {
              // console.log("logo....");
              submitButton.style.display = 'none';
              btn.disabled = true;

              const formFile1 = globalThis.document.getElementById(`formFilel_${id}`);

              const file = formFile1.files[0];

              if (formFile1.files.length === 0) {
                alert('Please select a image to upload.');
                btn.disabled = false;
                return;
              }

              else if (file) {
                // console.log(file.name);
                function isVideoExtension(extension) {
                  const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
                  return videoExtensions.includes(extension.toLowerCase());
                }
                const extension = file.name.match(/\.([^\.]+)$/);

                if (extension) {
                  const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
                  const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
                  // console.log(isVideo);
                  if (!isVideo) {
                    alert('Please select a image to upload.');
                    btn.disabled = false;
                    // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                    formFile1.value = "";
                    return;
                  }
                } else {
                  console.log("No extension found");
                }
              }

              // btn.parentElement.previousElementSibling.style.display = 'none';
              // btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
              // btn.parentElement.parentElement.style.marginBottom = '50px';

              // console.log(file.name);
              // globalThis.document.getElementById(`formNameFilel_${id}`).value = `logo_${id}`;

              const spinner = document.getElementById(`spinner_subl_${id}`);
              spinner.style.display = 'block';

              const formdata = new FormData();
              formdata.append("fileToUpload", file);

              const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
              };

              fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  // console.log(result);
                  if (result.isSuccess == true) {
                    spinner.style.display = 'none';
                    btn.parentElement.style.display = 'none';
                    globalThis.document.getElementById(`formNameFilel_${id}`).value = result.image;
                    btn.parentElement.previousElementSibling.style.display = 'none';
                    btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                    btn.parentElement.parentElement.style.marginBottom = '50px';
                    // btn.parentElement.parentElement.previousElementSibling.style.display = 'none';
                    // btn.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                    // // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
                    // btn.parentElement.parentElement.parentElement.style.marginBottom = '50px';

                    langSelect.addEventListener("change", function () {
                      const selectedValue = langSelect.value;

                      // console.log('upload', selectedValue);

                      if (selectedValue === '') {
                        alert("Please select a language.");
                        submitButton.style.display = 'none';                          
                        return;
                      }

                      else {
                        submitButton.style.display = 'block';
                      }
                    });
                  }
                  else {
                    alert('Failed to upload.');
                    btn.disabled = false;
                    file.value = '';
                    spinner.style.display = 'none';
                    return;
                  }
                })
                .catch((error) => console.error(error));
            }

            function uploadPosterImage(id, btn) {
              // console.log("poster....");
              submitButton.style.display = 'none';
              btn.disabled = true;

              const formFile1 = globalThis.document.getElementById(`formFilep_${id}`);

              const file = formFile1.files[0];

              if (formFile1.files.length === 0) {
                alert('Please select a image to upload.');
                btn.disabled = false;
                return;
              }

              else if (file) {
                // console.log(file.name);
                function isVideoExtension(extension) {
                  const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
                  return videoExtensions.includes(extension.toLowerCase());
                }
                const extension = file.name.match(/\.([^\.]+)$/);

                if (extension) {
                  const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
                  const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
                  // console.log(isVideo);
                  if (!isVideo) {
                    alert('Please select a image to upload.');
                    btn.disabled = false;
                    // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                    formFile1.value = "";
                    return;
                  }
                } else {
                  console.log("No extension found");
                }
              }

              // btn.parentElement.previousElementSibling.style.display = 'none';
              // btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
              // btn.parentElement.parentElement.style.marginBottom = '50px';

              // console.log(file.name);
              // globalThis.document.getElementById(`formNameFilel_${id}`).value = `logo_${id}`;

              const spinner = document.getElementById(`spinner_subp_${id}`);
              spinner.style.display = 'block';

              const formdata = new FormData();
              formdata.append("fileToUpload", file);

              const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
              };

              fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  // console.log(result);
                  if (result.isSuccess == true) {
                    spinner.style.display = 'none';
                    btn.parentElement.style.display = 'none';
                    globalThis.document.getElementById(`formNameFilep_${id}`).value = result.image;
                    btn.parentElement.previousElementSibling.style.display = 'none';
                    btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                    btn.parentElement.parentElement.style.marginBottom = '50px';
                    // btn.parentElement.parentElement.previousElementSibling.style.display = 'none';
                    // btn.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                    // // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
                    // btn.parentElement.parentElement.parentElement.style.marginBottom = '50px';

                    langSelect.addEventListener("change", function () {
                      const selectedValue = langSelect.value;

                      // console.log('upload', selectedValue);

                      if (selectedValue === '') {
                        alert("Please select a language.");
                        submitButton.style.display = 'none';                          
                        return;
                      }

                      else {
                        submitButton.style.display = 'block';
                      }
                    });
                  }
                  else {
                    alert('Failed to upload.');
                    btn.disabled = false;
                    file.value = '';
                    spinner.style.display = 'none';
                    return;
                  }
                })
                .catch((error) => console.error(error));
            }

            function uploadBgImage(id, btn) {
              // console.log("bg....");
              submitButton.style.display = 'none';
              btn.disabled = true;

              const formFile1 = globalThis.document.getElementById(`formFilebg_${id}`);

              const file = formFile1.files[0];

              if (formFile1.files.length === 0) {
                alert('Please select a image to upload.');
                btn.disabled = false;
                return;
              }

              else if (file) {
                // console.log(file.name);
                function isVideoExtension(extension) {
                  const videoExtensions = [".png", ".jpg", ".jpeg", ".gif"];
                  return videoExtensions.includes(extension.toLowerCase());
                }
                const extension = file.name.match(/\.([^\.]+)$/);

                if (extension) {
                  const extractedExtension = extension[1].toLowerCase(); // Convert to lowercase for case-insensitive comparison
                  const isVideo = isVideoExtension("." + extractedExtension); // Add dot prefix
                  // console.log(isVideo);
                  if (!isVideo) {
                    alert('Please select a image to upload.');
                    btn.disabled = false;
                    // const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling.nextElementSibling; // The third sibling is the file-name span
                    formFile1.value = "";
                    return;
                  }
                } else {
                  console.log("No extension found");
                }
              }

              // console.log(file.name, btn.parentElement);
              // globalThis.document.getElementById(`formNameFilebg_${id}`).value = `bg_${id}`;

              const spinner = document.getElementById(`spinner_subbg_${id}`);
              spinner.style.display = 'block';

              const formdata = new FormData();
              formdata.append("fileToUpload", file);

              const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
              };

              fetch("https://feflix.tech/feflix_api/upload_image.php", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  // console.log(result);
                  if (result.isSuccess == true) {
                    spinner.style.display = 'none';
                    btn.parentElement.style.display = 'none';
                    globalThis.document.getElementById(`formNameFilebg_${id}`).value = result.image;
                    btn.parentElement.previousElementSibling.style.display = 'none';
                    btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                    btn.parentElement.parentElement.style.marginBottom = '50px';
                    // btn.parentElement.parentElement.previousElementSibling.style.display = 'none';
                    // btn.parentElement.parentElement.previousElementSibling.previousElementSibling.style.display = 'block';
                    // e.target.parentElement.previousElementSibling.style.border = '1px solid grey';
                    // btn.parentElement.parentElement.parentElement.style.marginBottom = '50px';

                    langSelect.addEventListener("change", function () {
                      const selectedValue = langSelect.value;

                      // console.log('upload', selectedValue);

                      if (selectedValue === '') {
                        alert("Please select a language.");
                        submitButton.style.display = 'none';                          
                        return;
                      }

                      else {
                        submitButton.style.display = 'block';
                      }
                    });
                  }
                  else {
                    alert('Failed to upload.');
                    btn.disabled = false;
                    file.value = '';
                    spinner.style.display = 'none';
                    return;
                  }
                })
                .catch((error) => console.error(error));
            }
          }
          else {
            // console.log('No seasons data found for the selected TV show.');
            searchSeasons.innerHTML = `<li>No Episode data found for the selected TV show.</li>`
          }
        }
        else if(event.target.tagName === 'LI' && event.target.dataset.type === 'movie') {
          // searchMovieContainer.style.display = 'none';
          const searchTerm = searchInput.value.trim();
          searchTypeContainer.style.display = 'none';
          searchMovieContainer.style.display = 'block';
          // console.log("hii", event.target.tagName);

          const movieData = await fetchDataFromAPI(searchTerm);
          // console.log(movieData);
        }
      });

      // Add event listeners to the search input and search results
      searchInput.addEventListener('input', updateSearchResults);
      searchResults.addEventListener('click', handleResultClick);
      searchSeasons.addEventListener('click', handleSeasonClick);

      // Function to clear the input text
      const clearInput = () => {
        searchInput.value = '';
        // console.log(globalThis.location);
        globalThis.location.reload();
      };

      // Add click event listener to the clear button
      clearButton.addEventListener('click', clearInput);
    });