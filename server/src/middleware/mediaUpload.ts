import multer from "multer";

const imageFilter = (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(null, false);
    }
    cb(null, true);
};

export const profilePicUpload  = multer({
    fileFilter: imageFilter
});