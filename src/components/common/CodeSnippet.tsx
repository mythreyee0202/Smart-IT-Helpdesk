import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  language?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language = 'cmd' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-2 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono border border-slate-800 overflow-hidden shadow-inner group">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700 text-slate-400 text-[11px]">
        <div className="flex items-center gap-1.5 font-sans">
          <Terminal className="w-3.5 h-3.5 text-primary-light" />
          <span>Command Prompt / Terminal</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-slate-700/50 hover:bg-slate-700 px-2 py-0.5 rounded text-[10px]"
          title="Copy command"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto select-all text-emerald-400 font-mono tracking-wide">
        <span className="text-slate-500 mr-2 select-none">$</span>
        {code}
      </div>
    </div>
  );
};
