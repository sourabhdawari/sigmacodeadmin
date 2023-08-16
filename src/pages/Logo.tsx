import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, set, push } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { app, db } from "../firebase";
import { homeClasses } from "./Home/homeClasses";
import Navbar from "../components/Header/Navbar";

const Logo = () => {
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const [logoURLs, setLogoURLs] = useState<{ [key: string]: string }>({});
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
        const storagePath = `logos/${file.name}`;
        const storageReference = storageRef(storage, storagePath);
        await uploadBytes(storageReference, file);
  
        // Update the logos in the Realtime Database
        const logosRef = ref(db, "logos");
        const newLogoRef = push(logosRef);
        await set(newLogoRef, file.name);
  
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
    const logosRef = ref(database, "logos");

    const logosListener = onValue(logosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLogos(data);
      }
    });

    return () => {
      off(logosRef, "value", logosListener);
    };
  }, [database]);

  useEffect(() => {
    const fetchLogoURLs = async () => {
      const urls: { [key: string]: string } = {};

      for (const logoId in logos) {
        const logoFileName = logos[logoId];
        const storagePath = `logos/${logoFileName}`;
        const logoStorageRef = storageRef(storage, storagePath);

        try {
          const downloadURL = await getDownloadURL(logoStorageRef);
          urls[logoId] = downloadURL;
        } catch (error) {
          urls[logoId] = "https://example.com/alternate-image.jpg";
        }
      }

      setLogoURLs(urls);
    };

    fetchLogoURLs();
  }, [logos]);
  
  const handleDelete = async (logoId: string, logoFileName: string) => {
    try {
      const storagePath = `logos/${logoFileName}`;
      const storageReference = storageRef(storage, storagePath);
      await deleteObject(storageReference);
      console.log("Image deleted from storage:", logoFileName);
      const logosRef = ref(db, "logos");
      const logoToDeleteRef = ref(db, `logos/${logoId}`);
      await set(logoToDeleteRef, null);
  
      alert("Deleted successfully");
      window.location.reload()
      console.log("Image entry deleted from database:", logoId);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const { container, cardContainer, title, description } = homeClasses;
  return (
    <div className="">
      
    <Navbar/>
      <div className="container py-24 mx-auto">
        <p className="text-lg font-semibold">Upload an image for your logo.</p>
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

      <h1 className="text-2xl font-semibold mt-8">Logo Images</h1>
      <div className="grid grid-cols-3 gap-4 mt-4 container">
        {Object.keys(logoURLs).map((logoId) => (
          <div key={logoId} className="border rounded p-4 shadow">
            <button
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDelete(logoId, logos[logoId])}
              >
              Delete
            </button>
            <img className="h-48 w-full mx-auto" src={logoURLs[logoId]} alt={`Logo ${logoId}`} />
          </div>
        ))}
      </div>
        </div>
    </div>
  );
};

export default Logo;