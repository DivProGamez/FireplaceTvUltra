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
};

export const ambiancePacks: AmbiancePack[] = [
  {
    id: 'crackling-fireplace',
    title: 'Crackling Fireplace',
    description: 'The warm, comforting sound of a crackling fire.',
    thumbnailUrlId: 'fireplace',
    animationType: 'fireplace',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/fireplace.mp3',
    isPremium: false,
  },
  {
    id: 'gentle-rain',
    title: 'Gentle Rain',
    description: 'Relax to the soothing sounds of gentle rainfall.',
    thumbnailUrlId: 'gentle-rain',
    animationType: 'rain',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/rain.mp3',
    isPremium: false,
  },
  {
    id: 'serene-aquarium',
    title: 'Serene Aquarium',
    description: 'The peaceful bubbling of a well-kept aquarium.',
    thumbnailUrlId: 'coral-reef',
    animationType: 'aquarium',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/aquarium.mp3',
    isPremium: false,
  },
  {
    id: 'forest-creek',
    title: 'Forest Creek',
    description: 'A tranquil creek flowing through a lush forest.',
    thumbnailUrlId: 'forest-creek',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/forest.mp3',
    isPremium: true,
  },
  {
    id: 'cozy-cafe',
    title: 'Cozy Cafe',
    description: 'The warm, ambient chatter of a cozy coffee shop.',
    thumbnailUrlId: 'cozy-cafe',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/cafe.mp3',
    isPremium: true,
  },
  {
    id: 'thunderstorm',
    title: 'Thunderstorm',
    description: 'A powerful thunderstorm with distant thunder and heavy rain.',
    thumbnailUrlId: 'thunderstorm',
    animationType: 'rain',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/thunderstorm.mp3',
    isPremium: true,
  },
  {
    id: 'night-sky',
    title: 'Night Sky',
    description: 'The quiet hum of a clear night, with crickets chirping.',
    thumbnailUrlId: 'night-sky',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/night.mp3',
    isPremium: true,
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    description: 'Calm ocean waves washing up on a sandy shore.',
    thumbnailUrlId: 'ocean-waves',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/ocean.mp3',
    videoUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/ocean.mp4',
    isPremium: true,
  },
  {
    id: 'zen-garden',
    title: 'Zen Garden',
    description: 'A peaceful zen garden with a gentle breeze through bamboo.',
    thumbnailUrlId: 'zen-garden',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/zen.mp3',
    isPremium: true,
  },
  {
    id: 'city-ambience',
    title: 'City Ambience',
    description: 'The distant, muted sounds of a city at night.',
    thumbnailUrlId: 'city-ambience',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/city.mp3',
    isPremium: true,
  },
  {
    id: 'grand-library',
    title: 'Grand Library',
    description: 'The quiet rustle of pages in a grand, old library.',
    thumbnailUrlId: 'library',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/library.mp3',
    isPremium: true,
  },
  {
    id: 'cat-purring',
    title: 'Cat Purring',
    description: 'The deep, comforting purr of a sleeping cat.',
    thumbnailUrlId: 'cat-purring',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/cat.mp3',
    isPremium: true,
  },
    {
    id: 'windy-desert',
    title: 'Windy Desert',
    description: 'The sound of wind sweeping across desert dunes.',
    thumbnailUrlId: 'windy-desert',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/desert.mp3',
    isPremium: true,
  },
  {
    id: 'train-journey',
    title: 'Train Journey',
    description: 'The rhythmic clickety-clack of a train on the rails.',
    thumbnailUrlId: 'train-journey',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/train.mp3',
    isPremium: true,
  },
  {
    id: 'space-engine',
    title: 'Space Engine',
    description: 'The low hum of a spaceship engine traversing the cosmos.',
    thumbnailUrlId: 'space-engine',
    animationType: 'none',
    audioUrl: 'https://storage.googleapis.com/immersive-escapes-1718218116/space.mp3',
    isPremium: true,
  },
];
