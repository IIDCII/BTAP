import React, { useState } from 'react';
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import {insertText} from "../taskpane";

const OpenAIChat: React.FC = () => {
  const [inputText, setInputText] = useState('Enter prompt here');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAPI = async (e: React.FormEvent, prompt: string) => {
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
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        }),
        
      });
      setResponseText("The prompt the ai received: " + prompt);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'An error occurred');
      }

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        // need to segment the message here and pass it as different arguments to insertText
        insertText(data.choices[0].message.content);
      } else {
        setResponseText('Unexpected response format');
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseText(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    
    try {
      await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getUsedRange();
        range.load('values');
        
        await context.sync();
        
        const prompt = "the data in the excel sheet shown in a matrix format: " + JSON.stringify(range.values) + "\n prompt based on the excel data: " + inputText;

        await handleAPI(e, prompt);
        
      });
    } catch (error) {
      console.error('Error:', error);
      setResponseText(`Error: ${error.message}`);
    }
  }

  const styles = useStyles();

  const handleTextChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  return (
    <div className = {styles.textPromptAndInsertion}>
      <Field className={styles.textAreaField} size="large" label="Add any additional information for pairing if needed.\n E.g. 'I want only the id's of the pairings'">
        <Textarea size="large" value={inputText} onChange={handleTextChange} />
      </Field>
      <Field className={styles.instructions}>Click the button to generate the table of pairings</Field>
      <Button appearance="primary" disabled={false} size="large" onClick={handleSubmit}>
        {isLoading ? 'Generating...' : 'Generate Pairings'}
      </Button>

      {responseText && (
        <div>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "20px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "20px",
    maxWidth: "50%",
  },
});

export default OpenAIChat;
