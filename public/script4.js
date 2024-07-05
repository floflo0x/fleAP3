const episodesData = JSON.parse(dataArray.replace(/&#34;/g, '"'));
const sNumber = season;
const serialId = sid;
const name = title;
const type = Type;
const editing = Editing;
const lang = JSON.parse(Lang.replace(/&#34;/g, '"'));
const genres = JSON.parse(genre.replace(/&#34;/g, '"'));
const gen1 = JSON.parse(Gen1.replace(/&#34;/g, '"'));

let uploadedVideos = 0;
// console.log(lang);
// console.log(episodesData);
// console.log(sNumber, serialId, name, type, editing, genres);

const form = globalThis.document.getElementById('searchForm');
const submitButton = globalThis.document.getElementById('subBtn');

// console.log(form, submitButton, gen1);
// console.log(type, name, editing, editing === 'true');

if(editing === 'true') {
    const searchInput = globalThis.document.getElementById('searchInput');
    const clearButton = globalThis.document.getElementById('clearButton');
    const selectedMovieIdInput = globalThis.document.getElementById('selectedMovieId');
    const selectedMediaType = globalThis.document.getElementById('selectedMediaType');
    // const langSelect = globalThis.document.getElementById("language");
    const selectedLanguageDisplay = document.getElementById("selectedLanguageDisplay");

    searchInput.value = name;
    selectedMovieIdInput.value = serialId;
    selectedMediaType.value = type;
    searchInput.style.pointerEvents = 'none';
    clearButton.style.pointerEvents = 'none';

    if (episodesData && episodesData.length >= 1) {
        const resultsHTML = episodesData.map((tvShow) => {
            // console.log(tvShow.url && tvShow.subUrl);

            if (!tvShow.fileCode && !tvShow.file_Sub_Code) {
                return `
                    <div>
                      <div class="row mb-1" id="get_movies_detail">
                        <div class="col-12 col-sm-12">
                            <!-- name -->
                          <div class="mb-3">
                            <label for="exampleFormControlName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="exampleFormControlName" name="title" placeholder="e.g., abcd" value="${tvShow.name}" required>
                          </div>
                            <!-- description -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                            <textarea class="form-control" name="description" id="exampleFormControlTextarea1" rows="3" required>
                                ${tvShow.description}
                            </textarea>
                          </div>
                            <!-- cast -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea2" class="form-label">Cast</label>
                            <textarea class="form-control" name="cast" id="exampleFormControlTextarea2" rows="3" required>
                                ${tvShow.cast}
                            </textarea>
                          </div>
                            <!-- creator -->
                          <div class="mb-3">
                            <label for="exampleFormControlCreator" class="form-label">Creator</label>
                            <input type="text" class="form-control" name="creator" id="exampleFormControlCreator" 
                            placeholder="e.g., xyz" value="${tvShow.creator}" required>
                          </div>
                            <!-- age -->
                          <div class="mb-3">
                            <label for="exampleFormControlAge" class="form-label">Age</label>
                              <input type="number" class="form-control" name="age"  id="exampleFormControlAge" 
                              placeholder="e.g., 12" min="12" max="50" value="${tvShow.age_category}" required>
                          </div>
                            <!-- release date -->
                          <div class="mb-3">
                            <label for="exampleFormControlDate" class="form-label">Release Date</label>
                              <input type="date" class="form-control" id="exampleFormControlDate" name="release_date" value="${tvShow.release_date}" required>
                          </div>
                            <!-- type -->
                          <div class="mb-3">
                            <label class="form-label">Type</label>
                            <select class="form-select" aria-label="Default select example" name="movie_type" required>
                              <option value="movie" ${tvShow.type === 'movie' ? 'selected' : ''}>Movie</option>
                              <option value="collection" ${tvShow.type === 'collection' ? 'selected' : ''}>Collection</option>
                              <option value="series" ${tvShow.type === 'series' ? 'selected' : ''}>Series</option>
                            </select>
                          </div>
                            <!-- genres -->
                          <div class="mb-3" id="genres_class"></div>
                            <!-- logo -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile1" class="form-label">Logo Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Logo Image</label>
                              <input class="form-control" type="file" id="formFilel_${tvShow.id}">
                              <input type="hidden" name="logo" id="formNameFilel_${tvShow.id}" value="${tvShow.logo}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-limage-btn border-0" data-lshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-l-button" data-lshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subl_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- poster image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Poster Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Poster Image</label>
                              <input class="form-control" type="file" id="formFilep_${tvShow.id}">
                              <input type="hidden" name="poster_img" id="formNameFilep_${tvShow.id}" value="${tvShow.posterImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-pimage-btn border-0" data-pshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-p-button" data-pshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subp_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- background image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Background Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Background Image</label>
                              <input class="form-control" type="file" id="formFilebg_${tvShow.id}">
                              <input type="hidden" name="bg_img" id="formNameFilebg_${tvShow.id}" value="${tvShow.bgImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-bgimage-btn border-0" data-bgshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-bg-button" data-bgshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
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
                          <label class="file-label" for="movieFile_${tvShow.id}" id="fileLabel_${tvShow.id}">
                            <i class="fa-solid fa-file-video"></i> Choose Video
                          </label>
                          <input type="file" id="movieFile_${tvShow.id}" class="file-input" />
                          <input type="hidden" class="border-0" id="movieId_${tvShow.id}" name="movieId" value="${tvShow.id}">
                          <input type="hidden" id="fileCode_${tvShow.id}" name="fileCode" class="custom-file-input" value="${tvShow.fileCode}">
                          <span id="file_name_${tvShow.id}" name="file_name_${tvShow.id}" class="file-name">No file chosen</span>
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start d-flex justify-content-between align-items-center" style="word-wrap: break-word;">
                          <p class="text-break">${tvShow.name}</p>
                          <input type="hidden" class="border-0" id="movieName_${tvShow.id}" name="movieName" value="${tvShow.name}">
                          <input type="hidden" name="seasonNumber" value="null" />
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                          <div id="spinner_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                          <button type="button" class="btn upload-button border-0" data-movieshow-id="${tvShow.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                          <button type="button" class="btn delete-button" data-tvshow-id="${tvShow.id}">
                              <i class="fa-solid fa-trash"></i>
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
                              <input type="hidden" id="file_Sub_Code_${tvShow.id}" name="file_Sub_Code" class="custom-file-input" value="${tvShow.file_Sub_Code}">
                              <span id="file_Sub_name_${tvShow.id}" name="file_Sub_name_${tvShow.id}" class="file-name">No file chosen</span>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                              <!-- <p class="text-break">${tvShow.name}</p> -->
                              <input type="hidden" class="border-0" id="episodeSubName_${tvShow.id}" value="${tvShow.name}">
                              <input type="hidden" value="null" />
                            </div>
                            <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                              <div id="spinner_sub_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                              <button type="button" class="btn upload-sub-button border-0" data-tvshow-id="${tvShow.id}">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-sub-button" data-tvshow-id="${tvShow.id}">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;
            }

            else if (!tvShow.fileCode && tvShow.file_Sub_Code) {
                return `
                    <div>
                      <div class="row mb-1" id="get_movies_detail">
                        <div class="col-12 col-sm-12">
                            <!-- name -->
                          <div class="mb-3">
                            <label for="exampleFormControlName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="exampleFormControlName" name="title" placeholder="e.g., abcd" value="${tvShow.name}" required>
                          </div>
                            <!-- description -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                            <textarea class="form-control" name="description" id="exampleFormControlTextarea1" rows="3" required>
                                ${tvShow.description}
                            </textarea>
                          </div>
                            <!-- cast -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea2" class="form-label">Cast</label>
                            <textarea class="form-control" name="cast" id="exampleFormControlTextarea2" rows="3" required>
                                ${tvShow.cast}
                            </textarea>
                          </div>
                            <!-- creator -->
                          <div class="mb-3">
                            <label for="exampleFormControlCreator" class="form-label">Creator</label>
                            <input type="text" class="form-control" name="creator" id="exampleFormControlCreator" 
                            placeholder="e.g., xyz" value="${tvShow.creator}" required>
                          </div>
                            <!-- age -->
                          <div class="mb-3">
                            <label for="exampleFormControlAge" class="form-label">Age</label>
                              <input type="number" class="form-control" name="age"  id="exampleFormControlAge" 
                              placeholder="e.g., 12" min="12" max="50" value="${tvShow.age_category}" required>
                          </div>
                            <!-- release date -->
                          <div class="mb-3">
                            <label for="exampleFormControlDate" class="form-label">Release Date</label>
                              <input type="date" class="form-control" id="exampleFormControlDate" name="release_date" value="${tvShow.release_date}" required>
                          </div>
                            <!-- type -->
                          <div class="mb-3">
                            <label class="form-label">Type</label>
                            <select class="form-select" aria-label="Default select example" name="movie_type" required>
                              <option value="movie" ${tvShow.type === 'movie' ? 'selected' : ''}>Movie</option>
                              <option value="collection" ${tvShow.type === 'collection' ? 'selected' : ''}>Collection</option>
                              <option value="series" ${tvShow.type === 'series' ? 'selected' : ''}>Series</option>
                            </select>
                          </div>
                            <!-- genres -->
                          <div class="mb-3" id="genres_class"></div>
                            <!-- logo -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile1" class="form-label">Logo Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Logo Image</label>
                              <input class="form-control" type="file" id="formFilel_${tvShow.id}">
                              <input type="hidden" name="logo" id="formNameFilel_${tvShow.id}" value="${tvShow.logo}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-limage-btn border-0" data-lshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-l-button" data-lshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subl_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- poster image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Poster Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Poster Image</label>
                              <input class="form-control" type="file" id="formFilep_${tvShow.id}">
                              <input type="hidden" name="poster_img" id="formNameFilep_${tvShow.id}" value="${tvShow.posterImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-pimage-btn border-0" data-pshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-p-button" data-pshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subp_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- background image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Background Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Background Image</label>
                              <input class="form-control" type="file" id="formFilebg_${tvShow.id}">
                              <input type="hidden" name="bg_img" id="formNameFilebg_${tvShow.id}" value="${tvShow.bgImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-bgimage-btn border-0" data-bgshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-bg-button" data-bgshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
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
                          <label class="file-label" for="movieFile_${tvShow.id}" id="fileLabel_${tvShow.id}">
                            <i class="fa-solid fa-file-video"></i> Choose Video
                          </label>
                          <input type="file" id="movieFile_${tvShow.id}" class="file-input" />
                          <input type="hidden" class="border-0" id="movieId_${tvShow.id}" name="movieId" value="${tvShow.id}">
                          <input type="hidden" id="fileCode_${tvShow.id}" name="fileCode" class="custom-file-input" value="${tvShow.fileCode}">
                          <span id="file_name_${tvShow.id}" name="file_name_${tvShow.id}" class="file-name">No file chosen</span>
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start d-flex justify-content-between align-items-center" style="word-wrap: break-word;">
                          <p class="text-break">${tvShow.name}</p>
                          <input type="hidden" class="border-0" id="movieName_${tvShow.id}" name="movieName" value="${tvShow.name}">
                          <input type="hidden" name="seasonNumber" value="null" />
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                          <div id="spinner_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                          <button type="button" class="btn upload-button border-0" data-movieshow-id="${tvShow.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                          <button type="button" class="btn delete-button" data-tvshow-id="${tvShow.id}">
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          <!-- Subtitle Button -->
                          <button type="button" class="btn subtitle-button border-0" data-tvshow-id="${tvShow.id}">
                            <i class="fa-solid fa-closed-captioning"></i>
                          </button>
                        </div>
                        <!-- subtitle section -->
                        <div class="col-xxl mt-3" id="subtitle_block_${tvShow.id}" style="display: none;">
                          <div class= "row">
                            <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-sub-responsive_${tvShow.id}" style="display: block;">
                              <div class="embed-responsive embed-responsive-16by9">
                                <div id="image_sub_${tvShow.id}" class="uploaded-text">UPLOADED</div>
                              </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-sub-uploader_${tvShow.id}" style="display: none;">
                              <label class="file-label" for="episode_Sub_File_${tvShow.id}" id="file_Sub_Label_${tvShow.id}">
                                <i class="fa-solid fa-file-video"></i> Choose Subtitle File
                              </label>
                              <input type="file" id="episode_Sub_File_${tvShow.id}" class="file-input" />
                              <input type="hidden" class="border-0" id="episode_Sub_Id_${tvShow.id}" value="${tvShow.id}">
                              <input type="hidden" id="file_Sub_Code_${tvShow.id}" name="file_Sub_Code" class="custom-file-input" value="${tvShow.file_Sub_Code}">
                              <span id="file_Sub_name_${tvShow.id}" name="file_Sub_name_${tvShow.id}" class="file-name">No file chosen</span>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                              <!-- <p class="text-break">${tvShow.name}</p> -->
                              <input type="hidden" class="border-0" id="episodeSubName_${tvShow.id}" value="${tvShow.name}">
                              <input type="hidden" value="null" />
                            </div>
                            <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                              <div id="spinner_sub_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                              <button type="button" class="btn upload-sub-button border-0" data-tvshow-id="${tvShow.id}">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-sub-button" data-tvshow-id="${tvShow.id}">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;
            }

            else if (tvShow.fileCode && !tvShow.file_Sub_Code) {
                return `
                    <div>
                      <div class="row mb-1" id="get_movies_detail">
                        <div class="col-12 col-sm-12">
                            <!-- name -->
                          <div class="mb-3">
                            <label for="exampleFormControlName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="exampleFormControlName" name="title" placeholder="e.g., abcd" value="${tvShow.name}" required>
                          </div>
                            <!-- description -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                            <textarea class="form-control" name="description" id="exampleFormControlTextarea1" rows="3" required>
                                ${tvShow.description}
                            </textarea>
                          </div>
                            <!-- cast -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea2" class="form-label">Cast</label>
                            <textarea class="form-control" name="cast" id="exampleFormControlTextarea2" rows="3" required>
                                ${tvShow.cast}
                            </textarea>
                          </div>
                            <!-- creator -->
                          <div class="mb-3">
                            <label for="exampleFormControlCreator" class="form-label">Creator</label>
                            <input type="text" class="form-control" name="creator" id="exampleFormControlCreator" 
                            placeholder="e.g., xyz" value="${tvShow.creator}" required>
                          </div>
                            <!-- age -->
                          <div class="mb-3">
                            <label for="exampleFormControlAge" class="form-label">Age</label>
                              <input type="number" class="form-control" name="age"  id="exampleFormControlAge" 
                              placeholder="e.g., 12" min="12" max="50" value="${tvShow.age_category}" required>
                          </div>
                            <!-- release date -->
                          <div class="mb-3">
                            <label for="exampleFormControlDate" class="form-label">Release Date</label>
                              <input type="date" class="form-control" id="exampleFormControlDate" name="release_date" value="${tvShow.release_date}" required>
                          </div>
                            <!-- type -->
                          <div class="mb-3">
                            <label class="form-label">Type</label>
                            <select class="form-select" aria-label="Default select example" name="movie_type" required>
                              <option value="movie" ${tvShow.type === 'movie' ? 'selected' : ''}>Movie</option>
                              <option value="collection" ${tvShow.type === 'collection' ? 'selected' : ''}>Collection</option>
                              <option value="series" ${tvShow.type === 'series' ? 'selected' : ''}>Series</option>
                            </select>
                          </div>
                            <!-- genres -->
                          <div class="mb-3" id="genres_class"></div>
                            <!-- logo -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile1" class="form-label">Logo Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Logo Image</label>
                              <input class="form-control" type="file" id="formFilel_${tvShow.id}">
                              <input type="hidden" name="logo" id="formNameFilel_${tvShow.id}" value="${tvShow.logo}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-limage-btn border-0" data-lshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-l-button" data-lshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subl_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- poster image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Poster Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Poster Image</label>
                              <input class="form-control" type="file" id="formFilep_${tvShow.id}">
                              <input type="hidden" name="poster_img" id="formNameFilep_${tvShow.id}" value="${tvShow.posterImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-pimage-btn border-0" data-pshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-p-button" data-pshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subp_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- background image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Background Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Background Image</label>
                              <input class="form-control" type="file" id="formFilebg_${tvShow.id}">
                              <input type="hidden" name="bg_img" id="formNameFilebg_${tvShow.id}" value="${tvShow.bgImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-bgimage-btn border-0" data-bgshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-bg-button" data-bgshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subbg_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row border mb-4">
                        <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${tvShow.id}" style="display: block;">
                          <div class="embed-responsive embed-responsive-16by9">
                            <div id="image_${tvShow.id}" class="uploaded-text">UPLOADED</div>
                          </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${tvShow.id}" style="display: none;">
                          <label class="file-label" for="movieFile_${tvShow.id}" id="fileLabel_${tvShow.id}">
                            <i class="fa-solid fa-file-video"></i> Choose Video
                          </label>
                          <input type="file" id="movieFile_${tvShow.id}" class="file-input" />
                          <input type="hidden" class="border-0" id="movieId_${tvShow.id}" name="movieId" value="${tvShow.id}">
                          <input type="hidden" id="fileCode_${tvShow.id}" name="fileCode" class="custom-file-input" value="${tvShow.fileCode}">
                          <span id="file_name_${tvShow.id}" name="file_name_${tvShow.id}" class="file-name">No file chosen</span>
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start d-flex justify-content-between align-items-center" style="word-wrap: break-word;">
                          <p class="text-break">${tvShow.name}</p>
                          <input type="hidden" class="border-0" id="movieName_${tvShow.id}" name="movieName" value="${tvShow.name}">
                          <input type="hidden" name="seasonNumber" value="null" />
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                          <div id="spinner_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                          <button type="button" class="btn upload-button border-0" data-movieshow-id="${tvShow.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                          <button type="button" class="btn delete-button" data-tvshow-id="${tvShow.id}">
                              <i class="fa-solid fa-trash"></i>
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
                              <input type="hidden" id="file_Sub_Code_${tvShow.id}" name="file_Sub_Code" class="custom-file-input" value="${tvShow.file_Sub_Code}">
                              <span id="file_Sub_name_${tvShow.id}" name="file_Sub_name_${tvShow.id}" class="file-name">No file chosen</span>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                              <!-- <p class="text-break">${tvShow.name}</p> -->
                              <input type="hidden" class="border-0" id="episodeSubName_${tvShow.id}" value="${tvShow.name}">
                              <input type="hidden" value="null" />
                            </div>
                            <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                              <div id="spinner_sub_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                              <button type="button" class="btn upload-sub-button border-0" data-tvshow-id="${tvShow.id}">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-sub-button" data-tvshow-id="${tvShow.id}">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;
            }

            else {
                return `
                    <div>
                      <div class="row mb-1" id="get_movies_detail">
                        <div class="col-12 col-sm-12">
                            <!-- name -->
                          <div class="mb-3">
                            <label for="exampleFormControlName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="exampleFormControlName" name="title" placeholder="e.g., abcd" value="${tvShow.name}" required>
                          </div>
                            <!-- description -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                            <textarea class="form-control" name="description" id="exampleFormControlTextarea1" rows="3" required>
                                ${tvShow.description}
                            </textarea>
                          </div>
                            <!-- cast -->
                          <div class="mb-3">
                            <label for="exampleFormControlTextarea2" class="form-label">Cast</label>
                            <textarea class="form-control" name="cast" id="exampleFormControlTextarea2" rows="3" required>
                                ${tvShow.cast}
                            </textarea>
                          </div>
                            <!-- creator -->
                          <div class="mb-3">
                            <label for="exampleFormControlCreator" class="form-label">Creator</label>
                            <input type="text" class="form-control" name="creator" id="exampleFormControlCreator" 
                            placeholder="e.g., xyz" value="${tvShow.creator}" required>
                          </div>
                            <!-- age -->
                          <div class="mb-3">
                            <label for="exampleFormControlAge" class="form-label">Age</label>
                              <input type="number" class="form-control" name="age"  id="exampleFormControlAge" 
                              placeholder="e.g., 12" min="12" max="50" value="${tvShow.age_category}" required>
                          </div>
                            <!-- release date -->
                          <div class="mb-3">
                            <label for="exampleFormControlDate" class="form-label">Release Date</label>
                              <input type="date" class="form-control" id="exampleFormControlDate" name="release_date" value="${tvShow.release_date}" required>
                          </div>
                            <!-- type -->
                          <div class="mb-3">
                            <label class="form-label">Type</label>
                            <select class="form-select" aria-label="Default select example" name="movie_type" required>
                              <option value="movie" ${tvShow.type === 'movie' ? 'selected' : ''}>Movie</option>
                              <option value="collection" ${tvShow.type === 'collection' ? 'selected' : ''}>Collection</option>
                              <option value="series" ${tvShow.type === 'series' ? 'selected' : ''}>Series</option>
                            </select>
                          </div>
                            <!-- genres -->
                          <div class="mb-3" id="genres_class"></div>
                            <!-- logo -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile1" class="form-label">Logo Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Logo Image</label>
                              <input class="form-control" type="file" id="formFilel_${tvShow.id}">
                              <input type="hidden" name="logo" id="formNameFilel_${tvShow.id}" value="${tvShow.logo}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-limage-btn border-0" data-lshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-l-button" data-lshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subl_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- poster image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Poster Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Poster Image</label>
                              <input class="form-control" type="file" id="formFilep_${tvShow.id}">
                              <input type="hidden" name="poster_img" id="formNameFilep_${tvShow.id}" value="${tvShow.posterImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-pimage-btn border-0" data-pshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-p-button" data-pshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subp_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                            <!-- background image -->
                          <div class="mb-3">
                            <div style="display: block;">
                              <label for="formFile_${tvShow.id}" class="form-label">Background Image</label>
                              <h4>UPLOADED</h4>
                            </div>
                            <div style="display: none;">
                              <label for="formFile" class="form-label">Background Image</label>
                              <input class="form-control" type="file" id="formFilebg_${tvShow.id}">
                              <input type="hidden" name="bg_img" id="formNameFilebg_${tvShow.id}" value="${tvShow.bgImg}">
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                              <button type="button" class="btn upload-bgimage-btn border-0" data-bgshow-id="${tvShow.id}" style="display: none;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-bg-button" data-bgshow-id="${tvShow.id}">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                              <div id="spinner_subbg_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row border mb-4">
                        <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-responsive_${tvShow.id}" style="display: block;">
                          <div class="embed-responsive embed-responsive-16by9">
                            <div id="image_${tvShow.id}" class="uploaded-text">UPLOADED</div>
                          </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-uploader_${tvShow.id}" style="display: none;">
                          <label class="file-label" for="movieFile_${tvShow.id}" id="fileLabel_${tvShow.id}">
                            <i class="fa-solid fa-file-video"></i> Choose Video
                          </label>
                          <input type="file" id="movieFile_${tvShow.id}" class="file-input" />
                          <input type="hidden" class="border-0" id="movieId_${tvShow.id}" name="movieId" value="${tvShow.id}">
                          <input type="hidden" id="fileCode_${tvShow.id}" name="fileCode" class="custom-file-input" value="${tvShow.fileCode}">
                          <span id="file_name_${tvShow.id}" name="file_name_${tvShow.id}" class="file-name">No file chosen</span>
                        </div>
                        <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-start d-flex justify-content-between align-items-center" style="word-wrap: break-word;">
                          <p class="text-break">${tvShow.name}</p>
                          <input type="hidden" class="border-0" id="movieName_${tvShow.id}" name="movieName" value="${tvShow.name}">
                          <input type="hidden" name="seasonNumber" value="null" />
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                          <div id="spinner_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                            <span class="sr-only">Loading...</span>
                          </div>
                          <button type="button" class="btn upload-button border-0" data-movieshow-id="${tvShow.id}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </button>
                          <button type="button" class="btn delete-button" data-tvshow-id="${tvShow.id}">
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          <!-- Subtitle Button -->
                          <button type="button" class="btn subtitle-button border-0" data-tvshow-id="${tvShow.id}">
                            <i class="fa-solid fa-closed-captioning"></i>
                          </button>
                        </div>
                        <!-- subtitle section -->
                        <div class="col-xxl mt-3" id="subtitle_block_${tvShow.id}" style="display: none;">
                          <div class= "row">
                            <div class="col-12 col-sm-6 col-md-8 col-lg-5 border text-sm-center p-0" id="embed-sub-responsive_${tvShow.id}" style="display: block;">
                              <div class="embed-responsive embed-responsive-16by9">
                                <div id="image_sub_${tvShow.id}" class="uploaded-text">UPLOADED</div>
                              </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-8 col-lg-5 video-uploader" id="video-sub-uploader_${tvShow.id}" style="display: none;">
                              <label class="file-label" for="episode_Sub_File_${tvShow.id}" id="file_Sub_Label_${tvShow.id}">
                                <i class="fa-solid fa-file-video"></i> Choose Subtitle File
                              </label>
                              <input type="file" id="episode_Sub_File_${tvShow.id}" class="file-input" />
                              <input type="hidden" class="border-0" id="episode_Sub_Id_${tvShow.id}" value="${tvShow.id}">
                              <input type="hidden" id="file_Sub_Code_${tvShow.id}" name="file_Sub_Code" class="custom-file-input" value="${tvShow.file_Sub_Code}">
                              <span id="file_Sub_name_${tvShow.id}" name="file_Sub_name_${tvShow.id}" class="file-name">No file chosen</span>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-5 text-center" style="word-wrap: break-word;">
                              <!-- <p class="text-break">${tvShow.name}</p> -->
                              <input type="hidden" class="border-0" id="episodeSubName_${tvShow.id}" value="${tvShow.name}">
                              <input type="hidden" value="null" />
                            </div>
                            <div class="col-12 col-sm-12 col-md-12 col-lg-2 d-flex justify-content-between">
                              <div id="spinner_sub_${tvShow.id}" class="spinner-border" role="status" style="display: none;">
                                <span class="sr-only">Loading...</span>
                              </div>
                              <button type="button" class="btn upload-sub-button border-0" data-tvshow-id="${tvShow.id}">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                              </button>
                              <button type="button" class="btn delete-sub-button" data-tvshow-id="${tvShow.id}">
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;
            }

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

          genres.forEach(genre => {
            const genreOption = document.createElement('option'); // Create an option element
            genreOption.textContent = genre.genre_name;
            genreOption.value = genre.id;

            gen1.forEach(i => {
                return (
                    i == genre.id ? genreOption.selected = true : ''
                )
            })

            genreSelect.appendChild(genreOption); // Append the option to the select element
          });

          genreDiv.appendChild(genreLabel);
          genreDiv.appendChild(genreSelect);
        }

        submitButton.style.display = 'block';

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

        globalThis.document.querySelectorAll('.upload-limage-btn').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-lshow-id');
            // console.log(movieShowId, this);
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

        globalThis.document.querySelectorAll('.delete-l-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-lshow-id');
            // console.log(movieShowId, this);
            deleteLogoImage(movieShowId, this);
          });
        })

        globalThis.document.querySelectorAll('.delete-p-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-pshow-id');
            // console.log(movieShowId, this);
            deletePosterImage(movieShowId, this);
          });
        })

        globalThis.document.querySelectorAll('.delete-bg-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const movieShowId = this.getAttribute('data-bgshow-id');
            // console.log(movieShowId, this);
            deleteBgImage(movieShowId, this);
          });
        })

        globalThis.document.querySelectorAll('.delete-sub-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const tvShowId = this.getAttribute('data-tvshow-id');
            // console.log(tvShowId, this);
            deleteSubVideo(tvShowId, this);
          });
        })

        globalThis.document.querySelectorAll('.upload-sub-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const tvShowId = this.getAttribute('data-tvshow-id');
            // console.log(tvShowId, e.target);
            uploadSubVideo(tvShowId, this);
          });
        })

        globalThis.document.querySelectorAll('.delete-button').forEach(button => {
          button.addEventListener('click', function(e) {
            const tvShowId = this.getAttribute('data-tvshow-id');

            // console.log(tvShowId, e.target);
            deleteVideo(tvShowId, this);
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

        function deleteLogoImage(id, btn) {
          btn.disabled = true;
          // console.log(btn.previousElementSibling);
          btn.previousElementSibling.style.display = 'block';
          btn.parentElement.previousElementSibling.style.display = 'block';
          btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'none';
          globalThis.document.getElementById(`formNameFilel_${id}`).value = '';
        }

        function deletePosterImage(id, btn) {
          btn.disabled = true;
          // console.log(btn.previousElementSibling);
          btn.previousElementSibling.style.display = 'block';
          btn.parentElement.previousElementSibling.style.display = 'block';
          btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'none';
          globalThis.document.getElementById(`formNameFilep_${id}`).value = '';
        }

        function deleteBgImage(id, btn) {
          btn.disabled = true;
          // console.log(btn.previousElementSibling);
          btn.previousElementSibling.style.display = 'block';
          btn.parentElement.previousElementSibling.style.display = 'block';
          btn.parentElement.previousElementSibling.previousElementSibling.style.display = 'none';
          globalThis.document.getElementById(`formNameFilebg_${id}`).value = '';
        }

        function deleteSubVideo(tvShowId, btn) {
          try {
            // console.log(btn);
            const videoIframe = document.querySelector(`#embed-sub-responsive_${tvShowId}`);
            const uploadButton = btn.previousElementSibling;
            const videoUploader = document.querySelector(`#video-sub-uploader_${tvShowId}`);

            const iframeElement = document.getElementById(`image_sub_${tvShowId}`);
            const iUrl = iframeElement.textContent;

            // console.log(iframeElement, iUrl);

            if (iUrl === 'UPLOADED') {
              const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

              const baseUri = 'https://oneupload.to/';

              const fCode = document.getElementById(`file_Sub_Code_${tvShowId}`).value;

              // console.log(fCode, fCode.value);

              videoIframe.style.display = 'none';
              videoUploader.style.display = 'block';

              document.getElementById(`file_Sub_Code_${tvShowId}`).value = '';

              // console.log(uploadButton);
              uploadButton.disabled = false;

              const fileName = document.getElementById(`file_Sub_name_${tvShowId}`);
              fileName.textContent = 'No file chosen';

              submitButton.style.display = 'block';
            }
            else {
              // uploadButton.disabled = true;
              // btn.disabled = true;
              // submitButton.style.display = 'none';
              videoUploader.style.display = 'block';
              videoIframe.style.display = 'none';
            }
          }
          catch (error) {
            // Handle any errors that occur during data retrieval or video deletion
            console.error('Error:', error.message);
          }
        }

        function uploadSubVideo(tvShowId, btn) {
          submitButton.style.display = 'none';
          btn.disabled = true;

          // console.log(tvShowId);

          const videoIframe = document.querySelector(`#embed-sub-responsive_${tvShowId}`);
          const fileInput = document.querySelector(`#episode_Sub_File_${tvShowId}`);
          const videoUploader = document.querySelector(`#video-sub-uploader_${tvShowId}`);

          // console.log(videoIframe, fileInput, videoUploader);

          const iframeElement = document.getElementById(`image_sub_${tvShowId}`);
          const iUrl = iframeElement.textContent;

          // console.log(iframeElement, iUrl);

          const file = fileInput.files[0];
          // console.log(file);
          
          if (iUrl !== 'UPLOADED') {
            videoIframe.style.display = 'none';
            videoUploader.style.display = 'block';
          }            

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
              // console.log(isSubtitle);
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

          const formdata = new FormData();
          formdata.append("subtitle", file);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          fetch("https://feflix.tech/feflix_api/upload_subtitle.php",requestOptions)
            .then(response => response.json())
            .then(async (result) => {
              //console.log(result);

              let status = result.isSuccess;
              //console.log(status);

              if(status == true) {
                const filecode = result.subFile;
                //console.log(filecode);

                fCode.value = filecode;

                spinner.style.display = 'none';

                if(filecode) {
                  videoUploader.style.display = 'none';
                  videoIframe.style.display = 'block';
                  // Get a reference to the <iframe> element inside the <div>
                  iframeElement.textContent = 'UPLOADED';

                  submitButton.style.display = 'block';
                  spinner.style.display = 'none';

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
                submitButton.style.display = 'block';

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
                submitButton.style.display = 'block';

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
                submitButton.style.display = 'block';

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

        function uploadVideo(tvShowId, btn) {
          submitButton.style.display = 'none';
          btn.disabled = true;

          // console.log(tvShowId, 'editing');

          const videoIframe = document.querySelector(`#embed-responsive_${tvShowId}`);
          const fileInput = document.querySelector(`#movieFile_${tvShowId}`);
          const videoUploader = document.querySelector(`#video-uploader_${tvShowId}`);

          // console.log(videoIframe);
          const iframeElement = document.getElementById(`image_${tvShowId}`);
          const iUrl = iframeElement.textContent;

          // console.log(iframeElement, iUrl);

          const file = fileInput.files[0];
          // console.log(file);
          
          if (iUrl !== 'UPLOADED') {
            videoIframe.style.display = 'none';
            videoUploader.style.display = 'block';
          }

          // videoIframe.style.display = "none"; 
           
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

                      document.getElementById(`fileCode_${tvShowId}`).value = filecode;

                      if(filecode) {
                        videoUploader.style.display = 'none';
                        videoIframe.style.display = 'block';
                        // Get a reference to the <iframe> element inside the <div>
                        iframeElement.textContent = 'UPLOADED';

                        submitButton.style.display = 'block';
                        spinner.style.display = 'none';

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
        
        function deleteVideo(tvShowId, btn) {
          try {
            // console.log(btn, tvShowId);
            // console.log(btn.parentElement.previousElementSibling.previousElementSibling);

            const videoIframe = document.querySelector(`#embed-responsive_${tvShowId}`);
            const uploadButton = btn.previousElementSibling;
            const videoUploader = document.querySelector(`#video-uploader_${tvShowId}`);

            const iframeElement = document.getElementById(`image_${tvShowId}`);
            const iUrl = iframeElement.textContent;

            // console.log(btn.parentElement.nextElementSibling);

            // console.log(iframeElement, iUrl);

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

            const baseUri = 'https://oneupload.to/';

            if (iUrl === 'UPLOADED') {
              const fCode = document.getElementById(`fileCode_${tvShowId}`).value;

              // console.log(fCode);

              const requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };

              fetch(`${proxyUrl}${baseUri}api/file/delete?key=617ujm5brrei3rqdhdm&file_code=${fCode}`, requestOptions)
                .then(response => response.json())
                .then(async (result) => {
                  // console.log(result);

                  const status = await result.status;

                  if (status == '200') {
                    videoIframe.style.display = 'none';
                    videoUploader.style.display = 'block';

                    document.getElementById(`fileCode_${tvShowId}`).value = '';

                    // console.log(uploadButton);
                    uploadButton.disabled = false;

                    const fileName = document.getElementById(`file_name_${tvShowId}`);
                    fileName.textContent = 'No file chosen';

                    submitButton.style.display = 'block';
                  }

                  else {
                    alert(`Unable to delete ${file.name}.`);
                    videoUploader.style.display = 'none';
                    videoIframe.style.display = 'block';
                  }
                })
                .catch(error => console.log('error', error));
            }

            else {
              // uploadButton.disabled = true;
              // btn.disabled = true;
              // submitButton.style.display = 'none';
              videoUploader.style.display = 'block';
              videoIframe.style.display = 'none';
            }
          }
          catch (error) {
            // Handle any errors that occur during data retrieval or video deletion
            console.error('Error:', error.message);
          }
        }
    }
}
