// Every word and number on the site. Shared by all three options.
// Copy is the live site's, unchanged. Bhanu's rewrite (Google Doc) swaps in here later.
window.SITE = {
  name: "Bhanu Pratap",
  email: "contact.bhanu4012@gmail.com",
  line: "Writer and director first.",
  bio: "I like stories, spend most of my time reading, watching films, dissecting scenes, and I hope I spend the rest of my life reading, watching, and telling stories.",
  cvIntro: "I've spent 3+ years making content for people you know: Steven Bartlett, Andrew Ross Sorkin from the New York Times' DealBook, Dr Arthur Brooks, Nick Moar (founder, DMG Media) and some YC-backed startups. I like coming up with the idea, I like running the team, and I really like seeing people share what we made.",
  skills: ["Organic creative strategy", "Content production", "Content systems and workflows", "Copywriting", "Visual and art direction", "AI-assisted research", "AI-assisted production"],
  tools: ["Notion", "Affinity", "Higgsfield", "ElevenLabs", "Figma", "Manus"],
  clients: ["Steven Bartlett", "Andrew Ross Sorkin", "Dr Arthur Brooks", "Maple.inc", "Kitsh", "Ryan Bartlett, True Classic"],
  beyond: "I write poetry, watch video essays about random things, take pretty good photos, and buy more notebooks than I will ever use.",
  learned: "I learned everything I know by doing real work and teaching myself, over 5+ years of trying things. I learn fast.",
  contact: "Got a story nobody's heard yet? Tell me about it. I'm curious about almost everything, so at worst, we'll have a good chat.",
  dated: "Plays and likes as Instagram showed them on 20 Nov 2026.",

  work: [
    {
      id: "bartlett", client: "Steven Bartlett", show: "The Diary of a CEO",
      role: "Ran the clips pipeline", kind: "Short-form clips", years: "2025 to 2026",
      lede: "Steven's episodes are hours long. The job was turning them into short clips that millions of people watch. I ran that, from the full episode to the posted clip.",
      did: [
        ["Managed the production team", "The whole team that made the clips, day to day."],
        ["Picked the moments", "Out of hours of conversation, I chose which 40 seconds become a clip."],
        ["Directed the edits", "Where each clip starts, how fast it moves and where it ends."],
        ["Art direction", "Captions, look and feel, so every clip looks and sounds like DOAC."]
      ],
      aside: "At the end of every episode, the last guest leaves a question for the next one. Mine would be: \"Can I post this bit?\"",
      hero: ["14.6M", "plays on six clips"],
      stats: [["14.6M", "plays on the six clips here"], ["582K", "likes on the same six"], ["5.1M", "plays on the biggest one"], ["8.2M", "views on five more, with proof"]],
      reels: [
        { id: "bartlett_DWoAgfdAJRp", cap: "Nice people say what you want to hear. Kind people say what you need to hear.", num: "5.1M plays, 194K likes", ig: "https://www.instagram.com/reel/DWoAgfdAJRp/" },
        { id: "bartlett_DVsNATlgHrg", cap: "Your limiting beliefs about what's possible for you are not facts.", num: "2.7M plays, 144K likes", ig: "https://www.instagram.com/reel/DVsNATlgHrg/" },
        { id: "bartlett_DWjQXYTDCxY", cap: "I asked the world's most fearless climber if he finds it awkward to talk about emotions.", num: "2.6M plays, 120K likes", ig: "https://www.instagram.com/reel/DWjQXYTDCxY/" },
        { id: "bartlett_DVgBHwxDPiD", cap: "What makes us fall in love is not the person that's perfect.", num: "3M plays, 111K likes", ig: "https://www.instagram.com/reel/DVgBHwxDPiD/" },
        { id: "bartlett_DV6nOcCgOA9", cap: "The greatest commitments you can make are the ones you make to yourself.", num: "346K plays, 14K likes", ig: "https://www.instagram.com/reel/DV6nOcCgOA9/" },
        { id: "bartlett_DWZRf0FjFKo", cap: "Your biggest breakthroughs will often come from the most petty detail.", num: "806K plays, 399 comments", ig: "https://www.instagram.com/reel/DWZRf0FjFKo/" }
      ],
      proof: {
        intro: "Steven is on Dragons' Den, so we brought numbers. These screenshots came straight from his team.",
        quote: "Well done on some of the recent content guys, can really feel the momentum on IG!!!!!",
        who: "Zara Jarvis, our point of contact for Steven Bartlett's Instagram",
        shots: [["stat1", "1.12M views", "44K likes, 12K saves"], ["stat2", "2.24M views", "110K likes, 36K saves"], ["stat3", "1.41M views", "57K likes, 14K saves"], ["stat4", "743K views", "28K likes, 6.2K saves"], ["stat5", "2.72M views", "95K likes, 33K saves"]]
      }
    },
    {
      id: "maple", client: "Maple.inc", show: "Ads for an AI that answers the phone",
      role: "Writer and director", kind: "Paid ads", years: "",
      lede: "Maple makes an AI that answers the phone for restaurants. Busy kitchens miss a lot of calls. Maple picks them up. They needed ads people would actually stop for.",
      did: [
        ["Came up with the idea", "Every other company in this space ran the same ad: a picture and a list of features. I went with real phone calls instead."],
        ["Wrote the ads", "We took real calls between Maple's AI and real customers, and I shaped each one into a short story people want to hear to the end."],
        ["Directed the ads", "I art directed how they look, so they feel like normal posts in your feed, not like ads."],
        ["Made them work as ads", "Each one still had to sell. A clear hook, a clear product and a clear reason to try it."]
      ],
      aside: "People skip ads. Almost nobody skips listening in on someone else's phone call.",
      hero: ["$63", "to win a customer, down from $300"],
      stats: [["$63", "to win one customer, by month three"], ["79%", "cheaper than the $300 we started at"]],
      curve: [["Before", 300], ["Then", 98], ["Month three", 63]],
      ads: [["Ad one, in Meta's Ad Library", "https://www.facebook.com/ads/library/?id=4195112840710312"], ["Ad two", "https://www.facebook.com/ads/library/?id=25153189381040039"], ["Ad three", "https://www.facebook.com/ads/library/?id=1645467936582705"]],
      reels: []
    },
    {
      id: "aakash", client: "Aakash Bhalla", show: "Growing his Instagram from almost nothing",
      role: "Strategy, scripts, everything", kind: "Organic growth", years: "",
      lede: "Aakash was a salesman who started an agency. Eight of his businesses failed before one worked. He had a lot to teach, but almost nobody was listening.",
      did: [
        ["Built the strategy", "What he stands for, who he is talking to, and why they should care."],
        ["Wrote the scripts", "Every script, from the hook to the last line."],
        ["Planned the content", "The formats, the topics and how often to post, so he never had to wonder what to make next."],
        ["Turned views into leads", "The content was built to bring in clients, not just likes. It added a six-figure stream to his business."]
      ],
      aside: "Before: posting in the dark and hoping for miracles. After: he knew exactly what his brand stood for.",
      hero: ["65K+", "followers in 60 days, from 2,000"],
      stats: [["65K+", "followers, up from 2,000"], ["7M+", "organic impressions"], ["60", "days. Not a year."], ["6 fig.", "in sales that came from content"]],
      beforeAfter: [["aakash_before", "Day one: 377 accounts reached"], ["aakash_after", "Day 60: 1.97M reached"]],
      reels: [{ id: "aakash_reel", cap: "One of the reels", num: "", ig: "" }]
    },
    {
      id: "brooks", client: "Dr Arthur Brooks", show: "Harvard professor who teaches happiness",
      role: "Clips, edits and art direction", kind: "Short-form clips", years: "2025 to 2026",
      lede: "Arthur Brooks teaches people how to be happier. His ideas are big. Instagram clips are short. My job sat right in the middle.",
      did: [
        ["Worked with the clippers", "When his podcast appearances were being cut into clips, I worked with the clippers on what to make."],
        ["Chose the clips", "Which moments should become short clips, and which should stay in the long episode."],
        ["Picked the edit", "What kind of edit each clip needed to land."],
        ["Art direction", "How each clip looks and how the words sit on screen."]
      ],
      aside: "Fun fact: before Harvard, he played the French horn for a living.",
      hero: ["559K", "plays on three clips"],
      stats: [["559K", "plays on three of these four"], ["208K", "plays on the biggest one"], ["56K", "likes across all four"], ["37K", "likes on a single clip"]],
      reels: [
        { id: "brooks_DUgML6lCWBo", cap: "Your kids won't become what you tell them to be. They become what they watch you be.", num: "37K likes", ig: "https://www.instagram.com/reel/DUgML6lCWBo/" },
        { id: "brooks_DQprSK3DQd7", cap: "Those who truly live with gratitude find meaning even in the difficult parts of life.", num: "208K plays, 7.5K likes", ig: "https://www.instagram.com/reel/DQprSK3DQd7/" },
        { id: "brooks_DQFosxqjyr3", cap: "Strivers often believe they have to earn love through achievement.", num: "200K plays, 6.5K likes", ig: "https://www.instagram.com/reel/DQFosxqjyr3/" },
        { id: "brooks_DToP8E4CTmu", cap: "If something brings you pleasure and could become addictive, notice whether you do it alone.", num: "151K plays, 4.7K likes", ig: "https://www.instagram.com/reel/DToP8E4CTmu/" }
      ]
    },
    {
      id: "mmh", client: "Metro Media House", show: "Lead creative strategist and operator",
      role: "Lead creative strategist", kind: "Agency", years: "Apr 2025 to Aug 2026",
      lede: "Metro Media House is the agency behind the Steven Bartlett and Arthur Brooks clips, plus work for Andrew Ross Sorkin from the New York Times' DealBook. I wore a lot of hats there.",
      did: [
        ["Led a team of 30+", "A cross-functional team of creatives, making work across many formats and platforms."],
        ["Made it 90% cheaper", "Set up AI-assisted production that cut production overhead by more than 90%."],
        ["Built how we find clients", "Co-created the agency's lead generation channels, the ways new clients found us."],
        ["Wrote and directed our own posts", "The agency's own reels and carousels, including the ones below."]
      ],
      aside: "And yes, I made a post about fixing brainrot. I may have had a little brainrot while making it.",
      hero: ["30+", "people in the team I led"],
      stats: [["90%+", "less production overhead"], ["293K", "plays on the three reels here"], ["2,059", "people commented to get our reading list"], ["29K", "likes across all seven pieces"]],
      reels: [
        { id: "mmh_DOvSTHYiFup", cap: "When your product becomes part of the flex, you've already won.", num: "192K plays, 9.9K likes", ig: "https://www.instagram.com/reel/DOvSTHYiFup/" },
        { id: "mmh_DO1GOtSDOZD", cap: "Originality is overrated. Borrowed fame builds faster.", num: "71.5K plays, 4.4K likes", ig: "https://www.instagram.com/reel/DO1GOtSDOZD/" },
        { id: "mmh_DUTFN28CDDt", cap: "One announcement. Zero marketing. Forty years of legacy.", num: "29.5K plays, 1.7K likes", ig: "https://www.instagram.com/reel/DUTFN28CDDt/" }
      ],
      posts: [
        { id: "mmh_DSpg--liDsz", cap: "Five pieces of media that'll reverse your brainrot, part two.", num: "6.7K likes, 904 comments", ig: "https://www.instagram.com/p/DSpg--liDsz/" },
        { id: "mmh_DSXZhrLgXBa", cap: "Focus isn't a talent. It's a skill you rebuild.", num: "4K likes, 1.2K comments", ig: "https://www.instagram.com/p/DSXZhrLgXBa/" },
        { id: "mmh_DUqAn2HiBhE", cap: "Cool isn't a look. It's a behaviour people repeat before anyone names it.", num: "1.3K likes", ig: "https://www.instagram.com/p/DUqAn2HiBhE/" }
      ]
    }
  ]
};
