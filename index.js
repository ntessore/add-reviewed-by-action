const core = require('@actions/core');
const github = require('@actions/github');
const execFileSync = require('node:child_process').execFileSync;

async function run() {
    const token = core.getInput('github-token', {required: true});
    const octokit = github.getOctokit(token);

    const context = github.context;
    const user = context.payload.review.user.login;
    const body = context.payload.pull_request.body;

    const bodyWithNewline = body.endsWith('\n') ? body : body + '\n';

    const reviewedBy = `Reviewed-by: @${user}`;

    console.log(reviewedBy);

    bodyWithTrailer = execFileSync('git', ['interpret-trailers',
        '--no-divider', '--where', 'after', '--trailer', reviewedBy],
        {input: bodyWithNewline}).toString();

    octokit.rest.pulls.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.issue.number,
        body: bodyWithTrailer,
    })
}

run()
.catch(error => core.setFailed(error.message))
