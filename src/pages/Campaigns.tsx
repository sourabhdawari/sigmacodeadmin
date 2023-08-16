import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, set, push } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { app, db } from "../firebase";
import { homeClasses } from "./Home/homeClasses";
import Navbar from "../components/Header/Navbar";

const Campaign = () => {
  const [Campaigns, setCampaigns] = useState<{ [key: string]: string }>({});
  const [CampaignURLs, setCampaignURLs] = useState<{ [key: string]: string }>({});
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
        const storagePath = `Campaigns/${file.name}`;
        const storageReference = storageRef(storage, storagePath);
        await uploadBytes(storageReference, file);
  
        // Update the Campaigns in the Realtime Database
        const CampaignsRef = ref(db, "Campaigns");
        const newCampaignRef = push(CampaignsRef);
        await set(newCampaignRef, file.name);
  
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
    const CampaignsRef = ref(database, "Campaigns");

    const CampaignsListener = onValue(CampaignsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCampaigns(data);
      }
    });

    return () => {
      off(CampaignsRef, "value", CampaignsListener);
    };
  }, [database]);

  useEffect(() => {
    const fetchCampaignURLs = async () => {
      const urls: { [key: string]: string } = {};

      for (const CampaignId in Campaigns) {
        const CampaignFileName = Campaigns[CampaignId];
        const storagePath = `Campaigns/${CampaignFileName}`;
        const CampaignStorageRef = storageRef(storage, storagePath);

        try {
          const downloadURL = await getDownloadURL(CampaignStorageRef);
          urls[CampaignId] = downloadURL;
        } catch (error) {
          urls[CampaignId] = "https://example.com/alternate-image.jpg";
        }
      }

      setCampaignURLs(urls);
    };

    fetchCampaignURLs();
  }, [Campaigns]);
  
  const handleDelete = async (CampaignId: string, CampaignFileName: string) => {
    try {
      const storagePath = `Campaigns/${CampaignFileName}`;
      const storageReference = storageRef(storage, storagePath);
      await deleteObject(storageReference);
      console.log("Image deleted from storage:", CampaignFileName);
      const CampaignsRef = ref(db, "Campaigns");
      const CampaignToDeleteRef = ref(db, `Campaigns/${CampaignId}`);
      await set(CampaignToDeleteRef, null);
  
      alert("Deleted successfully");
      window.location.reload()
      console.log("Image entry deleted from database:", CampaignId);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const { container, cardContainer, title, description } = homeClasses;
  return (
    <div className="">
      
    <Navbar/>
      <div className="container py-24 mx-auto">
        <p className="text-lg font-semibold">Upload an image for your Campaign.</p>
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

      <h1 className="text-2xl font-semibold mt-8">Campaign Images</h1>
      <div className="grid grid-cols-3 gap-4 mt-4 container">
        {Object.keys(CampaignURLs).map((CampaignId) => (
          <div key={CampaignId} className="border rounded p-4 shadow">
            <button
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDelete(CampaignId, Campaigns[CampaignId])}
              >
              Delete
            </button>
            <img className="h-48 w-full mx-auto" src={CampaignURLs[CampaignId]} alt={`Campaign ${CampaignId}`} />
          </div>
        ))}
      </div>
        </div>
    </div>
  );
};

export default Campaign;