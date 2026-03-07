'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Code, Eye } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isCodeMode, setIsCodeMode] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link',
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-end">
        <button
          type="button"
          onClick={() => setIsCodeMode(!isCodeMode)}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#004d66] hover:text-[#003d52] transition-colors"
        >
          {isCodeMode ? (
            <>
              <Eye className="w-3 h-3" />
              Visual Editor
            </>
          ) : (
            <>
              <Code className="w-3 h-3" />
              HTML Code
            </>
          )}
        </button>
      </div>
      
      {isCodeMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your HTML code here..."
          className="w-full h-64 p-4 font-mono text-sm border-none focus:ring-0 resize-none text-gray-900 bg-white"
        />
      ) : (
        <div className="quill-container bg-white text-gray-900">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="h-64 mb-12 text-gray-900"
          />
        </div>
      )}
    </div>
  );
}
