# GitHub Main Branch Protection Rules

To safeguard production integrity and maintain high code quality across the **Kabadiwala Connect** monorepo, the `main` branch is protected with the following rules:

---

## 1. Branch Protection Policy for `main`

### A. Pull Request Reviews
- **Require a pull request before merging:** Enabled.
- **Required approvals:** Minimum 1 peer code review.
- **Dismiss stale pull request approvals when new commits are pushed:** Enabled.
- **Require review from Code Owners:** Enabled (Code Owners defined for `backend/`, `mobile/`, `ml/`).

### B. Status Checks
- **Require status checks to pass before merging:** Enabled.
- **Required checks:**
  - `validate-contracts` (Validates all JSON schemas, taxonomy files, and API contracts)
  - `lint-and-test` (Verifies core structure and design tokens)
- **Require branches to be up to date before merging:** Enabled.

### C. Safety & Governance
- **Do not allow bypassing the above settings:** Enforced for all contributors, including administrators.
- **Restrict who can push to matching branches:** Direct pushes to `main` are disabled. All changes must arrive via verified PRs.
- **Require linear history:** Squash and merge or rebase merge only (avoids noisy merge commits).
- **Require signed commits:** Recommended (GPG/SSH signature verification).

---

## 2. GitHub CLI Configuration Command

When connecting to the remote GitHub repository (`gh repo create`), apply the rules via GitHub CLI:

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/:owner/kabadiwala-connect/branches/main/protection \
  -f required_status_checks='{"strict":true,"contexts":["validate-contracts","lint-and-test"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' \
  -f restrictions=null
```
