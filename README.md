# MindLink DAO Facilitator

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/gethelpelevate-9675s-projects/v0-mind-link-dao-facilitator)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/dhXGMUtSU73)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/gethelpelevate-9675s-projects/v0-mind-link-dao-facilitator](https://vercel.com/gethelpelevate-9675s-projects/v0-mind-link-dao-facilitator)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/dhXGMUtSU73](https://v0.app/chat/projects/dhXGMUtSU73)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

---

## Somnia Mainnet Configuration

- Chain ID: `50312`
- RPC URL: `https://api.infra.mainnet.somnia.network/`

Set the following environment variables:

- `NEXT_PUBLIC_SOMNIA_RPC_URL="https://api.infra.mainnet.somnia.network/"`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="<your_walletconnect_project_id>"` (defaults to `demo` if not set)
- `OPENAI_API_KEY="<your_openai_api_key>"` for AI summaries (optional)
- `NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS="0xYourContractAddressHere"` (to be updated after mainnet deployment)

The app uses RainbowKit + Wagmi configured for Somnia Mainnet. If `NEXT_PUBLIC_SOMNIA_RPC_URL` is not set, it falls back to the mainnet RPC above.

## Onboarding Gate UX

- Root path `/` forces the onboarding experience until a wallet is connected.
- Once connected, the app redirects to `/dashboard`.
- As a fallback, protected routes like `/dashboard` also check connection and redirect back to `/` if unauthenticated.

## On‑Chain Proposals

- Production reads should come from an on‑chain `MindLinkDAO` contract on Somnia Mainnet.
- Configure `NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS` with your deployed address.
- Example placeholder: `0xYourContractAddressHere` (replace once deployed on mainnet).
- Voting UI is wired via Wagmi to `voteYes`/`voteNo` functions against the configured address.