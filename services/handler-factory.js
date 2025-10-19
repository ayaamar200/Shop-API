import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import APIFeatures from "../utils/api-features.js";

export function deleteOne(Model, field) {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`${field} Not Found for This id ${id}`, 404));
    }
    await document.deleteOne();
    res.status(200).json({
      status: "success",
      msg: `${field} Deleted Successfully`,
    });
  });
}

export function updateOne(Model, field) {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError(`${field} Not Found for This id ${id}`, 404));
    }
    document.save();
    res.status(200).json({
      status: "success",
      msg: `${field} Updated Successfully`,
      data: document,
    });
  });
}

export function createOne(Model, field) {
  return asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      msg: `${field} Created Successfully`,
      data: newDocument,
    });
  });
}

export function getOne(Model, field, populateOpts) {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOpts) {
      query = query.populate(populateOpts);
    }

    const document = await query;
    if (!document) {
      return next(new ApiError(`${field} Not Found for This id ${id}`, 404));
    }
    res.status(200).json({
      status: "success",
      msg: `${field} Found`,
      data: document,
    });
  });
}

export function getAll(Model, field, modelName = "") {
  return asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .search(modelName);

    // Count documents after filtering and searching
    const countDocuments = await Model.countDocuments(
      features.queryFilter || filter
    );

    // Then apply paginate, sort, limitFields, etc.
    features.paginate(countDocuments).sort().limitFields();
    // Execute query
    const { mongooseQuery, metaData } = features;
    const allDocuments = await mongooseQuery;
    res.status(200).json({
      status: "success",
      msg: `All ${field}`,
      results: countDocuments,
      metaData,
      data: allDocuments,
    });
  });
}
