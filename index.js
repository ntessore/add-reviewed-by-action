const core = require('@actions/core')
const github = require('@actions/github')
const execFileSync = require('node:child_process').execFileSync

async function run() {
    const token = core.getInput('github-token', { required: true })
    const octokit = github.getOctokit(token)

    const context = github.context
    const username = context.payload.review.user.login
    const body = context.payload.pull_request.body ?? ""

    const { data: user } = await octokit.rest.users.getByUsername({
        username,
    })

    var reviewer
    if (user.name) {
        if (user.email) {
            reviewer = `[${user.name}](https://github.com/${username}) <${user.email}>`
        } else {
            reviewer = `[${user.name}](https://github.com/${username})`
        }
    } else {
        reviewer = `[${username}](https://github.com/${username})`
    }

    const bodyWithNewline = body.endsWith('\n') ? body : body + '\n'

    const reviewedBy = `Reviewed-by: ${reviewer}`

    console.log(reviewedBy)

    bodyWithTrailer = execFileSync('git', ['interpret-trailers',
        '--no-divider', '--where', 'after', '--trailer', reviewedBy],
        { input: bodyWithNewline }).toString()

    octokit.rest.pulls.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.issue.number,
        body: bodyWithTrailer,
    })
}

run()
    .catch(error => core.setFailed(error.message))
