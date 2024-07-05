const express = require('express');

const { body, validationResult } = require("express-validator");

const request = require("request");

const router = express.Router();

const baseUrl2 = "https://feflix.tech/feflix_api/";

let loginFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl2 + "login.php",
    formData: {
      email: item,
      password: item2,
    },
  };
  return options;
};

let insertFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl2 + "insert.php",
    formData: {
      insert_query: item,
      select_query: item2,
    },
  };
  return options;
};

router.get("/", async (req, res, next) => {
	try {
		let message = req.flash('error');
		// console.log(message);

		if (message.length > 0) {
			message = message[0];
		}
		else {
			message = null;
		}
		return res.render("login", {
			title1: 'Login',
			errorMessage: message,
			oldInput: {
				email: ''
			}
		})
	}
	catch(error) {
		console.log(error);
		return res.redirect("/");
	}
})

router.post(
	"/login",
	[
	    body("email")
	      .trim()
	      .notEmpty()
	      .withMessage("Email Address required")
	      .normalizeEmail()
	      .isEmail()
	      .withMessage("Invalid email or password"),
	    body("password")
	      .trim()
	      .notEmpty()
	      .withMessage("Password required")
	      .isLength({ min: 8 })
	      .withMessage("Password must be 8 characters long")
	      .matches(/(?=.*?[A-Z])/)
	      .withMessage("Password must have at least one Uppercase")
	      .matches(/(?=.*?[a-z])/)
	      .withMessage("Password must have at least one Lowercase")
	      .matches(/(?=.*?[0-9])/)
	      .withMessage("Password must have at least one Number")
	      .matches(/(?=.*?[#?!@$%^&*-])/)
	      .withMessage("Password must have at least one special character")
	      .not()
	      .matches(/^$|\s+/)
	      .withMessage("White space not allowed")
  ], 
	async (req, res, next) => {
		// console.log(req.body);
		const { email, password } = req.body;

    	// console.log(req.session.lang);

    	try {

      	const error = validationResult(req);

	      if (!error.isEmpty()) {
					// console.log(error.array());
					let msg1 = error.array()[0].msg;

					// if (msg1 == 'Email Address required' && req.session.lang == 'fr') {
					// 	msg1 = "Adresse mail: (requis";
					// }
					// else if (msg1 == 'Invalid email or password' && req.session.lang == 'fr') {
					// 	msg1 = "email ou mot de passe invalide";
					// }
					// else if (msg1 == 'Password required' && req.session.lang == 'fr') {
					// 	msg1 = "Mot de passe requis";
					// }
					// else if (msg1 == 'Password must be 8 characters long' && req.session.lang == 'fr') {
					// 	msg1 = "Le mot de passe doit comporter 8 caractères";
					// }
					// else if (msg1 == 'Password must have at least one Uppercase' && req.session.lang == 'fr') {
					// 	msg1 = "Le mot de passe doit contenir au moins une majuscule";
					// }
					// else if (msg1 == 'Password must have at least one Lowercase' && req.session.lang == 'fr') {
					// 	msg1 = "Le mot de passe doit avoir au moins une minuscule";
					// }
					// else if (msg1 == 'Password must have at least one Number' && req.session.lang == 'fr') {
					// 	msg1 = "Le mot de passe doit avoir au moins un numéro";
					// }
					// else if (msg1 == 'Password must have at least one special character' && req.session.lang == 'fr') {
					// 	msg1 = "Le mot de passe doit contenir au moins un caractère spécial";
					// }
					// else if (msg1 == 'White space not allowed' && req.session.lang == 'fr') {
					// 	msg1 = "Espace blanc non autorisé";
					// }
					// else {
						msg1 = error.array()[0].msg;
					// }

					return res.render("login", 
				    { 
						title1: 'Login',
				      	errorMessage: msg1,
				      	oldInput: {
				      		email: email
				      	}
				    }
				  );
				}

			else {
				let opt1 = loginFunction(`${email}`, `${password}`);

		    request(opt1, async (error, response) => {
		      if (error) throw new Error(error);
		      else {
		        let x = JSON.parse(response.body);

		        // console.log(x, x.isSuccess);

		        if (x.isSuccess == false) {
		        	res.cookie("isLoggedIn", false);
							req.flash('error', 'Invalid email or password...');
		          return res.redirect("/v1/login");
		        }
		        else {
							let values2 = `\'en\', \'true\'`;

		        	res.cookie("isLoggedIn", true);

		        	let opt2 = insertFunction(
		        		"INSERT INTO aSession (lang, isLoggedIn) VALUES ("
		        			.concat(`${values2}`)
								  .concat(")"),
		        		"select * from aSession limit 10 offset 0"
		        	)

		        	request(opt2, async (error, response) => {
					      if (error) throw new Error(error);
					      else {
					        let y = JSON.parse(response.body);

		        			return res.redirect("/v1/home");
					      }
					    })
		        }
		      }
		    })
			}
		}

		catch(error) {
			console.log(error);
      return res.redirect("/");
		}
})

router.get("/logout", async (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.clearCookie('lang');
    res.clearCookie('isLoggedIn');
    return res.redirect("/");
  });
});

module.exports = router;