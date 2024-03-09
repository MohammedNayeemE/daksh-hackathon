
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loading';
import ChatModule from '../../components/chat'; 


type Question = {
  question: string;
  options: Record<string, string>;
};

interface Result {
  options: {
    [key: string]: string;
  };
  question: string;
}

interface Props {
  questions: Result[];
}

// Define Results component
const Results: React.FC<Props> = ({ questions }) => {
  return (
    <div>
     </div>
  );
};


const Quiz: React.FC = () => {

  const [moduleId, setmoduleId] = useState<number>(0);
  const [submoduleId, setsubmoduleId] = useState<number>(0);
  const [moduleName , setmoduleName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [score , setscore] = useState<number>(0);
  const [count , setcount] = useState(0);
  const [totalscore , settotalscore] = useState(0);
  const [loading , setloading] = useState<boolean>(false);


  const searchParams = useSearchParams();
  const info = searchParams.get('info');
  const router = useRouter();


  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (info) {
          console.log(info);
          
          const { moduleid, submoduleid  , moduleName} = JSON.parse(info);

          setmoduleId(moduleid);
          setsubmoduleId(submoduleid);
          setmoduleName(moduleName);
          const response = await axios.get(`http://localhost:6969/quiz/${moduleid}/${submoduleid}`);
          if (response.data && response.data.data && response.data.data.length > 0) {
            setQuestions(response.data.data[0].questions.questions);
          }
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [info]);


  const handleClick = async (score:number) => {
    setcount(count + 1);
    if (count >= 2) {
      if (totalscore >= 20) {
        router.push('/sucess');
      } else {
        router.push('/notsucess');
      }
      return;
    }
    setloading(true);

    setTimeout(async () => {
      try {
        const response = await axios.get(`http://localhost:6969/quiz/results/${moduleId}/${submoduleId}/${score}`);
        if (response && response.data) {
          setResults(response.data.data[0].questions.questions);
          settotalscore(totalscore + score);
          setscore(0);
          setloading(false);
        }
      } catch (err) {
        console.error(err);
        setscore(0);
        setloading(false);
      }
    }, 6000);
  };


  return (
    
    <>
    
      {loading ? (
        <>
         <div className='flex justify-center items-center flex-col'>
          <p className='text-center font-bold '>YOUR SCORE IS {score}</p>
          {score >= 7 ? (
            <>
            <p className = 'text-center font-semibold'>you seem to be smart, get ready for a harder one. Are you ready?</p>
            <video src="rizz.mp4"  autoPlay controls className="mx-auto mt-4 w-80 h-90" /> 
            <LoadingSpinner/>
            </>
          ) : (
            <>
            <p className = 'text-center font-semibold'>Better luck next time, try the next one.</p>
            <video src="crying.mp4"  autoPlay controls className="mx-auto mt-4 w-80 h-90" /> 
            <LoadingSpinner/>
            </>
          )}
          </div>
        </>
      ) : (
        <>
          {questions.length > 0 && (
            <div>
              <h1>Module ID: {moduleId}</h1>
              <h1>MODULE NAME : {moduleName}</h1>
              <h2>Submodule ID: {submoduleId}</h2>

              <div className='p-14'>
                <div className='flex flex-col justify-center items-center'>
                  <h2>Quiz Questions</h2>
                  <h2>ROUND {count}</h2>
                </div>
                {
                  results.length > 0 ? (
                    <>
                                 {results.length > 0 && (
            <div className='p-14'>
              {results.map((ele) => (
                <div className='bg-white divide-y divide-black rounded-xl' key={ele.question}>
                  <h1 className='text-black font-bold rounded p-3 hover:cursor-pointer m-2 hover:text-black'>{'Q.' + ele.question}</h1>
                  <p className='text-black rounded p-3 hover:bg-slate-400 hover:cursor-pointer hover:text-black m-2' onClick={() => { setscore(score + 3) }}>{'a. ' + ele.options['a']}</p>
                  <p className='text-black rounded p-3 hover:bg-slate-400 hover:cursor-pointer hover:text-black m-2' onClick={() => { setscore(score + 1) }}>{'b. ' + ele.options['b']}</p>
                  <p className='text-black rounded p-3 hover:bg-slate-400 hover:cursor-pointer hover:text-black m-2' onClick={() => { setscore(score + 5) }}>{'c. ' + ele.options['c']}</p>
                  <p className='text-black rounded p-3 hover:bg-slate-400 hover:cursor-pointer hover:text-black m-2' onClick={() => { setscore(score + 0) }}>{'d. ' + ele.options['d']}</p>
                </div>
              ))}
            </div>
            
          )}
          </>
                  ) :
                  (
                    <>

                                   {questions.map((ele) => (
                  <div className='bg-white divide-y divide-black rounded-xl' key={ele.question}>
                    <h1 className='text-black font-bold rounded p-3 hover:cursor-pointer m-2 hover:text-black'>{'Q.' + ele.question}</h1>
                    <p className='text-black rounded p-3 hover:bg-gradient-to-r from-indigo-500 hover:cursor-point hover:text-black m-2 hover:cursor-pointer' onClick={() => { setscore(score + 3) }}>{'a. ' + ele.options['a']}</p>
                    <p className='text-black rounded p-3 hover:bg-slate-400 hover:cursor-pointer hover:text-black m-2' onClick={() => { setscore(score + 1) }}>{'b. ' + ele.options['b']}</p>
                    <p className='text-black rounded p-3 hover:bg-slate-400 hover:cursor-pointer hover:text-black m-2' onClick={() => { setscore(score + 5) }}>{'c. ' + ele.options['c']}</p>
                    <p className='text-black rounded p-3 hover:bg-slate-400 hover:cursor-pointer hover:text-black m-2' onClick={() => { setscore(score + 0) }}>{'d. ' + ele.options['d']}</p>
                  </div>
                ))}

                    </>


                  )
                }

                <div className='flex justify-center items-center'>
                  <button className='p-4 bg-violet-500 rounded-md' onClick={() => handleClick(score)}>Get Results: {score}</button>
                </div>
              </div>
            </div>
          )}


        </>
      )}
      <ChatModule />  
    </>
  );
};

export default Quiz;
