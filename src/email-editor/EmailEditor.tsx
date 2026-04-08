import { useState } from 'react';

export default function EmailEditor() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold mb-4">Email Editor</h2>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 p-4">
        <textarea
          placeholder="Email content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="border-t p-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Send
        </button>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Save Draft
        </button>
      </div>
    </div>
  );
}
