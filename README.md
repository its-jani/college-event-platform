# Campus Event Centralizer - AWS CloudOps Platform

A production-grade, three-tier cloud architecture hosting a centralized event dashboard for college clubs. Built with the PERN stack and fully provisioned on AWS using Terraform (IaC) and GitHub Actions (CI/CD).

## Architecture

- **Frontend:** React (Hosted on Amazon S3 + CloudFront CDN)
- **Backend:** Node.js / Express API (Docker container on Amazon EC2)
- **Database:** Managed PostgreSQL (Amazon RDS)
- **Infrastructure as Code:** Terraform
- **CI/CD Pipeline:** GitHub Actions

### Topology

The static and dynamic tiers are decoupled: the React bundle is served as objects, not from a server, while only the API and database consume compute.

```text
[ User Browser ]
       │
       ├───► [ CloudFront + S3 ] ──────► Static React Frontend
       │
       └───► [ EC2 Instance / Docker ] ──► Express API Engine
                     │
                     └───► [ RDS PostgreSQL ] ──► Private Database
```

## Security & Operations

- Strict Security Group isolation (RDS isolated in private subnets).
- Ephemeral environment strategy using `terraform destroy` for zero-cost teardowns during development.
- No secrets, `.env` files, AWS keys or Terraform state are committed — enforced by `.gitignore`.

## Repository Layout

```text
college-event-platform/
├── frontend/           # React code & S3 configuration
├── backend/            # Express.js API & Dockerfile
├── terraform/          # IaC (.tf files) for AWS resources
├── .github/workflows/  # CI/CD pipeline definitions
└── .gitignore          # Security guardrail
```

## Status

Day 1 complete: repository structure, security guardrails and architecture baseline. Application scaffolding, containerization and AWS provisioning follow in later milestones.
