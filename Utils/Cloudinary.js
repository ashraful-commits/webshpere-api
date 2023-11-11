const cloudinary =require("cloudinary")


cloudinary.v2.config({ 
  cloud_name: 'ds9mljkgj', 
  api_key: '681823761534747', 
  api_secret: '_Eb_2iPZ5soB8Bg7FRsVryaW7qc',
  secure:true
});

 const cloudUpload= async(req)=>{
   
    const data = await cloudinary.v2.uploader.upload(req.file.path);
 
   return data
} 
 const cloudUploads= async(path)=>{
   
    const data = await cloudinary.v2.uploader.upload(path,{ resource_type: "auto" });
 
   return data.secure_url
} 
 const cloudDelete= async(publicId)=>{
   
    const data = await cloudinary.v2.uploader.destroy(publicId);
 
   return data
} 
const cloudDownload = (publicId, fileFormat) => {
   try {
     const signedUrl = cloudinary.utils.private_download_url(publicId, fileFormat, {
       type: 'authenticated',
       secure: true,
     });
     return signedUrl;
   } catch (error) {
     console.error('Error generating signed download URL:', error.message);
     throw error;
   }
 };

module.exports ={
  cloudUploads,cloudDelete,cloudUpload,cloudDownload
}