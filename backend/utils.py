from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

import os
import requests

from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
UNSPLASH_KEY = os.getenv('UNSPLASH_KEY')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

parser =  StrOutputParser()


def load_pdf(file_path):
    """
    Load a PDF file and return its content as a string.
    
    Args:
        file_path (str): Path to the PDF file.
        
    Returns:
        str: Content of the PDF file.
    """
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    return docs[0].page_content if docs else ""


import requests

def fallback_api():
    api2=os.getenv('api2')
    cse_id2=os.getenv('cse2')
    return api2,cse_id2

def fetch_unsplash_image(query):
    def make_request(api_key, cse_id):
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": api_key,
            "cx": cse_id,
            "q": query,
            "searchType": "image",
            "num": 1,
            "imgSize": "xlarge",
            "fileType": "png,jpg,jpeg,svg"
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            items = data.get("items")
            if items:
                print("✅ High-res Image URL:", items[0]["link"])
                return items[0]["link"]
            else:
                print("❌ No image found.")
        except Exception as e:
            print("❌ Error fetching image with given keys:", e)
        return None

    # First attempt
    result = make_request(os.getenv('api1'), os.getenv('cse1'))
    
    # Fallback to second key if first fails
    if not result:
        print("🔁 Trying fallback API key...")
        result = make_request(os.getenv('api2'), os.getenv('cse2'))

    return result


def fetch_youtube_video(query):
    try:
        full_query = f"{query} animated explainer for students"
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": full_query,
            "key": YOUTUBE_API_KEY,
            "maxResults": 3,
            "type": "video",
            "videoDuration": "short"
        }
        response = requests.get(url, params=params)
        data = response.json()

        if data.get("items"):
            for item in data["items"]:
                title = item["snippet"]["title"].lower()
                if any(k in title for k in ["animation", "animated", "explainer", "summary"]):
                    video_id = item["id"]["videoId"]
                    return f"https://www.youtube.com/watch?v={video_id}"
            video_id = data["items"][0]["id"]["videoId"]
            return f"https://www.youtube.com/watch?v={video_id}"
    except Exception as e:
        print(" YouTube fetch error:", e)
    return None

def clean_query(text):
    if not text or text.strip().lower() in ["null", "none", ""]:
        return None
    return text.lower().replace("youtube:", "").replace("search", "").strip()


def LLM_setup():
    """
    Set up the LLM model for text generation.
    
    Returns:
        ChatHuggingFace: Configured LLM model.
    """
    
    llm = HuggingFaceEndpoint(
        repo_id="meta-llama/Llama-3.1-8B-Instruct",
        task="text-generation",
        huggingfacehub_api_token=os.environ.get("HUGGINGFACE_TOKEN")
    )
    return ChatHuggingFace(llm=llm)


class PromptDesign:
    def prompt_for_quiz(self):
        """
        Create a prompt template for generating quizzes.
        
        Returns:
            PromptTemplate: Configured prompt template.
        """
        return PromptTemplate(
            template="""
            You are an expert quiz creator. Given the topic below, create a quiz with 15 questions.
            Each question should have 4 options, with one correct answer.
            Return the result in valid JSON format using this schema no strings or markdowns:

            {{
                "topic": "{topic}",
                "questions": [
                    {{
                        "question": "Question text?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "answer": "Correct option"
                    }},
                    ...
                ]
            }}

            --- TOPIC START ---
            {topic}
            --- TOPIC END ---
            """,
            input_variables=["topic"]
        )
    def prompt_for_topic_Planner(self):
        """
        Create a prompt template for the topic explainer.
        
        Returns:
            PromptTemplate: Configured prompt template.
        """
        return PromptTemplate(
        template=
        """
        You are an expert educational planner and curriculum designer.

        Given the extracted syllabus below, divide it into {total_days} days of learning.
        Each day should contain a logical set of topics from the syllabus. Return the result in a **valid JSON** format using this schema:

        {{
        "total_days": {total_days},
        "plan": [
            {{
            "day": "Day 1",
            "topics": "..."
            }},
            {{
            "day": "Day 2",
            "topics": "..."
            }},
            ...
        ]
        }}

        --- SYLLABUS START ---
        {retrieved_syllabus_text}
        --- SYLLABUS END ---
        """
        ,
        input_variables=["retrieved_syllabus_text", "total_days"]
        )
        
    def prompt_for_topic_explainer(self):
        return PromptTemplate(
        template="""
    You are a tutor bot teaching the topic \"{topic}\" step-by-step.
    Break it into 5 to 15 meaningful subtopics.
    For each subtopic, return:
    - \"title\": Subtopic name
    - \"explanation\": Clear, student-friendly explanation
    - \"image_suggestion\": If a diagram, chart, or photo would improve understanding, suggest a short and specific image search query. Include the topic’s key terms and the type of image (e.g., diagram, chart, photo, flowchart). Prefer educational formats like: 'X concept diagram', 'Y process flowchart', or 'Z model chart'. Return only the search query string. If not applicable, return null.
    - \"video_suggestion\": Always use null. The video will be suggested at the end of the topic.
    Respond ONLY in valid JSON list format:
    [
    {{
        \"title\": \"Subtopic Name\",
        \"explanation\": \"...\",
        \"image_suggestion\": \"... or null\",
        \"video_suggestion\": null
    }},
    ...
    ]
    """,
        input_variables=["topic"]
)
