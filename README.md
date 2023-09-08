# GitHub action to add a `Reviewed-by` trailer

This action adds a `Reviewed-by` trailer to a pull request description when
there is an approving review.

## Inputs

### `github-token`

**Optional** The repository token to use for authentication.  Must have the
right to edit the pull request body.  By default, `${{ github.token }}` is
used.

## Example usage

```yaml
on:
  pull_request_review:
    branches:
      - main
    types:
      - submitted

jobs:
  approved:
    if: github.event.review.state == 'approved'
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: ntessore/add-reviewed-by-action@v1
```
