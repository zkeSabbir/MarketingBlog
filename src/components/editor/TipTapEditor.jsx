import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import {
  Bold, Italic, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Image as ImageIcon,
  Video as YoutubeIcon, Undo, Redo, Code, Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ToolbarBtn = ({ onClick, active, title, children, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'p-1.5 rounded-lg transition-colors',
      active
        ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
      disabled && 'opacity-40 cursor-not-allowed'
    )}
  >
    {children}
  </button>
)

export default function TipTapEditor({ value = '', onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Youtube.configure({ controls: true, nocookie: true }),
      Placeholder.configure({ placeholder: 'Start writing your article… Use the toolbar above for formatting.' }),
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-editor-inner outline-none min-h-[400px] p-4',
      },
    },
  })

  if (!editor) return null

  const addImage = () => {
    const url = prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addLink = () => {
    const url = prompt('URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const addYoutube = () => {
    const url = prompt('YouTube URL:')
    if (url) editor.commands.setYoutubeVideo({ src: url })
  }

  const charCount = editor.storage.characterCount?.characters() || 0

  return (
    <div className="tiptap-editor border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-2 border-b border-gray-100 dark:border-gray-800 flex-wrap">
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={16}/></ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code"><Code size={16}/></ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={16}/></ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={16}/></ToolbarBtn>
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Add Link"><Link2 size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={addImage} title="Add Image"><ImageIcon size={16}/></ToolbarBtn>
        <ToolbarBtn onClick={addYoutube} title="Embed YouTube"><YoutubeIcon size={16}/></ToolbarBtn>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Word count */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-right">
        {charCount} characters · ~{Math.max(1, Math.round(charCount / 5 / 200))} min read
      </div>
    </div>
  )
}
