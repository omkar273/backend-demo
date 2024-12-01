import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')  // specify the destination folder       
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }

})

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const limits = {
    fileSize: 1024 * 1024 * 5 // 5 MB
};

export const upload = multer({ storage, limits });

export const largeFileUpload = multer({ storage });

export const largeImageFileUpload = multer({ storage, fileFilter });

export const imageUpload = multer({ storage, fileFilter, limits });