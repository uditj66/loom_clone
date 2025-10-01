// import { ChangeEvent, useEffect, useRef, useState } from "react";
// export const useFileInput = (maxSize: number) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [duration, setDuration] = useState(0);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const selectedFile = e.target.files[0];

//       if (selectedFile.size > maxSize) return;

//       /* This let know the browser that we want no longer  the reference to any earlier file and revoke it   bcz we have done with the preview and want no access to this url any more i.e

//         Simply we revoke the PreviewUrl of any earlier uploaded file
//       */
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//       // Set the file
//       setFile(selectedFile);
//       //  Creating the new Url for this new file uploaded
//       const objectUrl = URL.createObjectURL(selectedFile);
//       // Setting the preview url for this new uploaded File
//       setPreviewUrl(objectUrl);

//       // Extracting the duration of the video
//       if (selectedFile.type.startsWith("video")) {
//         const video = document.createElement("video");
//         // getting the meta-deta about the video
//         video.preload = "metadata";
//         video.onloadedmetadata = () => {
//           if (isFinite(video.duration) && video.duration > 0) {
//             setDuration(Math.round(video.duration));
//           } else {
//             setDuration(0);
//           }
//           // Again revokling the Url for this uploaded file
//           URL.revokeObjectURL(video.src);
//         };
//         // Setting the source of this video as new objectUrl
//         video.src = objectUrl;
//       }
//     }
//   };
//   // reset all the form
//   const resetFile = () => {
//     if (previewUrl) URL.revokeObjectURL(previewUrl);

//     setDuration(0);
//     setFile(null);
//     setPreviewUrl("");

//     if (inputRef.current) inputRef.current.value = "";
//   };
//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);
//   return {
//     file,
//     previewUrl,
//     duration,
//     inputRef,
//     handleFileChange,
//     resetFile,
//   };
// };

/*
When you try to build a file upload component:

<input type="file" onChange={handleFileChange} />


you often face several issues:

1. Previewing files:

If the user selects an image or video, you want to show it immediately.

Browsers don’t let you access local file paths directly. You need a temporary URL using URL.createObjectURL.

2. Memory leaks:

Every time you create a preview URL, the browser keeps it in memory.

Without revoking the URL, repeated uploads can slow down the app.

3. Resetting file input:

After uploading or canceling, you want to clear the selected file and preview.

In React, just clearing state is not enough: the <input type="file"> itself retains its value. You must manually reset it.

4. Extra info like video duration:

For video files, you might want metadata (like duration) before upload.

This requires creating a temporary <video> element and reading its metadata.




## Why we need it

A. Without this hook:

You would repeat the same logic in every file input component:

i.   Generating preview URL

ii.  Revoking old URL

iii. Extracting video duration

iv.  Resetting input

v.  Your component code would get messy and hard to maintain.

vi. You might forget URL.revokeObjectURL, leading to memory leaks.

B. With this hook:

i.   All file input logic is centralized.

ii.  Your components become cleaner and reusable.

iii. You can use it for images, videos, or other files easily.

*/

import { ChangeEvent, useEffect, useRef, useState } from "react";

export const useFileInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) return;

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile);

    // Revoke old preview if exists
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    // Update state
    setFile(selectedFile);
    setPreviewUrl(objectUrl);

    // Extract video duration if needed
    if (selectedFile.type.startsWith("video")) {
      const video = document.createElement("video");
      video.preload = "metadata";

      const tempUrl = URL.createObjectURL(selectedFile);
      video.src = tempUrl;

      video.onloadedmetadata = () => {
        setDuration(isFinite(video.duration) ? Math.round(video.duration) : 0);
        URL.revokeObjectURL(tempUrl);
      };
    } else {
      setDuration(0);
    }

    // 🔹 Critical: reset input value so same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl("");
    setDuration(0);

    if (inputRef.current) inputRef.current.value = "";
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return {
    file,
    previewUrl,
    duration,
    inputRef,
    handleFileChange,
    resetFile,
  };
};
