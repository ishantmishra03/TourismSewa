from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api.gpt_api import get_response

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryModel(BaseModel):
    user_input: str

@app.get("/")
def root():
    return "Hello"

@app.post("/api/query")
async def query(data: QueryModel):
    try:
        city_data = await get_response(data.user_input)
        return city_data
    except Exception as e:
        return {"error": "Unexpected backend error.", "details": str(e)}

@app.get("/health")
async def health():
    return {"status": "ok"}
