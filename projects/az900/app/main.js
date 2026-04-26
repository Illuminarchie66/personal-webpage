const response = await fetch('./questions.json');
const questions = await response.json();

const topics = {
    "Describe cloud computing": 0,
    "Describe the benefits of using cloud services": 0,
    "Describe cloud service types": 0,
    "Describe the core architectural components of Azure": 0,
    "Describe Azure compute and networking services": 0,
    "Describe Azure storage services": 0,
    "Describe Azure identity, access, and security": 0,
    "Describe cost management of Azure": 0,
    "Describe features and tools in Azure for governance and compliance": 0,
    "Describe features and tools for managing and deploying Azure resources": 0,
    "Describe monitoring tools in Azure": 0
}
const total = questions.length;

questions.forEach(question => {
    topics[question.topic]++;
});

console.log(topics);