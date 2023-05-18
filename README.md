# GitHub action to add `Reviewed-by`

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
    types: [submitted]

jobs:
  approved:
    name: Review approved
    if: github.event.review.state == 'approved'
    runs-on: ubuntu-latest
    steps:
      - name: Add Reviewed-By
        uses: ntessore/add-reviewed-by-action@v1
```
