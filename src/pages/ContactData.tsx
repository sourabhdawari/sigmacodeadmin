import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, DataSnapshot } from "firebase/database";
import { app } from "../firebase"; 
import Navbar from "../components/Header/Navbar";

interface ContactData {
  user_name: string;
  user_email: string;
  user_subject: string;
  message: string;
}

export default function ContactData() {
    const [contactDataList, setContactDataList] = useState<ContactData[]>([]);
  
    useEffect(() => {
      const fetchContactData = async () => {
        try {
          const db = getDatabase();
          const contactRef = ref(db, "contactUs");
  
          const snapshot: DataSnapshot = await get(contactRef);
  
          if (snapshot.exists()) {
            const contactEntries = snapshot.val();
            const contactDataArray: ContactData[] = Object.values(contactEntries);
            setContactDataList(contactDataArray);
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchContactData();
    }, []);
  
    return (
      <div className="bg-gray-100 min-h-screen">
       
    <Navbar/>
        <div className="container mx-auto p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Form Data</h2>
  
          {contactDataList.length > 0 ? (
            <ul className="list-decimal marker:text-teal-500 font-bold">
              {contactDataList.map((contactData, index) => (
                <li key={index} className=" p-4  rounded-md">
                  <p className="text-teal-500 font-bold mb-2">Name: {contactData.user_name}</p>
                  <p className="text-blue-600 mb-2">Email: {contactData.user_email}</p>
                  <p className="text-gray-600 mb-2">Subject: {contactData.user_subject}</p>
                  <p className="text-gray-400 mb-2">Message: {contactData.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600">No data available</p>
          )}
        </div>
      </div>
    );
  }