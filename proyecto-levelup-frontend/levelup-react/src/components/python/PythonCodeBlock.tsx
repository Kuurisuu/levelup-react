import React from 'react';

interface PythonCodeBlockProps {
  imports: string[];
  code: string;
  output?: string;
  executionTime?: number;
}

const PythonCodeBlock: React.FC<PythonCodeBlockProps> = ({ imports, code, output, executionTime }) => {
  return (
    <div className="python-code-block">
      <div className="code-header">
        <span className="python-icon">🐍</span>
        <span className="language">Python</span>
        {executionTime && (
          <span className="execution-time">
            ⏱️ {executionTime}ms
          </span>
        )}
      </div>
      
      <div className="code-section">
        <div className="code-label">Imports:</div>
        <pre className="code-content">
          {imports.map((imp, index) => (
            <div key={index} className="code-line">{imp}</div>
          ))}
        </pre>
      </div>
      
      <div className="code-section">
        <div className="code-label">Code:</div>
        <pre className="code-content">
          <div className="code-line">{code}</div>
        </pre>
      </div>
      
      {output && (
        <div className="code-section">
          <div className="code-label">Output:</div>
          <pre className="code-output">
            <div className="output-line">{output}</div>
          </pre>
        </div>
      )}
    </div>
  );
};

export default PythonCodeBlock;
