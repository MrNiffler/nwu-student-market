// configering the multer.js file which will play a huge role one uploading pictures
const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'), false);
  }
};

//We initializing multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit to minimize the risk of someone trying to upload a huge image file size
  },
  fileFilter: fileFilter
});

module.exports = upload;