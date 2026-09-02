export const T = {
  nav: {
    howItWorks: "How it works",
    features: "Features",
    ariaLabel: "Main navigation",
    ariaHome: "TradeLens – Back to the TradeLens page",
  },
  hero: {
    headlineL1: "Professional AI",
    headlineL2: "Chart Analysis in",
    headlineAccent: "Seconds.",
    sub: "Upload a chart and instantly receive a detailed technical analysis, clear long/short signals, and a complete trading plan.",
    exampleNote:
      "Note: values & assets are examples. In the app, you analyze your own chart.",
    trendLabel: "TREND SIGNAL",
    confidence: "Confidence 87%",
    aiLabel: "AI ANALYSIS",
    newsLabel: "NEWS ANALYSIS",
    sentiment: "Sentiment",
  },
  howItWorks: {
    eyebrow: "3 simple steps",
    heading: "How it works",
    steps: [
      {
        title: "Upload a Chart",
        description:
          "Photograph your chart or pick a screenshot from your gallery, ready in seconds.",
      },
      {
        title: "AI Analyzes in Seconds",
        description:
          "Our AI analyzes trend, patterns, volume and sentiment in real time, fully automated.",
      },
      {
        title: "Trade with Clarity",
        description:
          "Get a complete trading plan with entry points, stop-loss and risk assessment.",
      },
    ],
  },
  features: {
    eyebrow: "Features",
    heading: "What TradeLens can do",
    subtitle: "Everything you need to trade smarter, all in one app.",
    items: [
      {
        title: "AI Chart Analysis",
        description:
          "Instantly receive a professional technical analysis with trend, volatility, support and resistance levels, chart patterns, and a clear trading plan.",
      },
      {
        title: "100+ News Analyzed in Seconds",
        description:
          "The AI analyzes over 100 current news articles on your asset and delivers instant market insights so you always trade informed.",
      },
      {
        title: "Your Personal Trading Mentor",
        description:
          "Ask questions about trading strategies, risk management and market analysis. The AI mentor responds in a personalized way adapted to your experience level.",
      },
      {
        title: "Clear Long and Short Signals",
        description:
          "No more doubt. TradeLens gives you clear action recommendations: Long, Short or Hold with a detailed explanation.",
      },
      {
        title: "Stocks, Crypto, Forex and more",
        description:
          "Whether you trade cryptocurrencies, stocks, forex or commodities, TradeLens analyzes any chart of any asset class.",
      },
      {
        title: "Personalized to Your Level",
        description:
          "Beginner or pro, TradeLens adapts to your experience level and your markets to give you the most relevant insights.",
      },
    ],
  },
  valueProps: {
    headingPart1: "What experts spend hours on,",
    headingAccent: "TradeLens handles in seconds.",
    items: [
      {
        stat: "Up to 6x",
        label: "faster",
        description: "Find profitable trades compared to manual analysis",
      },
      {
        stat: "100+",
        label: "News at once",
        description: "Analyzed simultaneously for each of your assets",
      },
      {
        stat: "24/7",
        label: "available",
        description: "Your AI trading mentor is always there for you",
      },
    ],
  },
  cta: {
    countPrefix: "Over",
    countSuffix: "satisfied traders",
    heading: "Maximize your profits with TradeLens Pro",
    sub: "Less doubt, more confidence on every trade. Start today.",
  },
  appStore: {
    line1: "Download on the",
    line2: "App Store",
  },
  footer: {
    tagline: "Clear chart analysis. Better decisions.",
    connectHeading: "Connect with us",
    legalHeading: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    contactHeading: "Contact",
    copyright: (year: number) => `© ${year} Daverion Digital`,
    ariaTikTok: "TradeLens on TikTok",
    ariaEmail: "Contact TradeLens by email",
    ariaLegal: "Legal links",
  },
} as const;
