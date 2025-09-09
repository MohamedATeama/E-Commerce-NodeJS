class Features {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    const queryStringObj = { ...this.queryString };
    const executedFields = ["page", "limit", "sort", "fields", "search"];
    executedFields.forEach((field) => {
      delete queryStringObj[field];
    });
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
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
    if (this.queryString.search) {
      let query = {};
      if (modelName === "category") {
        query = { name: new RegExp(this.queryString.search, "i") }
      } else if (modelName === "subcategory") {
        query = { name: new RegExp(this.queryString.search, "i") }
      } else if (modelName === "brand") {
        query = { name: new RegExp(this.queryString.search, "i") }
      } else if (modelName === "review") {
        query = { comment: new RegExp(this.queryString.search, "i") }
      } else if (modelName === "product") {
        query = {
          $or: [
            { title: new RegExp(this.queryString.search, "i") },
            { desc: new RegExp(this.queryString.search, "i") },
          ]
        }
      } else {
        query = { name: new RegExp(this.queryString.search, "i") };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
  pagination(documentsCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    if (page < 1) {
      page = 1;
    }
    if (limit < 1) {
      limit = 20;
    }
    if (limit > 100) {
      limit = 100;
    }
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {};
    pagination.currentPage = parseInt(page);
    pagination.limit = parseInt(limit);
    pagination.totalPages = Math.ceil(documentsCount / limit);
    if (endIndex < documentsCount) {
      pagination.next = Number(page) + 1;
    }
    if (skip > 0) {
      pagination.prev = Number(page) - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}
export default Features;
