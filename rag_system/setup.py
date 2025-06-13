from setuptools import setup, find_packages

setup(
    name="serene_rag_backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "faiss-cpu",
        "sentence-transformers",
        "nltk",
        "pydantic"
    ]
)
