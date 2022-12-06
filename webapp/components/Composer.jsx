import React, { useState, useCallback, useContext, useEffect } from 'react'
import { useRouter } from "next/router"
import axios from 'axios';
import {
    Editable,
    withReact,
    Slate,
    ReactEditor,
    useFocused,
} from "slate-react";
import { createEditor, Node } from "slate";

import nimble from "@runonbitcoin/nimble";
import bops from "bops";

import { toast } from "react-toastify"


import { useRelay } from '../context/RelayContext';
import { useTuning } from '../context/TuningContext';
import axiosInstance, { useAPI } from '../hooks/useAPI';
import { PostCard } from '.';
import { useBitcoin } from '../context/BitcoinContext';


const SuccessSnackbar = (props) => {
  return (<div
    className="mx-2 sm:mx-auto max-w-sm  flex flex-row items-center justify-between bg-green-200 p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap">
    <div className="inline-flex items-center text-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd" />
      </svg>
      Transaction successful!
    </div>
    <div className="text-green-700 cursor-pointer hover:text-green-800">
      <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${props.tx_id}`}>View</a>
    </div>
  </div>)
}

const ErrorSnackbar = (props) => {
  return (
    <div
      className="mx-2 sm:mx-auto max-w-sm  flex flex-row items-center justify-between bg-red-200 p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap">
      <div className="inline-flex items-center text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd" />
        </svg>
        {props.message}
      </div>
    </div>
  )
}




const Composer = ({ reply_tx, onSuccess }) => {
  const { relayOne } = useRelay()
    const router = useRouter()
    const [twetchPost, setTwetchPost] = useState()
    const [placeholder, setPlaceholder] = useState("What's the latest?")
    const { tag, setTag } = useTuning() 
    const { send, authenticated } = useBitcoin()
    const blankSlateValue = [{ type: "paragraph", children: [{ text: "" }] }];
    const [editor, setEditor] = useState(() => withReact(createEditor()));
    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const [value, setValue] = useState(blankSlateValue);


    useEffect(()=>{
      if(reply_tx){
        setPlaceholder(`Add your answer`)
      } else {
        switch (tag){
          //case "1F9E9":
            case "question":
            setPlaceholder("Shoot your shot")
            break;
          //case "1F4A1":
            case "answer":
            setPlaceholder("What do you have in mind?")
            break;
          //case "1F48E":
            case "project":
            setPlaceholder("What are you building?")
            break;
          default: 
            setPlaceholder("What's the latest?")
        }
      }
      
    },[tag, reply_tx])

    const serialize = nodes => {
      return nodes.map(n => Node.string(n)).join('\n')
    }


    const handlePost = async (e) => {
      e.preventDefault()
      const content = serialize(editor.children)
      
      let opReturn;
      if (reply_tx) {
        opReturn = [
          "onchain",
          "1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN",
          "answer",
          JSON.stringify({
            question_tx_id: reply_tx,
            content,
          }),
        ];
      } else {
        opReturn = [
          "onchain",
          "1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN",
          "question",
          JSON.stringify({
            content,
          }),
        ];
      }

      const outputs = {
        opReturn,
        currency: "BSV",
        amount: 0.00052,
        to: "1MqPZFc31jUetZ5hxVtG4tijJSugAcSZCQ",
      };
    
      let { txid,rawTx } = await toast.promise(relayOne.send(outputs), {
        pending: 'Transaction is pending 🚀',
        success: {
          render({data}){
            return <SuccessSnackbar tx_id={data.txid}/>
          },
          icon:false
        },
        error: {
          render({data}){
            return <ErrorSnackbar message={data.message}/>
          },
          icon:false
        }
      }, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
      theme: "light",
      });
      
      if(!txid && !rawTx){
        return
      }
      (async () => {
        try {
          let { data: postTransactionResponse } = await axios.post('https://askbitcoin.ai/api/v1/transactions', {
            transaction: rawTx
          });

          console.log('askbitcoin_postTransactionResponse', postTransactionResponse);
        } catch (error) {
          console.error('postTransactionResponse', error);
        }
      })();

      (async () => {
        try {
          let { data: postTransactionResponse } = await axios.post('https://pow.co/api/v1/transactions', {
            transaction: rawTx
          });

          console.log('powco_post_transaction_response', postTransactionResponse);
        } catch (error) {
          console.error('powco_post_transaction_response', error);
        }
      })();


      (async () => {
        try {
          let { data: postTransactionResponse } = await axios.post('https://pow.co/api/v1/jobs', {
            transaction: rawTx
          });

          console.log('powco_post_transaction_response', postTransactionResponse);
        } catch (error) {
          console.error('powco_post_transaction_response', error);
        }
      })();

      if (reply_tx){

        (async () => {
          try {
            let { data: postTransactionResponse } = await axios.post('https://askbitcoin.ai/api/v1/answers', {
              transaction: rawTx
            });

            console.log('api.answers.post.response', postTransactionResponse);
          } catch (error) {
            console.error('api.answers.post.response', error);
          }
        })();
        
        (async () => {
          try {
            
            await axios.get(`https://askbitcoin.ai/api/v1/answers/${txid}`);
            

          } catch (error) {

            console.error('api.answers.show.error', error);
          }
        })();

        router.push(`/answers/${txid}`)

      } else {
        
        (async () => {
          try {
            let { data: postTransactionResponse } = await axios.post('https://askbitcoin.ai/api/v1/questions', {
              transaction: rawTx
            });

            
            console.log('api.questions.post.response', postTransactionResponse);

          } catch (error) {
            console.error('api.questions.post.response', error);
          }
        })();

        (async () => {
          try {

            await axios.get(`https://askbitcoin.ai/api/v1/questions/${txid}`);


          } catch (error) {

            console.error('api.questions.show.error', error);
          }
        })();

        router.push(`/questions/${txid}`)

      }
      setValue(blankSlateValue)
      
    };

    const handleChange = async (newValue) => {
      const twetchPostRegex = /http(s)?:\/\/(.*\.)?twetch\.com\/t\/([A-z0-9_/?=]+)/;
      let match = newValue[0].children[0].text.match(twetchPostRegex)
      
      if (match){
        /* let twetchTx = match[3]
        try {
          const resp = await axiosInstance.get(`/api/v1/twetch/${twetchTx}`)
          setTwetchPost(resp.data.twetch)  
          setValue(blankSlateValue)      
        } catch (error) {
          console.log("twetch.not.found")
          setTwetchPost()
        } */
      } else {
        setValue(newValue)
        //setTwetchPost()
      }
    }

  return (
    <div
      className={
         `flex flex-col p-3 rounded-lg sm:rounded-xl text-gray-900 dark:text-white ${reply_tx ? "bg-gray-200 dark:bg-gray-500":"bg-gray-100 dark:bg-gray-600"} dark:${reply_tx ? "bg-gray-500":"bg-gray-600"}`
      }
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => handleChange(newValue)}
      >
        <Editable
          placeholder={placeholder}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          style={{
            position: "relative",
            outline: "none",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            minHeight: "22px",
          }}
        />
      </Slate>
      {twetchPost && <div className='mt-2 border rounded-lg border-gray-300 dark:border-gray-700'><PostCard post={twetchPost}/></div>}
      <div className="flex items-center mt-2">
        {/* <>
          {router.pathname === "/compose" && <div className='rounded-full bg-gray-300 dark:bg-gray-700 py-2 px-4 flex items-center'>
            <div className="flex items-center mr-2">
                <input onChange={(e)=>setTag(e.target.value)}  checked={tag === ""} id="problem-tag" type="radio" value="" name="radio-tag" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"/>
                <label htmlFor="problem-tag" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"></label>
            </div> 
            <div className="flex items-center mr-2">
                <input onChange={(e)=>setTag(e.target.value)}  checked={tag === "question"} id="problem-tag" type="radio" value="question" name="radio-tag" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"/>
                <label htmlFor="problem-tag" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">🧩</label>
            </div>
            <div className="flex items-center mr-2">
                <input onChange={(e)=>setTag(e.target.value)} checked={tag === "answer" } id="idea-tag" type="radio" value="answer" name="radio-tag" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"/>
                <label htmlFor="idea-tag" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">💡</label>
            </div>
            <div className="flex items-center">
                <input onChange={(e)=>setTag(e.target.value)} checked={tag === "project"} id="project-tag" type="radio" value="project" name="radio-tag" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"/>
                <label htmlFor="project-tag" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">💎</label>
            </div>
            <div className="ml-2 flex items-center">
                <input onChange={(e)=>setTag(e.target.value)} checked={tag === "test"} id="test-tag" type="radio" value="test" name="radio-tag" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"/>
                <label htmlFor="project-tag" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">🐛</label>
            </div> 
          </div>}
         </> */}
        <div className='grow'/>
        <button
          onClick={handlePost}
          disabled={!authenticated || value[0].children[0].text.length === 0}
          className="text-white bg-gradient-to-tr from-blue-500 to-blue-600 leading-6 py-1 px-4 font-bold border-none rounded cursor-pointer flex items-center text-center justify-center disabled:opacity-50 transition duration-500 transform hover:-translate-y-1"
        >
          Post<span className='ml-1 hidden sm:block'>$0.02</span>
        </button>
      </div>
    </div>
  )
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
      /* case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
          return <ul {...attributes}>{children}</ul>
        case 'heading-one':
          return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
          return <h2 {...attributes}>{children}</h2>
        case 'list-item':
          return <li {...attributes}>{children}</li>
        case 'numbered-list':
          return <ol {...attributes}>{children}</ol> */
      default:
        return (
          <p {...attributes} className="RichInput_inputLabel__QYxaP">
            {children}
          </p>
        );
    }
  };
  
  const Leaf = ({ attributes, children, leaf }) => {
    /* if (leaf.bold) {
        children = <strong>{children}</strong>
      }
    
      if (leaf.code) {
        children = <code>{children}</code>
      }
    
      if (leaf.italic) {
        children = <em>{children}</em>
      }
    
      if (leaf.underline) {
        children = <u>{children}</u>
      } */
  
    return <span {...attributes}>{children}</span>;
  };

export default Composer;


const B_PREFIX = `19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut`;
const AIP_PREFIX = `15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva`;
export const MAP_PREFIX = `1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5`;