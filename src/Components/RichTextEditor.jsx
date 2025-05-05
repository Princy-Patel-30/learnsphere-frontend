import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

const RichTextEditor = ({ name, control, placeholder, rules }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue="<p></p>"
      rules={{
        ...rules,
        validate: (value) => {
          const text = value.replace(/<[^>]+>/g, '').trim();
          return text.length > 0 || (rules?.required ?? 'Content is required');
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => {
        const editor = useEditor({
          extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder }),
          ],
          content: value,
          onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
          },
          editorProps: {
            attributes: {
              onBlur: onBlur,
            },
          },
        });

        // keep editor in sync if form resets or value changes externally
        useEffect(() => {
          if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
          }
        }, [editor, value]);

        if (!editor) return null;

        return (
          <>
            {/* You can extract this toolbar if you like */}
            <div className="flex gap-2 mb-2 flex-wrap">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-3 py-1 border rounded-md ${
                  editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                } hover:bg-blue-100`}
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 border rounded-md ${
                  editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                } hover:bg-blue-100`}
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-3 py-1 border rounded-md ${
                  editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                } hover:bg-blue-100`}
              >
                Underline
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-3 py-1 border rounded-md ${
                  editor.isActive('heading', { level: 1 })
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700'
                } hover:bg-blue-100`}
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-3 py-1 border rounded-md ${
                  editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                } hover:bg-blue-100`}
              >
                Bullet List
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter the URL');
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className="px-3 py-1 border rounded-md bg-white text-gray-700 hover:bg-blue-100"
              >
                Link
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg">
              <EditorContent
                editor={editor}
                className="prose w-full min-h-[150px] p-4 focus:outline-none"
              />
            </div>
          </>
        );
      }}
    />
  );
};

export default RichTextEditor;