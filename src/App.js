import React, { useState, useEffect } from 'react';

const htmlElOptions = [
  { option: 'link', text: 'links <a>' },
  { option: 'ul', text: 'unordered list <ul>' },
  { option: 'ol', text: 'ordered list <ol>' },
  { option: 'dl', text: 'description list <dl>' },
  { option: 'bq', text: 'blockquotes <blockquote>' },
  { option: 'code', text: 'code/pre' },
  { option: 'headers', text: 'headings h1 through h6' },
  { option: 'decorate', text: 'bold and italic text' },
];

const otherOptions = [
  { option: 'allcaps', text: 'use ALL CAPS' },
  { option: 'plaintext', text: 'return plain text,no HTML' },
];

function App() {
  const [numOfParagraphs, setNumOfParagraphs] = useState(2);
  const [paragraphsLength, setParagraphsLength] = useState('short');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [API, setAPI] = useState('');

  const handleOptions = option => {
    setSelectedOptions(prevOptions =>
      prevOptions.includes(option)
        ? prevOptions.filter(opt => opt !== option)
        : [...prevOptions, option]
    );
  };

  const handleGenerate = () => {
    setClicked(prevClicked => prevClicked + 1);
  };

  useEffect(() => {
    const baseURL = `https://loripsum.net/api/${numOfParagraphs}/${paragraphsLength}`;
    const options = selectedOptions.join('/');
    setAPI(`${baseURL}/${options}`);
  }, [numOfParagraphs, paragraphsLength, selectedOptions]);

  return (
    <div className="app">
      <Heading1>Lorem Ipsum Generator</Heading1>
      <Content>
        <LoremOptions
          numOfParagraphs={numOfParagraphs}
          paragraphsLength={paragraphsLength}
          onNumParagraphs={setNumOfParagraphs}
          onParagraphsLength={setParagraphsLength}
          onOption={handleOptions}
          onGenerate={handleGenerate}
          selectedOptions={selectedOptions}
        />
        <Textarea API={API} clicked={clicked} />
      </Content>
    </div>
  );
}

function Heading1({ children }) {
  return <h1 className="heading">{children}</h1>;
}

function Heading2({ children }) {
  return <h2 className="heading-2">{children}</h2>;
}

function Heading3({ children }) {
  return <h3 className="heading-3">{children}</h3>;
}

function Content({ children }) {
  return <div className="content">{children}</div>;
}

function LoremOptions({
  numOfParagraphs,
  paragraphsLength,
  onNumParagraphs,
  onParagraphsLength,
  onOption,
  onGenerate,
  selectedOptions,
}) {
  return (
    <div className="lorem-options">
      <Heading2>Lorem Ipsum Options</Heading2>
      <Heading3>Number of paragraphs:</Heading3>
      <div className="number-paragraphs">
        <input
          type="number"
          value={numOfParagraphs}
          min={1}
          className="number-input"
          onChange={e => {
            onNumParagraphs(Number(e.target.value) || 1);
          }}
        />
        <button
          className="btn btn--value"
          onClick={() => onNumParagraphs(num => num + 1)}
        >
          +
        </button>
        <button
          className="btn btn--value"
          onClick={() => onNumParagraphs(num => num - 1)}
        >
          -
        </button>
      </div>

      <Heading3>Paragraphs length:</Heading3>
      <select
        value={paragraphsLength}
        onChange={e => onParagraphsLength(e.target.value)}
        className="select"
      >
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
        <option value="verylong">Very Long</option>
      </select>

      <Heading3>Add other HTML elements:</Heading3>
      <Options>
        {htmlElOptions.map(opt => (
          <OptionsList
            option={opt.option}
            text={opt.text}
            key={opt.option}
            onOption={onOption}
            selectedOptions={selectedOptions}
          />
        ))}
      </Options>

      <Heading3>Options:</Heading3>
      <Options>
        {otherOptions.map(opt => (
          <OptionsList
            option={opt.option}
            text={opt.text}
            key={opt.option}
            onOption={onOption}
            selectedOptions={selectedOptions}
          />
        ))}
      </Options>

      <button className="options-btn" onClick={onGenerate}>
        Generate Loripsum
      </button>
    </div>
  );
}

function Options({ children }) {
  return <ul className="options-list">{children}</ul>;
}

function OptionsList({ option, text, onOption, selectedOptions }) {
  return (
    <li>
      <input
        type="checkbox"
        id={option}
        className="checkbox"
        checked={selectedOptions.includes(option)}
        onChange={() => onOption(option)}
      />
      <label htmlFor={option} className="toggler">
        <span className="toggler-btn">
          <span></span>
        </span>
        {text}
      </label>
    </li>
  );
}

function Textarea({ API, clicked }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error(`Something went wrong ${res.status}`);

        const data = await res.text();

        setText(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetching();
  }, [API, clicked]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`Text copied to clipboard!`);
    } catch (err) {
      console.error(`${err}, cannot copy text to clipboard`);
    }
  };

  return (
    <div className="text">
      <div
        className="textarea"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      <button className="btn btn--copy" onClick={handleCopyToClipboard}>
        Copy to clipboard
      </button>
    </div>
  );
}

export default App;
