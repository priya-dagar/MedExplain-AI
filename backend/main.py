from fastapi import FastAPI

app = FastAPI(title="MedExplain API")

@app.get("/")
def read_root():
    return {"message": "Welcome to MedExplain API"}
