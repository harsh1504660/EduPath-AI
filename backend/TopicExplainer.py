import json
import re
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
import json
from utils import fetch_unsplash_image, fetch_youtube_video, clean_query, LLM_setup,PromptDesign
from langchain_core.output_parsers import StrOutputParser


# Load API  keys
load_dotenv()
UNSPLASH_KEY = 'rtmBiR_8-2f0H2MMbJObYI7THw8DUI3Js5mbWF_A3oo'
YOUTUBE_API_KEY = 'AIzaSyDkmryIR2bWT7QKUSeCkAxqy9hpIYn2vp4'


# ------------------ Media Fetchers ------------------

def topicExplainer(topics):
    results = []
    llm = LLM_setup()
    Prompt = PromptDesign()
    topic_prompt = Prompt.prompt_for_topic_explainer()
    parser = StrOutputParser()
    topic_chain = topic_prompt | llm | parser
    for topic in topics:
        result = {"topic": topic, "steps": [], "video": None}
        response = topic_chain.invoke({"topic": topic})

        try:
            match = re.search(r"\[\s*{.*?}\s*\]", response, re.DOTALL)
            if not match:
                raise ValueError("No valid JSON found.")
            subtopics = json.loads(match.group(0))
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e), "raw_response": response})

        for sub in subtopics:
            step = {
                "title": sub["title"],
                "explanation": sub["explanation"],
                "image": None
            }
            img_query = clean_query(sub.get("image_suggestion"))
            print(f"Image query for '{sub['title']}': {img_query}")
            if img_query:
                step["image"] = fetch_unsplash_image(img_query)
            result["steps"].append(step)

        result["video"] = fetch_youtube_video(topic)
        results.append(result)
        return results