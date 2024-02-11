"use client";
import { auth } from "../../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const firebaseConfig = {
    apiKey: "AIzaSyAyva6HJIQsabhF8qJrUsKqNOQZuiLQgVQ",
    authDomain: "weatherapp-49219.firebaseapp.com",
    projectId: "weatherapp-49219",
    storageBucket: "weatherapp-49219.appspot.com",
    messagingSenderId: "428920452812",
    appId: "1:428920452812:web:b6351f37dc5f970847b469",
  };

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
  }, []);

  async function login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/dashboard");
      })
      .catch((error) => {
        setError("Wrong email or password");
      });
  }

  return (
    <div className="bg-gray-200 flex h-screen w-full flex-col items-center">
      <div className="... w-full basis-4 bg1"></div>
      <div className="... w-full basis-1/12 bg1">
        <div className="h-full flex flex-row items-center justify-center bg-gray-400">
          <h1 className="text-3xl font-weight: 700">Weather app</h1>
        </div>
      </div>
      <div className="... w-full basis-6 bg1"></div>
      <div className="... w-full basis-10/12 ">
        <div className="rounded-2xl h-full mx-4 flex flex-col items-center bg-gray-400">
          <h1 className="text-3xl font-weight: 700">LOGIN</h1>
          <h3 className="text-m text-[#c10000] m-1">{error}</h3>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button
            className="btn btn-neutral w-32 rounded-full m-4"
            onClick={() => login()}
          >
            Login
          </button>
        </div>
      </div>
      <div className="... w-full basis-4 bg1 flex flex-col items-center"></div>
    </div>
  );
}
