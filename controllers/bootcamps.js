
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = (req, res, next) => {
    res.json({ sucess: true, msg: `Show all bootcamps` });
}


// @desc Get Single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public
export const getBootcamp = (req, res, next) => {
    res.json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
}

// @desc Carete new bootcamp
// @route POST /api/v1/bootcamps
// @access Public
export const createBootcamps = (req, res, next) => {
    res.json({ sucess: true, msg: `Create new bootcamps` });
}


// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Public
export const updateBootcamps = (req, res, next) => {
    res.json({ sucess: true, msg: `Update bootcamp ${req.params.id}` });

}

// @desc Get all bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Public
export const deleteBootcamps = (req, res, next) => {
    res.json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });

}