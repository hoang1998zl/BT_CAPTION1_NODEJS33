const successCode = (res, content, message) => {
  res.status(200).json({
    /* code: 0, */
    content,
    message,
  });
};
const failAuthenticationCode = (res, message) => {
  res.status(401).json({
    /* code: 1, */
    message,
  });
};
const failCode = (res, message) => {
  res.status(400).json({ /* code: 1, */ message });
};
const notFoundCode = (res, message) => {
  res.status(404).json({ /* code: 1, */ message });
};
const errorCode = (res, message) => {
  res.status(500).json({ /* code: 1, */ message });
};

module.exports = {
  successCode,
  failCode,
  errorCode,
  notFoundCode,
  failAuthenticationCode,
};
