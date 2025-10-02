import { parse } from "qs";

class APIFeatures {
  constructor(mongooseQuery, queryString, model) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.model = model;
    this.queryObjFinal = {};
  }

  //   Filtering
  filter() {
    const queryObj = parse(this.queryString);
    const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
    excludeFields.forEach((el) => delete queryObj[el]);
    // Advanced filter for price, rating
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.queryObjFinal = JSON.parse(queryStr);
    this.mongooseQuery = this.mongooseQuery.find(this.queryObjFinal);
    return this;
  }

  //   Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  //   Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let searchQuery = {};
      const keyword = this.queryString.keyword;
      if (modelName == "ProductModel") {
        searchQuery.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      } else {
        searchQuery = { name: { $regex: keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }

  // Pagination
  paginate(countDocuments) {
    const page = parseInt(this.queryString.page * 1) || 1;
    const limit = parseInt(this.queryString.limit * 1) || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
    };

    if (skip > 0) {
      pagination.hasPrevPage = true;
      pagination.prevPage = page - 1;
    }
    if (endIndex < countDocuments) {
      pagination.hasNextPage = true;
      pagination.nextPage = page + 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}

export default APIFeatures;
