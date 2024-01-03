import multer from 'multer'; 

const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
       // const uniqueSuffix = Date.now() + '-'+Math.round(Math.random()*IE9)
        cb(null, file.originalname)
    }
})

export const upload = multer({storage: storage})