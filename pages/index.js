import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";
import ReactDOM from "react-dom";

const Home = () => {
  const [conversationSubject, setConversationSubject] = useState("");
  const [userInput, setUserInput] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputList, setInputList] = useState("");

  const beginConversation = () => {
    setConversationSubject(userInput);
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userQuestion, userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const onUserChangedQuestion = (event) => {
    setUserQuestion(event.target.value);
  };

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Ask anyone, anything.</h1>
          </div>
        </div>
        <div className="prompt-container">
          <div className="header-subtitle">
            <h2>
              Enter the name of someone famous, or enter an artibitary name and
              give them some characteristics:
            </h2>
          </div>
          <textarea
            className="prompt-box"
            placeholder="Elon Musk, Oprah Winfrey, Joe the angry neighbor..."
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={beginConversation}
            >
              <div className="generate">
                {isGenerating ? (
                  <span class="loader"></span>
                ) : (
                  <p>Ask a question</p>
                )}
              </div>
            </a>
          </div>

          {
            //TODO: Make this dynamically add a component, so that I can add more of the same components in future versions
            conversationSubject != "" && (
              <textarea
                className="prompt-box"
                placeholder="Ask a question..."
                value={userQuestion}
                onChange={onUserChangedQuestion}
              />
            )
          }
          {conversationSubject != "" && (
            <div className="prompt-buttons">
              <a
                className={
                  isGenerating ? "generate-button loading" : "generate-button"
                }
                onClick={callGenerateEndpoint}
              >
                <div className="generate">
                  {isGenerating ? (
                    <span class="loader"></span>
                  ) : (
                    <p>Get Answer</p>
                  )}
                </div>
              </a>
            </div>
          )}
          {apiOutput != "" && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>{apiOutput}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="badge-container grow">
          <a
            href="https://buildspace.so/builds/ai-writer"
            target="_blank"
            rel="noreferrer"
          >
            <div className="badge">
              <Image src={buildspaceLogo} alt="buildspace logo" />
              <p>build with buildspace</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
