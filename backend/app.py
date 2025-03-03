import os
from fastapi import FastAPI
from pydantic import BaseModel
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from langchain.prompts import PromptTemplate
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
from langchain.memory import ConversationBufferMemory

# Load env
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize the model
model = init_chat_model("llama3-8b-8192", model_provider="groq")

# FastAPI setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, limit to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global memory (keeps history between requests - reset server to clear)
memory = ConversationBufferMemory(return_messages=True)

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(request: QueryRequest):
    duckduckgo = DuckDuckGoSearchAPIWrapper()
   

    try:
        data = request.question
        response = duckduckgo.run(data)

        promptData = """
        User's question: {data}
        Previous conversation history: {history}
        
        If the user request is related to general talk like hello, hii, greetings etc, 
        then respond like a normal AI assistant in 1-2 lines.
        Otherwise, summarize this search result for the user query: {response}
        """

        # Retrieve chat history from memory
        history = memory.load_memory_variables({}).get("history", "")

        prompt = PromptTemplate.from_template(promptData)

        # Build the chain with prompt and model
        chain = prompt | model

        # Invoke the chain with history, search response, and new question
        mainResponse = chain.invoke({"response": response, "data": data, "history": history})

        # Save this interaction to memory
        memory.save_context({"input": data}, {"output": mainResponse.content})

        return {"answer": mainResponse.content}

    except Exception as e:
        return {"error": f"Something went wrong: {str(e)}"}
