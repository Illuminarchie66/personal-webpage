import json
from pathlib import Path

BASE_URL = "https://www.archie-harrodine.com"
AUTHOR = "Archie Harrodine"

def build_head(key, project):
    title = f"{AUTHOR} | {project['title']}"
    description = f"{project['title']} - {project['summary']}"
    url = f"{BASE_URL}/projects/{key}/"

    skills = project.get("skills", [])

    programming_languages = [
        s for s in skills
        if s in ["Python", "JavaScript", "HTML", "CSS", "C++", "Java", "C", "Go", "Rust", "Haskell", "Ruby", "PHP", "Swift", "Kotlin", "Unity", "Unreal Engine", "Django", "Flask", "React", "Vue", "Angular", "Node.js", "Express.js"]
    ]

    keywords = [
        s.lower() for s in skills
        if s not in programming_languages
    ]

    github = ""
    for link in project.get("links", []):
        if link["label"].lower() == "github":
            github = link["url"]

    head = f"""    
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Basic Meta -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title id="project-title">{title}</title>
    <meta name="description" content="{description}">
    <meta name="keywords" content="portfolio, projects, {', '.join(keywords)}">
    <meta name="author" content="{AUTHOR}">

    <!-- Favicon -->
	<link rel="icon" type="image/png" sizes="32x32" href="../../assets/icons/meta/favicon-v2-32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="../../assets/icons/meta/favicon-v2-16.png">
	<link rel="apple-touch-icon" sizes="180x180" href="../../assets/icons/meta/apple-touch-icon-v2.png">

    <!-- Canonical Url -->
    <link rel="canonical" href="{url}">

    <!-- Open Graph -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{BASE_URL}/assets/images/preview.png">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="website">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{BASE_URL}/assets/images/preview.png">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {json.dumps({
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": project["title"],
        "description": project["summary"],
        "author": {
            "@type": "Person",
            "name": AUTHOR,
            "url": BASE_URL
        },
        "url": url,
        "codeRepository": github,
        "programmingLanguage": programming_languages,
        "runtimePlatform": "Web Browser",
        "keywords": keywords
    }, indent=4)}
    </script>

    <!-- CSS -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/project_md.css">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

    <!-- KaTeX -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

    <!-- Prism -->
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js"></script>

    <!-- JS -->
    <script type="module" src="../../js/colors.js"></script>
    <script type="module" src="../../js/header.js"></script>
</head>

<body class="bg-bg-main text-text-text font-sans">

  <!-- Header -->
  <div id="header"></div>

  <div id="project-shell"></div>

  <script src="../../js/project_data.js"></script>
  <script src="../../js/project_page.js"></script>
</body>
</html>
"""
    return head


def generate_all(projects):
    output = {}

    for key, project in projects.items():
        output[key] = build_head(key, project)

    return output


if __name__ == "__main__":
    # Load your JSON file
    with open("../assets/project-data.json", "r") as f:
        projects = json.load(f)

    heads = generate_all(projects)

    # Print each block clearly separated
    for key, head in list(heads.items())[20:30]:  # Print only a subset for brevity
        print("\n" + "="*80)
        print(f"PROJECT: {key}")
        print("="*80)
        print(head)