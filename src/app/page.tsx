"use client";

import { useEffect, useState } from "react";
import { PickerOverlay } from "filestack-react";

const DEFAULT_POLICY =
  "eyJleHBpcnkiOjE3NDA3ODM2MDAsImNhbGwiOlsicGljayIsInJlYWQiLCJzdGF0Iiwid3JpdGUiLCJ3cml0ZVVybCIsInN0b3JlIiwiY29udmVydCIsInJlbW92ZSIsImV4aWYiLCJydW5Xb3JrZmxvdyJdfQ==";
const DEFAULT_SIGNATURE =
  "5f9707658d46ccf8e0c1aa0d052bc761d5683f9416afb239654e1681665781b0";
const FILESTACK_BASE_URL = `https://cdn.filestackcontent.com/${process.env.NEXT_PUBLIC_FILESTACK_API_KEY}/security=p:${DEFAULT_POLICY},s:${DEFAULT_SIGNATURE}`;

export default function Home() {
  const [showPicker, setShowPicker] = useState(false);
  const [uploadedFileHandle, setUploadedFileHandle] = useState("");
  const [ocrResult, setOcrResult] = useState("");

  useEffect(() => {
    if (!uploadedFileHandle) return;

    fetch(`${FILESTACK_BASE_URL}/ocr/${uploadedFileHandle}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setOcrResult(res.text);
      });
    if (uploadedFileHandle) {
    }
  }, [uploadedFileHandle]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-white border border-black/[15%] rounded py-10 px-14 text-center -mt-32">
        <h1 className="text-4xl font-bold mb-2">Image to Text</h1>
        <p className="text-xl">
          Upload an image and we will extract the text from it.
        </p>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-7"
          onClick={() => setShowPicker(true)}
        >
          Upload image for OCR
        </button>

        {showPicker && (
          <PickerOverlay
            apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY!}
            clientOptions={{
              security: {
                policy: DEFAULT_POLICY,
                signature: DEFAULT_SIGNATURE,
              },
            }}
            pickerOptions={{
              accept: ["image/*"],
              onClose: () => setShowPicker(false),
              onUploadDone: (res) => {
                console.log(res.filesUploaded);
                setUploadedFileHandle(res.filesUploaded[0].handle);
                setShowPicker(false);
              },
            }}
          />
        )}

        <h2 className="font-semibold mb-2 mt-10 pt-10 border-t border-black/10">
          OCR Result
        </h2>
        <p className="text-sm text-zinc-500">{ocrResult || "No result yet."}</p>
      </div>
    </main>
  );
}
