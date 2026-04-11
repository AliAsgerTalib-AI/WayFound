export interface StorySection {
  title: string;
  content: string;
  image?: string;
}

export interface StoryItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Story {
  id: string;
  title: string;
  category: string;
  heroImage: string;
  description: string;
  sections: StorySection[];
  itinerary: StoryItineraryDay[];
}

export const stories: Story[] = [
  {
    id: "kyoto",
    title: "The Silent Rhythm of Kyoto",
    category: "Cultural Immersion",
    heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070",
    description: "In the heart of Japan's ancient capital, time flows differently. Kyoto is not just a city; it's a living museum of silence, where every moss-covered stone and sliding paper door tells a story of centuries-old devotion to beauty and precision.",
    sections: [
      {
        title: "The Philosophy of Ma",
        content: "Kyoto is defined by 'Ma'—the space between things. It is found in the silence between the strikes of a temple bell and the empty white gravel of a Zen garden. To truly experience Kyoto is to embrace this emptiness, allowing the mind to settle like dust after a storm. At Ryoan-ji, the 15 stones are arranged so that from any vantage point, at least one is always hidden—a reminder of the limits of human perception.",
        image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=2070"
      },
      {
        title: "The Art of the Tea Ceremony",
        content: "In a small wooden hut tucked away in a bamboo grove, we witnessed the Ichigo Ichie—the philosophy that every meeting is unique and will never happen again. The precise movements of the tea master, the steam rising from the iron kettle, and the bitter-sweet taste of matcha create a moment of perfect presence. Every bowl is rotated twice to show humility, and every sip is a meditation on the season.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070"
      },
      {
        title: "The Geiko of Gion",
        content: "As twilight falls over the wooden machiya houses of Gion, the world of the Geiko and Maiko awakens. This is a world of rigorous discipline and refined art. We were invited to a private ochaya where the performance of traditional dance and the playing of the shamisen transported us to the Edo period. It is a culture of 'Omotenashi'—wholehearted hospitality that anticipates every need before it is spoken.",
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2070"
      },
      {
        title: "The Philosopher's Path",
        content: "Walking along the stone path that follows a canal lined with hundreds of cherry trees, one understands why Nishida Kitaro, one of Japan's most famous philosophers, practiced meditation here. The path connects the Silver Pavilion (Ginkaku-ji) to the Nanzen-ji neighborhood, offering a quiet transition between the spiritual and the mundane.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070"
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "The Path of Zen & Old Kyoto",
        activities: [
          "Sunrise at Fushimi Inari-taisha to avoid the crowds",
          "Private Zen meditation session at Nanzen-ji Temple",
          "Exploration of the Higashiyama District's narrow lanes",
          "Traditional Kaiseki dinner at a Michelin-starred ryotei in Gion",
          "Evening walk through the illuminated Yasaka Shrine"
        ]
      },
      {
        day: 2,
        title: "Bamboo Groves & Imperial Grandeur",
        activities: [
          "Early morning walk through Arashiyama Bamboo Grove",
          "Visit to Okochi Sanso Villa for tea and garden views",
          "Tenryu-ji Temple's Sogenchi Garden (UNESCO World Heritage)",
          "Traditional Buddhist vegetarian lunch (Shojin Ryori) at Shigetsu",
          "Private boat ride down the Hozugawa River",
          "Evening visit to the Kyoto Imperial Palace grounds"
        ]
      },
      {
        day: 3,
        title: "The Golden Hour & Craftsmanship",
        activities: [
          "Kinkaku-ji (The Golden Pavilion) at opening",
          "Ryoan-ji Rock Garden for contemplation",
          "Visit to a traditional silk weaving workshop in Nishijin",
          "Nishiki Market 'Kyoto's Kitchen' for local delicacies",
          "Sunset walk through Pontocho Alley for riverside dining",
          "Farewell drinks at a hidden bar overlooking the Kamo River"
        ]
      }
    ]
  },
  {
    id: "amalfi",
    title: "The Hidden Coves of Amalfi",
    category: "Coastal Escape",
    heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1974",
    description: "Where the mountains meet the Tyrrhenian Sea, the Amalfi Coast clings to the cliffs with a defiant elegance. Beyond the bustling squares of Positano lie secret paths, emerald waters, and ancient traditions known only to those who seek the coast's quieter, more authentic side.",
    sections: [
      {
        title: "Vertical Living",
        content: "Life on the Amalfi Coast is vertical. Houses are stacked like colorful blocks, connected by steep staircases that have been worn smooth by generations of locals. Each step offers a new perspective of the sea, a shimmering expanse that changes from turquoise to deep indigo as the sun moves across the sky. In the village of Atrani, the smallest town in Italy, the labyrinth of tunnels and arches feels like a medieval fortress.",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1972"
      },
      {
        title: "The Scent of Lemons",
        content: "The Sfusato Amalfitano—the famous local lemons—perfume the air. We spent an afternoon in a terraced grove in Ravello, learning how these giant fruits are harvested by hand on slopes so steep they seem to defy gravity. The result is a limoncello that tastes like liquid sunshine, and a culinary tradition where the lemon is the star of everything from pasta to desserts.",
        image: "https://images.unsplash.com/photo-1614947859542-09439369343e?auto=format&fit=crop&q=80&w=2070"
      },
      {
        title: "The Path of the Gods",
        content: "Sentiero degli Dei—The Path of the Gods—is a hiking trail that winds high above the coastline. Walking between Agerola and Nocelle, one feels suspended between heaven and earth. The views of the Galli islands and the distant silhouette of Capri are breathtaking, framed by wild herbs and ancient stone ruins that whisper stories of shepherds and sailors.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1974"
      },
      {
        title: "The Ceramic Soul of Vietri",
        content: "At the eastern end of the coast lies Vietri sul Mare, the capital of ceramics. Every corner of the town is adorned with vibrant tiles, from the dome of the church to the walls of the shops. We visited a family-run workshop where the techniques of hand-painting have remained unchanged for centuries, capturing the colors of the Mediterranean in clay.",
        image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=2070"
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "The Divine Coast & Positano",
        activities: [
          "Arrival in Positano and check-in to a cliffside boutique hotel",
          "Private walking tour of Positano's 'Scalinatella' (stairways)",
          "Sunset aperitivo at Franco's Bar for the iconic view",
          "Dinner at Da Adolfo, a beach club accessible only by boat",
          "Evening stroll along the Spiaggia Grande"
        ]
      },
      {
        day: 2,
        title: "Ravello Heights & Lemon Groves",
        activities: [
          "Morning visit to Villa Cimbrone and its 'Infinity Terrace'",
          "Guided tour of an organic lemon grove with limoncello tasting",
          "Lunch at a farm-to-table restaurant in the Ravello hills",
          "Exploration of Villa Rufolo and its legendary gardens",
          "Classical music concert at the Ravello Festival (seasonal)",
          "Dinner in the quiet piazza of Ravello"
        ]
      },
      {
        day: 3,
        title: "Emerald Waters & Secret Coves",
        activities: [
          "Full-day private gozzo boat tour along the coast",
          "Swimming in the crystal-clear waters of the Emerald Grotto",
          "Discovery of the Fiordo di Furore, a hidden fjord",
          "Lunch at a secluded beach trattoria in Nerano",
          "Visit to the colorful town of Amalfi and its Cathedral",
          "Farewell dinner in the charming village of Atrani"
        ]
      }
    ]
  },
  {
    id: "symmetry",
    title: "Symmetry in the Wild",
    category: "Architectural Finds",
    heroImage: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&q=80&w=2052",
    description: "In the remote corners of the world, a new architectural movement is taking root. It's a design philosophy that doesn't seek to dominate the landscape, but to mirror its inherent symmetry, creating structures that feel like natural extensions of the earth and the soul.",
    sections: [
      {
        title: "The Mirror Effect",
        content: "We visited a retreat where glass walls reflect the surrounding forest so perfectly that the building becomes nearly invisible. Inside, the boundary between interior and exterior dissolves, allowing the rhythm of the wild to dictate the pace of the day. The architecture uses light as a primary material, shifting with the movement of the sun and the changing seasons.",
        image: "https://images.unsplash.com/photo-1449156001935-d28bc1dc7281?auto=format&fit=crop&q=80&w=2070"
      },
      {
        title: "Brutalist Nature",
        content: "Raw concrete and weathered wood meet jagged rocks and ancient pines. There is a profound honesty in this symmetry—a recognition that human craft is at its best when it respects the raw, unyielding geometry of the natural world. The structures are designed to weather over time, allowing moss and lichen to become part of the facade, further blurring the line between man-made and organic.",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2070"
      },
      {
        title: "Biophilic Design",
        content: "Biophilia is the innate human connection to nature. This architectural approach brings the outside in, using natural ventilation, living walls, and materials like rammed earth and reclaimed timber. The result is a space that doesn't just look beautiful, but actively promotes well-being, lowering cortisol levels and fostering a sense of deep peace.",
        image: "https://images.unsplash.com/photo-1518005020480-309a9ba769c6?auto=format&fit=crop&q=80&w=2070"
      },
      {
        title: "The Sound of Silence",
        content: "In these remote structures, acoustics are as important as aesthetics. The buildings are designed to amplify the sounds of the wild—the rustle of leaves, the call of a distant bird, the patter of rain—while dampening the noise of the modern world. It is a sonic symmetry that aligns the heartbeat with the environment.",
        image: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&q=80&w=2052"
      }
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Architectural Immersion",
        activities: [
          "Private seaplane transfer to the remote wilderness retreat",
          "Welcome ceremony and architectural orientation tour",
          "Sunset meditation on the cantilevered glass deck",
          "Gourmet dinner featuring locally foraged ingredients",
          "Stargazing from the retreat's private observatory"
        ]
      },
      {
        day: 2,
        title: "The Forest Floor & Thermal Rituals",
        activities: [
          "Guided forest bathing (Shinrin-yoku) session at dawn",
          "Ethical foraging walk with the resident botanist and chef",
          "Lunch prepared over an open fire in the woods",
          "Traditional thermal circuit: outdoor sauna, cold plunge, and hot spring",
          "Evening workshop on sustainable design and biophilia",
          "Dinner under the canopy of ancient trees"
        ]
      },
      {
        day: 3,
        title: "Reflections & Natural Rhythms",
        activities: [
          "Morning yoga session on the mirror lake platform",
          "Kayaking through the silent waterways of the preserve",
          "Private architectural photography workshop",
          "Farewell lunch featuring a 'zero-waste' tasting menu",
          "Quiet time for reflection in the library of the wild",
          "Departure transfer with a new perspective on design"
        ]
      }
    ]
  }
];
