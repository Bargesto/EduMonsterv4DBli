import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Student } from '../types';

interface AddStudentModalProps {
  onClose: () => void;
  onAdd: (student: Student) => void;
}

export default function AddStudentModal({ onClose, onAdd }: AddStudentModalProps) {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const generateAvatarUrl = (seed: string) => {
    return `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${seed}&backgroundColor=b6e3f4`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const photoUrl = canvas.toDataURL('image/jpeg');
      setPhoto(photoUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (name.trim()) {
      const avatarUrl = photo || generateAvatarUrl(name);
      onAdd({
        id: crypto.randomUUID(),
        name: name.trim(),
        avatarUrl,
        points: 0,
        notes: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Add New Student
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {!showCamera && (
            <div className="flex gap-2">
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Camera className="w-5 h-5" />
                Camera
              </button>
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
                <Upload className="w-5 h-5" />
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {showCamera && (
            <div className="space-y-2">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Take Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {photo && (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={photo}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {!photo && name && (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={generateAvatarUrl(name)}
                alt="Avatar Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <p className="text-center text-sm text-gray-500 mt-2">Default Avatar</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}