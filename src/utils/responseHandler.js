const successResponseHandler = (statusCode, status, message, data, res) => {
  res.status(statusCode).send({
    status,
    message,
    data
  })
}

const errorResponseHandler = (statusCode, status, error, res) => {
  res.status(statusCode).send({
    status,
    error,
  })
}

module.exports = {
  successResponseHandler, errorResponseHandler
}