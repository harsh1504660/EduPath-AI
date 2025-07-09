from uuid import uuid4
from typing import Dict
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage
from utils import LLM_setup
session_memories: Dict[str, ConversationBufferMemory] = {}
def Qna(request):
    session_id = request.session_id or str(uuid4())
    topic = request.topic
    question = request.question

    # Create or get session memory
    if session_id not in session_memories:
        session_memories[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

        # Optional: seed the conversation with topic
        system_prompt = f"You are a helpful assistant answering questions on the topic: {topic}."
        session_memories[session_id].chat_memory.add_user_message(system_prompt)

    memory = session_memories[session_id]

    # Call the chat model with memory
    chat_history = memory.load_memory_variables({})["chat_history"]
    messages = chat_history + [HumanMessage(content=question)]
    
    model = LLM_setup()
    response = model(messages)
    
    # Update memory with the latest user and assistant messages
    memory.chat_memory.add_user_message(question)
    memory.chat_memory.add_ai_message(response.content)

    return response.content, session_id