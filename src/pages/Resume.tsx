import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, set, push } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { app, db } from "../firebase";
import { homeClasses } from "./Home/homeClasses";
import Navbar from "../components/Header/Navbar";

const Resume = () => {
  const [resume, setResume] = useState<{ [key: string]: string }>({});
  const [resumeURLs, setResumeURLs] = useState<{ [key: string]: string }>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const storage = getStorage(app);
  const database = getDatabase(app);

  const handleUpload = async (e:any) => {
    e.preventDefault()
    if (file ) {
      setUploading(true);
  
      try {
        // Upload the image to Firebase Storage
        const storagePath = `resume/${file.name}`;
        const storageReference = storageRef(storage, storagePath);
        await uploadBytes(storageReference, file);
  
        // Update the logos in the Realtime Database
        const ResumesRef = ref(db, "resume");
        const newResumeRef=push(ResumesRef)
        await set(newResumeRef, file.name);
  
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
    const resumesRef = ref(database, "resume");

    const resumesListener = onValue(resumesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResume(data);
      }
    });

    return () => {
      off(resumesRef, "value", resumesListener);
    };
  }, [database]);

  useEffect(() => {
    const fetchLogoURLs = async () => {
      const urls: { [key: string]: string } = {};

      for (const resumeId in resume) {
        const resumeFileName = resume[resumeId];
        const storagePath = `resume/${resumeFileName}`;
        const logoStorageRef = storageRef(storage, storagePath);

        try {
          const downloadURL = await getDownloadURL(logoStorageRef);
          urls[resumeId] = downloadURL;
        } catch (error) {
          urls[resumeId] = "https://example.com/alternate-image.jpg";
        }
      }

      setResumeURLs(urls);
    };

    fetchLogoURLs();
  }, [resume]);
  
  const handleDelete = async (resumeId: string, resumeFileName: string) => {
    try {
      const storagePath = `resume/${resumeFileName}`;
      const storageReference = storageRef(storage, storagePath);
      await deleteObject(storageReference);
      console.log("Image deleted from storage:", resumeFileName);
      const logosRef = ref(db, "resume");
      const logoToDeleteRef = ref(db, `resume/${resumeId}`);
      await set(logoToDeleteRef, null);
  
      alert("Deleted successfully");
      window.location.reload()
      console.log("Image entry deleted from database:", resumeId);
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
      <div className=" mx-auto w-full my-24">

      <h1 className="text-2xl font-semibold mt-8 mx-auto text-center py-12">Current Resume</h1>
      <div className="container mx-auto ">
        {Object.keys(resumeURLs).map((resumeId) => (
          <div key={resumeId} className="border  rounded w-full shadow">
            <button
              className="px-2 w-full  mx-auto bg-red-500 text-white  py-4 rounded"
              onClick={() => handleDelete(resumeId, resume[resumeId])}
              >
              Delete
            </button>
            <img className=" w-full mx-auto" src={resumeURLs[resumeId]} alt={`Logo ${resumeId}`} />
          </div>
        ))}
      </div>
        </div>
    </div>
  );
};

export default Resume;