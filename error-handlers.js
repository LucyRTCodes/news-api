exports.psqlError = (err, req, res, next) => {
	if (err.code) {
		if (err.code === "23503") {
			res.status(404).send({ msg: "Not found" });
		}
		res.status(400).send({ msg: "Bad request" });
	}

	next(err);
};

exports.customError = (err, req, res, next) => {
	if (err.msg && err.status) {
		res.status(err.status).send({ msg: err.msg });
	}
	next(err);
};

exports.serverError = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Internal server error" });
};
