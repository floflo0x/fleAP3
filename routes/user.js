const express = require('express');

const { body, validationResult } = require("express-validator");

const request = require("request");

const router = express.Router();

const isAuth = require('../middleware/is_auth');

const baseUrl = "https://feflix.tech/feflix_api/";

let selectFunction = (item) => {
  let options = {
    method: "POST",
    url: baseUrl + "select.php",
    formData: {
      select_query: item,
    },
  };
  return options;
};

let insertFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl + "insert.php",
    formData: {
      insert_query: item,
      select_query: item2,
    },
  };
  return options;
};

let updateFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl + "update.php",
    formData: {
      update_query: item,
      select_query: item2,
    },
  };
  return options;
}

let deleteFunction = (item, item2) => {
	let options = {
	    method: "POST",
	    url: baseUrl + "delete.php",
	    formData: {
	      delete_query: item,
	      select_query: item2,
	    },
  	};
  	return options;
};

router.get("/home", isAuth, async (req, res, next) => {
	let opt1 = selectFunction("select * from videos_info");

	request(opt1, (error, response) => {
		if (error) throw new Error(error);
  	else {
  		// console.log(response.body);
  		let x = JSON.parse(response.body);

  		// console.log(x);

  		return res.render("home", {
				title1: 'Home',
				vidData: x
			})
  	}
	})
})

router.get("/add", isAuth, async (req, res, next) => {
	try {
		let message = req.flash('error');
		// console.log(message);

		if (message.length > 0) {
			message = message;
		}
		else {
			message = null;
		}

		let opt1 = selectFunction("select * from languages");

		request(opt1, function (error, response) {
		  	if (error) throw new Error(error);
		  	else {
		  		let x = JSON.parse(response.body);

		  		let opt2 = selectFunction("SELECT * FROM genre");

		  		request(opt2, function (error, response) {
		  			if (error) throw new Error(error);
		  			else {
		  				let y = JSON.parse(response.body);

		  				// console.log(y);

		  				return res.render("formAdd", {
								title1: 'Add Video',
								editing: false,
								errorMessage: message,
		            dataArray: [],
		            season: '',
		            sid: '',
		            title: '',
		            type: '',
								langArray: x,
								genre: y,
								selGen: [],
								oldInput: {
									title: '',
									description: '',
									cast: '',
									creator: '',
									release_date: '',
									movie_type: '',
									genre_type: '',
									logo: '',
									age: '',
									poster_img: '',
									bg_img: '',
									fileCode: '',
									file_Sub_Code: ''
								}
							})
		  			}
		  		})
		  	}
		})
	}
	catch(error) {
		return res.redirect("/v1/home");
	}
})

router.post("/upload", isAuth,
	[
		body('lang').trim().notEmpty().withMessage('Language is required.'),
	  body('selectedMediaType').trim().notEmpty().withMessage('Selected media type is required.'),
	  body('title').trim().notEmpty().withMessage('Name is required.'),
	  body("description").trim().notEmpty().withMessage("Description is required"),
	  body("cast").trim().notEmpty().withMessage("Cast is required"),
	  body("creator").trim().notEmpty().withMessage("Creator is required"),
	  body("release_date").trim().notEmpty().withMessage("Release date is required"),
	  body("movie_type").trim().notEmpty().withMessage("Movie type is required"),
	  body("genre").trim().notEmpty().withMessage("Genre is required"),
	  body("logo").trim().notEmpty().withMessage("Logo is required"),
	  body('age').trim().notEmpty().isNumeric().withMessage('Age must be a number.'),
	  body('movie_type').notEmpty()
	  	.isIn(['movie', 'collection', 'series']).withMessage('Movie type must be either "movie", "collection", or "series".'),
	  body('poster_img').trim().notEmpty().withMessage('Poster image is required.'),
	  body("bg_img").trim().notEmpty().withMessage("Background image is required"),
	],
	async (req, res, next) => {
		// console.log(req.body);

		try {
			const {lang, selectedMediaType, title, description, cast, creator, age, 
			release_date, movie_type, genre, logo, poster_img, bg_img} = req.body;

			const {movieId, fileCode, selectedMovieName, seasonNumber, file_Sub_Code} = req.body;

			let dateComponents = release_date.split('-');

			// Rearrange the components to form the new date format
			let newDateFormat = `${dateComponents[2]}/${dateComponents[1]}/${dateComponents[0]}`;

			// console.log(newDateFormat);

			const error = validationResult(req);

      if (!error.isEmpty()) {
				// console.log(error.array());
				let msg1 = error.array()[0].msg;
				// console.log(msg1);

				// let opt10 = selectFunction("select * from languages");

				// request(opt10, (error, response) => {
			  // 	if (error) throw new Error(error);
			  // 	else {
			  // 		// console.log(response.body);
			  // 		let x = JSON.parse(response.body);

		  	// 		let opt11 = selectFunction("SELECT * FROM genre");

		  	// 		request(opt11, (error, response) => {
				// 	  	if (error) throw new Error(error);
				// 	  	else {
				// 	  		// console.log(response.body);
				// 	  		let y = JSON.parse(response.body);

				// 	  		return res.render("add", {
				// 					title1: 'Add Video',
				// 					editing: false,
				// 					errorMessage: '',
				// 		      dataArray: [],
				// 		      season: '',
				// 		      sid: '',
				// 		      title: title,
				// 		      type: '',
				// 					langArray: x,
				// 					genre: y,
				// 					selGen: [],
				// 					oldInput: {
				// 						title: title,
				// 						description: description,
				// 						cast: cast,
				// 						creator: creator,
				// 						release_date: release_date,
				// 						movie_type: movie_type,
				// 						genre: genre,
				// 						logo: logo,
				// 						age: age,
				// 						poster_img: poster_img,
				// 						bg_img: bg_img,
				// 					}
				// 				})
				// 	  	}
				// 	  })
			  // 	}
			  // })

				req.flash('error', msg1);

				return res.redirect("/v1/add");
			}

			else {
				if (selectedMediaType === 'tv') {
					return res.redirect("/v1/home");
				}

				else if (selectedMediaType === 'movie') {
					const movieName = req.body.movieName;

					if (typeof movieId === 'object' && typeof movieName === 'object') {
						return res.redirect("/v1/home");
					}

					else {
						let opt1 = {
						  'method': 'POST',
						  'url': baseUrl + 'insert/uploadVideoData.php',
						  'headers': {
						    'Content-Type': 'application/json'
						  },
					  	body: JSON.stringify({
						    "name": title,
							  "posterImg": poster_img,
							  "bgImg": bg_img,
							  "logo": logo,
							  "release_date": newDateFormat,
							  "description": description,
							  "cast": cast,
							  "creator": creator,
							  "type": movie_type,
							  "age_category": age,
							  "genres": genre	  
							})
						}

						request(opt1, function (error, response) {
						  if (error) throw new Error(error);
						  else {
						  	// console.log(response.body);
						  	let x = JSON.parse(response.body);
						  	// console.log(x);

						  	if (x[0].id) {
						  		let opt2 = {
									  'method': 'POST',
									  'url': baseUrl + 'insert/uploadVideo.php',
									  'headers': {
									  },
									  formData: {
									    'videoId': x[0].id,
									    'link': fileCode
									  }
									};
									request(opt2, function (error, response) {
									  if (error) throw new Error(error);
									  else {
									  	// console.log(response.body);
									  }
									});

									let opt3 = {
									  'method': 'POST',
									  'url': baseUrl + 'insert/uploadSub.php',
									  'headers': {
									  },
									  formData: {
									    'videoId': x[0].id,
									    'link': file_Sub_Code,
									    'lang': lang
									  }
									};
									request(opt3, function (error, response) {
									  if (error) throw new Error(error);
									  else {
									  	// console.log(response.body);
									  }
									});

									let opt4 = insertFunction(
										"insert into video_genres (video_id, genre_id) VALUES ("
										.concat(`\'${x[0].id}\', '${genre}\'`)
										.concat(")"),
										"select * from video_genres"
									);

									request(opt4, function (error, response) {
									  if (error) throw new Error(error);
									  else {
									  	// console.log(response.body);
									  }
									});

									return res.redirect("/v1/home");
				  			}

						  	else {
						  		return res.redirect("/v1/home");
						  	}
						  	// return res.send("uploaded....");
						  }
						});
					}
				}
			}
		}

		catch(error) {
			console.log(error);
			return res.redirect("/v1/add");
		}
	}
)

router.get("/edit/:id", isAuth, async (req, res, next) => {
	try {
		const { id } = req.params;
		// const { lang } = req.query;

		let message = req.flash('error');
		// console.log(message);

		if (message.length > 0) {
			message = message;
		}
		else {
			message = null;
		}

		let opt1 = selectFunction("select * from videos_info where id = " + id);

		request(opt1, (error, response) => {
		  if (error) throw new Error(error);
		  else {
		  	// console.log(response.body);
		  	let x = JSON.parse(response.body);

		  	// console.log(x);

		  	let opt2 = selectFunction("select * from video_play where video_id = " + id);

		  	request(opt2, (error, response) => {
				  if (error) throw new Error(error);
				  else {
				  	// console.log(response.body);
				  	let y = JSON.parse(response.body);

				  	// console.log(y);

		  			let opt3 = selectFunction("select * from subtitle where video_id = " + id);

		  			request(opt3, (error, response) => {
						  if (error) throw new Error(error);
						  else {
						  	// console.log(response.body);
						  	let z = JSON.parse(response.body);

						  	// console.log(z);

						  	const lang = z[0].lang;

								const langArray = [{ lang: `${lang}`, name: lang === 'en' ? 'English' : 'Brazil' }];

								let opt4 = selectFunction("SELECT genre_id FROM video_genres WHERE video_id = " + id + " ORDER BY genre_id");

								request(opt4, (error, response) => {
								  if (error) throw new Error(error);
								  else {
								  	// console.log(response.body);
								  	let k = JSON.parse(response.body);

								  	// console.log(k);

								  	let genreIds = k.map(item => item.genre_id);

								  	// console.log(genreIds);

								  	let dateComponents = x[0].release_date.split('/');

								  	// console.log(dateComponents);
										let newDateFormat = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;
										// console.log(newDateFormat);

								  	// const urlArray = [{
							    	// 	id: x[0].id,
							    	// 	name: x[0].name,
							  		// 	posterImg: x[0].poster_image,
							  		// 	bgImg: x[0].bg_image,
							  		// 	logo: x[0].logo,
							  		// 	release_date: newDateFormat,
							  		// 	description: x[0].description,
							  		// 	cast: x[0].cast,
							  		// 	creator: x[0].creator,
							  		// 	type: x[0].type,
							  		// 	age_category: x[0].age_category,
										// 	fileCode: y[0].link,
										// 	file_Sub_Code: z[0].link,
							    	// }];

		  							let opt5 = selectFunction("SELECT * FROM genre");

		  							request(opt5, (error, response) => {
										  if (error) throw new Error(error);
										  else {
										  	// console.log(response.body);
										  	let m = JSON.parse(response.body);
										  	// console.log(m);

										  	// return res.redirect("/v1/home");

				  							return res.render("formAdd", {
				  								title1: 'Edit Video',
													editing: true,
													errorMessage: message,
													season: '',
													sid: x[0].id,
													title: x[0].name,
													type: 'movie',
													langArray: langArray,
													genre: m,
							  					selGen: genreIds,
							  					oldInput: {
										    		id: x[0].id,
										    		title: x[0].name,
										  			poster_img: x[0].poster_image,
										  			bg_img: x[0].bg_image,
										  			logo: x[0].logo,
										  			release_date: newDateFormat,
										  			description: x[0].description,
										  			cast: x[0].cast,
										  			creator: x[0].creator,
										  			movie_type: x[0].type,
										  			age: x[0].age_category,
														fileCode: y[0].link,
														file_Sub_Code: z[0].link,
														genre_type: ''
										    	}
												});
										  }
										})
								  }
								})
		  				}
		  			})
		  		}
		  	})
		  }
		})
	}
	catch(error) {
		console.log(error);
		return res.redirect("/v1/home");
	}
})

router.post("/edit/:id", isAuth,
	[
		body('lang').trim().notEmpty().withMessage('Language is required.'),
	  body('selectedMediaType').trim().notEmpty().withMessage('Selected media type is required.'),
	  body('title').trim().notEmpty().withMessage('Name is required.'),
	  body("description").trim().notEmpty().withMessage("Description is required"),
	  body("cast").trim().notEmpty().withMessage("Cast is required"),
	  body("creator").trim().notEmpty().withMessage("Creator is required"),
	  body("release_date").trim().notEmpty().withMessage("Release date is required"),
	  body("movie_type").trim().notEmpty().withMessage("Movie type is required"),
	  body("genre").trim().notEmpty().withMessage("Genre is required"),
	  body("logo").trim().notEmpty().withMessage("Logo is required"),
	  body('age').trim().notEmpty().isNumeric().withMessage('Age must be a number.'),
	  body('movie_type').trim().notEmpty()
	  	.isIn(['movie', 'collection', 'series']).withMessage('Movie type must be either "movie", "collection", or "series".'),
	  body('poster_img').trim().notEmpty().withMessage('Poster image is required.'),
	  body("bg_img").trim().notEmpty().withMessage("Background image is required"),
	], 
	async (req, res, next) => {
		// console.log(req.body);
		const { id } = req.params;

		try {
			const {lang, selectedMediaType, title, description, cast, creator, age, 
				release_date, movie_type, genre, logo, poster_img, bg_img} = req.body;

			const {movieId, fileCode, selectedMovieName, seasonNumber, file_Sub_Code} = req.body;

			let dateComponents = release_date.split('-');

			// Rearrange the components to form the new date format
			let newDateFormat = `${dateComponents[2]}/${dateComponents[1]}/${dateComponents[0]}`;

			// console.log(newDateFormat);

			const error = validationResult(req);

	    if (!error.isEmpty()) {
				// console.log(error.array());
				let msg1 = error.array()[0].msg;
				// console.log(msg1);

				req.flash('error', msg1);
				return res.redirect(`/v1/edit/${id}`);
			}

			else {
				if (selectedMediaType === 'tv') {
					return res.redirect("/v1/home");
				}

				else if (selectedMediaType === 'movie') {
					const movieName = req.body.movieName;

					if (typeof fileCode === 'object' && typeof file_Sub_Code === 'object') {
						return res.redirect("/v1/home");
					}

					else {
						let opt1 = {
						  'method': 'POST',
						  'url': baseUrl + 'update/videoInfo.php',
						  'headers': {
						    'Content-Type': 'application/json'
						  },
					  	body: JSON.stringify({
					  		"id": id,
						    "name": title,
							  "posterImg": poster_img,
							  "bgImg": bg_img,
							  "logo": logo,
							  "release_date": newDateFormat,
							  "description": description,
							  "cast": cast,
							  "creator": creator,
							  "type": movie_type,
							  "age_category": age,
							  "genres": genre	  
							})
						}

						request(opt1, function (error, response) {
						  if (error) throw new Error(error);
						  else {
						  	// console.log(response.body);
						  	// let x = JSON.parse(response.body);

						  	// console.log(x);
						  }
						});

						let opt2 = updateFunction(
						 	"update video_play set link = '"
						 		.concat(`${fileCode}`)
						 		.concat("' where video_id = '")
						 		.concat(`${id}`)
						 		.concat("'"),
						 	"select * from video_play where id = '"
						 		.concat(`${id}`)
						 		.concat("'")
						)

						request(opt2, (error, response) => {
              if (error) throw new Error(error);
              else {
                let x = JSON.parse(response.body);

                // console.log(x);
              }
            })

						if (typeof genre === 'object') {
	            genre.forEach(i => {
	            	let opt3 = updateFunction(
		            	"update video_genres set genre_id = '"
		            		.concat(`${i}`)
		            		.concat("' where video_id = '")
		            		.concat(`${id}`)
		            		.concat("'"),
		            	"select * from video_genres where video_id = '"
		            		.concat(`${id}`)
		            		.concat("'")
		            )

		            request(opt3, (error, response) => {
	                if (error) throw new Error(error);
	                else {
	                  let x = JSON.parse(response.body);

	                  // console.log(x);
	                }
	              })
	            })
	          }

	          else {
		          let opt5 = updateFunction(
			          "update video_genres set genre_id = '"
			          	.concat(`${genre}`)
			          	.concat("' where video_id = '")
			          	.concat(`${id}`)
			          	.concat("'"),
			          "select * from video_genres where video_id = '"
			          	.concat(`${id}`)
			          	.concat("'")
			        )

			        request(opt5, (error, response) => {
		            if (error) throw new Error(error);
		            else {
		              let x = JSON.parse(response.body);

		              // console.log(x);
		            }
		          })
			      }


	          let opt4 = updateFunction(
	          	"update subtitle set link = '"
	          		.concat(`${file_Sub_Code}`)
	          		.concat("', lang = '")
	          		.concat(`${lang}`)
	          		.concat("' where video_id = '")
	          		.concat(`${id}`)
	          		.concat("'"),
	          	"select * from subtitle where video_id = '"
	          		.concat(`${id}`)
	          		.concat("'")
	          )

	          request(opt4, (error, response) => {
              if (error) throw new Error(error);
              else {
                let x = JSON.parse(response.body);

                // console.log(x);
              }
            })

						return res.redirect("/v1/home");
					}
				}
			}
		}

		catch(error) {
			console.log(error);
			return res.redirect("/v1/home");
		}
	}
)

router.get("/search", isAuth, async (req, res, next) => {
	try {
		const { q } = req.query;

		// console.log(q);

		const options = {
		  'method': 'POST',
		  'url': baseUrl + 'search/searchVideo.php',
		  'headers': {
		  },
		  formData: {
		    's': q
		  }
		};

		request(options, function (error, response) {
		  if (error) throw new Error(error);
		  else {
		  	// console.log(response.body);
		  	let x = JSON.parse(response.body);

		  	// console.log(x);
		  	
		  	return res.render("home", {
					title1: 'Home',
					vidData: x
				})
		  }
		});
	}

	catch(error) {
		console.log(error);
		return res.redirect("/v1/home");
	}
})

router.get("/slider", isAuth, async (req, res, next) => {
	try {
		let message = req.flash('error');
		// console.log(message);

		if (message.length > 0) {
			message = message;
		}
		else {
			message = null;
		}

		const options = {
		  'method': 'GET',
		  'url': baseUrl + 'getSlider.php',
		  'headers': {
		  }
		};

		request(options, function (error, response) {
		  if (error) throw new Error(error);
		  else {
		  	// console.log(response.body);

		  	let x = JSON.parse(response.body);

		  	// console.log(x);

		  	const opt1 = selectFunction("select * from videos_info");

		  	request(opt1, function (error, response) {
				  if (error) throw new Error(error);
				  else { 
				  	// console.log(response.body);

				  	let y = JSON.parse(response.body);

				  	// console.log(y);

				  	if (x !== null) {
				  		const data1 = y.filter(item => !x.some(xItem => xItem.id === item.id));

					  	// console.log(data1);

					  	return res.render("slider", {
								title1: 'Slider',
								errorMessage: message,
								data: x,
								vInfo: data1
							})
					  }

					  else {
					  	return res.render("slider", {
								title1: 'Slider',
								errorMessage: message,
								data: [],
								vInfo: y
							})
					  }
				  }
				})
		  }
		});
	}

	catch(error) {
		console.log(error);
		return res.redirect("/v1/home");
	}
})

router.post("/delete/:id", isAuth, async (req, res, next) => {
	try {
		const { dd } = req.body;

		// console.log(dd);

		const options = {
		  'method': 'POST',
		  'url': baseUrl + 'delete/slider.php',
		  'headers': {
		  },
		  formData: {
		    'videoId': dd
		  }
		};

		request(options, function (error, response) {
		  if (error) throw new Error(error);
		  else { 
		  	// console.log(response.body);

		  	return res.redirect("/v1/slider");
		  }
		});
	}

	catch(error) {
		console.log(error);
		return res.redirect("/v1/slider");
	}
})

router.get("/updateS/:id", isAuth, async (req, res, next) => {
	try {
		const { id } = req.params;
		// console.log(id);

		const options = {
		  'method': 'POST',
		  'url': baseUrl + 'insert/slider.php',
		  'headers': {
		  },
		  formData: {
		    'videoId': id
		  }
		};

		request(options, function (error, response) {
		  if (error) throw new Error(error);
		  else { 
		  	// console.log(response.body);

		  	return res.redirect("/v1/slider");
		  }
		});
	}

	catch(error) {
		console.log(error);
		return res.redirect("/v1/slider");
	}
})

router.get("/editSlider/:id", isAuth,
 	async (req, res, next) => {
		try {
			const { id } = req.params;

			// console.log(id);

			const error = validationResult(req);

      if (!error.isEmpty()) {
				// console.log(error.array());
				let msg1 = error.array()[0].msg;

				req.flash('error', msg1);

				return res.redirect("/v1/slider");
			}

			else {
				return res.render("mSearch", {
					title1: 'Search',
					vidData: [],
					mid: id
				});
			}
		}

		catch(error) {
			console.log(error);
			return res.redirect("/v1/slider");
		}
	}
)

router.get("/msearch/:id", isAuth, async (req, res, next) => {
	try {
		const { q } = req.query;
		const { id } = req.params;

		// console.log(q, id);

		const options = {
		  'method': 'POST',
		  'url': baseUrl + 'search/searchVideo.php',
		  'headers': {
		  },
		  formData: {
		    's': q
		  }
		};

		request(options, function (error, response) {
		  if (error) throw new Error(error);
		  else {
		  	// console.log(response.body);
		  	let x = JSON.parse(response.body);

		  	// console.log(x);
		  	
		  	return res.render("mSearch", {
					title1: 'Search',
					vidData: x,
					mid: id
				})
		  }
		});
	}

	catch(error) {
		console.log(error);
		return res.redirect("/v1/home");
	}
})

router.post("/slider", isAuth, async (req, res, next) => {
	try {
		// console.log(req.body);

		const { prevID, newID } = req.body;

		let opt1 = selectFunction("select * from videos_info where id = " + newID);

		request(opt1, function (error, response) {
		 	if (error) throw new Error(error);
		 	else {
				// console.log(response.body);

				let x = JSON.parse(response.body);

				// console.log(x, x.length >= 1, x === '', newId, pevID);

				if (x.length >= 1) {
				 	const opt2 = {
					  'method': 'POST',
					  'url': baseUrl + 'update/slider.php',
					  'headers': {
					  },
					  formData: {
					    'new_videoId': newID,
					    'prev_videoId': prevID
					  }
					};

					request(opt2, function (error, response) {
					  if (error) throw new Error(error);
					  else {
					  	// console.log(response.body);
							return res.redirect("/v1/slider");
					  }
					});
				}

				else {
					req.flash('error', 'Invalid Slider ID');

					return res.redirect("/v1/slider");
				}
			}
		})
	}

	catch(error) {
		console.log(error);
		return res.redirect("/v1/slider");
	}
})

router.post("/upload1", isAuth,
	[
		body('lang').trim().notEmpty().withMessage('Language is required.'),
	  body('title').trim().notEmpty().withMessage('Name is required.'),
	  body("description").trim().notEmpty().withMessage("Description is required"),
	  body("cast").trim().notEmpty().withMessage("Cast is required"),
	  body("creator").trim().notEmpty().withMessage("Creator is required"),
	  body("release_date").trim().notEmpty().withMessage("Release date is required"),
	  body("movie_type").trim().notEmpty().withMessage("Movie type is required"),
	  body("genre").trim().notEmpty().withMessage("Genre is required"),
	  body("logo").trim().notEmpty().withMessage("Logo is required"),
	  body('age').trim().notEmpty().isNumeric().withMessage('Age must be a number.'),
	  body('movie_type').notEmpty()
	  	.isIn(['movie', 'collection', 'series']).withMessage('Movie type must be either "movie", "collection", or "series".'),
	  body('poster_img').trim().notEmpty().withMessage('Poster image is required.'),
	  body("bg_img").trim().notEmpty().withMessage("Background image is required"),
	],
 	async (req, res, next) => {
		try {
			// console.log(req.body.genre);

			const {lang, title, description, cast, creator, age, 
			release_date, movie_type, genre, logo, poster_img, bg_img} = req.body;

			const {fileCode, file_Sub_Code} = req.body;

			let dateComponents = release_date.split('-');

			// Rearrange the components to form the new date format
			let newDateFormat = `${dateComponents[2]}/${dateComponents[1]}/${dateComponents[0]}`;

			// console.log(newDateFormat);

			const error = validationResult(req);

			if (!error.isEmpty()) {
				// console.log(error.array());
				let msg1 = error.array()[0].msg;
				// console.log(msg1);

				let opt10 = selectFunction("select * from languages");

				request(opt10, (error, response) => {
			  	if (error) throw new Error(error);
			  	else {
			  		// console.log(response.body);
			  		let x = JSON.parse(response.body);

		  			let opt11 = selectFunction("SELECT * FROM genre");

		  			request(opt11, (error, response) => {
					  	if (error) throw new Error(error);
					  	else {
					  		// console.log(response.body);
					  		let y = JSON.parse(response.body);

					  		return res.render("formAdd", {
									title1: 'Add Video',
									editing: false,
									errorMessage: '',
						      dataArray: [],
						      season: '',
						      sid: '',
						      title: title,
						      type: '',
									langArray: x,
									genre: y,
									selGen: genre,
									oldInput: {
										title: title,
										description: description,
										cast: cast,
										creator: creator,
										release_date: release_date,
										movie_type: movie_type,
										genre_type: '',
										logo: logo,
										age: age,
										poster_img: poster_img,
										bg_img: bg_img,
										fileCode: fileCode,
										file_Sub_Code: file_Sub_Code
									}
								})
					  	}
					  })
			  	}
			  })
			}

			else {
				let opt1 = {
					'method': 'POST',
					'url': baseUrl + 'insert/uploadVideoData.php',
					'headers': {
					  'Content-Type': 'application/json'
					},
					body: JSON.stringify({
					  "name": title,
					  "posterImg": poster_img,
					  "bgImg": bg_img,
					  "logo": logo,
					  "release_date": newDateFormat,
					  "description": description,
					  "cast": cast,
					  "creator": creator,
					  "type": movie_type,
					  "age_category": age,
					  "genres": genre	  
					})
				}

				request(opt1, function (error, response) {
					if (error) throw new Error(error);
					else {
						// console.log(response.body);
						let x = JSON.parse(response.body);
						// console.log(x);

						if (x[0].id) {
						  let opt2 = {
								'method': 'POST',
								'url': baseUrl + 'insert/uploadVideo.php',
								'headers': {
								},
								formData: {
								  'videoId': x[0].id,
								  'link': fileCode
								}
							};
							request(opt2, function (error, response) {
								if (error) throw new Error(error);
								else {
									// console.log(response.body);
								}
							});

							let opt3 = {
								'method': 'POST',
								'url': baseUrl + 'insert/uploadSub.php',
								'headers': {
								},
								formData: {
								  'videoId': x[0].id,
								  'link': file_Sub_Code,
								  'lang': lang
								}
							};
							request(opt3, function (error, response) {
								if (error) throw new Error(error);
								else {
									// console.log(response.body);
								}
							});

							let opt4 = insertFunction(
								"insert into video_genres (video_id, genre_id) VALUES ("
									.concat(`\'${x[0].id}\', '${genre}\'`)
									.concat(")"),
								"select * from video_genres"
							);

							request(opt4, function (error, response) {
								if (error) throw new Error(error);
								else {
									// console.log(response.body);
								}
							});

							return res.redirect("/v1/home");
				  	}

						else {
							return res.redirect("/v1/home");
						}
						// return res.send("uploaded....");
					}
				});
			}
		}

		catch(error) {
			console.log(error);
			return res.redirect("/v1/add");
		}
})

router.post("/edit1/:id", isAuth,
	[
		body('lang').trim().notEmpty().withMessage('Language is required.'),
	  body('title').trim().notEmpty().withMessage('Name is required.'),
	  body("description").trim().notEmpty().withMessage("Description is required"),
	  body("cast").trim().notEmpty().withMessage("Cast is required"),
	  body("creator").trim().notEmpty().withMessage("Creator is required"),
	  body("release_date").trim().notEmpty().withMessage("Release date is required"),
	  body("movie_type").trim().notEmpty().withMessage("Movie type is required"),
	  body("genre").trim().notEmpty().withMessage("Genre is required"),
	  body("logo").trim().notEmpty().withMessage("Logo is required"),
	  body('age').trim().notEmpty().isNumeric().withMessage('Age must be a number.'),
	  body('movie_type').trim().notEmpty()
	  	.isIn(['movie', 'collection', 'series']).withMessage('Movie type must be either "movie", "collection", or "series".'),
	  body('poster_img').trim().notEmpty().withMessage('Poster image is required.'),
	  body("bg_img").trim().notEmpty().withMessage("Background image is required"),
	], 
	async (req, res, next) => {
		// console.log(req.body);
		const { id } = req.params;

		try {
			const {lang, title, description, cast, creator, age, 
				release_date, movie_type, genre, logo, poster_img, bg_img} = req.body;

			const {fileCode, file_Sub_Code} = req.body;

			let dateComponents = release_date.split('-');

			// Rearrange the components to form the new date format
			let newDateFormat = `${dateComponents[2]}/${dateComponents[1]}/${dateComponents[0]}`;

			// console.log(newDateFormat);

			// console.log(typeof genre === 'object');

			const error = validationResult(req);

	    if (!error.isEmpty()) {
				// console.log(error.array());
				let msg1 = error.array()[0].msg;
				// console.log(msg1);

				let opt10 = selectFunction("select * from languages");

				request(opt10, (error, response) => {
			  	if (error) throw new Error(error);
			  	else {
			  		// console.log(response.body);
			  		let x = JSON.parse(response.body);

		  			let opt11 = selectFunction("SELECT * FROM genre");

		  			request(opt11, (error, response) => {
					  	if (error) throw new Error(error);
					  	else {
					  		// console.log(response.body);
					  		let y = JSON.parse(response.body);

					  		return res.render("formAdd", {
									title1: 'Edit Video',
									editing: true,
									errorMessage: msg1,
						      dataArray: [],
						      season: '',
						      sid: '',
						      title: title,
						      type: '',
									langArray: x,
									genre: y,
									selGen: genre,
									oldInput: {
										title: title,
										description: description,
										cast: cast,
										creator: creator,
										release_date: release_date,
										movie_type: movie_type,
										genre_type: '',
										logo: logo,
										age: age,
										poster_img: poster_img,
										bg_img: bg_img,
										fileCode: fileCode,
										file_Sub_Code: file_Sub_Code
									}
								})
					  	}
					  })
			  	}
			  })
			}

			else {
				let opt1 = {
					'method': 'POST',
					'url': baseUrl + 'update/videoInfo.php',
					'headers': {
					  'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"id": id,
					  "name": title,
					  "posterImg": poster_img,
					  "bgImg": bg_img,
					  "logo": logo,
					  "release_date": newDateFormat,
					  "description": description,
					  "cast": cast,
					  "creator": creator,
					  "type": movie_type,
					  "age_category": age,
					  "genres": genre	  
					})
				}

				request(opt1, function (error, response) {
					if (error) throw new Error(error);
					else {
						// console.log(response.body);
						// let x = JSON.parse(response.body);

						// console.log(x);
					}
				});

				let opt2 = updateFunction(
					"update video_play set link = '"
						.concat(`${fileCode}`)
						.concat("' where video_id = '")
						.concat(`${id}`)
						.concat("'"),
					"select * from video_play where id = '"
						.concat(`${id}`)
						.concat("'")
				)

				request(opt2, (error, response) => {
          if (error) throw new Error(error);
          else {
            let x = JSON.parse(response.body);

            // console.log(x);
          }
        })

				if (typeof genre === 'object') {
	        genre.forEach(async (i)=> {
	         	let opt3 = updateFunction(
		        	"update video_genres set genre_id = '"
		        		.concat(`${i}`)
		        		.concat("' where video_id = '")
		        		.concat(`${id}`)
		        		.concat("'"),
		        	"select * from video_genres where video_id = '"
		        		.concat(`${id}`)
		        		.concat("'")
		        )

		        request(opt3, async (error, response) => {
	            if (error) throw new Error(error);
	            else {
	              let x = await JSON.parse(response.body);

	              // console.log(x);
	            }
	          })
	        })
	      }

	      else {
		      let opt5 = updateFunction(
			      "update video_genres set genre_id = '"
			      	.concat(`${genre}`)
			      	.concat("' where video_id = '")
			      	.concat(`${id}`)
			      	.concat("'"),
			      "select * from video_genres where video_id = '"
			      	.concat(`${id}`)
			      	.concat("'")
			    )

			    request(opt5, (error, response) => {
		        if (error) throw new Error(error);
		        else {
		          let x = JSON.parse(response.body);

		          // console.log(x);
		        }
		      })
			  }

	      let opt4 = updateFunction(
	        "update subtitle set link = '"
	        	.concat(`${file_Sub_Code}`)
	        	.concat("', lang = '")
	        	.concat(`${lang}`)
	        	.concat("' where video_id = '")
	        	.concat(`${id}`)
	        	.concat("'"),
	        "select * from subtitle where video_id = '"
	        	.concat(`${id}`)
	        	.concat("'")
	      )

	      request(opt4, (error, response) => {
          if (error) throw new Error(error);
          else {
            let x = JSON.parse(response.body);

            // console.log(x);
          }
        })

				return res.redirect("/v1/home");
			}
		}

		catch(error) {
			console.log(error);
			return res.redirect("/v1/edit/<%= id %>");
		}
	}
)

router.post("/delete", isAuth, async (req, res, next) => {
	try {
		const { id } = req.body;

		let opt1 = selectFunction("select * from videos_info where id = " + id);

		request(opt1, async (error, response) => {
			if (error) throw new Error(error);
	  	else {
	  		// console.log(response.body);
	  		let x = JSON.parse(response.body);

	  		// console.log(x);

	  		if (x.length >= 1) {
	  			let opt2 = deleteFunction(
	  				"DELETE FROM videos_info WHERE id = " + id,
	  				""
	  			);

	  			request(opt2, (error, response) => {
						if (error) throw new Error(error);
				  	else {
				  		// console.log(response.body);
				  	}
				  })

				  let opt3 = deleteFunction(
				  	"DELETE FROM video_genres WHERE video_id = " + id,
				  	""
				  );

	  			request(opt3, (error, response) => {
						if (error) throw new Error(error);
				  	else {
				  		// console.log(response.body);
				  	}
				  })

				  let opt4 = deleteFunction(
				  	"DELETE FROM video_play WHERE video_id = " + id,
				  	""
				  );

	  			request(opt4, (error, response) => {
						if (error) throw new Error(error);
				  	else {
				  		// console.log(response.body);
				  	}
				  })

				  let opt5 = deleteFunction(
				  	"DELETE FROM subtitle WHERE video_id = " + id,
				  	""
				  );

	  			request(opt5, (error, response) => {
						if (error) throw new Error(error);
				  	else {
				  		// console.log(response.body);
				  	}
				  })

				  let opt6 = deleteFunction(
				  	"DELETE FROM slider WHERE video_id = " + id,
				  	""
				  );

	  			request(opt6, (error, response) => {
						if (error) throw new Error(error);
				  	else {
				  		// console.log(response.body);
				  	}
				  })

		  		return res.redirect("/v1/home");		  	}

		  	else {
		  		return res.redirect("/v1/home");
		  	}
	  	}
		})		
	}

	catch(error) {
		console.log(error);

		return res.redirect("/v1/home");;
	}
})

module.exports = router;