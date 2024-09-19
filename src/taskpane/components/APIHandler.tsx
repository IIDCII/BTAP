import React, { useState } from 'react';

const OpenAIChat: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
          messages: [{ role: 'user', content: inputText }],
          max_tokens: 1000,
        }),
        
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'An error occurred');
      }

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        setResponseText(data.choices[0].message.content);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseText(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your prompt..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {responseText && (
        <div>
          <h2>Response:</h2>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
};

export default OpenAIChat;
