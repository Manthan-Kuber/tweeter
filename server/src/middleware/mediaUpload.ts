import multer from "multer";

const imageFilter = (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(null, false);
    }
    cb(null, true);
};

const tweetMediaFilter = (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mkv|mp4|mov|avi)$/)) {
        return cb(null, false);
    }
    cb(null, true);
};

export const imageUpload  = multer({
    fileFilter: imageFilter
});

export const tweetMediaUpload = multer({
    fileFilter: tweetMediaFilter
});