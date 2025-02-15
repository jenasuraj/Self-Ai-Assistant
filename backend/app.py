import getpass
import os
from fastapi import FastAPI
from pydantic import BaseModel
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


load_dotenv() 
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize LangChain Chat Model
model = init_chat_model("llama3-8b-8192", model_provider="groq")

# FastAPI App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(request: QueryRequest):
    messages = [
        SystemMessage("You are an math ai assitant and you are capable of answering only mathematical questions and if someone asks you other then say i am only available for mathematical question"),
        HumanMessage(request.question),
    ]
    
    response = model.invoke(messages)  # Get response from Groq Llama 3 model
    return {"answer": response.content}  # Return the response text
