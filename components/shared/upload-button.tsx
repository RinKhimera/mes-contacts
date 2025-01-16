"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUploadThing } from "@/utils/uploadthing"
import { useState } from "react"

const UploadInput = () => {
  const [files, setFiles] = useState<File[]>([])

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (response) => {
      alert("upload complete")
      console.log(response)

      setFiles([]) // Reset files after upload
    },
    onUploadError: (error) => {
      console.log(error)
      alert("error occurred while uploading")
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file)
    },
    onUploadProgress: (progress) => {
      console.log(progress)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList) {
      setFiles(Array.from(fileList))
    }
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" onChange={handleFileChange} />
        <button
          onClick={() => startUpload(files)}
          disabled={files.length === 0}
        >
          Upload
        </button>
      </div>
    </main>
  )
}

export default UploadInput
