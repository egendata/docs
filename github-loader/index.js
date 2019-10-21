const fetch = require('node-fetch');
const marked = require('marked');
const fs = require('fs');

async function getGitHubReadme(repo) {
    const url = 'https://raw.githubusercontent.com/' + repo + '/master/README.md';

    const response = await fetch(url);
    if (response.status === 403) {
        console.log('Failed to fetch readme from repository: ' + repo);
        return 'Failed to fetch readme from repository: ' + repo;
    }
    
    return response.text().then((body) => {

        marked.setOptions({
            baseUrl: 'https://github.com/' + repo + '/raw/master/',
            renderer: new marked.Renderer(),
            gfm: true,
            breaks: false,
            sanitizer: true,
        });
        
        const frontmatter = "---\n"
        + "linkTitle: " + repo + "\n"
        + "---\n\n";

        const html = marked(body);

        return frontmatter + html;
    });
}

function getAllGitHubReadmes(options) {
    if (!fs.existsSync(options.outputDir)){
        fs.mkdirSync(options.outputDir); 
    }

    for (var i=0; i<options.repositories.length; i++) {
        const repository = options.repositories[i];
        const outputPath = options.outputDir + '/' + repository.filename;
        
        getGitHubReadme(repository.url)
        .then((htmlSafe) => {    
            fs.writeFileSync(outputPath, htmlSafe);
        }).catch((err) => {
            console.log(err);
            throw "Unexpected failure when fetching GitHub readme"
        });
    }
}

const options = {
    outputDir: 'content/repositories',
    repositories: [
        { url: 'egendata/docs', filename: 'docs.html' },
        { url: 'egendata/app', filename: 'app.html' },
        { url: 'egendata/client', filename: 'client.html' },
        { url: 'egendata/operator', filename: 'operator.html' },
        { url: 'egendata/messaging', filename: 'messaging.html' },
        { url: 'egendata/infrastructure', filename: 'infrastructure.html' },
        { url: 'egendata/cli', filename: 'cli.html' },
        { url: 'egendata/example-cv', filename: 'example.cv.html' },
    ]
}

getAllGitHubReadmes(options);
