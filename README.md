# MindLink : AI-Powered DAO Decision Assistant

> An AI-enhanced governance tool that helps DAO members understand proposals faster, vote smarter, and stay aligned.

---

## 📌 What is MindLink?

MindLink is an AI-powered DAO governance facilitator designed to simplify decentralized decision-making.  
It fetches real on-chain proposals, summarizes them using AI, and helps members make informed voting decisions in seconds — instead of hours of reading.

Ideal for **DAO members, contributors, and core teams** who want fast clarity and more aligned votes.

---

## 🚀 Live Deployment

🔗 **Live App:**  
https://mindlink.framer.ai/
---

## 🧩 Features

| Feature | Description |
|--------|--------------|
| 🔗 Wallet-based Onboarding | Users must connect their wallet before accessing the app |
| 🧠 AI Proposal Summaries | AI generates simple summaries to make proposals easy to understand |
| 📊 Proposal Dashboard | View active proposals, votes, DAO member stats, and recent on-chain activity |
| ⚙️ On-Chain Reading | Fetch proposals directly from the Somnia network |
| 🔐 Gated User Flow | Dashboard routes protected until wallet connection |

---

## ⚙️ Tech Stack

- **Next.js 15**
- **RainbowKit + Wagmi** (Somnia Wallet Integration)
- **TailwindCSS + shadcn/ui + daisyUI**
- **Vercel (hosting)**
- **Gemini (for AI summaries)** 

---

## 🔧 Environment Setup

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SOMNIA_RPC_URL="https://api.infra.mainnet.somnia.network/"
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS="0xYourContractAddressHere"
GEMINI_API_KEY="your_openai_api_key" # optional
