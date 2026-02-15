const advancedResults = (model, populate) => async (req, res, next) => {

    // Build query
    let query;

    // Copy req.query
    let reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete then from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create quert to string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, $lt, $lte, $in)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {

        query = query.sort('-createdAt');
    }

    /// Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);


    if (populate) {
        query = query.populate(populate);
    }

    // Executing query
    const result = await query;

    ///  Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.perv = {
            page: page - 1,
            limit
        }
    }
    res.advancedResults = {
        success: true,
        count: result.length,
        pagination,
        data: result
    }

    next();
};

export default advancedResults;