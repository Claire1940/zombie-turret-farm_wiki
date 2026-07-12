"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  Boxes,
  Check,
  ExternalLink,
  Gift,
  LayoutGrid,
  Moon,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Maps a Tools Grid card index to the section id it should scroll to.
// Order matches tools.cards in en.json.
const TOOLS_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "turret-tier-list",
  "turrets-and-rarities",
  "upgrade-guide",
  "best-base-layout",
  "afk-farming-guide",
  "updates",
];

// Tier accent classes for the tier-list module.
const TIER_ACCENTS: Record<string, string> = {
  S: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
  A: "bg-sky-500/10 border-sky-500/40 text-sky-400",
  B: "bg-amber-500/10 border-amber-500/40 text-amber-400",
  C: "bg-rose-500/10 border-rose-500/40 text-rose-400",
};

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.zombie-turret-farm.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Zombie Turret Farm Wiki",
        description:
          "Zombie Turret Farm Wiki with verified codes, turret rankings, upgrade paths, base layouts, AFK income tips, offline farming help, and Roblox update news.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 500,
          height: 279,
          caption: "Zombie Turret Farm - Idle Turret Defense AFK Farming Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Zombie Turret Farm Wiki",
        alternateName: "Zombie Turret Farm",
        url: siteUrl,
        description:
          "Zombie Turret Farm Wiki resource hub for codes, turrets, tier lists, upgrades, base layouts, and AFK farming guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 500,
          height: 279,
          caption: "Zombie Turret Farm Wiki - Idle Turret Defense AFK Farming",
        },
        sameAs: [
          "https://www.roblox.com/games/70790155462881/Zombie-Turret-Farm",
          "https://www.roblox.com/communities/383912360/BrainRot-Zombies-Inc",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Zombie Turret Farm",
        gamePlatform: ["PC", "Mobile", "Roblox"],
        applicationCategory: "Game",
        genre: ["Tower Defense", "Idle", "Simulator", "AFK Farming"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/70790155462881/Zombie-Turret-Farm",
        },
      },
      {
        "@type": "VideoObject",
        name: "Zombie Turret Farm Gameplay",
        description:
          "Zombie Turret Farm gameplay preview showing turret placement, zombie defense, and AFK income farming.",
        uploadDate: "2025-01-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/I8u6mNDFPzs",
        url: "https://www.youtube.com/watch?v=I8u6mNDFPzs",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();
  const codes = t.modules.zombieTurretFarmCodes;
  const beginner = t.modules.zombieTurretFarmBeginnerGuide;
  const tierList = t.modules.zombieTurretFarmTurretTierList;
  const turrets = t.modules.zombieTurretFarmTurretsAndRarities;
  const upgrades = t.modules.zombieTurretFarmUpgradeGuide;
  const layouts = t.modules.zombieTurretFarmBestBaseLayout;
  const afk = t.modules.zombieTurretFarmAFKFarmingGuide;
  const updates = t.modules.zombieTurretFarmUpdates;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位（侧边栏广告位，暂未启用） */}
      {/* <aside className="hidden xl:block fixed top-20 w-40 z-10" style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}>
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside> */}
      {/* <aside className="hidden xl:block fixed top-20 w-40 z-10" style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}>
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/70790155462881/Zombie-Turret-Farm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="I8u6mNDFPzs"
              title="Zombie Turret Farm Gameplay"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (after video, before modules & latest updates) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes & Rewards */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Gift className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {codes.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {codes.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {codes.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {codes.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 scroll-reveal">
            {codes.items.map((item: any, index: number) => {
              const available = item.status === "available";
              return (
                <div
                  key={index}
                  className={`p-5 md:p-6 rounded-xl border transition-colors ${
                    available
                      ? "bg-[hsl(var(--nav-theme)/0.05)] border-[hsl(var(--nav-theme)/0.4)]"
                      : "bg-white/5 border-border"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-lg md:text-xl">
                      {item.code}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        available
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-border text-muted-foreground"
                      }`}
                    >
                      {available ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mb-4 text-sm md:text-base text-muted-foreground">
                    {item.reward}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                      How to claim
                    </p>
                    <ol className="space-y-1.5">
                      {item.instructions.map((step: string, si: number) => (
                        <li key={si} className="flex items-start gap-2 text-sm">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.15)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                            {si + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {beginner.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {beginner.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {beginner.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {beginner.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {beginner.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <p className="text-sm text-[hsl(var(--nav-theme-light))] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {step.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Turret Tier List */}
      <section id="turret-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {tierList.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {tierList.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {tierList.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {tierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {tierList.tiers.map((tier: any, index: number) => {
              const accent = TIER_ACCENTS[tier.tier] || TIER_ACCENTS.C;
              return (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3 md:w-48 md:flex-shrink-0">
                      <span
                        className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl border text-2xl md:text-3xl font-black ${accent}`}
                      >
                        {tier.tier}
                      </span>
                      <div>
                        <p className="font-bold text-lg">{tier.label}</p>
                        <p className="text-xs text-muted-foreground">Tier</p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold mb-2 text-[hsl(var(--nav-theme-light))]">
                        {tier.name}
                      </p>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 mb-3">
                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border">
                          <span className="text-muted-foreground">Damage: </span>
                          {tier.damage}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border">
                          <span className="text-muted-foreground">Farming: </span>
                          {tier.farming}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border">
                          <span className="text-muted-foreground">Upgrades: </span>
                          {tier.upgrades}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-semibold text-foreground/90">Best use: </span>
                        {tier.bestUse}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground/90">Priority: </span>
                        {tier.priority}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 4: Turrets and Rarities */}
      <section id="turrets-and-rarities" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Boxes className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {turrets.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {turrets.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {turrets.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {turrets.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {turrets.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base md:text-lg">{item.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                    {item.category}
                  </span>
                </div>
                <dl className="space-y-2 text-sm flex-1">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">Strength</dt>
                    <dd className="text-muted-foreground">{item.strength}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">Obtained from</dt>
                    <dd className="text-muted-foreground">{item.obtainedFrom}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">Best use</dt>
                    <dd className="text-muted-foreground">{item.bestUse}</dd>
                  </div>
                </dl>
                <p className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                  {item.spendingRule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Upgrade Guide */}
      <section id="upgrade-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {upgrades.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {upgrades.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {upgrades.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {upgrades.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {upgrades.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white text-sm font-bold">
                    {step.step}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {step.priority}
                  </span>
                </div>
                <h3 className="font-bold mb-1">{step.name}</h3>
                <p className="text-xs text-[hsl(var(--nav-theme-light))] font-semibold mb-2">
                  {step.value}
                </p>
                <p className="text-sm text-muted-foreground mb-2 flex-1">
                  {step.recommendation}
                </p>
                <p className="text-xs text-muted-foreground/80 border-t border-border pt-2">
                  {step.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Best Base Layout */}
      <section id="best-base-layout" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <LayoutGrid className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {layouts.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {layouts.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {layouts.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {layouts.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
            {layouts.layouts.slice(0, 3).map((layout: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base md:text-lg">{layout.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                    {layout.bestFor}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{layout.setup}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground/90">Upgrade focus: </span>
                  {layout.upgradeFocus}
                </p>
                <p className="text-sm text-[hsl(var(--nav-theme-light))]">
                  <span className="font-semibold">Next: </span>
                  {layout.nextStep}
                </p>
              </div>
            ))}
          </div>

          {/* Full-width mistakes card */}
          {layouts.layouts[3] && (
            <div className="scroll-reveal p-5 md:p-6 bg-amber-500/5 border border-amber-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-400 mb-3">
                    {layouts.layouts[3].name}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground/90 block mb-1">Setup</span>
                      {layouts.layouts[3].setup}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground/90 block mb-1">Upgrade focus</span>
                      {layouts.layouts[3].upgradeFocus}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground/90 block mb-1">Next step</span>
                      {layouts.layouts[3].nextStep}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Module 7: AFK Farming Guide */}
      <section id="afk-farming-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Moon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {afk.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {afk.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {afk.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {afk.intro}
            </p>
          </div>

          {/* Desktop comparison table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Requirement</th>
                  <th className="p-4 font-semibold">Benefit</th>
                  <th className="p-4 font-semibold">Best use</th>
                  <th className="p-4 font-semibold">Preparation</th>
                </tr>
              </thead>
              <tbody>
                {afk.methods.map((m: any, index: number) => (
                  <tr key={index} className="border-t border-border align-top">
                    <td className="p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                      {m.method}
                    </td>
                    <td className="p-4 text-muted-foreground">{m.requirement}</td>
                    <td className="p-4 text-muted-foreground">{m.benefit}</td>
                    <td className="p-4 text-muted-foreground">{m.bestUse}</td>
                    <td className="p-4 text-muted-foreground">{m.preparation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {afk.methods.map((m: any, index: number) => (
              <div
                key={index}
                className="p-4 bg-white/5 border border-border rounded-xl"
              >
                <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">
                  {m.method}
                </h3>
                <dl className="space-y-1.5 text-sm">
                  <div>
                    <dt className="font-semibold text-foreground/90">Requirement</dt>
                    <dd className="text-muted-foreground">{m.requirement}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground/90">Benefit</dt>
                    <dd className="text-muted-foreground">{m.benefit}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground/90">Best use</dt>
                    <dd className="text-muted-foreground">{m.bestUse}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground/90">Preparation</dt>
                    <dd className="text-muted-foreground">{m.preparation}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Updates */}
      <section id="updates" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Bell className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold tracking-wide">
                {updates.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {updates.title}
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base md:text-lg text-muted-foreground">
              {updates.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/80">
              {updates.intro}
            </p>
          </div>

          <div className="scroll-reveal relative space-y-4 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6">
            {updates.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.65rem] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {entry.stage}
                    </span>
                    <h3 className="font-bold">{entry.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{entry.summary}</p>
                  <ul className="space-y-1.5">
                    {entry.changes.map((change: string, ci: number) => (
                      <li key={ci} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/70790155462881/Zombie-Turret-Farm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/383912360/BrainRot-Zombies-Inc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGroup}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/results?search_query=zombie+turret+farm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
