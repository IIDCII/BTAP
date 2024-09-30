import React, { useState , useEffect } from 'react';
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import { insertText } from '../taskpane';

const OpenAIChat: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [inputCell, setInputCell] = useState('A1');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAPI = async (e: React.FormEvent, prompt: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const promptEng = await fetch('../../assets/prompt_eng.txt').then((response) => response.text());

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {role: 'system', content: promptEng},
            { role: 'user', content: prompt },
          ],
          max_tokens: 2000,
        }),
        
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'An error occurred');
      }

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        insertText(data.choices[0].message.content, inputCell);
        // checking direct repsonse
        // setResponseText(data.choices[0].message.content);
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

        if (inputText === '') {
          setInputText('none');
        }
        
        const prompt = "the data in the excel sheet shown in a matrix format: " + JSON.stringify(range.values) + "\n Extra prompt: " + inputText;

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
      <Field className={styles.textAreaField} size="large" label="Add any additional information for pairing if needed.">
        <Textarea size="large" value={inputText} onChange={handleTextChange} placeholder = "Enter prompt here"/>
      </Field>

      <Field className={styles.textAreaField} size="large" label="Enter the cell for the output. Make sure to leave no spaces.">
        <Textarea style={{ maxWidth: "30%" }} size="large" value={inputCell} onChange={(event) => setInputCell(event.target.value)} />
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
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
  },
});

export default OpenAIChat;
