import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MarathonRoute } from '@/data/marathon-routes';

const DEFAULT_RACE_IMAGE = '/images/default-race.jpg';

interface RaceCardProps {
  race: MarathonRoute;
}

export function RaceCard({ race }: RaceCardProps) {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'moderate':
        return 'default';
      case 'challenging':
        return 'warning';
      case 'difficult':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleSelectRace = () => {
    router.push(`/races/${race.id}`);
  };

  return (
    <Card className="h-full">
      <div className="relative h-48 w-full">
        <Image
          src={race.imageUrl || DEFAULT_RACE_IMAGE}
          alt={race.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{race.name}</h3>
            <p className="text-sm text-gray-500">{race.location}</p>
          </div>
          <Badge variant={getDifficultyColor(race.difficulty)}>
            {race.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="outline">{race.distance} km</Badge>
            <Badge variant="outline">{race.elevationGain}m elevation</Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{race.description}</p>
          <Button 
            onClick={handleSelectRace}
            className="w-full"
          >
            Select Race
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 