from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import predict

app = FastAPI(title="X-Ray Analyzer AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "AI service running!"}

@app.post("/analyze")
async def analyze_xray(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        result = predict(image_bytes)

        return {
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "probabilities": result["probabilities"],
            "heatmap": "",
            "report": f"AI analysis suggests {result['prediction']} with {result['confidence']}% confidence.",
            "status": "success"
        }
    except Exception as e:
        print("PYTHON ANALYZE ERROR:", str(e))
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))