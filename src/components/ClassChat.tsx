import { useState, useEffect, useRef } from 'react';
import { Message, ClassRoom } from '../types';
import { loadState, saveState } from '../utils/storage';
import { Send, Trash2, X, Image, Video, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ClassChatProps {
  classroom: ClassRoom;
  onClose: () => void;
}

export default function ClassChat({ classroom, onClose }: ClassChatProps) {
  const [messages, setMessages] = useState<Message[]>(classroom.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const state = loadState();
  const isTeacher = state.currentTeacher?.id === classroom.teacherId;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setMediaType(isImage ? 'image' : 'video');

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
  };

  const clearMediaSelection = () => {
    setSelectedFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !state.currentTeacher) return;

    let mediaUrl = '';

    if (selectedFile) {
      // Convert file to base64
      const reader = new FileReader();
      mediaUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
    }

    const message: Message = {
      id: crypto.randomUUID(),
      senderId: state.currentTeacher.id,
      senderName: state.currentTeacher.schoolName,
      senderType: 'teacher',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      ...(mediaUrl && {
        mediaUrl,
        mediaType,
      }),
    };

    // Update local state
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Update storage
    const updatedState = loadState();
    const classIndex = updatedState.classes.findIndex(c => c.id === classroom.id);
    updatedState.classes[classIndex].messages = updatedMessages;
    saveState(updatedState);

    setNewMessage('');
    clearMediaSelection();
  };

  const handleDeleteMessage = (messageId: string) => {
    // Update local state
    const updatedMessages = messages.filter(m => m.id !== messageId);
    setMessages(updatedMessages);

    // Update storage
    const updatedState = loadState();
    const classIndex = updatedState.classes.findIndex(c => c.id === classroom.id);
    updatedState.classes[classIndex].messages = updatedMessages;
    saveState(updatedState);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 w-full max-w-2xl h-[80vh] rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-medium">Sınıf Haberleri: {classroom.name}</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === state.currentTeacher?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === state.currentTeacher?.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-1">
                      {message.senderName}
                    </p>
                    {message.content && (
                      <p className="text-sm mb-2">{message.content}</p>
                    )}
                    {message.mediaUrl && message.mediaType === 'image' && (
                      <img
                        src={message.mediaUrl}
                        alt="Shared image"
                        className="rounded-lg max-w-full mb-2"
                      />
                    )}
                    {message.mediaUrl && message.mediaType === 'video' && (
                      <video
                        src={message.mediaUrl}
                        controls
                        className="rounded-lg max-w-full mb-2"
                      />
                    )}
                    <p className="text-xs mt-1 opacity-75">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </p>
                  </div>
                  {isTeacher && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-white hover:text-red-200 opacity-60 hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Media Preview */}
        {mediaPreview && (
          <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
            <div className="relative inline-block">
              {mediaType === 'image' ? (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="max-h-32 rounded-lg"
                />
              ) : (
                <video
                  src={mediaPreview}
                  className="max-h-32 rounded-lg"
                />
              )}
              <button
                onClick={clearMediaSelection}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              title="Add media"
            >
              {mediaType === 'image' ? (
                <Image className="w-5 h-5" />
              ) : mediaType === 'video' ? (
                <Video className="w-5 h-5" />
              ) : (
                <Image className="w-5 h-5" />
              )}
            </button>
            <button
              type="submit"
              disabled={!newMessage.trim() && !selectedFile}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}