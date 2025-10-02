import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import APIFeatures from "../utils/api-features.js";

export function deleteOne(Model, field) {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`${field} Not Found for This id ${id}`, 404));
    }
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

export function getOne(Model, field) {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
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

    const countDocuments = await Model.countDocuments();
    const features = new APIFeatures(Model.find(filter), req.query, Model)
      .paginate(countDocuments)
      .filter()
      .search(modelName)
      .sort()
      .limitFields();

    // Execute query
    const { mongooseQuery, paginationResult } = features;
    const allDocuments = await mongooseQuery;
    res.status(200).json({
      status: "success",
      msg: `All ${field}`,
      results: allDocuments.length,
      paginationResult,
      data: allDocuments,
    });
  });
}
