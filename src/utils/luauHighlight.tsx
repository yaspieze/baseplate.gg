import React from 'react';

const KEYWORDS = new Set([
  'local', 'function', 'return', 'if', 'then', 'elseif', 'else', 'end',
  'for', 'in', 'while', 'do', 'repeat', 'until', 'break', 'continue',
  'and', 'or', 'not', 'export', 'type', 'typeof'
]);

const BUILTINS = new Set([
  'game', 'workspace', 'script', 'Instance', 'Vector3', 'Vector2', 'CFrame',
  'Color3', 'UDim2', 'UDim', 'TweenInfo', 'Enum', 'task', 'math', 'table',
  'string', 'os', 'tick', 'time', 'warn', 'print', 'error', 'pcall', 'xpcall',
  'ipairs', 'pairs', 'RaycastParams', 'NumberSequence', 'ColorSequence',
  'BrickColor', 'Random'
]);

const LITERALS = new Set(['true', 'false', 'nil', 'self']);

export function highlightLuauLine(line: string): React.ReactNode[] {
  const commentIdx = line.indexOf('--');
  const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

  const nodes: React.ReactNode[] = [];
  const tokenRegex = /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[^\sA-Za-z0-9_"']+|\s+)/g;

  let match: RegExpExecArray | null;
  let k = 0;
  while ((match = tokenRegex.exec(codePart)) !== null) {
    const tok = match[0];
    if (tok.startsWith('"') || tok.startsWith("'")) {
      nodes.push(<span key={k++} className="text-[#ADF195]">{tok}</span>);
    } else if (/^\d/.test(tok)) {
      nodes.push(<span key={k++} className="text-[#FFC600]">{tok}</span>);
    } else if (KEYWORDS.has(tok)) {
      nodes.push(<span key={k++} className="text-[#F86D7C] font-semibold">{tok}</span>);
    } else if (LITERALS.has(tok)) {
      nodes.push(<span key={k++} className="text-[#FFC600] font-semibold">{tok}</span>);
    } else if (BUILTINS.has(tok)) {
      nodes.push(<span key={k++} className="text-[#84D6F7]">{tok}</span>);
    } else if (/^[A-Z][A-Za-z0-9_]*$/.test(tok)) {
      nodes.push(<span key={k++} className="text-[#9CDCFE]">{tok}</span>);
    } else {
      nodes.push(<span key={k++} className="text-[#E6EDF7]">{tok}</span>);
    }
  }

  if (commentPart) {
    const isDirective = commentPart.startsWith('--!');
    nodes.push(
      <span
        key={k++}
        className={isDirective ? 'text-[#C792EA] font-semibold' : 'text-[#667489] italic'}
      >
        {commentPart}
      </span>
    );
  }

  return nodes;
}
