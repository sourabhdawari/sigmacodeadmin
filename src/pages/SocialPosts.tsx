import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, set, push } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { app, db } from "../firebase";
import { homeClasses } from "./Home/homeClasses";
import Navbar from "../components/Header/Navbar";

const SocialPosts = () => {
  const [SocialPostss, setSocialPostss] = useState<{ [key: string]: string }>({});
  const [SocialPostsURLs, setSocialPostsURLs] = useState<{ [key: string]: string }>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const storage = getStorage(app);
  const database = getDatabase(app);

  const handleUpload = async (e:any) => {
    e.preventDefault()
    if (file && file.type === "image/jpeg") {
      setUploading(true);
  
      try {
        // Upload the image to Firebase Storage
        const storagePath = `SocialPostss/${file.name}`;
        const storageReference = storageRef(storage, storagePath);
        await uploadBytes(storageReference, file);
  
        // Update the SocialPostss in the Realtime Database
        const SocialPostssRef = ref(db, "SocialPostss");
        const newSocialPostsRef = push(SocialPostssRef);
        await set(newSocialPostsRef, file.name);
  
        setUploading(false);
        console.log("Image uploaded successfully!");
        alert("Uploaded");
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    const SocialPostssRef = ref(database, "SocialPostss");

    const SocialPostssListener = onValue(SocialPostssRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSocialPostss(data);
      }
    });

    return () => {
      off(SocialPostssRef, "value", SocialPostssListener);
    };
  }, [database]);

  useEffect(() => {
    const fetchSocialPostsURLs = async () => {
      const urls: { [key: string]: string } = {};

      for (const SocialPostsId in SocialPostss) {
        const SocialPostsFileName = SocialPostss[SocialPostsId];
        const storagePath = `SocialPostss/${SocialPostsFileName}`;
        const SocialPostsStorageRef = storageRef(storage, storagePath);

        try {
          const downloadURL = await getDownloadURL(SocialPostsStorageRef);
          urls[SocialPostsId] = downloadURL;
        } catch (error) {
          urls[SocialPostsId] = "https://example.com/alternate-image.jpg";
        }
      }

      setSocialPostsURLs(urls);
    };

    fetchSocialPostsURLs();
  }, [SocialPostss]);
  
  const handleDelete = async (SocialPostsId: string, SocialPostsFileName: string) => {
    try {
      const storagePath = `SocialPostss/${SocialPostsFileName}`;
      const storageReference = storageRef(storage, storagePath);
      await deleteObject(storageReference);
      console.log("Image deleted from storage:", SocialPostsFileName);
      const SocialPostssRef = ref(db, "SocialPostss");
      const SocialPostsToDeleteRef = ref(db, `SocialPostss/${SocialPostsId}`);
      await set(SocialPostsToDeleteRef, null);
  
      alert("Deleted successfully");
      window.location.reload()
      console.log("Image entry deleted from database:", SocialPostsId);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const { container, cardContainer, title, description } = homeClasses;
  return (
    <div className="">
      
    <Navbar/>
      <div className="container py-24 mx-auto">
        <p className="text-lg font-semibold">Upload an image for your SocialPosts.</p>
        <input
          type="file"
          accept="image/jpeg"
          className="mt-2 py-1 w-full border rounded"
          onChange={(e) => setFile(e.target.files && e.target.files[0])}
        />
        {file && <img className="mt-4 max-w-xs mx-auto" src={URL.createObjectURL(file)} alt="Uploaded" />}
        <button
          className={`mt-4 bg-blue-500 w-full text-white px-4 py-2 rounded ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div className="container mx-auto my-24">

      <h1 className="text-2xl font-semibold mt-8">SocialPosts Images</h1>
      <div className="grid grid-cols-3 gap-4 mt-4 container">
        {Object.keys(SocialPostsURLs).map((SocialPostsId) => (
          <div key={SocialPostsId} className="border rounded p-4 shadow">
            <button
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDelete(SocialPostsId, SocialPostss[SocialPostsId])}
              >
              Delete
            </button>
            <img className="h-48 w-full mx-auto" src={SocialPostsURLs[SocialPostsId]} alt={`SocialPosts ${SocialPostsId}`} />
          </div>
        ))}
      </div>
        </div>
    </div>
  );
};

export default SocialPosts;