"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Camera } from "lucide-react";
import { classifyImage, validateImageFile } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { setUploading, setResult, setError, language } = useAppStore();

  const processFile = useCallback(
    (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setError]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleClassify = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const result = await classifyImage(selectedFile, language);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div className="space-y-4">
          {/* Camera Button (Primary on Mobile) */}
          <button
            onClick={openCamera}
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg p-6 flex flex-col items-center gap-3 transition-colors shadow-lg hover:shadow-xl"
          >
            <Camera className="w-12 h-12" />
            <div className="text-center">
              <p className="text-lg font-semibold">
                {language === "ja" ? "写真を撮る" : "Take Photo"}
              </p>
              <p className="text-sm text-primary-100 dark:text-primary-200">
                {language === "ja" ? "カメラを起動" : "Open camera"}
              </p>
            </div>
          </button>

          {/* Hidden Camera Input */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                {language === "ja" ? "または" : "or"}
              </span>
            </div>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
              ${
                isDragActive
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isDragActive
                ? language === "ja"
                  ? "ここにドロップ"
                  : "Drop here"
                : language === "ja"
                ? "ファイルをアップロード"
                : "Upload from device"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === "ja"
                ? "ドラッグ＆ドロップまたはクリック"
                : "Drag and drop or click to browse"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              JPEG, PNG, WEBP (max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <div className="relative">
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleClassify}
              disabled={!selectedFile}
              className="btn btn-primary flex-1"
            >
              {language === "ja" ? "分類する" : "Classify Image"}
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              {language === "ja" ? "クリア" : "Clear"}
            </button>
          </div>
          {selectedFile && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
