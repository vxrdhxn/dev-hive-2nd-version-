import os
import time
from pinecone import Pinecone, ServerlessSpec, PodSpec
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

def init_pinecone():
    api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME")
    
    if not api_key or not index_name:
        print("Error: PINECONE_API_KEY and PINECONE_INDEX_NAME must be set in .env")
        return

    if "your_" in api_key or "your_" in index_name:
         print("Error: You are still using placeholder values in .env. Please update them with your actual keys.")
         return

    print(f"Connecting to Pinecone...")
    pc = Pinecone(api_key=api_key)

    existing_indexes = [index.name for index in pc.list_indexes()]
    
    if index_name in existing_indexes:
        print(f"Index '{index_name}' already exists.")
        
        # Check dimension
        try:
            index_info = pc.describe_index(index_name)
            if index_info.dimension != 768:
                 print(f"\nWARNING: Index '{index_name}' has dimension {index_info.dimension}, but Gemini requires 768.")
                 print(f"Deleting and recreating index...")
                 pc.delete_index(index_name)
                 time.sleep(5) # Wait for deletion
                 
                 # Recreate
                 print(f"Creating index '{index_name}' with dimension 768...")
                 pc.create_index(
                    name=index_name,
                    dimension=768, # Dimension for text-embedding-004
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                 )
                 print(f"Successfully created index '{index_name}'")
                 while not pc.describe_index(index_name).status['ready']:
                    time.sleep(1)
                 print("Index is ready!")
            else:
                 print(f"Index dimension is correct (768).")
        except Exception as e:
            print(f"Could not verify index dimension: {e}")
    else:
        print(f"Creating index '{index_name}'...")
        try:
            # Create a serverless index in us-east-1
            # You can change the region if needed
            pc.create_index(
                name=index_name,
                dimension=768, # Dimension for text-embedding-004
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region='us-east-1'
                )
            )
            print(f"Successfully created index '{index_name}'")
            
            # Wait for index to be ready
            while not pc.describe_index(index_name).status['ready']:
                time.sleep(1)
            print("Index is ready!")
            
        except Exception as e:
            print(f"Failed to create index: {e}")
            print("\nIf you are on the free tier, you might not be able to create a Serverless index in this region.")
            print("Please create the index manually in the Pinecone console with:")
            print(f"  - Name: {index_name}")
            print(f"  - Dimensions: 768")
            print(f"  - Metric: cosine")

if __name__ == "__main__":
    init_pinecone()
