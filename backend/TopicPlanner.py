from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
from utils import PromptDesign, load_pdf

# Step 1:  Load PDF

#  Step 2: Define Pydantic schema for structured output
class DayWisePlan(BaseModel):
    day: str
    topics: str

class StudyPlan(BaseModel):
    total_days: int
    plan: List[DayWisePlan]

# Step 3: Define prompt with strict instruction for JSON


# Step 4: Load model

def TopicPlanner(retrieved_syllabus_text,total_days):

    Prompt = PromptDesign()
    print("===========================",retrieved_syllabus_text)
    prompt = Prompt.prompt_for_topic_Planner()
    llm = HuggingFaceEndpoint(
        repo_id="meta-llama/Llama-3.1-8B-Instruct",
        task="text-generation",
    )
    model = ChatHuggingFace(llm=llm)

    # Step 5: Set up output parser
    parser = PydanticOutputParser(pydantic_object=StudyPlan)

    # Step 6: Compose chain
    chain = prompt | model | parser

    # Step 7: Invoke chain
    result = chain.invoke({
        "retrieved_syllabus_text": retrieved_syllabus_text,
        "total_days": total_days
    })

    

    # Step 8: Use result in your backend (dict or JSON)
    return result.dict()


