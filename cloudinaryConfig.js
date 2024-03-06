const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnmvpsveh',
  api_key: '764354853669262',
  api_secret: 'sOZVDOeUMCHagy9WVbIse2JTexI',
  secure: true
});

module.exports = cloudinary;
