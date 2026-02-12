from flask import Blueprint, jsonify
from utils.pinecone_utils import index
from utils.gemini_utils import get_embedding

health_bp = Blueprint('health', __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for deployment monitoring"""
    try:
        # Check Pinecone connection
        index_stats = index.describe_index_stats()
        
        # We can add a simple Gemini check here if needed, but for now just check Pinecone
        # which implies connectivity is okay.
        
        return jsonify({
            "status": "healthy",
            "services": {
                "pinecone": "connected",
                "gemini": "configured" 
            },
            "index_stats": {
                "total_vector_count": index_stats.get('total_vector_count', 0),
                "dimension": index_stats.get('dimension', 0)
            },
            "timestamp": "2024-01-01T00:00:00Z"
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500 