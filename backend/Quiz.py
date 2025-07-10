from utils import LLM_setup,PromptDesign
from pydantic import BaseModel
from langchain_core.output_parsers.json import JsonOutputParser

class TopicRequest(BaseModel):
    topics: list[str]

def quiz(topic):

    model = LLM_setup()
    prompt = PromptDesign()
    prompt_template = prompt.prompt_for_quiz()
    parser = JsonOutputParser(key_name="questions")
    chain = prompt_template | model |  parser

    result = chain.invoke({"topic": topic})

    return result

