"use client";
import React, { useState, useEffect, useRef } from "react";
import * as qna from "@tensorflow-models/qna";
import "@tensorflow/tfjs";

interface Answer {
  text: string;
  score: number;
}

const QnaComponent = () => {
  const [cxtques, setCxtques] = useState<string>("");
  const [chat, setChat] = useState<Answer[]>([]);
  const [ques, setQues] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [model, setModel] = useState<qna.QuestionAndAnswer | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadModel = async () => {
      console.log("Hitted");
      const loadedModel = await qna.load();
      setModel(loadedModel);
      console.log("model loaded");
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!model || !ques || !context) {
      if (!model) console.log("model mai gadbad");
      console.log("gone");
      return;
    }

    console.log("came");

    const q = [
      {
        text: ques,
        score: -1,
      },
    ];
    setQues("");

    setChat((prevChat) => [...prevChat, ...q]);

    try {
      const newAns = await model.findAnswers(ques, context);
      if (newAns.length == 0) {
        const ans = [
          {
            text: "can't find answers for " + ques,
            score: 10,
          },
        ];
        setChat((prevChat) => [...prevChat, ...ans]);
      } else {
        setChat((prevChat) => [...prevChat, ...newAns]);
      }
    } catch (error) {
      console.error("Error finding answers:", error);
    }
    console.log("krdiya kaam");
  };

  const handleContext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContext(cxtques);
    setCxtques("");
  };

  return (
    <div className="flex gap-2 items-center justify-center h-screen w-full text-center">
      <div className="flex flex-col basis-1/2 h-full border-r-2 border-gray-300">
        {context.length > 0 ? (
          <div className="h-4/5 mb-2 w-full overflow-y-scroll">{context}</div>
        ) : (
          <div className="h-4/5 mb-2 w-full">Provide Your Context...</div>
        )}
        <form
          action=""
          onSubmit={(e) => handleContext(e)}
          className="flex min-w-full justify-self-end self-end"
        >
          <input
            type="text"
            placeholder="Provide Your context"
            value={cxtques}
            onChange={(e) => setCxtques(e.target.value)}
            className="p-1 text-center border rounded-lg outline-transparent basis-4/5"
          />
          <button className="p-2 m-2 bg-green-300 border rounded-lg basis-1/5">
            Send
          </button>
        </form>
      </div>

      <div className="flex flex-col basis-1/2 text-center h-full">
        {chat.length > 0 ? (
          <div
            ref={chatContainerRef}
            className="flex flex-col h-4/5 mb-2 overflow-y-scroll gap-2"
          >
            {chat.map((i, index) => {
              return (
                <h3
                  className={`${
                    i.score == -1
                      ? "bg-blue-50 self-end justify-self-end text-right mr-2"
                      : "bg-blue-500 self-start justify-self-start text-left ml-2 text-white"
                  } p-2 border rounded-lg max-w-96 inline-block`}
                  key={index}
                >
                  {i.text}
                </h3>
              );
            })}
          </div>
        ) : (
          <div className="h-4/5 mb-2 items-center justify-center">
            {model
              ? "Start Chating"
              : "Model is Loading... Please Wait for a while"}
          </div>
        )}
        <form
          action=""
          onSubmit={(e) => handleSearch(e)}
          className="flex min-w-full justify-self-end self-end"
        >
          <input
            type="text"
            placeholder="Write Your question"
            value={ques}
            onChange={(e) => setQues(e.target.value)}
            className="p-1 text-center border rounded-lg outline-transparent basis-4/5"
          />
          <button
            disabled={model ? false : true}
            // className={`p-2 m-2 border rounded-lg basis-1/5${
            //   model ? "bg-green-300" : "bg-red-300"
            // }`}
            className={`${
              model ? "bg-green-300" : "bg-red-200"
            } p-2 m-2 border rounded-lg basis-1/5`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default QnaComponent;
