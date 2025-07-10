from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from fastapi import FastAPI, UploadFile, File    ,Form
from typing import List, Dict
from Qna import Qna
from uuid import uuid4
from TopicPlanner import TopicPlanner

from pydantic import BaseModel
from TopicExplainer import topicExplainer
from utils import load_pdf,LLM_setup
from Quiz import quiz 
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatHuggingFace
from langchain.llms import HuggingFaceEndpoint

from tempfile import NamedTemporaryFile
import shutil

app = FastAPI()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://edu-path-ai-swart.vercel.app/"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,  # Only True if you're using cookies/auth headers
)
@app.get("/")
def root():
    return {"message" : "The site is live!"}

@app.get("/health")
def health_check(): 
    return {"status": "ok"}

@app.post("/planner")
async def planner(total_days: int = Form(...), file: UploadFile = File(...)):
    # Save the uploaded file to a temp file
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    # Now load the PDF using PyPDFLoader
    retrieved_syllabus_text = load_pdf(temp_file_path)
    
    # Process your planner logic
    result = TopicPlanner(
        retrieved_syllabus_text=retrieved_syllabus_text, 
        total_days=total_days
    )
    
    return {"endpoint test": result}



class TopicRequest(BaseModel):
    topics: list[str]


@app.post("/quiz")
def quizz(payload: TopicRequest):
    result = quiz(payload.topics[0])
    print(result)
    return {"result": result}

@app.post("/explainer")
def explainer(payload: TopicRequest):    
    # Load the LLM model
    results = topicExplainer(topics=payload.topics)
    return {"results": results}

class TopicManual(BaseModel):
    total_days:int
    topic :str

@app.post('/planner-manual')
def planner_for_manual(request : TopicManual):
    retrived_topic = request.topic

    
    total_days = request.total_days
    print(total_days,"==========================================================")
    result = TopicPlanner(
        retrieved_syllabus_text=retrived_topic, 
        total_days=total_days
    )
    print(result)
    return {"endpoint test":result}

class ChatRequest(BaseModel):
    session_id: str
    topic: str
    question: str

class ChatResponse(BaseModel):
    answer: str
    session_id: str
@app.post("/qna", response_model=ChatResponse)
async def llm_chat(request: ChatRequest):
    answer,session_id = Qna(request)
    return ChatResponse(answer=answer, session_id=session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)