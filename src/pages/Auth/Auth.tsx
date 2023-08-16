import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { authClasses } from "./authClasses";
import { AuthForm, authFormSchema } from "../../models/Form";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { auth, db } from "../../firebase";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { login } from "../../features/authSlice";
import { User } from "../../models/User";
import React from "react";

const Auth = () => {
  const [authType, setAuthType] = useState<"login" | "sign-up">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<
    string | null
  >(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );

  const navigate = useNavigate();



  const {
    container,
    form,
    button,
    input,
    text,
    link,
    hr,
    forgotPasswordButton,
  } = authClasses;

 

  const database = getDatabase();

  const dispatch = useAppDispatch();
  const signInWithGoogle = React.useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      if (user && user.email) {
        const adminsRef = ref(database, "admins");
        const adminsSnapshot = await get(adminsRef);
        if (adminsSnapshot.exists() && adminsSnapshot.hasChild(user.uid)) {
          const userData: User = {
            email: user.email,
            id: user.uid,
            photoUrl: user.photoURL || null,
          };
          dispatch(login(userData));
          navigate("/"); // Redirect to the admin page
        } else {
         alert('User is not authorized for admin access.');
          console.log("User is not authorized for admin access.");
        }
      }
    } catch (error) {
      console.log("Error signing in with Google:", error);
    }
  }, [database, navigate]);




  return (
    <>
    <div className={container}>
      <div className="w-full max-w-sm rounded-lg bg-slate-700/30 shadow">
        {loading ? ( // Show loading screen while loading is true
          <p className="bg-blue-400 px-3 py-2 text-center rounded-md text-white">
            Loading...
          </p>
        ) : (
          <>
            {errorMessage && (
              <p className="bg-red-400 px-3 py-2 text-center rounded-md text-white">
                {errorMessage}
              </p>
            )}
            <div className="grid gap-y-3">
              <button
                onClick={signInWithGoogle}
                className={button}
                type="button"
              >
                Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </>
);
};

export default Auth;
