exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data, message });
};

exports.errorResponse = (res, message = 'Error', statusCode = 400, errors = []) => {
  return res.status(statusCode).json({ success: false, message, errors });
};
