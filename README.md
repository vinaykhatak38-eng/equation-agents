# Quantum Agent Physics Lab

Quantum Agent Physics Lab is a full-stack AI physics learning website where students paste a physics problem and receive a structured, visual, step-by-step solution from an internal team of specialized solving agents.

## Tech Stack

- Next.js 16 with App Router and TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- KaTeX
- OpenAI Responses API
- OpenAI Images API with `gpt-image-1.5`, falling back to `gpt-image-1`
- Vercel deployment target

## Features

- Futuristic landing page with animated particles, glowing grid effects, and example problem shortcuts
- `/solve` workbench with original problem, detected topic, knowns, unknowns, equations, agent cards, steps, final answer, mistakes, assumptions, and dimensional checks
- Internal agent roster: Concept Agent, Variable Extraction Agent, Equation Selection Agent, Algebra Agent, Numerical Calculation Agent, Visualization Agent, and Final Explanation Agent
- `/api/solve` server route using the OpenAI Responses API with strict structured JSON output
- `/api/generate-visual` server route using GPT image models for educational visuals
- Dynamic educational visuals: animated equation reveal, Recharts graph, vector arrows, quantum wave, circuit sketch, and energy bars
- Built-in example problems for projectile motion, parallel resistance, photon energy, simple harmonic motion, and de Broglie wavelength
- Demo fallback responses when `OPENAI_API_KEY` is not configured, so the UI remains testable

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then add:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Optional model overrides:

```bash
OPENAI_SOLVER_MODEL=gpt-5.5
OPENAI_IMAGE_MODEL=gpt-image-1.5
```

Do not expose `OPENAI_API_KEY` in frontend code. The app only reads it inside server route handlers.

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Create a Vercel project from this repository.
2. Add `OPENAI_API_KEY` in Vercel Project Settings under Environment Variables.
3. Keep the framework preset as Next.js.
4. Deploy the project.

The app can deploy without `OPENAI_API_KEY`, but live AI solving and GPT image generation require the variable in production.

## API Routes

### `POST /api/solve`

Input:

```json
{
  "problem": "A projectile is launched at 20 m/s at 30 degrees. Find range and max height."
}
```

Output is structured solution JSON with topic, difficulty, variables, agents, equations, step-by-step solution, final answer, common mistakes, visualization plan, image prompt, assumptions, and dimensional check.

### `POST /api/generate-visual`

Input:

```json
{
  "imagePrompt": "Futuristic diagram of a projectile arc...",
  "topic": "Projectile motion"
}
```

Output:

```json
{
  "image": "data:image/png;base64,...",
  "modelUsed": "gpt-image-1.5",
  "source": "openai"
}
```

## Future Improvements

- Add persistent solve history and shareable solution URLs
- Add teacher review mode and rubric-aligned feedback
- Add streaming agent status from the server
- Add topic-specific simulations for circuits, thermodynamics, and relativity
- Add account-based saved notebooks
