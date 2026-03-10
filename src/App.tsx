/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Copy, Sparkles, RefreshCw, Download, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const categories = {
  image: {
    label: "Image Prompt",
    toneOptions: ["Cinematic", "Epic", "Luxury", "Dark", "Bright", "Minimal"],
    fields: [
      { key: "subject", label: "Main subject", placeholder: "ancient treehouse city" },
      { key: "style", label: "Art style", placeholder: "hyper-realistic concept art" },
      { key: "lighting", label: "Lighting", placeholder: "golden hour volumetric light" },
      { key: "details", label: "Extra details", placeholder: "floating lanterns, mist, intricate wood textures" },
    ],
    buildPrompt: (v: any) =>
      `You are an expert AI image generation prompt engineer. Create a highly detailed, ${v.tone.toLowerCase()} ${v.style || "high-fidelity visual"} depicting ${v.subject || "the main subject"}.

Lighting & Atmosphere: Ensure the scene features ${v.lighting || "dramatic, cinematic lighting with deep shadows and bright highlights"}. The mood should be evocative and immersive.
Details & Elements: Incorporate ${v.details || "intricate textures, rich environmental storytelling, and layered background elements"}.
Camera & Composition: Frame the shot with a polished, visually striking composition (e.g., rule of thirds, leading lines). Use a high-end lens effect (like 35mm or 85mm, f/1.8 for shallow depth of field if appropriate).
Quality Modifiers: 8k resolution, masterpiece, trending on ArtStation, hyper-realistic, highly detailed, volumetric lighting, physically based rendering (PBR).
Negative Prompt: Avoid low detail, blur, distortion, bad anatomy, extra limbs, low contrast, cluttered composition, unreadable text, watermarks, and artifacts.`
  },
  marketing: {
    label: "Marketing Prompt",
    toneOptions: ["Professional", "Bold", "Luxury", "Friendly", "Direct", "High-Converting"],
    fields: [
      { key: "product", label: "Product or service", placeholder: "AI resume builder" },
      { key: "audience", label: "Target audience", placeholder: "job seekers needing a fast professional resume" },
      { key: "goal", label: "Goal", placeholder: "increase signups" },
      { key: "usp", label: "Unique Selling Proposition (USP)", placeholder: "build and download a polished resume in under 10 minutes" },
      { key: "ctaType", label: "CTA Type", placeholder: "e.g., 'Sign Up', 'Learn More'" },
      { key: "ctaTone", label: "CTA Tone", placeholder: "e.g., 'Urgent', 'Friendly', 'Direct'" },
      { key: "keywords", label: "Keywords (include/exclude)", placeholder: "include: 'free trial', exclude: 'cheap'" },
    ],
    buildPrompt: (v: any) =>
      `Act as a world-class copywriter and marketing strategist. Write a ${v.tone.toLowerCase()} marketing campaign for ${v.product || "the product/service"} specifically tailored to ${v.audience || "the target audience"}.

Primary Objective: ${v.goal || "Drive immediate conversions and maximize engagement"}.
Unique Selling Proposition (USP): ${v.usp || "Highlight the strongest benefits, unique features, and why this is superior to alternatives"}.
Keywords to consider: ${v.keywords || "None specified"}.

Structure the output as follows:
1. Hook: A scroll-stopping headline that immediately addresses the audience's core pain point or desire.
2. The Problem/Agitation: Briefly validate the challenge they are facing.
3. The Solution: Introduce the product as the perfect answer.
4. Key Benefits: 3-4 bullet points focusing on outcomes (not just features).
5. Social Proof/Credibility: A brief statement building trust.
6. Call to Action (CTA): A clear, compelling, and ${v.ctaTone ? v.ctaTone.toLowerCase() : "persuasive"} next step. The CTA should be focused on '${v.ctaType || "taking action"}'.

Ensure the language is modern, persuasive, and optimized for high conversion rates without sounding overly salesy.`
  },
  code: {
    label: "Code Prompt",
    toneOptions: ["Production", "Minimal", "Scalable", "Beginner-Friendly", "Fast MVP", "Enterprise"],
    fields: [
      { key: "app", label: "What to build", placeholder: "React app for a prompt generator" },
      { key: "stack", label: "Tech stack", placeholder: "React, Tailwind, Node, Express" },
      { key: "features", label: "Features", placeholder: "copy button, category selector, export prompt" },
      { key: "details", label: "Constraints", placeholder: "single-file MVP, clean UI, mobile responsive" },
    ],
    buildPrompt: (v: any) =>
      `You are an elite, senior software engineer and architect. Your task is to build a fully functional, production-ready implementation of: ${v.app || "the requested application"}.

Tech Stack: ${v.stack || "React, TypeScript, Tailwind CSS, and Node.js"}.
Core Features: ${v.features || "A complete, functional MVP with core user flows"}.
Constraints & Requirements: ${v.details || "Ensure clean architecture, comprehensive inline comments, and a fully responsive, accessible UI"}.

CRITICAL INSTRUCTIONS FOR FUNCTIONAL CODE:
1. NO PLACEHOLDERS: Write 100% complete, runnable code. Do not use comments like "// implement later", "// add logic here", or "TODO". Every function, component, and style must be fully implemented.
2. FILE STRUCTURE: Clearly separate multiple files using markdown code blocks with the exact file path/name above each block (e.g., \`src/App.tsx\`).
3. DEPENDENCIES: Provide a complete list of required terminal commands to install all necessary dependencies (e.g., \`npm install ...\`).
4. IMPORTS: Ensure all imports are accurate and resolve correctly. Do not import non-existent libraries or components.
5. ERROR HANDLING: Implement robust error handling, loading states, and edge-case management.
6. TYPE SAFETY: If using TypeScript, define all necessary interfaces and types. Avoid using 'any'.
7. EXECUTION: Provide clear, step-by-step instructions on how to start and run the application.

Your output must be a complete, working solution that the user can copy, paste, and run immediately without debugging.`
  },
  writing: {
    label: "Writing Prompt",
    toneOptions: ["Compelling", "Formal", "Emotional", "Sharp", "Story-Driven", "Persuasive"],
    fields: [
      { key: "topic", label: "Topic", placeholder: "why small businesses should use AI" },
      { key: "audience", label: "Audience", placeholder: "small business owners" },
      { key: "format", label: "Format", placeholder: "blog post" },
      { key: "details", label: "Key points", placeholder: "save time, improve customer replies, lower costs" },
    ],
    buildPrompt: (v: any) =>
      `You are a Pulitzer-prize winning author and expert communicator. Write a ${v.tone.toLowerCase()} ${v.format || "comprehensive piece"} focusing on ${v.topic || "the specified topic"}. Your target audience is ${v.audience || "a general but engaged readership"}.

Key Points to Cover:
${v.details || "- Provide a deep dive into the subject matter.\n- Offer unique insights and actionable takeaways.\n- Conclude with a strong, memorable closing thought."}

Writing Guidelines:
- Structure: Organize the content with a captivating introduction, well-paced body paragraphs with clear transitions, and a powerful conclusion.
- Style & Voice: Maintain a ${v.tone.toLowerCase()} tone throughout. Use vivid imagery, varied sentence structures, and active voice to keep the reader engaged.
- Formatting: Use appropriate markdown formatting (headings, bullet points, bold text) to make the content highly readable and scannable.
- Originality: Ensure the perspective is fresh, avoiding clichés and generic AI-sounding phrases. Make it feel human, empathetic, and authoritative.`
  },
};

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [category, setCategory] = useState<keyof typeof categories>("image");
  const config = categories[category];
  const [tone, setTone] = useState(config.toneOptions[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setTone(categories[category].toneOptions[0]);
    setValues({});
  }, [category]);

  const prompt = useMemo(() => config.buildPrompt({ ...values, tone }), [config, values, tone]);

  const onGenerate = () => {
    const item = {
      id: Date.now(),
      category: config.label,
      tone,
      prompt,
      createdAt: new Date().toLocaleString(),
    };
    setHistory((prev) => [item, ...prev].slice(0, 8));
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const randomize = () => {
    const starters: Record<string, any> = {
      image: {
        subject: "a futuristic driftwood sanctuary in the forest",
        style: "cinematic concept art",
        lighting: "blue-orange rim lighting with soft fog",
        details: "fine textures, dramatic atmosphere, crystal-clear focal point"
      },
      marketing: {
        product: "prompt generator app",
        audience: "creators and solo founders",
        goal: "increase paid conversions",
        usp: "fast prompt generation, clean UI, multiple categories",
        ctaType: "Start Free Trial",
        ctaTone: "Urgent",
        keywords: "include: 'AI-powered', 'save time'; exclude: 'complex'"
      },
      code: {
        app: "a prompt generator web app",
        stack: "React, Tailwind CSS, Node.js",
        features: "category presets, copy button, export, history",
        details: "single-file front-end MVP, polished layout"
      },
      writing: {
        topic: "using AI to accelerate solo business growth",
        audience: "small business owners",
        format: "LinkedIn post",
        details: "save time, improve content quality, generate ideas faster"
      }
    };
    setValues(starters[category]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2">
          <Card className="rounded-3xl border-slate-800 bg-slate-900 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Sparkles className="w-7 h-7" /> Synthra
                  </CardTitle><title>Synthra</title>
                  <p className="text-slate-400 mt-2">Precision AI Prompt Engineering</p>
                </div>
                <Button variant="outline" className="rounded-2xl" onClick={randomize}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Fill Sample
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Category</label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, item]) => (
                        <SelectItem key={key} value={key}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950">
                      <SelectValue placeholder="Choose tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {config.toneOptions.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {config.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm text-slate-300 mb-2 block">{field.label}</label>
                    <Input
                      className="rounded-2xl border-slate-700 bg-slate-950"
                      placeholder={field.placeholder}
                      value={values[field.key] || ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-500" onClick={onGenerate}>
                  <Wand2 className="w-4 h-4 mr-2" /> Generate Prompt
                </Button>
                <Button variant="secondary" className="rounded-2xl" onClick={onCopy}>
                  <Copy className="w-4 h-4 mr-2" /> {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" className="rounded-2xl" onClick={() => downloadText(`${category}-prompt.txt`, prompt)}>
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Generated Prompt</label>
                <Textarea
                  value={prompt}
                  readOnly
                  className="min-h-[220px] rounded-2xl border-slate-700 bg-slate-950 text-slate-100"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="rounded-3xl border-slate-800 bg-slate-900 shadow-2xl h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                    Generate a prompt to save it here.
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{item.category}</p>
                        <span className="text-xs text-slate-500">{item.tone}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.createdAt}</p>
                      <p className="text-sm text-slate-300 mt-3 line-clamp-6">{item.prompt}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 px-0"
                        onClick={() => navigator.clipboard.writeText(item.prompt)}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Copy again
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

