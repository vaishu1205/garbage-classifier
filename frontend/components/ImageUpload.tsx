"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { classifyImage, validateImageFile } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setUploading, setResult, setError, language, isUploading } =
    useAppStore();

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
    [setError],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) processFile(file);
    },
    [processFile],
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
    noClick: true, // We'll handle clicks manually
  });

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div className="space-y-4">
          {/* Camera Button (Primary - Opens Camera Directly) */}
          <button
            onClick={openCamera}
            type="button"
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl p-8 flex flex-col items-center gap-4 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <div className="bg-white/20 dark:bg-black/20 p-4 rounded-full">
              <Camera className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold mb-1">
                {language === "ja" ? "写真を撮る" : "Take Photo"}
              </p>
              <p className="text-sm text-primary-100 dark:text-primary-200">
                {language === "ja" ? "カメラで撮影する" : "Capture with camera"}
              </p>
            </div>
          </button>

          {/* Hidden Camera Input - Opens native camera */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
            aria-label="Camera input"
          />

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                {language === "ja" ? "または" : "OR"}
              </span>
            </div>
          </div>

          {/* File Upload Button */}
          <button
            onClick={openFilePicker}
            type="button"
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl p-8 flex flex-col items-center gap-4 transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
              <ImageIcon className="w-10 h-10 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                {language === "ja" ? "ファイルを選択" : "Choose File"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ja"
                  ? "ギャラリーから選ぶ"
                  : "Select from gallery"}
              </p>
            </div>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
            aria-label="File input"
          />

          {/* Desktop Drag & Drop Area */}
          <div
            {...getRootProps()}
            onClick={openFilePicker}
            className={`
              hidden md:block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${
                isDragActive
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {isDragActive
                ? language === "ja"
                  ? "ここにドロップ"
                  : "Drop here"
                : language === "ja"
                  ? "デスクトップからアップロード"
                  : "Upload from Desktop"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {language === "ja"
                ? "ドラッグ＆ドロップまたはクリック"
                : "Drag and drop or click to browse"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              JPEG, PNG, WEBP (max 10MB)
            </p>
          </div>

          {/* Info Text */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
            {language === "ja"
              ? "サポート形式: JPEG, PNG, WEBP (最大10MB)"
              : "Supported formats: JPEG, PNG, WEBP (max 10MB)"}
          </p>
        </div>
      ) : (
        <div className="card p-6 space-y-6">
          {/* Image Preview */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={handleReset}
              className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all z-10 hover:scale-110"
              aria-label="Remove image"
              type="button"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClassify}
              disabled={!selectedFile || isUploading}
              className="btn btn-primary flex-1 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {language === "ja" ? "分類中..." : "Classifying..."}
                </span>
              ) : language === "ja" ? (
                "分類する"
              ) : (
                "Classify Image"
              )}
            </button>
            <button
              onClick={handleReset}
              className="btn btn-secondary px-6 py-4"
              type="button"
              disabled={isUploading}
            >
              {language === "ja" ? "クリア" : "Clear"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
