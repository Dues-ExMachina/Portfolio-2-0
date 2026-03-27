from pinecone import Pinecone
from dotenv import load_dotenv
import json
import os

load_dotenv()


def prepare_records(data: dict) -> list[dict]:
    records = []

    # 1. Bio + Skills
    skills = ", ".join(data.get("skills", []))
    certs = ", ".join(data.get("certifications", []))
    records.append({
        "id": "bio",
        "text": (
            f"Name: {data['name']}. Bio: {data['bio']}. "
            f"Skills: {skills}. "
            f"Education: {data.get('education', '')}. "
            f"Certifications: {certs}."
        ),
        "section": "bio",
    })

    # 2. Projects
    for i, proj in enumerate(data.get("projects", [])):
        tech = ", ".join(proj.get("tech_stack", []))
        url = proj.get("url", "")
        text = (
            f"Project: {proj['name']}. "
            f"Description: {proj['description']} "
            f"Tech stack: {tech}. "
            f"URL: {url}."
        )
        records.append({"id": f"project_{i}", "text": text, "section": "projects"})

    # 3. Experience
    for i, exp in enumerate(data.get("experience", [])):
        text = (
            f"Experience: {exp.get('role')} at {exp.get('company')} "
            f"({exp.get('period', '')}). {exp.get('description', '')}"
        )
        records.append({"id": f"experience_{i}", "text": text, "section": "experience"})

    # 4. Certifications (as individual records for better retrieval)
    for i, cert in enumerate(data.get("certifications", [])):
        records.append({
            "id": f"cert_{i}",
            "text": f"Certification: {cert}",
            "section": "certifications",
        })

    # 5. Contact
    contact = data.get("contact", {})
    records.append({
        "id": "contact",
        "text": (
            f"Contact: Email: {contact.get('email')}. "
            f"LinkedIn: {contact.get('linkedin')}. "
            f"GitHub: {contact.get('github')}. "
            f"Mobile: {contact.get('mobile')}. "
            f"Portfolio: {contact.get('portfolio')}."
        ),
        "section": "contact",
    })

    return records


def index_profile():
    # 1. Load profile.json (search relative to this script's location)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    profile_path = os.path.join(script_dir, "..", "..", "profile.json")
    profile_path = os.path.normpath(profile_path)

    try:
        with open(profile_path, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: profile.json not found at {profile_path}")
        return

    # 2. Build records
    records = prepare_records(data)
    print(f"Prepared {len(records)} records to index.")

    # 3. Connect to Pinecone
    api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME")

    if not api_key or not index_name:
        print("Error: PINECONE_API_KEY or PINECONE_INDEX_NAME env vars missing!")
        return

    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)

    # 4. Upsert (idempotent — safe to re-run)
    print("Upserting records into Pinecone...")
    try:
        index.upsert_records(namespace="agent", records=records)
        print(f"[OK] Successfully indexed {len(records)} records into '{index_name}' (namespace: agent).")
        for r in records:
            print(f"  • [{r['section']}] {r['id']}: {r['text'][:80]}...")
    except Exception as e:
        print(f"[ERROR] Error indexing: {e}")


if __name__ == "__main__":
    index_profile()