def analyze_resume(text):
    return f"""
    ✅ Resume received successfully!

    Characters extracted: {len(text)}

    Sample content:
    {text[:500]}

    (This is a backend test response)
    """
