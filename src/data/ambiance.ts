import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type AmbiancePack = {
  id: string;
  title: string;
  description: string;
  thumbnailUrlId: ImagePlaceholder['id'];
  videoUrl?: string;
  audioUrl: string;
  animationType: 'fireplace' | 'rain' | 'aquarium' | 'none';
  isPremium: boolean;
  audioDescription: string;
};

export const ambiancePacks: AmbiancePack[] = [
  {
    id: 'crackling-fireplace',
    title: 'Crackling Fireplace',
    description: 'The warm, comforting sound of a crackling fire.',
    thumbnailUrlId: 'fireplace',
    animationType: 'fireplace',
    audioUrl: '/audio/fireplace.mp3', // Placeholder
    isPremium: false,
    audioDescription: 'A steady fireplace crackling in a cozy room.',
  },
  {
    id: 'gentle-rain',
    title: 'Gentle Rain',
    description: 'Relax to the soothing sounds of gentle rainfall.',
    thumbnailUrlId: 'gentle-rain',
    animationType: 'rain',
    audioUrl: '/audio/rain.mp3', // Placeholder
    isPremium: false,
    audioDescription:
      'A light, consistent rain falls against a window pane.',
  },
  {
    id: 'serene-aquarium',
    title: 'Serene Aquarium',
    description: 'The peaceful bubbling of a well-kept aquarium.',
    thumbnailUrlId: 'coral-reef',
    animationType: 'aquarium',
    audioUrl: '/audio/aquarium.mp3', // Placeholder
    isPremium: false,
    audioDescription: 'The gentle bubbling of an aquarium filter and water.',
  },
  {
    id: 'forest-creek',
    title: 'Forest Creek',
    description: 'A tranquil creek flowing through a lush forest.',
    thumbnailUrlId: 'forest-creek',
    animationType: 'none',
    audioUrl: '/audio/forest.mp3', // Placeholder
    isPremium: true,
    audioDescription:
      'Water gently flowing over rocks in a forest, with distant bird calls.',
  },
  {
    id: 'cozy-cafe',
    title: 'Cozy Cafe',
    description: 'The warm, ambient chatter of a cozy coffee shop.',
    thumbnailUrlId: 'cozy-cafe',
    animationType: 'none',
    audioUrl: '/audio/cafe.mp3', // Placeholder
    isPremium: true,
    audioDescription:
      'Muffled conversations, the clinking of cups, and the hiss of an espresso machine.',
  },
  {
    id: 'thunderstorm',
    title: 'Thunderstorm',
    description: 'A powerful thunderstorm with distant thunder and heavy rain.',
    thumbnailUrlId: 'thunderstorm',
    animationType: 'rain',
    audioUrl: '/audio/thunderstorm.mp3', // Placeholder
    isPremium: true,
    audioDescription:
      'Heavy rain mixed with the low rumble of distant thunder.',
  },
  {
    id: 'night-sky',
    title: 'Night Sky',
    description: 'The quiet hum of a clear night, with crickets chirping.',
    thumbnailUrlId: 'night-sky',
    animationType: 'none',
    audioUrl: '/audio/night.mp3', // Placeholder
    isPremium: true,
    audioDescription:
      'A chorus of crickets on a calm, clear summer night.',
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    description: 'Calm ocean waves washing up on a sandy shore.',
    thumbnailUrlId: 'ocean-waves',
    animationType: 'none',
    audioUrl: '/audio/ocean.mp3', // Placeholder
    videoUrl: '/videos/ocean.mp4',
    isPremium: true,
    audioDescription: 'The rhythmic sound of ocean waves breaking on a beach.',
  },
  {
    id: 'zen-garden',
    title: 'Zen Garden',
    description: 'A peaceful zen garden with a gentle breeze through bamboo.',
    thumbnailUrlId: 'zen-garden',
    animationType: 'none',
    audioUrl: '/audio/zen.mp3', // Placeholder
    isPremium: true,
    audioDescription:
      'A light wind rustling through bamboo leaves in a quiet garden.',
  },
  {
    id: 'city-ambience',
    title: 'City Ambience',
    description: 'The distant, muted sounds of a city at night.',
    thumbnailUrlId: 'city-ambience',
    animationType: 'none',
    audioUrl: '/audio/city.mp3', // Placeholder
    isPremium: true,
    audioDescription:
      'The low, distant hum of city traffic from a high-rise apartment.',
  },
  {
    id: 'grand-library',
    title: 'Grand Library',
    description: 'The quiet rustle of pages in a grand, old library.',
    thumbnailUrlId: 'library',
    animationType: 'none',
    audioUrl: '/audio/library.mp3', // Placeholder
    isPremium: true,
    audioDescription:
      'The quiet atmosphere of a library, with occasional page turns and soft coughs.',
  },
  {
    id: 'cat-purring',
    title: 'Cat Purring',
    description: 'The deep, comforting purr of a sleeping cat.',
    thumbnailUrlId: 'cat-purring',
    animationType: 'none',
    audioUrl: '/audio/cat.mp3', // Placeholder
    isPremium: true,
    audioDescription: 'A close-up, deep, and rhythmic cat purr.',
  },
];
