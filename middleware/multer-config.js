const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const processImage = async (req, res, next) => {
  if (!req.file) {
    return next(); 
  }

  try {
    const imagePath = path.join(__dirname, '../images');
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }

    const { buffer, originalname } = req.file;
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalname.split(' ').join('_').split('.')[0]}.webp`;

    
    await sharp(buffer)
      .webp({ quality: 80 }) 
      .toFile(path.join(imagePath, filename));

   
    req.file.filename = filename;
    req.file.path = `/images/${filename}`;

    next(); 
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'image :', error);
    res.status(500).json({ message: 'Erreur lors du traitement de l\'image.', error });
  }
};

module.exports = { upload, processImage };
