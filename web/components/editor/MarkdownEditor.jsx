'use client'

// Tiptap editor that reads and writes markdown (@tiptap/markdown), the format Strapi stores in "body".
// "Markdown" switches to the plain markdown text, for anything the toolbar does not cover.
import { useEffect, useState } from 'react'
import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import {
  Bold, Italic, Strikethrough, Code, Heading2, Heading3, List, ListOrdered, Quote, SquareCode, Minus, Link2, Undo2, Redo2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function ToolButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={cn('rounded p-1.5 text-gray-700 hover:bg-gray-200 disabled:opacity-40', active && 'bg-gray-200 text-tbBlue')}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      codeBlock: e.isActive('codeBlock'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const run = () => editor.chain().focus()
  const setLink = () => {
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('Link address (leave empty to remove the link)', prev)
    if (url === null) return
    if (!url.trim()) run().extendMarkRange('link').unsetLink().run()
    else run().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }
  const i = 'h-4 w-4'
  return (
    <>
      <ToolButton title="Bold" active={s.bold} onClick={() => run().toggleBold().run()}><Bold className={i} /></ToolButton>
      <ToolButton title="Italic" active={s.italic} onClick={() => run().toggleItalic().run()}><Italic className={i} /></ToolButton>
      <ToolButton title="Strikethrough" active={s.strike} onClick={() => run().toggleStrike().run()}><Strikethrough className={i} /></ToolButton>
      <ToolButton title="Inline code" active={s.code} onClick={() => run().toggleCode().run()}><Code className={i} /></ToolButton>
      <span className="mx-1 h-5 w-px bg-gray-300" />
      <ToolButton title="Heading" active={s.h2} onClick={() => run().toggleHeading({ level: 2 }).run()}><Heading2 className={i} /></ToolButton>
      <ToolButton title="Sub-heading" active={s.h3} onClick={() => run().toggleHeading({ level: 3 }).run()}><Heading3 className={i} /></ToolButton>
      <ToolButton title="Bullet list" active={s.bullet} onClick={() => run().toggleBulletList().run()}><List className={i} /></ToolButton>
      <ToolButton title="Numbered list" active={s.ordered} onClick={() => run().toggleOrderedList().run()}><ListOrdered className={i} /></ToolButton>
      <ToolButton title="Quote" active={s.quote} onClick={() => run().toggleBlockquote().run()}><Quote className={i} /></ToolButton>
      <ToolButton title="Code block" active={s.codeBlock} onClick={() => run().toggleCodeBlock().run()}><SquareCode className={i} /></ToolButton>
      <ToolButton title="Horizontal line" onClick={() => run().setHorizontalRule().run()}><Minus className={i} /></ToolButton>
      <ToolButton title="Link" active={s.link} onClick={setLink}><Link2 className={i} /></ToolButton>
      <span className="mx-1 h-5 w-px bg-gray-300" />
      <ToolButton title="Undo" disabled={!s.canUndo} onClick={() => run().undo().run()}><Undo2 className={i} /></ToolButton>
      <ToolButton title="Redo" disabled={!s.canRedo} onClick={() => run().redo().run()}><Redo2 className={i} /></ToolButton>
    </>
  )
}

export default function MarkdownEditor({ value, onChange }) {
  const [source, setSource] = useState(false)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: { openOnClick: false, autolink: true } }),
      Markdown,
    ],
    content: value,
    contentType: 'markdown',
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'prose prose-sm sm:prose-base max-w-none min-h-[24rem] px-4 py-3 focus:outline-none prose-a:text-tbBlue2' },
    },
    onUpdate: ({ editor: e }) => onChange(e.getMarkdown()),
  })

  // Back from the markdown text: load it into the editor.
  useEffect(() => {
    if (editor && !source) editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, editor])

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-tbBlue2">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1">
        {editor && !source && <Toolbar editor={editor} />}
        <button
          type="button"
          onClick={() => setSource(s => !s)}
          className={cn('ml-auto rounded px-2 py-1 text-xs font-medium hover:bg-gray-200', source ? 'bg-gray-200 text-tbBlue' : 'text-gray-600')}
        >
          {source ? 'Editor' : 'Markdown'}
        </button>
      </div>
      {source ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          spellCheck
          className="block min-h-[24rem] w-full resize-y px-4 py-3 font-mono text-sm focus:outline-none"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}
