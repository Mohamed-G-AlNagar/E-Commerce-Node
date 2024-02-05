class APIFeatures {
  constructor(queryDB, queryString) {
    // queryDB is all documents of the colections as query object.
    this.queryDB = queryDB;
    this.queryString = queryString;
  }

  //? 1A- prepaire the Query with normal filter ( .find(object))
  filter() {
    // spread the query object to new object to copy it to not effect the main query
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    // remove the exclucded keys ( reseved for other functions) from the query object
    excludeFields.forEach((exc) => delete queryObj[exc]);
    // if (queryObj.age) {
    //   queryObj.age = Number(queryObj.age);
    // }
    //? 1B-advanced filtering with lte, lt , gt. gte
    let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(lte|lt|gt|gte)\b/g, (match) => `$${match}`);
    queryStr = queryStr.replace(/\b(lte|lt|gt|gte)\b/g, (match) => `$${match}`);

    // use the query object as filtering object in the find method
    this.queryDB = this.queryDB.find(JSON.parse(queryStr));
    return this;
  }

  //? 2- Sorting
  sort() {
    if (this.queryString.sort) {
      // sort the query based on what come in sort field of the original query
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.queryDB = this.queryDB.sort(sortBy);
      // .sort(price ratingsAvergae)
    } else {
      this.queryDB = this.queryDB.sort("-createdAt");
    }
    return this;
  }

  //? 3- limit the outaput displayed fields ( parameters)
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.queryDB = this.queryDB.select(`${fields} __v`); // __v is to removed it as well from displaying
    } else {
      this.queryDB = this.queryDB.select("-__v"); // - negative before any key will exclude the field and show remaining fields
    }
    return this;
  }

  //? 4- penetration (limit the no. of results in pages and show by page number)
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;
    // apply skip and limit methods to the query
    this.queryDB = this.queryDB.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
