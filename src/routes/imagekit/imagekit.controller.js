const ImageKit = require('imagekit');

const imagekitAuth = (req, res, next)=>{
    const imagekit = new ImageKit({
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY
    });

    var result = imagekit.getAuthenticationParameters();
    res.status(200).json({
      success: true,
      result,
    });
}

module.exports = { imagekitAuth }